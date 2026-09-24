import { app } from "@azure/functions"
import { BlobSASPermissions, BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob"
import { readSessionCookie, verifySession } from "../lib/session.js"

const LECTURE_ID_PATTERN = /^[a-z0-9-]+$/
const SAS_TTL_MS = 30 * 60 * 1000
const KINDS = new Set(["video", "audio", "subtitles"])
const LANGS = new Set(["en", "hi", "es", "ar"])

function blobNameFor(lectureId, kind, lang) {
  if (kind === "audio") return `${lectureId}-audio-${lang}.m4a`
  if (kind === "subtitles") return `${lectureId}-subtitles-${lang}.vtt`
  return `${lectureId}.mp4`
}

function blobServiceClient() {
  const accountName = process.env.VIDEOS_ACCOUNT_NAME
  const accountKey = process.env.VIDEOS_ACCOUNT_KEY
  if (!accountName || !accountKey) {
    throw new Error("VIDEOS_ACCOUNT_NAME / VIDEOS_ACCOUNT_KEY are not configured")
  }
  const credential = new StorageSharedKeyCredential(accountName, accountKey)
  return new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, credential)
}

app.http("videoUrl", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "videos/{lectureId}/url",
  handler: async (request) => {
    const token = readSessionCookie(request)
    const claims = token ? verifySession(token) : null
    if (!claims) {
      return { status: 401, jsonBody: { error: "not_authenticated" } }
    }

    const lectureId = request.params.lectureId
    if (!lectureId || !LECTURE_ID_PATTERN.test(lectureId)) {
      return { status: 400, jsonBody: { error: "invalid_lecture_id" } }
    }

    const kind = request.query.get("kind") ?? "video"
    if (!KINDS.has(kind)) {
      return { status: 400, jsonBody: { error: "invalid_kind" } }
    }

    const lang = request.query.get("lang")
    if (kind !== "video" && !LANGS.has(lang)) {
      return { status: 400, jsonBody: { error: "invalid_lang" } }
    }

    const containerName = process.env.VIDEOS_CONTAINER ?? "videos"
    const blobClient = blobServiceClient()
      .getContainerClient(containerName)
      .getBlockBlobClient(blobNameFor(lectureId, kind, lang))

    const url = await blobClient.generateSasUrl({
      permissions: BlobSASPermissions.parse("r"),
      expiresOn: new Date(Date.now() + SAS_TTL_MS),
    })

    return { status: 200, jsonBody: { url } }
  },
})
