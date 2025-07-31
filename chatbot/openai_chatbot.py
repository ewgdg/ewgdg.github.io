import os
import csv
import json
import requests
from cachecontrol import CacheControl
from cachetools import cached, TTLCache
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
from pathlib import Path
from openai import OpenAI

# Initialize OpenAI client with explicit parameters to avoid conflicts
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY environment variable is required")

client = OpenAI(api_key=api_key, timeout=30.0)

# Base URL of your SSG site (update as needed)
SITE_BASE_URL = os.getenv("SITE_BASE_URL")

# OpenAI model constant
OPENAI_MODEL = "gpt-4.1-nano"

# Create cached HTTP session
cached_session = CacheControl(requests.Session())

app = FastAPI()

# Set CORS origins based on environment
is_production = os.getenv("ENVIRONMENT", "development").lower() == "production"
allowed_origins = [SITE_BASE_URL] if is_production else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load FAQ from CSV and prepare knowledge base
FAQ_PATH = Path(__file__).parent / "faq.csv"
faq_list = []
faq_knowledge_base = ""

if FAQ_PATH.exists():
    with open(FAQ_PATH, newline="", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        faq_list = [row for row in reader]

    # Create knowledge base string for system prompt
    faq_knowledge_base = "\n".join(
        [f"Q: {row['question']}\nA: {row['answer']}\n" for row in faq_list]
    )


# Pydantic models
class Message(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str


class ChatRequest(BaseModel):
    messages: List[Message]
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    type: str
    confidence: float = 1.0


@cached(cache=TTLCache(maxsize=1, ttl=3000))
def fetch_content_summary(char_limit: int = 5000) -> str:
    """Fetch content list with HTTP caching support using CacheControl.

    Args:
        char_limit: Maximum total character count for formatted content

    Returns:
        Formatted content string within character limit
    """
    url = f"{SITE_BASE_URL}/api/content"
    try:
        with requests.session() as session:
            resp = session.get(url, timeout=10)
            resp.raise_for_status()
            content_list = resp.json()

            content_summary = ""
            for item in content_list:
                entry = f"- [{item.get('title', 'Untitled')}]({item.get('url', '')}): {item.get('description', 'No description')}\n"

                if len(content_summary) + len(entry) <= char_limit:
                    content_summary += entry
                else:
                    break

            return content_summary.rstrip()

    except Exception as e:
        print(f"Error fetching content list: {e}")
        return ""


def ask_agent(messages: List[Dict]) -> str:
    """Unified agent that handles both FAQ and content suggestions in a single call."""
    content_summary = fetch_content_summary()

    system_prompt = f"""
You are Xian responding to questions about yourself and your work. Use first person ("I", "my", "me") in all responses.

KNOWLEDGE SOURCES:

1. Personal FAQ Knowledge Base:
{faq_knowledge_base}

2. Available Website Content Summaries:
{content_summary}

RESPONSE GUIDELINES:
- Prioritize answers from your FAQ knowledge base when the question directly relates to information there
- If the FAQ doesn't cover the question, suggest relevant website content using proper markdown links
- When referencing content, use EXACT URLs as provided (e.g., if given URL=/blog/my-post, use [title](/blog/my-post), NOT [title](https://blog/my-post))
- If neither source has relevant information, provide a helpful response explaining you don't have specific content about that topic
- Keep responses natural, conversational, and under 300 words
- Always respond as yourself (Xian) in first person

Provide a single, cohesive response that draws from the most relevant sources available.
"""

    try:
        # Prepare messages for OpenAI API
        api_messages = [{"role": "system", "content": system_prompt}]
        api_messages.extend(messages)

        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=api_messages,
            max_tokens=300,
            temperature=0.7,
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        print(f"OpenAI API error: {e}")
        return "I apologize, but I'm having trouble processing your request right now. Please try again later."


@app.post("/chat")
def chat(request: ChatRequest) -> ChatResponse:
    """Main chat endpoint with unified agent integration."""
    if not request.messages or len(request.messages) == 0:
        raise HTTPException(status_code=400, detail="Messages cannot be empty")

    # Convert messages to dict format for OpenAI API
    messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]

    # Use unified agent that handles both FAQ and content in single call
    answer = ask_agent(messages)

    return ChatResponse(response=answer, type="agent")


@app.get("/qa")
def qa_legacy(question: str):
    """Legacy endpoint for backward compatibility."""
    messages = [Message(role="user", content=question)]
    request = ChatRequest(messages=messages)
    return chat(request)


@app.get("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "openai_chatbot:app", host="0.0.0.0", port=int(os.environ.get("PORT", 8080))
    )
