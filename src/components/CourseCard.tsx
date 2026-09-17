import { motion } from "motion/react"
import { courseHours, courseProgress } from "../data/courses"
import type { Course } from "../data/courses"
import { useCourseRating } from "../hooks/useCourseRating"
import { useIdSet } from "../hooks/useIdSet"

function initials(title: string) {
  return title
    .split(" ")
    .filter((w) => w.length > 2 || /[A-Z]/.test(w[0]))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
}

export default function CourseCard({
  course,
  showProgress = true,
}: {
  course: Course
  showProgress?: boolean
}) {
  const discount = Math.round((1 - course.price / course.originalPrice) * 100)
  const { rating } = useCourseRating(course.id)
  const wishlist = useIdSet("learnly:wishlist")
  const wishlisted = wishlist.has(course.id)
  const completed = useIdSet("learnly:completed")
  const progress = courseProgress(course, completed.ids)
  const inProgress = progress.done > 0 && progress.done < progress.total

  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="flex w-full flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-sm hover:shadow-lg"
    >
      <div
        className="relative flex h-32 items-center justify-center text-2xl font-bold text-white"
        style={{ backgroundColor: course.color }}
      >
        {initials(course.title)}
        <motion.button
          type="button"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          whileTap={{ scale: 0.8 }}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            wishlist.toggle(course.id)
          }}
          className={
            "absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full text-[14px] transition " +
            (wishlisted ? "bg-white text-brand" : "bg-black/25 text-white hover:bg-black/40")
          }
        >
          {wishlisted ? "♥" : "♡"}
        </motion.button>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="line-clamp-2 min-h-[2.7em] text-[15px] font-semibold leading-snug text-ink">
          {course.title}
        </h3>
        <p className="text-[13px] text-ink-faint">{course.instructor}</p>

        {showProgress && inProgress ? (
          <div className="mt-1.5">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-brand"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
            <p className="mt-1 text-[12px] font-medium text-ink-soft">
              {progress.percent}% complete
            </p>
          </div>
        ) : (
          <>
            {rating ? (
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-bold text-amber-700">{rating.toFixed(1)}</span>
                <span className="text-amber-500" aria-hidden="true">
                  {"★".repeat(rating)}
                  {"☆".repeat(5 - rating)}
                </span>
                <span className="text-[12px] text-ink-faint">(your rating)</span>
              </div>
            ) : (
              <p className="text-[12px] text-ink-faint">No ratings yet</p>
            )}
            <p className="text-[12px] text-ink-faint">
              {courseHours(course)}h total · {course.level}
            </p>
            {course.bestseller && (
              <span className="mt-1 inline-block w-fit rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-bold text-amber-900">
                Bestseller
              </span>
            )}
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-[15px] font-bold text-ink">
                ₹{course.price}
              </span>
              <span className="font-mono text-[12.5px] text-ink-faint line-through">
                ₹{course.originalPrice}
              </span>
              <span className="text-[12px] font-semibold text-brand">
                {discount}% off
              </span>
            </div>
          </>
        )}
      </div>
    </motion.article>
  )
}
