import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    navigate("/home")
  }

  return (
    <div className="flex min-h-svh flex-col bg-paper">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-extrabold text-ink">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand font-display text-base font-bold text-white">
              L
            </span>
            Learnly
          </Link>
          <p className="text-[14px] text-ink-soft">
            New here?{" "}
            <Link to="/login" className="font-semibold text-brand hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-14">
        <div className="w-full max-w-sm rounded-xl border border-line bg-surface p-8 shadow-sm">
          <h1 className="text-[22px] font-bold text-ink">Log in to Learnly</h1>
          <p className="mt-1 text-[14px] text-ink-soft">
            Pick up your Azure, AWS, GCP, or SAP course right where you left off.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-[13.5px] font-semibold text-ink">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="rounded-md border border-line bg-paper px-3.5 py-2.5 text-[14.5px] text-ink outline-none focus:border-brand"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-[13.5px] font-semibold text-ink">
                  Password
                </label>
                <span className="text-[12.5px] font-semibold text-brand">Forgot?</span>
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-md border border-line bg-paper px-3.5 py-2.5 text-[14.5px] text-ink outline-none focus:border-brand"
              />
            </div>

            <button
              type="submit"
              className="mt-2 rounded-md bg-brand px-4 py-2.5 text-[14.5px] font-semibold text-white transition hover:bg-brand-dark"
            >
              Log in
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-line" />
            <span className="text-[12px] text-ink-faint">OR</span>
            <span className="h-px flex-1 bg-line" />
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="rounded-md border border-line px-4 py-2.5 text-[14px] font-semibold text-ink transition hover:border-ink-soft"
            >
              Continue with Google
            </button>
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="rounded-md border border-line px-4 py-2.5 text-[14px] font-semibold text-ink transition hover:border-ink-soft"
            >
              Continue with Microsoft
            </button>
          </div>

          <p className="mt-6 text-center text-[12.5px] leading-relaxed text-ink-faint">
            By logging in you agree to Learnly's Terms of Use and Privacy Policy.
          </p>
        </div>
      </main>
    </div>
  )
}
