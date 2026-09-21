import { useState } from "react"
import { CHAT_DISCLAIMER, CHAT_OPTIONS, CHAT_SUBTITLE, CHAT_WELCOME, type ChatOption } from "../data/chatOptions"

function now() {
  return new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
}

export default function ChatWindow({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<ChatOption | null>(null)
  const [sentAt] = useState(now)

  return (
    <div className="flex h-[480px] w-[92vw] max-w-sm flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-xl">
      <div className="flex flex-none items-center justify-between bg-brand px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-white/15 font-display text-sm font-bold text-white">
            L
          </span>
          <div>
            <p className="text-[13.5px] font-bold text-white">{selected ? "Learnly Support" : "Learnly"}</p>
            {selected && <p className="text-[11px] text-white/75">Today, {sentAt}</p>}
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

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {!selected ? (
          <>
            <p className="text-[16px] font-bold text-ink">{CHAT_WELCOME}</p>
            <p className="mt-1 text-[13.5px] text-ink-soft">{CHAT_SUBTITLE}</p>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-2">
              <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-brand text-[11px] font-bold text-white">
                L
              </span>
              <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-paper px-3.5 py-2.5 text-[13.5px] text-ink">
                {CHAT_WELCOME}
                <br />
                {CHAT_SUBTITLE}
              </div>
            </div>
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-brand px-3.5 py-2.5 text-[13.5px] text-white">
                {selected.label}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-brand text-[11px] font-bold text-white">
                L
              </span>
              <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-paper px-3.5 py-2.5 text-[13.5px] text-ink">
                {selected.reply}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-none border-t border-line px-4 py-3.5">
        {!selected && (
          <div className="mb-3 flex flex-col gap-2">
            {CHAT_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelected(option)}
                className="rounded-md bg-brand px-4 py-2.5 text-left text-[13.5px] font-semibold text-white transition hover:bg-brand-dark"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
        <p className="text-[11px] leading-relaxed text-ink-faint">{CHAT_DISCLAIMER}</p>
      </div>
    </div>
  )
}
