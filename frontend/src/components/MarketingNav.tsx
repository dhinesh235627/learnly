import { Link } from "react-router-dom"
import { categories, courses } from "../data/courses"

export default function MarketingNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-3.5">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-extrabold text-ink">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand font-display text-base font-bold text-white">
            L
          </span>
          Learnly
        </Link>

        <div className="hidden flex-1 items-center gap-2 md:flex">
          <div className="relative w-full max-w-md">
            <input
              type="search"
              placeholder="Search for courses, e.g. AWS, Azure, SAP"
              className="w-full rounded-full border border-line bg-paper px-4 py-2 text-[14px] text-ink outline-none focus:border-brand"
            />
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <Link
            to="/login"
            className="hidden text-[14.5px] font-semibold text-ink-soft hover:text-ink sm:inline"
          >
            Log in
          </Link>
          <Link
            to="/login"
            className="rounded-md bg-brand px-4 py-2 text-[14px] font-semibold text-white transition hover:bg-brand-dark"
          >
            Sign up
          </Link>
        </nav>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl items-center gap-6 overflow-x-auto px-5 py-2.5">
          {categories.map((category) => {
            const course = courses.find((c) => c.category === category)
            if (!course) return null
            return (
              <Link
                key={category}
                to={`/course/${course.id}`}
                className="flex-none text-[13.5px] font-semibold text-ink-soft transition hover:text-brand"
              >
                {category}
              </Link>
            )
          })}
        </div>
      </div>
    </header>
  )
}
