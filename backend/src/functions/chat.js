import { app } from "@azure/functions"
import { DefaultAzureCredential } from "@azure/identity"
import { AIProjectClient } from "@azure/ai-projects"

const AGENT_NAME = "LearnlySupportAgent"
const MAX_MESSAGE_LENGTH = 1000
const MAX_OUTPUT_TOKENS = 300

// Lightweight, single-instance abuse guard for a public, unauthenticated,
// paid-model endpoint. Not durable across restarts or multiple Function
// instances — a proper fix (Table/Cosmos-backed) can come later; this just
// stops a casual loop from running up model costs.
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 10
const requestLog = new Map()

function isRateLimited(clientId) {
  const now = Date.now()
  const timestamps = (requestLog.get(clientId) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  timestamps.push(now)
  requestLog.set(clientId, timestamps)
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS
}

let projectClient
let openAIClient

async function getOpenAIClient() {
  if (!openAIClient) {
    const endpoint = process.env.FOUNDRY_PROJECT_ENDPOINT
    if (!endpoint) throw new Error("FOUNDRY_PROJECT_ENDPOINT is not configured")
    projectClient = new AIProjectClient(endpoint, new DefaultAzureCredential())
    openAIClient = projectClient.getOpenAIClient({ azureConfig: { allowPreview: true, agentName: AGENT_NAME } })
  }
  return openAIClient
}

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
      const openai = await getOpenAIClient()
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
