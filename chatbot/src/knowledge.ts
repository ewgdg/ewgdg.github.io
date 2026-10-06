import faq from "../faq.json"

type ContentItem = { title?: string; url?: string; description?: string }

const CONTENT_SUMMARY_CHAR_LIMIT = 10_000
const CONTENT_FETCH_TIMEOUT_MS = 10_000

const faqKnowledgeBase = faq
  .map(({ question, answer }) => `Q: ${question}\nA: ${answer}\n`)
  .join("\n")

function formatContentItem({ title, url, description }: ContentItem): string {
  return `- [${title ?? "Untitled"}](${url ?? ""}): ${description ?? "No description"}`
}

function limitToChars(lines: string[], charLimit: number): string {
  let summary = ""
  for (const line of lines) {
    if (summary.length + line.length + 1 > charLimit) break
    summary += `${line}\n`
  }
  return summary.trimEnd()
}

/**
 * Site content list, formatted as markdown links. Returns "" when the site is
 * unreachable so the chatbot keeps answering from the FAQ alone.
 */
async function fetchContentSummary(siteBaseUrl: string): Promise<string> {
  try {
    // GitHub Pages sends max-age=600; cacheEverything makes Cloudflare honor it
    // for this extensionless JSON path instead of refetching on every chat.
    const response = await fetch(`${siteBaseUrl}/api/content`, {
      cf: { cacheEverything: true },
      signal: AbortSignal.timeout(CONTENT_FETCH_TIMEOUT_MS),
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const contentList = await response.json<ContentItem[]>()
    return limitToChars(contentList.map(formatContentItem), CONTENT_SUMMARY_CHAR_LIMIT)
  } catch (error) {
    console.error("Error fetching content list:", error)
    return ""
  }
}

export async function buildSystemPrompt(siteBaseUrl: string): Promise<string> {
  const contentSummary = await fetchContentSummary(siteBaseUrl)

  return `
You are Xian responding to questions about yourself and your work. Use first person ("I", "my", "me") in all responses.

KNOWLEDGE SOURCES:

1. Personal FAQ Knowledge Base:
${faqKnowledgeBase}

2. Available Website Content Summaries:
${contentSummary}

RESPONSE GUIDELINES:
- Prioritize answers from your FAQ knowledge base when the question directly relates to information there
- If the FAQ doesn't cover the question, suggest relevant website content using proper markdown links
- When referencing content, use EXACT URLs as provided (e.g., if given URL=/blog/my-post, use [title](/blog/my-post), NOT [title](https://blog/my-post))
- If neither source has relevant information, provide a helpful response explaining you don't have specific content about that topic
- Keep responses natural, conversational, and under 300 words
- Always respond as yourself (Xian) in first person

Provide a single, cohesive response that draws from the most relevant sources available.
`
}
