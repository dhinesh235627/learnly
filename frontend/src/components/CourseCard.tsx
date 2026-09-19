import { motion } from "motion/react"
import { courseHours, courseProgress } from "../data/courses"
import type { Course } from "../data/courses"
import { useIdSet } from "../hooks/useIdSet"
import RatingStars from "./RatingStars"

export default function CourseCard({
  course,
  showProgress = true,
}: {
  course: Course
  showProgress?: boolean
}) {
  const discount = Math.round((1 - course.price / course.originalPrice) * 100)
  const wishlist = useIdSet("learnly:wishlist")
  const wishlisted = wishlist.has(course.id)
  const cart = useIdSet("learnly:cart")
  const inCart = cart.has(course.id)
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
        className="relative flex h-36 items-center justify-center overflow-hidden"
        style={{ background: `color-mix(in srgb, ${course.color} 10%, white)` }}
      >
        <img
          src={course.logo}
          alt={course.category}
          className="h-16 max-w-[65%] object-contain"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1.5" style={{ backgroundColor: course.color }} />

        {course.bestseller && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded bg-brand px-1.5 py-0.5 text-[10.5px] font-bold text-white shadow-sm">
            ★ Bestseller
          </span>
        )}

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
            (wishlisted ? "bg-brand-soft text-brand" : "bg-black/8 text-ink-faint hover:bg-black/15")
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
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-bold text-[#B45900]">{course.rating.toFixed(1)}</span>
              <RatingStars rating={course.rating} />
              <span className="text-[12px] text-ink-faint">({course.ratingCount.toLocaleString()})</span>
            </div>
            <p className="text-[12px] text-ink-faint">
              {courseHours(course)}h total · {course.level}
            </p>
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
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                cart.toggle(course.id)
              }}
              className={
                "mt-1.5 w-full rounded-md border py-2 text-[13px] font-bold transition " +
                (inCart
                  ? "border-brand bg-brand-soft text-brand"
                  : "border-line text-ink hover:border-ink-soft")
              }
            >
              {inCart ? "✓ Added to cart" : "Add to cart"}
            </button>
          </>
        )}
      </div>
    </motion.article>
  )
}
