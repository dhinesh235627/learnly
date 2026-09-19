import { motion } from "motion/react"
import { Link } from "react-router-dom"
import { nextIncompleteLecture } from "../data/courses"
import type { Course } from "../data/courses"
import { useIdSet } from "../hooks/useIdSet"

const MotionLink = motion.create(Link)

export default function ContinueLearningCard({ course }: { course: Course }) {
  const completed = useIdSet("learnly:completed")
  const lecture = nextIncompleteLecture(course, completed.ids)
  if (!lecture) return null

  return (
    <MotionLink
      to={`/learn/${course.id}/${lecture.id}`}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="flex w-95 flex-none overflow-hidden rounded-xl border border-line bg-surface shadow-sm hover:shadow-lg"
    >
      <div
        className="group relative flex h-26 w-40 flex-none items-center justify-center overflow-hidden"
        style={{ background: `color-mix(in srgb, ${course.color} 10%, white)` }}
      >
        <img
          src={course.logo}
          alt={course.category}
          className="absolute left-2.5 top-2.5 h-5 max-w-[55%] object-contain object-left"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1" style={{ backgroundColor: course.color }} />
        <motion.span
          whileHover={{ scale: 1.08 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="grid h-10 w-10 place-items-center rounded-full bg-brand text-[13px] text-white shadow-md"
        >
          ▶
        </motion.span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 p-3.5">
        <p className="text-[11.5px] font-semibold uppercase tracking-wide text-ink-faint">
          {course.category}
        </p>
        <p className="line-clamp-2 text-[13.5px] font-semibold leading-snug text-ink">
          {lecture.title}
        </p>
        <p className="text-[12px] text-ink-faint">Lecture · {lecture.minutes}m</p>
      </div>
    </MotionLink>
  )
}
