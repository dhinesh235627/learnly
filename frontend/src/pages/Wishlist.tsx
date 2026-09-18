import { Link } from "react-router-dom"
import CourseCard from "../components/CourseCard"
import Footer from "../components/Footer"
import TopNav from "../components/TopNav"
import { courses } from "../data/courses"
import { useIdSet } from "../hooks/useIdSet"

export default function Wishlist() {
  const wishlist = useIdSet("learnly:wishlist")
  const items = courses.filter((c) => wishlist.has(c.id))

  return (
    <div className="flex min-h-svh flex-col">
      <TopNav />
      <main className="flex-1 bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <h1 className="text-[22px] font-bold text-ink">Wishlist</h1>

          {items.length === 0 ? (
            <div className="mt-8 rounded-xl border border-line bg-surface p-10 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-soft text-[26px] text-brand">
                ♡
              </span>
              <p className="mt-4 text-[16px] font-bold text-ink">Your wishlist is empty</p>
              <p className="mt-2 text-[14.5px] text-ink-soft">
                Tap the heart on any course to save it here for later.
              </p>
              <Link
                to="/home"
                className="mt-6 inline-block rounded-md bg-brand px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-brand-dark"
              >
                Browse courses
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((course) => (
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
