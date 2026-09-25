import { app } from "@azure/functions"
import { readSessionCookie, verifySession } from "../lib/session.js"
import { videosContainerClient } from "../lib/videoStorage.js"
import { getAgentClient } from "../lib/foundryAgent.js"
import { createRateLimiter } from "../lib/rateLimit.js"

const AGENT_NAME = "LearnlyTeachingAssistant"
const MAX_MESSAGE_LENGTH = 1000
const MAX_OUTPUT_TOKENS = 400

// Lectures with a real transcript to ground answers in. Grows as more
// lectures get real video + subtitles — see videoUrl.js for the same list
// implicitly (any lecture with an "-subtitles-en.vtt" blob).
const TRANSCRIBED_LECTURES = new Set(["azb-01-intro"])

const isRateLimited = createRateLimiter(60_000, 10)

function vttToPlainText(vtt) {
  return vtt
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim()
      return trimmed && trimmed !== "WEBVTT" && !trimmed.includes("-->")
    })
    .join(" ")
    .trim()
}

async function fetchTranscript(lectureId) {
  const blobClient = videosContainerClient().getBlockBlobClient(`${lectureId}-subtitles-en.vtt`)
  const download = await blobClient.downloadToBuffer()
  return vttToPlainText(download.toString("utf8"))
}

app.http("lectureChat", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "videos/{lectureId}/chat",
  handler: async (request, context) => {
    const token = readSessionCookie(request)
    const claims = token ? verifySession(token) : null
    if (!claims) {
      return { status: 401, jsonBody: { error: "not_authenticated" } }
    }

    const lectureId = request.params.lectureId
    if (!lectureId || !TRANSCRIBED_LECTURES.has(lectureId)) {
      return { status: 400, jsonBody: { error: "no_transcript_for_lecture" } }
    }

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

      let input = message
      let conversation
      if (conversationId) {
        conversation = { id: conversationId }
      } else {
        conversation = await openai.conversations.create()
        const transcript = await fetchTranscript(lectureId)
        input = `Lecture transcript for context:\n\n${transcript}\n\nStudent question: ${message}`
      }

      const response = await openai.responses.create({
        conversation: conversation.id,
        input,
        max_output_tokens: MAX_OUTPUT_TOKENS,
      })

      return {
        status: 200,
        jsonBody: { reply: response.output_text, conversationId: conversation.id },
      }
    } catch (err) {
      context.error("lecture chat agent call failed", err)
      return { status: 502, jsonBody: { error: "agent_unavailable" } }
    }
  },
})
