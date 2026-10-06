import { Hono } from "hono"
import { cors } from "hono/cors"
import { buildSystemPrompt } from "./knowledge"

// Gemma 4 26B (4B active) is the cheapest capable chat model on Workers AI:
// ~30 neurons per chat, so the 10k/day free allocation covers ~300 chats.
const MODEL = "@cf/google/gemma-4-26b-a4b-it"
// Headroom over the ~300 words the prompt asks for, plus markdown link URLs, so
// replies aren't cut mid-sentence; neurons are only spent on tokens generated.
const MAX_REPLY_TOKENS = 1024

const CHAT_ROLES = ["user", "assistant"]

type ChatMessage = { role: "user" | "assistant"; content: string }

// Only user/assistant turns are accepted so visitors cannot inject system instructions.
function isChatMessage(message: unknown): message is ChatMessage {
  if (typeof message !== "object" || message === null) return false
  const { role, content } = message as Record<string, unknown>
  return CHAT_ROLES.includes(role as string) && typeof content === "string"
}

function isChatRequest(body: unknown): body is { messages: ChatMessage[] } {
  const messages = (body as { messages?: unknown } | null)?.messages
  return Array.isArray(messages) && messages.length > 0 && messages.every(isChatMessage)
}

async function generateReply(env: Env, messages: ChatMessage[]): Promise<string | null> {
  const systemPrompt = await buildSystemPrompt(env.SITE_BASE_URL)
  const result = await env.AI.run(MODEL, {
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    max_tokens: MAX_REPLY_TOKENS,
    // Thinking adds latency and neurons; FAQ-style answers don't need it.
    chat_template_kwargs: { enable_thinking: false },
  })
  return result.choices[0]?.message.content ?? null
}

const app = new Hono<{ Bindings: Env }>()

app.use(
  "*",
  cors({
    origin: (origin, c) => (origin === c.env.SITE_BASE_URL ? origin : null),
    allowMethods: ["GET", "POST"],
    allowHeaders: ["Content-Type"],
  }),
)

app.get("/health", (c) => c.json({ status: "ok" }))

app.post("/chat", async (c) => {
  const body = await c.req.json().catch(() => null)
  if (!isChatRequest(body)) {
    return c.json({ detail: "messages must be a non-empty list of user/assistant turns" }, 400)
  }

  try {
    return c.json({ response: await generateReply(c.env, body.messages), type: "agent" })
  } catch (error) {
    // A null response makes the site show its "try again" message, e.g. once
    // the free daily neuron allocation runs out.
    console.error("Error generating reply:", error)
    return c.json({ response: null, type: "agent" })
  }
})

export default app
