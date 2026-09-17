import { Link } from "react-router-dom"
import Footer from "../components/Footer"
import TopNav from "../components/TopNav"
import { useLearningStats } from "../hooks/useLearningStats"

export default function Profile() {
  const stats = useLearningStats()
  return (
    <div className="flex min-h-svh flex-col">
      <TopNav />
      <main className="flex-1 bg-paper">
        <div className="mx-auto max-w-2xl px-5 py-10">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-ink font-display text-[18px] font-bold text-white">
              DH
            </span>
            <div>
              <h1 className="text-[20px] font-bold text-ink">Dhinesh</h1>
              <p className="text-[13.5px] text-ink-faint">dhinesh.ad@aivisualz.com</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "In progress", value: stats.coursesInProgress },
              { label: "Hours completed", value: `${stats.hoursCompleted}h` },
              { label: "Day streak", value: stats.streakDays },
              { label: "Certificates", value: stats.certificatesEarned },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-line bg-surface p-4">
                <p className="font-mono text-[20px] font-bold text-ink">{s.value}</p>
                <p className="mt-0.5 text-[12px] text-ink-soft">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-line bg-surface p-5">
            <h2 className="text-[15px] font-bold text-ink">Account settings</h2>
            <div className="mt-4 flex flex-col gap-3 text-[13.5px]">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <span className="text-ink-soft">Occupation</span>
                <span className="font-medium text-ink">Cloud & Platform Engineer</span>
              </div>
              <div className="flex items-center justify-between border-b border-line pb-3">
                <span className="text-ink-soft">Language</span>
                <span className="font-medium text-ink">English</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-soft">Notifications</span>
                <span className="font-medium text-ink">Email + in-app</span>
              </div>
            </div>
          </div>

          <Link
            to="/"
            className="mt-8 inline-block rounded-md border border-line px-5 py-2.5 text-[14px] font-semibold text-ink hover:border-ink-soft"
          >
            Log out
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
