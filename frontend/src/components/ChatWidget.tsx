import { useState } from "react"
import AnimatedPopover from "./AnimatedPopover"
import ChatWindow from "./ChatWindow"
import { useClickOutside } from "../hooks/useClickOutside"

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false))

  return (
    <div ref={ref} className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <AnimatedPopover open={open} className="origin-bottom-right">
        <ChatWindow onClose={() => setOpen(false)} />
      </AnimatedPopover>

      <button
        type="button"
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((v) => !v)}
        className="grid h-14 w-14 place-items-center rounded-full bg-brand text-[22px] text-white shadow-lg transition hover:bg-brand-dark"
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  )
}
