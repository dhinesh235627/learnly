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
        <section className="glass-hero flex min-h-svh flex-col items-center justify-center px-5 py-20 text-center">
          <div className="glass-blob -left-28 -top-36 h-[520px] w-[520px] bg-[#ff8a9b] opacity-35" />
          <div className="glass-blob -right-24 -bottom-40 h-[460px] w-[460px] bg-brand-soft opacity-25" />
          <div className="glass-blob bottom-[10%] left-[8%] h-[380px] w-[380px] bg-brand-dark opacity-50" />

          <p className="relative mb-2 font-display text-[12px] font-bold uppercase tracking-[0.18em] text-white/80">
            Cloud &amp; enterprise skills
          </p>
          <h1 className="relative font-script text-[96px] leading-none text-paper drop-shadow-[0_6px_30px_rgba(0,0,0,0.25)] sm:text-[150px]">
            Learnly
          </h1>

          <div className="glass-card relative mt-2 w-full max-w-2xl rounded-[28px] px-8 py-9 sm:px-10">
            <h2 className="text-[22px] font-bold leading-tight text-white sm:text-[28px]">
              Get certified on the platforms companies actually run on.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-white/85">
              Microsoft Azure, AWS, Google Cloud, and SAP training in one place — structured
              courses, hands-on labs, and certification prep taught by practitioners.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/login"
                className="rounded-[10px] bg-white px-6 py-3 text-[15px] font-bold text-brand-dark transition hover:bg-paper"
              >
                Start learning free
              </Link>
              <Link
                to="/home"
                className="rounded-[10px] border border-white/40 bg-white/10 px-6 py-3 text-[15px] font-bold text-white transition hover:bg-white/20"
              >
                Browse courses
              </Link>
            </div>
            <p className="mt-4 text-[12.5px] text-white/65">
              Trusted by learners preparing for AZ-900, AWS SAA-C03, GCP ACE, and SAP S/4HANA
            </p>
          </div>
        </section>

        {/* Category strip */}
        <section className="border-b border-line bg-paper">
          <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-3 px-5 py-6">
            {courses.map((c) => (
              <span
                key={c.id}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-[13.5px] font-semibold text-ink-soft"
              >
                <span
                  className="grid h-5 w-5 flex-none place-items-center rounded-full text-[10px] font-bold text-white"
                  style={{ backgroundColor: c.color }}
                >
                  {c.category[0]}
                </span>
                {c.category}
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
