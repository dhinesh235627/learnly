import { Link } from "react-router-dom"
import Footer from "../components/Footer"
import TopNav from "../components/TopNav"

export default function Teach() {
  return (
    <div className="flex min-h-svh flex-col">
      <TopNav />
      <main className="flex-1">
        <section className="border-b border-line bg-surface">
          <div className="mx-auto max-w-4xl px-5 py-16 text-center">
            <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-brand">
              For practitioners
            </p>
            <h1 className="mt-3 text-[30px] font-extrabold text-ink">Teach on Learnly</h1>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-ink-soft">
              Turn your Azure, AWS, GCP, or SAP expertise into a course. Learnly handles hosting,
              certificates, and payouts — you focus on teaching.
            </p>
            <button
              type="button"
              className="mt-6 rounded-md bg-brand px-6 py-3 text-[14.5px] font-semibold text-white hover:bg-brand-dark"
            >
              Start your instructor application
            </button>
          </div>
        </section>

        <section className="mx-auto grid max-w-4xl gap-8 px-5 py-14 sm:grid-cols-3">
          {[
            { title: "Reach learners", body: "Publish once, get discovered by learners already searching for your platform." },
            { title: "Keep control", body: "You own your curriculum, pricing, and how often you update it." },
            { title: "Get paid monthly", body: "Track enrollments and revenue from an instructor dashboard." },
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
