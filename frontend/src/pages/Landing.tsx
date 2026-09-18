import { Link } from "react-router-dom"
import CourseCard from "../components/CourseCard"
import Footer from "../components/Footer"
import MarketingNav from "../components/MarketingNav"
import { categories, courses } from "../data/courses"

export default function Landing() {
  return (
    <div className="flex min-h-svh flex-col">
      <MarketingNav />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-line bg-surface">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.1fr_1fr] md:items-center md:py-20">
            <div>
              <p className="mb-3 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-brand">
                Cloud &amp; enterprise skills
              </p>
              <h1 className="text-[34px] font-extrabold leading-[1.1] text-ink sm:text-[44px]">
                Get certified on the platforms companies actually run on.
              </h1>
              <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-ink-soft">
                Learnly brings Microsoft Azure, AWS, Google Cloud, and SAP training into one
                place — structured courses, hands-on labs, and certification prep taught by
                practitioners.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  to="/login"
                  className="rounded-md bg-brand px-6 py-3 text-[15px] font-semibold text-white transition hover:bg-brand-dark"
                >
                  Start learning free
                </Link>
                <Link
                  to="/home"
                  className="rounded-md border border-line px-6 py-3 text-[15px] font-semibold text-ink transition hover:border-ink-soft"
                >
                  Browse courses
                </Link>
              </div>
              <p className="mt-5 text-[13px] text-ink-faint">
                Trusted by learners preparing for AZ-900, AWS SAA-C03, GCP ACE, and SAP S/4HANA
                certifications.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {courses.map((c) => (
                <div
                  key={c.id}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border border-line bg-paper p-6 text-center"
                >
                  <span
                    className="grid h-12 w-12 place-items-center rounded-lg text-lg font-bold text-white"
                    style={{ backgroundColor: c.color }}
                  >
                    {c.category[0]}
                  </span>
                  <p className="text-[13.5px] font-semibold text-ink">{c.category}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Category strip */}
        <section className="border-b border-line bg-paper">
          <div className="mx-auto flex max-w-6xl flex-wrap gap-3 px-5 py-6">
            {categories.map((cat) => (
              <span
                key={cat}
                className="rounded-full border border-line bg-surface px-4 py-1.5 text-[13.5px] font-semibold text-ink-soft"
              >
                {cat}
              </span>
            ))}
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
