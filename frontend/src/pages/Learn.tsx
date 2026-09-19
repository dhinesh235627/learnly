import { useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import AnimatedPopover from "../components/AnimatedPopover"
import StarRating from "../components/StarRating"
import { adjacentLecture, allLectures, courseProgress, courses, findLecture } from "../data/courses"
import { useClickOutside } from "../hooks/useClickOutside"
import { useCourseRating } from "../hooks/useCourseRating"
import { useCourseReminder } from "../hooks/useCourseReminder"
import { useCourseReview } from "../hooks/useCourseReview"
import { useIdSet } from "../hooks/useIdSet"
import { useLectureNotes } from "../hooks/useLectureNotes"
import { useLectureQuestions } from "../hooks/useLectureQuestions"

const TABS = ["Course content", "Overview", "Q&A", "Notes", "Announcements", "Reviews", "Learning tools"] as const

export default function Learn() {
  const { courseId, lectureId } = useParams()
  const navigate = useNavigate()
  const course = courses.find((c) => c.id === courseId)
  const [openSection, setOpenSection] = useState(0)
  const completed = useIdSet("learnly:completed")
  const [tab, setTab] = useState<(typeof TABS)[number]>("Course content")
  const [showCaptionsNotice, setShowCaptionsNotice] = useState(false)
  const [questionDraft, setQuestionDraft] = useState("")

  const [openRating, setOpenRating] = useState(false)
  const [openProgress, setOpenProgress] = useState(false)
  const [openMore, setOpenMore] = useState(false)
  const [copied, setCopied] = useState(false)
  const [reviewDraft, setReviewDraft] = useState("")

  const ratingRef = useClickOutside<HTMLDivElement>(() => setOpenRating(false))
  const progressRef = useClickOutside<HTMLDivElement>(() => setOpenProgress(false))
  const moreRef = useClickOutside<HTMLDivElement>(() => setOpenMore(false))

  const { rating, rate } = useCourseRating(courseId ?? "")
  const { review, submit } = useCourseReview(courseId ?? "")
  const { text: noteText, setText: setNoteText } = useLectureNotes(lectureId ?? "")
  const { questions, ask } = useLectureQuestions(lectureId ?? "")
  const { reminder, permission, setReminder, clearReminder } = useCourseReminder(courseId ?? "", course?.title ?? "")

  const lecture = course && lectureId ? findLecture(course, lectureId) : undefined

  const currentSectionIndex = useMemo(() => {
    if (!course || !lecture) return 0
    return course.curriculum.findIndex((s) => s.lectures.some((l) => l.id === lecture.id))
  }, [course, lecture])

  if (!course || !lecture) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-3 bg-paper text-center">
        <p className="text-[15px] text-ink-soft">Lecture not found.</p>
        <Link to="/home" className="font-semibold text-brand hover:underline">
          Back to home
        </Link>
      </div>
    )
  }

  const flat = allLectures(course)
  const lectureNumber = flat.findIndex((l) => l.id === lecture.id) + 1
  const prev = adjacentLecture(course, lecture.id, -1)
  const next = adjacentLecture(course, lecture.id, 1)
  const isComplete = completed.has(lecture.id)
  const activeSection = currentSectionIndex === -1 ? 0 : currentSectionIndex
  const progress = courseProgress(course, completed.ids)

  function submitReview() {
    if (!rating) return
    submit(rating, reviewDraft.trim())
    setReviewDraft("")
    setOpenRating(false)
  }

  function askQuestion() {
    if (!questionDraft.trim()) return
    ask(questionDraft)
    setQuestionDraft("")
  }

  function setQuickReminder(hoursFromNow: number) {
    const at = new Date(Date.now() + hoursFromNow * 60 * 60 * 1000)
    setReminder(at.toISOString())
  }

  function formatReminder(atISO: string) {
    return new Date(atISO).toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  function share() {
    try {
      navigator.clipboard.writeText(window.location.href)
    } catch {
      // clipboard unavailable — still show confirmation, link is in the address bar
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="flex min-h-svh flex-col bg-ink">
      {/* Slim player header */}
      <header className="border-b border-white/10 bg-[#1c1d1f] px-4 py-2.5">
        <div className="mx-auto flex max-w-[1760px] items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link to={`/course/${course.id}`} aria-label="Back to course" className="text-[18px] text-white/80 hover:text-white">
            ←
          </Link>
          <p className="min-w-0 truncate text-[13.5px] font-semibold text-white">{course.title}</p>
        </div>

        <div className="flex flex-none items-center gap-2">
          <div className="relative" ref={ratingRef}>
            <button
              type="button"
              onClick={() => {
                setOpenRating((v) => !v)
                setOpenProgress(false)
                setOpenMore(false)
              }}
              className="hidden items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12.5px] font-semibold text-white/90 hover:bg-white/10 sm:flex"
            >
              {rating ? "★" : "☆"} {rating ? "Your rating" : "Leave a rating"}
            </button>
            <AnimatedPopover
              open={openRating}
              className="absolute right-0 z-50 mt-2 w-72 origin-top-right rounded-xl border border-white/10 bg-[#25262b] p-4 shadow-lg"
            >
              <p className="text-[13px] font-bold text-white">Rate this course</p>
              <div className="mt-2">
                <StarRating value={rating} onRate={rate} />
              </div>
              <textarea
                value={reviewDraft}
                onChange={(e) => setReviewDraft(e.target.value)}
                placeholder="Share what you thought (optional)"
                rows={3}
                className="mt-3 w-full rounded-md border border-white/15 bg-[#1c1d1f] p-2 text-[13px] text-white outline-none placeholder:text-white/40 focus:border-brand"
              />
              <button
                type="button"
                disabled={!rating}
                onClick={submitReview}
                className="mt-2 w-full rounded-md bg-brand px-3 py-1.5 text-[13px] font-semibold text-white transition disabled:opacity-40"
              >
                Post
              </button>
            </AnimatedPopover>
          </div>

          <div className="relative" ref={progressRef}>
            <button
              type="button"
              onClick={() => {
                setOpenProgress((v) => !v)
                setOpenRating(false)
                setOpenMore(false)
              }}
              className="hidden items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12.5px] font-semibold text-white/90 hover:bg-white/10 sm:flex"
            >
              🏆 {progress.percent}%
            </button>
            <AnimatedPopover
              open={openProgress}
              className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-xl border border-white/10 bg-[#25262b] p-4 shadow-lg"
            >
              <p className="text-[13px] font-bold text-white">Your progress</p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-brand" style={{ width: `${progress.percent}%` }} />
              </div>
              <p className="mt-2 text-[12.5px] text-white/70">
                {progress.done} of {progress.total} lectures completed
              </p>
            </AnimatedPopover>
          </div>

          <button
            type="button"
            onClick={share}
            className="hidden items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12.5px] font-semibold text-white/90 hover:bg-white/10 sm:flex"
          >
            {copied ? "Copied!" : "Share ⤴"}
          </button>

          <div className="relative" ref={moreRef}>
            <button
              type="button"
              aria-label="More options"
              onClick={() => {
                setOpenMore((v) => !v)
                setOpenRating(false)
                setOpenProgress(false)
              }}
              className="grid h-8 w-8 place-items-center rounded-md text-white/80 hover:bg-white/10"
            >
              ⋮
            </button>
            <AnimatedPopover
              open={openMore}
              className="absolute right-0 z-50 mt-2 w-52 origin-top-right rounded-xl border border-white/10 bg-[#25262b] p-2 shadow-lg"
            >
              <Link
                to={`/course/${course.id}`}
                onClick={() => setOpenMore(false)}
                className="block rounded-lg px-2.5 py-2 text-[13px] text-white/80 hover:bg-white/10 hover:text-white"
              >
                Course details
              </Link>
              <button
                type="button"
                onClick={() => setOpenMore(false)}
                className="block w-full rounded-lg px-2.5 py-2 text-left text-[13px] text-white/80 hover:bg-white/10 hover:text-white"
              >
                Report an issue
              </button>
            </AnimatedPopover>
          </div>

          <button
            type="button"
            onClick={() => completed.toggle(lecture.id)}
            className={
              "flex-none rounded-md px-3.5 py-1.5 text-[12.5px] font-semibold transition " +
              (isComplete
                ? "bg-teal text-white"
                : "border border-white/25 text-white/90 hover:border-white/50")
            }
          >
            {isComplete ? "✓ Completed" : "Mark as complete"}
          </button>
        </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1760px] flex-1">
        <div className="min-w-0">
          <div className="relative aspect-video w-full bg-black">
            {lecture.videoUrl ? (
              <>
                <video
                  key={lecture.id}
                  src={lecture.videoUrl}
                  controls
                  preload="metadata"
                  className="h-full w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowCaptionsNotice((v) => !v)}
                  className="absolute right-3 top-3 rounded-md border border-white/30 bg-black/50 px-2 py-1 text-[11px] font-bold text-white/90 hover:bg-black/70"
                >
                  CC
                </button>
                {showCaptionsNotice && (
                  <div className="absolute bottom-14 left-1/2 -translate-x-1/2 rounded-md bg-black/80 px-3 py-1.5 text-[12.5px] text-white">
                    Captions aren't available for this lecture yet.
                  </div>
                )}
              </>
            ) : (
              <div
                className="flex h-full w-full flex-col items-center justify-center gap-2 text-white/70"
                style={{ backgroundColor: course.color, opacity: 0.35 }}
              >
                <span className="text-[32px]">🎬</span>
                <p className="text-[13.5px]">Video coming soon for this lecture</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
            <button
              type="button"
              disabled={!prev}
              onClick={() => prev && navigate(`/learn/${course.id}/${prev.id}`)}
              className="text-[13px] font-semibold text-white/80 hover:text-white disabled:opacity-30"
            >
              ← Previous
            </button>
            <p className="text-[12px] text-white/50">
              Lecture {lectureNumber} of {flat.length}
            </p>
            <button
              type="button"
              disabled={!next}
              onClick={() => next && navigate(`/learn/${course.id}/${next.id}`)}
              className="text-[13px] font-semibold text-white/80 hover:text-white disabled:opacity-30"
            >
              Next →
            </button>
          </div>

          <div className="bg-surface px-5 py-5">
            <h1 className="text-[18px] font-bold text-ink">{lecture.title}</h1>
            <p className="mt-1 text-[13px] text-ink-faint">
              {course.category} · {lecture.minutes} min
            </p>

            <div className="mt-5 flex gap-5 overflow-x-auto border-b border-line">
              {TABS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={
                    "flex-none border-b-2 pb-2.5 text-[13.5px] font-semibold transition " +
                    (tab === t ? "border-brand text-brand" : "border-transparent text-ink-faint hover:text-ink-soft")
                  }
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="py-5 text-[14px] leading-relaxed text-ink-soft">
              {tab === "Course content" && (
                <div className="overflow-hidden rounded-lg border border-line text-ink">
                  {course.curriculum.map((section, i) => {
                    const isOpen = activeSection === i || openSection === i
                    return (
                      <div key={section.title} className="border-b border-line last:border-b-0">
                        <button
                          type="button"
                          onClick={() => setOpenSection(isOpen ? -1 : i)}
                          className="flex w-full items-center justify-between bg-paper px-4 py-3 text-left"
                        >
                          <span className="text-[13.5px] font-semibold text-ink">{section.title}</span>
                          <span className="text-[12px] text-ink-faint">{section.lectures.length} lectures</span>
                        </button>
                        {isOpen && (
                          <div className="pb-1">
                            {section.lectures.map((l) => {
                              const active = l.id === lecture.id
                              return (
                                <Link
                                  key={l.id}
                                  to={`/learn/${course.id}/${l.id}`}
                                  className={
                                    "flex items-center gap-2.5 px-4 py-2.5 text-[13px] " +
                                    (active ? "bg-brand-soft text-brand" : "text-ink-soft hover:bg-paper")
                                  }
                                >
                                  <span
                                    className={
                                      "grid h-4 w-4 flex-none place-items-center rounded-sm border text-[9px] " +
                                      (completed.has(l.id)
                                        ? "border-teal bg-teal text-white"
                                        : "border-line text-transparent")
                                    }
                                  >
                                    ✓
                                  </span>
                                  <span className="min-w-0 flex-1 truncate">{l.title}</span>
                                  {!l.videoUrl && <span className="flex-none text-[11px] text-ink-faint">soon</span>}
                                  <span className="flex-none text-ink-faint">{l.minutes}m</span>
                                </Link>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
              {tab === "Overview" && (
                <div className="flex flex-col gap-6">
                  <div>
                    <h2 className="text-[15px] font-bold text-ink">About this course</h2>
                    <div className="mt-2 flex flex-col gap-3">
                      {course.about.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-[15px] font-bold text-ink">What you'll learn</h2>
                    <ul className="mt-2 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                      {course.whatYouLearn.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="flex-none text-teal">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-[15px] font-bold text-ink">Requirements</h2>
                    <ul className="mt-2 flex flex-col gap-1.5">
                      {course.requirements.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="flex-none text-ink-faint">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-[15px] font-bold text-ink">Instructor</h2>
                    <div className="mt-2 flex gap-3">
                      <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-brand-soft text-[13px] font-bold text-brand">
                        {course.instructor
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                      <div>
                        <p className="font-semibold text-ink">{course.instructor}</p>
                        <p className="mt-0.5">{course.instructorBio}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {tab === "Q&A" && (
                <div>
                  <div className="flex gap-3">
                    <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-brand-soft text-[12px] font-bold text-brand">
                      DH
                    </span>
                    <div className="flex-1">
                      <textarea
                        value={questionDraft}
                        onChange={(e) => setQuestionDraft(e.target.value)}
                        placeholder="Ask a question about this lecture"
                        rows={2}
                        className="w-full rounded-md border border-line bg-surface p-2.5 text-[13.5px] text-ink outline-none focus:border-brand"
                      />
                      <button
                        type="button"
                        disabled={!questionDraft.trim()}
                        onClick={askQuestion}
                        className="mt-2 rounded-md bg-brand px-3.5 py-1.5 text-[13px] font-semibold text-white transition disabled:opacity-40"
                      >
                        Post question
                      </button>
                    </div>
                  </div>
                  {questions.length > 0 ? (
                    <div className="mt-5 flex flex-col gap-4 border-t border-line pt-4">
                      {questions.map((q) => (
                        <div key={q.id} className="flex gap-3">
                          <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-brand-soft text-[12px] font-bold text-brand">
                            DH
                          </span>
                          <div>
                            <p className="text-[13.5px] text-ink">{q.text}</p>
                            <p className="mt-1 text-[12px] text-ink-faint">{q.date} · Dhinesh</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-[13px] text-ink-faint">
                      No questions yet on this lecture — be the first to ask.
                    </p>
                  )}
                </div>
              )}
              {tab === "Notes" && (
                <div>
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Take notes while you watch — saved automatically, just for you."
                    rows={6}
                    className="w-full rounded-md border border-line bg-surface p-3 text-[13.5px] text-ink outline-none focus:border-brand"
                  />
                  <p className="mt-1.5 text-[12px] text-ink-faint">
                    Notes are private and saved on this device only.
                  </p>
                </div>
              )}
              {tab === "Announcements" &&
                (course.announcements?.length ? (
                  <div className="flex flex-col gap-5">
                    {course.announcements.map((a) => (
                      <div key={a.date} className="flex gap-3">
                        <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-brand-soft text-[12px] font-bold text-brand">
                          {course.instructor
                            .split(" ")
                            .map((w) => w[0])
                            .join("")
                            .slice(0, 2)}
                        </span>
                        <div>
                          <p className="text-[13.5px] text-ink">{a.text}</p>
                          <p className="mt-1 text-[12px] text-ink-faint">
                            {a.date} · {course.instructor}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>{course.instructor} hasn't posted any announcements yet.</p>
                ))}
              {tab === "Reviews" &&
                (review ? (
                  <div className="flex gap-3">
                    <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-brand-soft text-[12px] font-bold text-brand">
                      DH
                    </span>
                    <div>
                      <p className="text-amber-500" aria-hidden="true">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </p>
                      <p className="mt-1 text-[13.5px] text-ink">
                        {review.text || "No written feedback left."}
                      </p>
                      <p className="mt-1 text-[12px] text-ink-faint">{review.date} · Dhinesh</p>
                    </div>
                  </div>
                ) : (
                  <p>
                    No reviews yet — use{" "}
                    <span className="font-semibold text-ink">Leave a rating</span> above to write
                    the first one.
                  </p>
                ))}
              {tab === "Learning tools" && (
                <div>
                  <p className="text-[13.5px] font-semibold text-ink">Remind me to keep learning</p>
                  <p className="mt-1 text-[13px] text-ink-faint">
                    We'll send a browser notification for this course while Learnly is open.
                  </p>

                  {reminder ? (
                    <div className="mt-3 flex items-center gap-3 rounded-md border border-brand bg-brand-soft px-3.5 py-2.5">
                      <span className="text-[13.5px] text-brand">
                        🔔 Reminder set for <span className="font-semibold">{formatReminder(reminder.atISO)}</span>
                      </span>
                      <button
                        type="button"
                        onClick={clearReminder}
                        className="ml-auto text-[12.5px] font-semibold text-brand underline"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {[
                        { label: "In 1 hour", hours: 1 },
                        { label: "Tomorrow", hours: 24 },
                        { label: "In 3 days", hours: 72 },
                        { label: "In 1 week", hours: 168 },
                      ].map((o) => (
                        <button
                          key={o.label}
                          type="button"
                          onClick={() => setQuickReminder(o.hours)}
                          className="rounded-md border border-line px-3.5 py-2 text-[13px] font-semibold text-ink transition hover:border-ink-soft"
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {permission === "denied" && (
                    <p className="mt-3 text-[12px] text-ink-faint">
                      Notifications are blocked in this browser — the reminder time is still saved, but you
                      won't get a popup. Enable notifications for this site to change that.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
