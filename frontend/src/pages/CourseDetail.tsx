import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import Footer from "../components/Footer"
import StarRating from "../components/StarRating"
import TopNav from "../components/TopNav"
import { allLectures, courseHours, courses, firstPlayableLecture } from "../data/courses"
import { useCourseRating } from "../hooks/useCourseRating"
import { useIdSet } from "../hooks/useIdSet"

const HERO_BACKGROUNDS: Record<string, string> = {
  "Microsoft Azure": "/logos/azure-hero.png",
  AWS: "/logos/aws-hero.png",
  "Google Cloud": "/logos/google-cloud-hero.png",
  SAP: "/logos/sap-hero.png",
}

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const course = courses.find((c) => c.id === id)
  const [openSection, setOpenSection] = useState(0)
  const { rating, rate } = useCourseRating(id ?? "")
  const wishlist = useIdSet("learnly:wishlist")
  const cart = useIdSet("learnly:cart")

  if (!course) {
    return (
      <div className="flex min-h-svh flex-col">
        <TopNav />
        <main className="flex-1 bg-paper px-5 py-16 text-center">
          <p className="text-[16px] text-ink-soft">Course not found.</p>
          <Link to="/home" className="mt-3 inline-block font-semibold text-brand hover:underline">
            Back to home
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const discount = Math.round((1 - course.price / course.originalPrice) * 100)
  const lectures = allLectures(course)
  const hours = courseHours(course)
  const startLecture = firstPlayableLecture(course)

  return (
    <div className="flex min-h-svh flex-col">
      <TopNav />

      <main className="flex-1">
        <section className="relative overflow-hidden text-white" style={{ backgroundColor: course.color }}>
          {HERO_BACKGROUNDS[course.category] && (
            <img
              src={HERO_BACKGROUNDS[course.category]}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute bottom-3 right-3 h-16 w-24 object-contain object-right mix-blend-multiply opacity-25 sm:h-20 sm:w-32 md:h-24 md:w-40"
            />
          )}
          <div className="relative mx-auto max-w-6xl px-5 py-10">
            <p className="text-[12.5px] font-semibold uppercase tracking-wide text-white/80">
              {course.category}
            </p>
            <h1 className="mt-2 max-w-2xl text-[28px] font-extrabold leading-tight">
              {course.title}
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/90">
              {course.description}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-[13.5px] text-white/90">
              <span>{rating ? `Rated ${rating}/5 by you` : "No ratings yet"}</span>
              <span>· {hours}h total</span>
              <span>· {course.level}</span>
            </div>
            <p className="mt-2 text-[13.5px] text-white/90">
              Created by <span className="font-semibold">{course.instructor}</span>
            </p>
          </div>
        </section>

        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 md:grid-cols-[1fr_320px]">
          <div>
            <section className="rounded-xl border border-line bg-surface p-6">
              <h2 className="text-[18px] font-bold text-ink">What you'll learn</h2>
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {course.whatYouLearn.map((item) => (
                  <li key={item} className="flex gap-2 text-[13.5px] text-ink-soft">
                    <span className="text-teal">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-[18px] font-bold text-ink">Course content</h2>
              <p className="mt-1 text-[13px] text-ink-faint">
                {course.curriculum.length} sections · {lectures.length} lectures · {hours}h total
                length
              </p>
              <div className="mt-4 divide-y divide-line rounded-xl border border-line bg-surface">
                {course.curriculum.map((section, i) => {
                  const sectionMinutes = section.lectures.reduce((n, l) => n + l.minutes, 0)
                  const isOpen = openSection === i
                  return (
                    <div key={section.title}>
                      <button
                        type="button"
                        onClick={() => setOpenSection(isOpen ? -1 : i)}
                        className="flex w-full items-center justify-between px-4 py-3.5 text-left"
                      >
                        <span className="flex items-center gap-2 text-[14px] font-semibold text-ink">
                          <span
                            className={"text-ink-faint transition-transform " + (isOpen ? "rotate-90" : "")}
                          >
                            ›
                          </span>
                          {section.title}
                        </span>
                        <span className="text-[12.5px] text-ink-faint">
                          {section.lectures.length} lecture{section.lectures.length === 1 ? "" : "s"} ·{" "}
                          {sectionMinutes}m
                        </span>
                      </button>
                      {isOpen && (
                        <div className="bg-paper">
                          {section.lectures.map((lecture) => (
                            <Link
                              key={lecture.id}
                              to={`/learn/${course.id}/${lecture.id}`}
                              className="flex items-center justify-between px-4 py-2.5 pl-9 text-[13.5px] text-ink-soft hover:text-ink"
                            >
                              <span className="flex items-center gap-2">
                                <span className={lecture.hasVideo ? "text-brand" : "text-ink-faint"}>▶</span>
                                {lecture.title}
                              </span>
                              <span className="text-[12px] text-ink-faint">{lecture.minutes}m</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-xl border border-line bg-surface p-5 shadow-sm">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[24px] font-bold text-ink">₹{course.price}</span>
              <span className="font-mono text-[14px] text-ink-faint line-through">
                ₹{course.originalPrice}
              </span>
              <span className="text-[13px] font-semibold text-brand">{discount}% off</span>
            </div>
            <button
              type="button"
              onClick={() => navigate(`/learn/${course.id}/${startLecture.id}`)}
              className="mt-4 w-full rounded-md bg-brand px-4 py-2.5 text-[14.5px] font-semibold text-white transition hover:bg-brand-dark"
            >
              Enroll now
            </button>
            {cart.has(course.id) ? (
              <Link
                to="/cart"
                className="mt-2.5 block w-full rounded-md border border-line px-4 py-2.5 text-center text-[14px] font-semibold text-ink transition hover:border-ink-soft"
              >
                Go to cart
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => cart.add(course.id)}
                className="mt-2.5 w-full rounded-md border border-line px-4 py-2.5 text-[14px] font-semibold text-ink transition hover:border-ink-soft"
              >
                Add to cart
              </button>
            )}
            <button
              type="button"
              onClick={() => wishlist.toggle(course.id)}
              className={
                "mt-2.5 w-full rounded-md border px-4 py-2.5 text-[14px] font-semibold transition " +
                (wishlist.has(course.id)
                  ? "border-brand text-brand"
                  : "border-line text-ink hover:border-ink-soft")
              }
            >
              {wishlist.has(course.id) ? "♥ Wishlisted" : "♡ Add to wishlist"}
            </button>
            <p className="mt-4 text-[12px] text-ink-faint">
              30-day money-back guarantee · Full lifetime access
            </p>
            <div className="mt-5 border-t border-line pt-4">
              <StarRating value={rating} onRate={rate} />
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
