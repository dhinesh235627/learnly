import { motion } from "motion/react"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { courseProgress } from "../data/courses"
import type { Course } from "../data/courses"
import { useIdSet } from "../hooks/useIdSet"
import CourseHoverPreview from "./CourseHoverPreview"

const PREVIEW_WIDTH = 288
const ENTER_DELAY = 300
const LEAVE_DELAY = 150

export default function CourseCard({
  course,
  showProgress = true,
}: {
  course: Course
  showProgress?: boolean
}) {
  const wishlist = useIdSet("learnly:wishlist")
  const wishlisted = wishlist.has(course.id)
  const completed = useIdSet("learnly:completed")
  const progress = courseProgress(course, completed.ids)
  const inProgress = progress.done > 0 && progress.done < progress.total
  const canPreview = !(showProgress && inProgress)

  const cardRef = useRef<HTMLElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const enterTimer = useRef<number>(undefined)
  const leaveTimer = useRef<number>(undefined)

  useEffect(() => {
    return () => {
      window.clearTimeout(enterTimer.current)
      window.clearTimeout(leaveTimer.current)
    }
  }, [])

  useLayoutEffect(() => {
    if (!showPreview) return
    const cardRect = cardRef.current?.getBoundingClientRect()
    const previewHeight = previewRef.current?.getBoundingClientRect().height ?? 0
    if (!cardRect) return

    let left = cardRect.right + 10
    if (left + PREVIEW_WIDTH > window.innerWidth - 8) {
      left = cardRect.left - PREVIEW_WIDTH - 10
    }
    left = Math.max(8, left)

    let top = cardRect.top
    if (top + previewHeight > window.innerHeight - 8) {
      top = Math.max(8, window.innerHeight - previewHeight - 8)
    }

    setPosition({ top, left })
  }, [showPreview])

  useEffect(() => {
    if (!showPreview) return
    const close = () => setShowPreview(false)
    window.addEventListener("scroll", close, true)
    return () => window.removeEventListener("scroll", close, true)
  }, [showPreview])

  function handleEnter() {
    if (!canPreview) return
    window.clearTimeout(leaveTimer.current)
    enterTimer.current = window.setTimeout(() => setShowPreview(true), ENTER_DELAY)
  }

  function handleLeave() {
    window.clearTimeout(enterTimer.current)
    leaveTimer.current = window.setTimeout(() => setShowPreview(false), LEAVE_DELAY)
  }

  return (
    <>
      <motion.article
        ref={cardRef}
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
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
              <div className="flex flex-wrap items-center gap-1.5">
                {course.bestseller && (
                  <span className="rounded bg-teal-soft px-1.5 py-0.5 text-[11px] font-bold text-teal">
                    Bestseller
                  </span>
                )}
                <span className="rounded border border-line px-1.5 py-0.5 text-[11px] font-semibold text-ink-soft">
                  Course
                </span>
                <span className="flex items-center gap-1 rounded border border-line px-1.5 py-0.5 text-[11px] font-bold text-[#B45900]">
                  <span className="text-[#F5A623]">★</span>
                  {course.rating.toFixed(1)}
                </span>
              </div>
              <p className="text-[12px] text-ink-faint">
                ({course.ratingCount.toLocaleString()} ratings)
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-[15px] font-bold text-ink">
                  ₹{course.price}
                </span>
                <span className="font-mono text-[12.5px] text-ink-faint line-through">
                  ₹{course.originalPrice}
                </span>
              </div>
            </>
          )}
        </div>
      </motion.article>

      {canPreview &&
        showPreview &&
        createPortal(
          <CourseHoverPreview
            course={course}
            previewRef={previewRef}
            style={{ top: position.top, left: position.left }}
            onMouseEnter={() => window.clearTimeout(leaveTimer.current)}
            onMouseLeave={handleLeave}
          />,
          document.body,
        )}
    </>
  )
}
