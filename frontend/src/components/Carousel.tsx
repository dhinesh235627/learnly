import { useRef } from "react"
import type { ReactNode } from "react"

export default function Carousel({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null)

  function scroll(dir: 1 | -1) {
    trackRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" })
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => scroll(1)}
        className="absolute -right-4 top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface text-ink shadow-md md:grid"
      >
        ›
      </button>
    </div>
  )
}
