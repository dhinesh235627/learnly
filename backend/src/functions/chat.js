import { app } from "@azure/functions"
import { getAgentClient } from "../lib/foundryAgent.js"
import { createRateLimiter } from "../lib/rateLimit.js"

const AGENT_NAME = "LearnlySupportAgent"
const MAX_MESSAGE_LENGTH = 1000
const MAX_OUTPUT_TOKENS = 300

const isRateLimited = createRateLimiter(60_000, 10)

app.http("chat", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "chat",
  handler: async (request, context) => {
    const clientId = request.headers.get("x-forwarded-for") ?? "unknown"
    if (isRateLimited(clientId)) {
      return { status: 429, jsonBody: { error: "rate_limited" } }
    }

    let body
    try {
      body = await request.json()
    } catch {
      return { status: 400, jsonBody: { error: "invalid_json" } }
    }

    const message = typeof body?.message === "string" ? body.message.trim() : ""
    if (!message || message.length > MAX_MESSAGE_LENGTH) {
      return { status: 400, jsonBody: { error: "invalid_message" } }
    }

    const conversationId = typeof body?.conversationId === "string" ? body.conversationId : undefined

    try {
      const openai = getAgentClient(AGENT_NAME)
      const conversation = conversationId ? { id: conversationId } : await openai.conversations.create()

      const response = await openai.responses.create({
        conversation: conversation.id,
        input: message,
        max_output_tokens: MAX_OUTPUT_TOKENS,
      })

      return {
        status: 200,
        jsonBody: { reply: response.output_text, conversationId: conversation.id },
      }
    } catch (err) {
      context.error("chat agent call failed", err)
      return { status: 502, jsonBody: { error: "agent_unavailable" } }
    }
  },
})
