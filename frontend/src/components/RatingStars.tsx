/** Read-only 5-star row with smooth partial-fill, rendered in gold over a muted base. */
export default function RatingStars({ rating, size = 13 }: { rating: number; size?: number }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100))
  return (
    <span
      className="relative inline-flex flex-none"
      style={{ fontSize: size, lineHeight: 1 }}
      aria-hidden="true"
    >
      <span className="flex text-line">★★★★★</span>
      <span
        className="absolute inset-0 flex overflow-hidden text-[#F5A623]"
        style={{ width: `${pct}%` }}
      >
        ★★★★★
      </span>
    </span>
  )
}
