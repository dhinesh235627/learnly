/** Large, low-opacity watermark glyph — a generic icon, not a brand logo. */
export function CloudCircuitGlyph(props: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={props.className} aria-hidden="true">
      <path
        d="M30 62a16 16 0 0 1-2-31.9A20 20 0 0 1 66 22a14 14 0 0 1 4 27.4"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path d="M30 62h38" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="30" cy="78" r="4" stroke="currentColor" strokeWidth="3.5" />
      <circle cx="50" cy="78" r="4" stroke="currentColor" strokeWidth="3.5" />
      <circle cx="70" cy="78" r="4" stroke="currentColor" strokeWidth="3.5" />
      <path d="M30 74v-6M50 74v-6M70 74v-6" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}
