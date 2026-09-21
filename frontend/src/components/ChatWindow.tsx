import { useEffect, useRef, useState } from "react"
import { CHAT_DISCLAIMER, CHAT_OPTIONS, CHAT_SUBTITLE, CHAT_WELCOME, matchReply, type ChatOption } from "../data/chatOptions"
import { sendMessage } from "../lib/chatApi"

type Message = { from: "bot" | "user"; text: string }

function now() {
  return new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
}

export default function ChatWindow({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([{ from: "bot", text: `${CHAT_WELCOME}\n${CHAT_SUBTITLE}` }])
  const [draft, setDraft] = useState("")
  const [sending, setSending] = useState(false)
  const [sentAt] = useState(now)
  const conversationId = useRef<string | undefined>(undefined)
  const bodyRef = useRef<HTMLDivElement>(null)

  const started = messages.length > 1

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, sending])

  function handleOption(option: ChatOption) {
    // Quick replies stay canned and free — only typed messages hit the paid agent.
    setMessages((m) => [...m, { from: "user", text: option.label }, { from: "bot", text: option.reply }])
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const text = draft.trim()
    if (!text || sending) return

    setMessages((m) => [...m, { from: "user", text }])
    setDraft("")
    setSending(true)

    try {
      const result = await sendMessage(text, conversationId.current)
      conversationId.current = result.conversationId
      setMessages((m) => [...m, { from: "bot", text: result.reply }])
    } catch {
      setMessages((m) => [...m, { from: "bot", text: matchReply(text) }])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex h-[480px] w-[92vw] max-w-sm flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-xl">
      <div className="flex flex-none items-center justify-between bg-brand px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-white/15 font-display text-sm font-bold text-white">
            L
          </span>
          <div>
            <p className="text-[13.5px] font-bold text-white">{started ? "Learnly Support" : "Learnly"}</p>
            {started && <p className="text-[11px] text-white/75">Today, {sentAt}</p>}
          </div>
        </div>
        <button
          type="button"
          aria-label="Close chat"
          onClick={onClose}
          className="grid h-7 w-7 flex-none place-items-center rounded-full text-white/90 hover:bg-white/15"
        >
          ✕
        </button>
      </div>

      <div ref={bodyRef} className="flex-1 overflow-y-auto px-4 py-4">
        {!started ? (
          <>
            <p className="text-[16px] font-bold text-ink">{CHAT_WELCOME}</p>
            <p className="mt-1 text-[13.5px] text-ink-soft">{CHAT_SUBTITLE}</p>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((msg, i) =>
              msg.from === "bot" ? (
                <div key={i} className="flex items-start gap-2">
                  <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-brand text-[11px] font-bold text-white">
                    L
                  </span>
                  <div className="max-w-[80%] whitespace-pre-line rounded-2xl rounded-tl-sm bg-paper px-3.5 py-2.5 text-[13.5px] text-ink">
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
                <div className="rounded-2xl rounded-tl-sm bg-paper px-3.5 py-2.5 text-[13.5px] text-ink-faint">
                  Typing…
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex-none border-t border-line px-4 py-3.5">
        {!started && (
          <div className="mb-3 flex flex-col gap-2">
            {CHAT_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleOption(option)}
                className="rounded-md bg-brand px-4 py-2.5 text-left text-[13.5px] font-semibold text-white transition hover:bg-brand-dark"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a message…"
            disabled={sending}
            className="flex-1 rounded-full border border-line bg-paper px-3.5 py-2 text-[13px] text-ink outline-none focus:border-brand disabled:opacity-60"
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={!draft.trim() || sending}
            className="grid h-9 w-9 flex-none place-items-center rounded-full bg-brand text-[14px] text-white transition hover:bg-brand-dark disabled:opacity-40"
          >
            ➤
          </button>
        </form>

        <p className="mt-2 text-[11px] leading-relaxed text-ink-faint">{CHAT_DISCLAIMER}</p>
      </div>
    </div>
  )
}
