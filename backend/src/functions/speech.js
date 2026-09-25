import { app } from "@azure/functions"
import { readSessionCookie, verifySession } from "../lib/session.js"
import { createRateLimiter } from "../lib/rateLimit.js"

// Short spoken callouts only (e.g. "hey <name>, you seem distracted") — not
// a general narration endpoint, so a low character cap keeps both cost and
// abuse surface small.
const MAX_TEXT_LENGTH = 300
const VOICE_NAME = "en-US-JennyNeural"

const isRateLimited = createRateLimiter(60_000, 5)

function escapeSsml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

async function synthesize(text) {
  const key = process.env.SPEECH_KEY
  const region = process.env.SPEECH_REGION
  if (!key || !region) {
    throw new Error("SPEECH_KEY / SPEECH_REGION are not configured")
  }

  const ssml = `<speak version='1.0' xml:lang='en-US'><voice xml:lang='en-US' xml:gender='Female' name='${VOICE_NAME}'>${escapeSsml(text)}</voice></speak>`

  const res = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": "audio-16khz-64kbitrate-mono-mp3",
      "User-Agent": "learnly-app",
    },
    body: ssml,
  })

  if (!res.ok) {
    throw new Error(`speech synthesis failed: ${res.status} ${await res.text()}`)
  }

  return Buffer.from(await res.arrayBuffer())
}

app.http("speech", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "speech/synthesize",
  handler: async (request, context) => {
    const token = readSessionCookie(request)
    const claims = token ? verifySession(token) : null
    if (!claims) {
      return { status: 401, jsonBody: { error: "not_authenticated" } }
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

    const text = typeof body?.text === "string" ? body.text.trim() : ""
    if (!text || text.length > MAX_TEXT_LENGTH) {
      return { status: 400, jsonBody: { error: "invalid_text" } }
    }

    try {
      const audio = await synthesize(text)
      return {
        status: 200,
        headers: { "Content-Type": "audio/mpeg" },
        body: audio,
      }
    } catch (err) {
      context.error("speech synthesis failed", err)
      return { status: 502, jsonBody: { error: "speech_unavailable" } }
    }
  },
})
