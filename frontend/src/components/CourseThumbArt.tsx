import type { ReactElement } from "react"

function clamp(n: number) {
  return Math.max(0, Math.min(255, n))
}

function shade(hex: string, amount: number) {
  const num = parseInt(hex.replace("#", ""), 16)
  const r = clamp((num >> 16) + Math.round(255 * amount))
  const g = clamp(((num >> 8) & 0xff) + Math.round(255 * amount))
  const b = clamp((num & 0xff) + Math.round(255 * amount))
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

/** A diagonal two-tone gradient derived from the course's brand color. */
export function thumbGradient(color: string) {
  return {
    backgroundImage: `linear-gradient(135deg, ${shade(color, 0.14)} 0%, ${color} 45%, ${shade(color, -0.3)} 100%)`,
  }
}

/** Large, low-opacity watermark glyph per category — generic icons, not brand logos. */
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

function StackedCubeGlyph(props: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={props.className} aria-hidden="true">
      <path d="M50 18 82 34 50 50 18 34Z" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M18 34v32l32 16 32-16V34" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M50 50v32" stroke="currentColor" strokeWidth="3.5" />
    </svg>
  )
}

function OrbitCloudGlyph(props: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={props.className} aria-hidden="true">
      <path
        d="M34 66a17 17 0 0 1-2-33.8A21 21 0 0 1 71 24a15 15 0 0 1 5 29"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="50" cy="50" r="34" stroke="currentColor" strokeWidth="2" strokeDasharray="2 6" />
    </svg>
  )
}

function DashboardGlyph(props: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={props.className} aria-hidden="true">
      <rect x="18" y="18" width="64" height="64" rx="6" stroke="currentColor" strokeWidth="3.5" />
      <path d="M30 66V50M50 66V34M70 66V44" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}

const GLYPHS: Record<string, (props: { className?: string }) => ReactElement> = {
  "Microsoft Azure": CloudCircuitGlyph,
  AWS: StackedCubeGlyph,
  "Google Cloud": OrbitCloudGlyph,
  SAP: DashboardGlyph,
}

export function CategoryGlyph({ category, className }: { category: string; className?: string }) {
  const Glyph = GLYPHS[category] ?? CloudCircuitGlyph
  return <Glyph className={className} />
}
