import { API_BASE } from "./api"

/** Synthesizes `text` via the backend's Azure Speech endpoint and plays it
 * immediately. Gated behind login, like video access. */
export async function speakCallout(text: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/speech/synthesize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ text }),
  })

  if (!res.ok) {
    throw new Error(`speech request failed: ${res.status}`)
  }

  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const audio = new Audio(url)
  audio.addEventListener("ended", () => URL.revokeObjectURL(url))
  audio.addEventListener("error", () => URL.revokeObjectURL(url))
  await audio.play()
}
