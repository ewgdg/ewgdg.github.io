import { Hono } from "hono"
import { cors } from "hono/cors"
import { buildSystemPrompt } from "./knowledge"

// Gemma 4 26B (4B active) is the cheapest capable chat model on Workers AI:
// ~30 neurons per chat, so the 10k/day free allocation covers ~300 chats.
const MODEL = "@cf/google/gemma-4-26b-a4b-it"
// Headroom over the ~300 words the prompt asks for, plus markdown link URLs, so
// replies aren't cut mid-sentence; neurons are only spent on tokens generated.
const MAX_REPLY_TOKENS = 1024
// AI Gateway holding the daily spend limit; it keeps chats capped even if the
// account leaves the Workers Free plan, whose neuron allocation is the only other cap.
const SPEND_CAPPED_GATEWAY_ID = "qa-chatbot"

// The chat box sends at most 4 turns (3 of history plus the new question), and
// replies stay under MAX_REPLY_TOKENS; anything larger only burns free neurons.
const MAX_MESSAGES = 8
const MAX_MESSAGE_CHARS = 5_000

const CHAT_ROLES = ["user", "assistant"]

type ChatMessage = { role: "user" | "assistant"; content: string }

// Only user/assistant turns are accepted so visitors cannot inject system instructions.
function isChatMessage(message: unknown): message is ChatMessage {
  if (typeof message !== "object" || message === null) return false
  const { role, content } = message as Record<string, unknown>
  return (
    CHAT_ROLES.includes(role as string) &&
    typeof content === "string" &&
    content.length <= MAX_MESSAGE_CHARS
  )
}

function isChatRequest(body: unknown): body is { messages: ChatMessage[] } {
  const messages = (body as { messages?: unknown } | null)?.messages
  return (
    Array.isArray(messages) &&
    messages.length > 0 &&
    messages.length <= MAX_MESSAGES &&
    messages.every(isChatMessage)
  )
}

async function generateReply(env: Env, messages: ChatMessage[]): Promise<string | null> {
  const systemPrompt = await buildSystemPrompt(env.SITE_BASE_URL)
  const result = await env.AI.run(
    MODEL,
    {
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      max_tokens: MAX_REPLY_TOKENS,
      // Thinking adds latency and neurons; FAQ-style answers don't need it.
      chat_template_kwargs: { enable_thinking: false },
    },
    { gateway: { id: SPEND_CAPPED_GATEWAY_ID } },
  )
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
  // Visitors are anonymous, so their IP is the only per-visitor key. Cloudflare
  // sets this header on every request; it is only missing in unit tests.
  const visitorIp = c.req.header("CF-Connecting-IP") ?? "unknown"
  const { success } = await c.env.CHAT_RATE_LIMITER.limit({ key: visitorIp })
  if (!success) {
    return c.json({ detail: "Too many messages; please wait a minute" }, 429)
  }

  const body = await c.req.json().catch(() => null)
  if (!isChatRequest(body)) {
    return c.json({ detail: `messages must be 1-${MAX_MESSAGES} user/assistant turns of text` }, 400)
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
