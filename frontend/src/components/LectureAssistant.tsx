import { useEffect, useRef, useState } from "react"
import { sendLectureMessage } from "../lib/chatApi"

type Message = { from: "bot" | "user"; text: string }

export default function LectureAssistant({ lectureId }: { lectureId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState("")
  const [sending, setSending] = useState(false)
  const conversationId = useRef<string | undefined>(undefined)
  const bodyRef = useRef<HTMLDivElement>(null)

  // Fresh lecture — drop the previous one's thread entirely.
  useEffect(() => {
    setMessages([])
    conversationId.current = undefined
  }, [lectureId])

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, sending])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const text = draft.trim()
    if (!text || sending) return

    setMessages((m) => [...m, { from: "user", text }])
    setDraft("")
    setSending(true)

    try {
      const result = await sendLectureMessage(lectureId, text, conversationId.current)
      conversationId.current = result.conversationId
      setMessages((m) => [...m, { from: "bot", text: result.reply }])
    } catch {
      setMessages((m) => [...m, { from: "bot", text: "Sorry, I couldn't answer that — try again in a moment." }])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[13px] text-ink-faint">
        Ask about anything from this lecture — specific details from the video, or related concepts you're stuck on.
      </p>

      {messages.length > 0 && (
        <div
          ref={bodyRef}
          className="flex max-h-[420px] flex-col gap-3 overflow-y-auto rounded-md border border-line bg-paper p-4"
        >
          {messages.map((msg, i) =>
            msg.from === "bot" ? (
              <div key={i} className="flex items-start gap-2">
                <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-brand text-[11px] font-bold text-white">
                  L
                </span>
                <div className="max-w-[80%] whitespace-pre-line rounded-2xl rounded-tl-sm bg-surface px-3.5 py-2.5 text-[13.5px] text-ink">
                  {msg.text}
                </div>
              </div>
            ) : (
              <div key={i} className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-brand px-3.5 py-2.5 text-[13.5px] text-white">
                  {msg.text}
                </div>
              </div>
            ),
          )}
          {sending && (
            <div className="flex items-start gap-2">
              <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-brand text-[11px] font-bold text-white">
                L
              </span>
              <div className="rounded-2xl rounded-tl-sm bg-surface px-3.5 py-2.5 text-[13.5px] text-ink-faint">
                Thinking…
              </div>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSend} className="flex items-center gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask a question about this lecture…"
          disabled={sending}
          className="flex-1 rounded-md border border-line bg-surface px-3.5 py-2.5 text-[13.5px] text-ink outline-none focus:border-brand disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!draft.trim() || sending}
          className="rounded-md bg-brand px-4 py-2.5 text-[13.5px] font-semibold text-white transition hover:bg-brand-dark disabled:opacity-40"
        >
          Ask
        </button>
      </form>
    </div>
  )
}
