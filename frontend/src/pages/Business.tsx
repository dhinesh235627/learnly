import { Link } from "react-router-dom"
import Footer from "../components/Footer"
import TopNav from "../components/TopNav"

export default function Business() {
  return (
    <div className="flex min-h-svh flex-col">
      <TopNav />
      <main className="flex-1">
        <section className="border-b border-line" style={{ backgroundColor: "#0078D4" }}>
          <div className="mx-auto max-w-4xl px-5 py-16 text-center text-white">
            <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-white/80">
              For teams
            </p>
            <h1 className="mt-3 text-[30px] font-extrabold">Learnly for Business</h1>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-white/90">
              Give your team unlimited access to every Azure, AWS, GCP, and SAP course, plus
              team-wide progress tracking and certification reporting.
            </p>
            <button
              type="button"
              className="mt-6 rounded-md bg-white px-6 py-3 text-[14.5px] font-semibold text-ink hover:bg-white/90"
            >
              Request a demo
            </button>
          </div>
        </section>

        <section className="mx-auto grid max-w-4xl gap-8 px-5 py-14 sm:grid-cols-3">
          {[
            { title: "Team dashboards", body: "See who's certified, who's in progress, and where the gaps are." },
            { title: "Unlimited access", body: "One license, every course across all four platforms." },
            { title: "Compliance-ready", body: "Export completion and certification records for audits." },
          ].map((b) => (
            <div key={b.title}>
              <p className="text-[14.5px] font-bold text-ink">{b.title}</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">{b.body}</p>
            </div>
          ))}
        </section>

        <section className="border-t border-line bg-surface py-8 text-center">
          <Link to="/home" className="text-[13.5px] font-semibold text-brand hover:underline">
            ← Back to courses
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}
