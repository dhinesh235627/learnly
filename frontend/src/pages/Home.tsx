import { useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import Carousel from "../components/Carousel"
import ContinueLearningCard from "../components/ContinueLearningCard"
import CourseCard from "../components/CourseCard"
import Footer from "../components/Footer"
import PromoBanner from "../components/PromoBanner"
import TopNav from "../components/TopNav"
import { courseProgress, courses } from "../data/courses"
import { useAuth } from "../hooks/useAuth"
import { useLearningStats } from "../hooks/useLearningStats"

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return parts.slice(0, 2).map((p) => p[0]).join("").toUpperCase()
}

export default function Home() {
  const [params] = useSearchParams()
  const [editingRole, setEditingRole] = useState(false)
  const [role, setRole] = useState("Cloud & Platform Engineer")
  const stats = useLearningStats()
  const { user } = useAuth()
  const firstName = user?.name?.split(" ")[0]
  const inProgress = courses.filter((c) => {
    const { done, total } = courseProgress(c, stats.completed.ids)
    return done > 0 && done < total
  })

  const q = params.get("q")?.trim() ?? ""
  const category = params.get("category")

  if (q) {
    const results = courses.filter((c) =>
      [c.title, c.instructor, c.category].some((f) => f.toLowerCase().includes(q.toLowerCase())),
    )
    return (
      <div className="flex min-h-svh flex-col">
        <PromoBanner />
        <TopNav />
        <main className="flex-1 bg-paper">
          <div className="mx-auto max-w-6xl px-5 py-8">
            <p className="text-[14px] text-ink-soft">
              {results.length} result{results.length === 1 ? "" : "s"} for
            </p>
            <h1 className="text-[24px] font-bold text-ink">"{q}"</h1>
            <Link to="/home" className="mt-2 inline-block text-[13.5px] font-semibold text-brand hover:underline">
              Clear search
            </Link>

            {results.length === 0 ? (
              <p className="mt-8 text-[14.5px] text-ink-soft">
                No courses matched. Try "Azure", "AWS", "Google Cloud", or "SAP".
              </p>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {results.map((course) => (
                  <Link key={course.id} to={`/course/${course.id}`}>
                    <CourseCard course={course} showProgress={false} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (category) {
    const results = courses.filter((c) => c.category === category)
    return (
      <div className="flex min-h-svh flex-col">
        <PromoBanner />
        <TopNav />
        <main className="flex-1 bg-paper">
          <div className="mx-auto max-w-6xl px-5 py-8">
            <h1 className="text-[24px] font-bold text-ink">{category} courses</h1>
            <Link to="/home" className="mt-2 inline-block text-[13.5px] font-semibold text-brand hover:underline">
              Clear filter
            </Link>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {results.map((course) => (
                <Link key={course.id} to={`/course/${course.id}`}>
                  <CourseCard course={course} showProgress={false} />
                </Link>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col">
      <PromoBanner />
      <TopNav />

      <main className="flex-1 bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-8">
          <div className="flex items-center gap-5">
            <span className="grid h-16 w-16 flex-none place-items-center overflow-hidden rounded-full bg-ink font-display text-[18px] font-bold text-white">
              {user?.picture ? (
                <img src={user.picture} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              ) : user ? (
                initials(user.name)
              ) : (
                "?"
              )}
            </span>
            <div>
              <h1 className="text-[30px] font-bold text-ink">
                {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
              </h1>
              {editingRole ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    setEditingRole(false)
                  }}
                  className="mt-1.5 flex items-center gap-2"
                >
                  <input
                    autoFocus
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="rounded-md border border-line bg-surface px-2.5 py-1 text-[15px] text-ink outline-none focus:border-brand"
                  />
                  <button type="submit" className="text-[14px] font-semibold text-brand">
                    Save
                  </button>
                </form>
              ) : (
                <p className="mt-1 text-[16px] text-ink-soft">
                  {role} ·{" "}
                  <button
                    type="button"
                    onClick={() => setEditingRole(true)}
                    className="font-semibold text-brand underline"
                  >
                    Edit occupation and interests
                  </button>
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Courses in progress", value: stats.coursesInProgress },
              { label: "Hours completed", value: `${stats.hoursCompleted}h` },
              { label: "Day streak", value: stats.streakDays },
              { label: "Certificates earned", value: stats.certificatesEarned },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-line bg-surface p-4">
                <p className="font-mono text-[22px] font-bold text-ink">{s.value}</p>
                <p className="mt-0.5 text-[12.5px] text-ink-soft">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Continue learning */}
          <section className="mt-12">
            <div className="mb-5 flex items-end justify-between">
              <h2 className="text-[28px] font-bold text-ink">Let's start learning</h2>
              <Link to="/home" className="text-[15px] font-semibold text-brand underline">
                My learning
              </Link>
            </div>
            <Carousel>
              {inProgress.map((course) => (
                <ContinueLearningCard key={course.id} course={course} />
              ))}
            </Carousel>
          </section>

          {/* What to learn next */}
          <section className="mt-13">
            <h2 className="text-[28px] font-bold text-ink">What to learn next</h2>
            <p className="mt-1.5 text-[16px] text-ink-soft">Recommended for you</p>
            <div className="mt-4">
              <Carousel>
                {courses.map((course) => (
                  <Link key={course.id} to={`/course/${course.id}`} className="w-64 flex-none">
                    <CourseCard course={course} showProgress={false} />
                  </Link>
                ))}
              </Carousel>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
