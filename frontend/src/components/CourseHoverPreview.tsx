import { courseHours } from "../data/courses"
import type { Course } from "../data/courses"
import { useIdSet } from "../hooks/useIdSet"
import RatingStars from "./RatingStars"

type Props = {
  course: Course
  style: React.CSSProperties
  onMouseEnter: () => void
  onMouseLeave: () => void
  previewRef: React.Ref<HTMLDivElement>
}

export default function CourseHoverPreview({ course, style, onMouseEnter, onMouseLeave, previewRef }: Props) {
  const cart = useIdSet("learnly:cart")
  const inCart = cart.has(course.id)

  return (
    <div
      ref={previewRef}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="fixed z-50 w-72 rounded-lg border border-line bg-surface p-4 shadow-xl"
    >
      <h4 className="text-[15px] font-bold leading-snug text-ink">{course.title}</h4>

      <div className="mt-1.5 flex items-center gap-1.5">
        {course.bestseller && (
          <span className="rounded bg-brand-soft px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">
            Bestseller
          </span>
        )}
        <span className="text-[12.5px] font-bold text-[#B45900]">{course.rating.toFixed(1)}</span>
        <RatingStars rating={course.rating} size={12} />
      </div>

      <p className="mt-1 text-[12px] text-ink-faint">
        {courseHours(course)}h · {course.level}
      </p>

      <p className="mt-2 line-clamp-3 text-[12.5px] leading-relaxed text-ink-soft">{course.description}</p>

      <ul className="mt-2 flex flex-col gap-1">
        {course.whatYouLearn.slice(0, 2).map((item) => (
          <li key={item} className="flex items-start gap-1.5 text-[12px] text-ink-soft">
            <span className="flex-none text-teal">✓</span>
            <span className="line-clamp-1">{item}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          cart.toggle(course.id)
        }}
        className={
          "mt-3 w-full rounded-md py-2 text-[13px] font-bold transition " +
          (inCart ? "border border-brand bg-brand-soft text-brand" : "bg-brand text-white hover:bg-brand-dark")
        }
      >
        {inCart ? "✓ Added to cart" : "Add to cart"}
      </button>
    </div>
  )
}
