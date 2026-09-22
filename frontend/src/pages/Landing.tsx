import { Link } from "react-router-dom"
import CourseCard from "../components/CourseCard"
import Footer from "../components/Footer"
import MarketingNav from "../components/MarketingNav"
import { courses } from "../data/courses"

export default function Landing() {
  return (
    <div className="flex min-h-svh flex-col">
      <MarketingNav />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-brand-dark">
          <img
            src="/images/landing-hero-wide.jpg"
            alt="A laptop open to a digital skills course, on a desk with a second monitor and plants"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-brand-dark/50 to-brand-dark/10" />

          <div className="relative mx-auto max-w-6xl px-5 py-14 md:py-24">
            <div className="max-w-md rounded-2xl bg-white p-7 shadow-xl sm:p-9">
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

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {courses.map((course) => (
                <div key={course.id} className="rounded-xl border border-line bg-surface p-5">
                  <div
                    className="flex h-16 items-center justify-center rounded-lg"
                    style={{ background: `color-mix(in srgb, ${course.color} 10%, white)` }}
                  >
                    <img src={course.logo} alt={course.category} className="h-8 max-w-[70%] object-contain" />
                  </div>
                  <h3 className="mt-4 text-[15px] font-bold text-ink">{course.category}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">
                    {course.description}
                  </p>
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
