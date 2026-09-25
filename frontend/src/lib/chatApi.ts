import { API_BASE } from "./api"

export type ChatReply = { reply: string; conversationId: string }

export async function sendMessage(text: string, conversationId?: string): Promise<ChatReply> {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text, conversationId }),
  })

  if (!res.ok) {
    throw new Error(`chat request failed: ${res.status}`)
  }

  return res.json() as Promise<ChatReply>
}

/** Gated behind login, like video access — the backend grounds the first reply in the lecture's transcript. */
export async function sendLectureMessage(
  lectureId: string,
  text: string,
  conversationId?: string,
): Promise<ChatReply> {
  const res = await fetch(`${API_BASE}/api/videos/${lectureId}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ message: text, conversationId }),
  })

  if (!res.ok) {
    throw new Error(`lecture chat request failed: ${res.status}`)
  }

  return res.json() as Promise<ChatReply>
}
