import { useState } from "react"

export default function StarRating({
  value,
  onRate,
}: {
  value: number | null
  onRate: (value: number) => void
}) {
  const [hover, setHover] = useState<number | null>(null)
  const shown = hover ?? value ?? 0

  return (
    <div className="flex items-center gap-2">
      <div className="flex" onMouseLeave={() => setHover(null)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`Rate ${n} star${n === 1 ? "" : "s"}`}
            onMouseEnter={() => setHover(n)}
            onClick={() => onRate(n)}
            className="p-0.5 text-[20px] leading-none text-amber-500"
          >
            {n <= shown ? "★" : "☆"}
          </button>
        ))}
      </div>
      <span className="text-[13px] text-ink-soft">
        {value ? `You rated this ${value} star${value === 1 ? "" : "s"}` : "Rate this course"}
      </span>
    </div>
  )
}
