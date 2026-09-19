import { Link } from "react-router-dom"
import CourseCard from "../components/CourseCard"
import Footer from "../components/Footer"
import MarketingNav from "../components/MarketingNav"
import { courses } from "../data/courses"

const categoryTiles = [
  { category: "Microsoft Azure", image: "/images/tile-azure.jpg", color: "#0078D4" },
  { category: "AWS", image: "/images/tile-aws.jpg", color: "#FF9900" },
  { category: "Google Cloud", image: "/images/tile-gcp.jpg", color: "#4285F4" },
  { category: "SAP", image: "/images/tile-sap.jpg", color: "#0FAAFF" },
]

export default function Landing() {
  return (
    <div className="flex min-h-svh flex-col">
      <MarketingNav />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-brand to-brand-dark">
          <div className="mx-auto grid max-w-6xl items-center gap-0 px-5 py-10 md:grid-cols-2 md:gap-8 md:py-0">
            <div className="relative z-10 max-w-md rounded-2xl bg-white p-7 shadow-xl sm:p-9">
              <p className="mb-2 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-brand">
                Cloud &amp; enterprise skills
              </p>
              <h1 className="text-[26px] font-extrabold leading-[1.15] text-ink sm:text-[30px]">
                Get certified on the platforms companies actually run on.
              </h1>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
                Microsoft Azure, AWS, Google Cloud, and SAP training in one place — structured
                courses, hands-on labs, and certification prep taught by practitioners.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link
                  to="/login"
                  className="rounded-md bg-brand px-6 py-3 text-[14.5px] font-bold text-white transition hover:bg-brand-dark"
                >
                  Start learning free
                </Link>
                <Link
                  to="/home"
                  className="rounded-md border border-line px-6 py-3 text-[14.5px] font-bold text-ink transition hover:border-ink-soft"
                >
                  Browse courses
                </Link>
              </div>
            </div>

            <div className="relative -mx-5 h-[260px] overflow-hidden sm:h-[340px] md:mx-0 md:h-[420px] md:rounded-l-2xl">
              <img
                src="/images/landing-hero.jpg"
                alt="Two learners reviewing a course together on a laptop"
                className="h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/50 via-brand-dark/10 to-transparent md:from-brand-dark/40" />
            </div>
          </div>
        </section>

        {/* Category tiles */}
        <section className="border-b border-line bg-paper">
          <div className="mx-auto max-w-6xl px-5 py-14">
            <h2 className="text-[26px] font-bold text-ink">
              Learn essential <span className="font-script text-[34px] text-brand">cloud &amp; enterprise</span>{" "}
              skills
            </h2>
            <p className="mt-1.5 max-w-lg text-[14.5px] text-ink-soft">
              Learnly helps you build in-demand cloud skills fast and advance your career in a
              changing job market.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {categoryTiles.map((tile) => (
                <div
                  key={tile.category}
                  className="relative block h-48 overflow-hidden rounded-xl sm:h-56"
                >
                  <img src={tile.image} alt="" className="h-full w-full object-cover" />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(180deg, ${tile.color}22 0%, ${tile.color}dd 100%)`,
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <span className="text-[14.5px] font-bold text-white">{tile.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured courses */}
        <section className="mx-auto max-w-6xl px-5 py-14">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-[24px] font-bold text-ink">Start with these four</h2>
              <p className="mt-1 text-[14.5px] text-ink-soft">
                Our most-enrolled certification tracks this quarter.
              </p>
            </div>
            <Link to="/home" className="text-[14px] font-semibold text-brand hover:underline">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((course) => (
              <Link key={course.id} to={`/course/${course.id}`}>
                <CourseCard course={course} showProgress={false} />
              </Link>
            ))}
          </div>
        </section>

        {/* Why Learnly */}
        <section className="border-t border-line bg-surface">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:grid-cols-3">
            <div>
              <p className="mb-2 text-[13px] font-bold uppercase tracking-wide text-teal">
                Vendor-aligned
              </p>
              <p className="text-[14.5px] leading-relaxed text-ink-soft">
                Curriculum mapped directly to Microsoft, AWS, Google Cloud, and SAP exam guides —
                not generic tech content.
              </p>
            </div>
            <div>
              <p className="mb-2 text-[13px] font-bold uppercase tracking-wide text-teal">
                Hands-on labs
              </p>
              <p className="text-[14.5px] leading-relaxed text-ink-soft">
                Practice in real consoles and sandboxes before you sit the certification exam.
              </p>
            </div>
            <div>
              <p className="mb-2 text-[13px] font-bold uppercase tracking-wide text-teal">
                Learn at your pace
              </p>
              <p className="text-[14.5px] leading-relaxed text-ink-soft">
                Track progress across devices, pick up where you left off, and earn a certificate
                on completion.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
