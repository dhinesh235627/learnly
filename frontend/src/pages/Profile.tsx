import { useNavigate } from "react-router-dom"
import Footer from "../components/Footer"
import TopNav from "../components/TopNav"
import { useAuth } from "../hooks/useAuth"
import { useLearningStats } from "../hooks/useLearningStats"

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return parts.slice(0, 2).map((p) => p[0]).join("").toUpperCase()
}

export default function Profile() {
  const stats = useLearningStats()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate("/")
  }

  return (
    <div className="flex min-h-svh flex-col">
      <TopNav />
      <main className="flex-1 bg-paper">
        <div className="mx-auto max-w-2xl px-5 py-10">
          <div className="flex items-center gap-4">
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
              <h1 className="text-[20px] font-bold text-ink">{user?.name ?? "Not signed in"}</h1>
              <p className="text-[13.5px] text-ink-faint">{user?.email ?? ""}</p>
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

          <button
            type="button"
            onClick={handleLogout}
            className="mt-8 inline-block rounded-md border border-line px-5 py-2.5 text-[14px] font-semibold text-ink hover:border-ink-soft"
          >
            Log out
          </button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
