import { useState } from "react"
import { Link } from "react-router-dom"
import Footer from "../components/Footer"
import TopNav from "../components/TopNav"
import { courses } from "../data/courses"
import { useIdSet } from "../hooks/useIdSet"

export default function Cart() {
  const cart = useIdSet("learnly:cart")
  const [checkedOut, setCheckedOut] = useState(false)
  const items = courses.filter((c) => cart.has(c.id))
  const subtotal = items.reduce((sum, c) => sum + c.price, 0)

  function checkout() {
    items.forEach((c) => cart.remove(c.id))
    setCheckedOut(true)
  }

  return (
    <div className="flex min-h-svh flex-col">
      <TopNav />
      <main className="flex-1 bg-paper">
        <div className="mx-auto max-w-4xl px-5 py-10">
          <h1 className="text-[24px] font-bold text-ink">Cart</h1>

          {checkedOut ? (
            <div className="mt-8 rounded-xl border border-line bg-surface p-8 text-center">
              <p className="text-[18px] font-bold text-ink">🎉 You're enrolled!</p>
              <p className="mt-2 text-[14px] text-ink-soft">
                This is a demo checkout — no real payment was processed.
              </p>
              <Link
                to="/home"
                className="mt-5 inline-block rounded-md bg-brand px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-brand-dark"
              >
                Go to my learning
              </Link>
            </div>
          ) : items.length === 0 ? (
            <div className="mt-8 rounded-xl border border-line bg-surface p-8 text-center">
              <p className="text-[15px] text-ink-soft">Your cart is empty.</p>
              <Link to="/home" className="mt-3 inline-block font-semibold text-brand hover:underline">
                Browse courses
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid gap-8 md:grid-cols-[1fr_280px]">
              <div className="flex flex-col gap-4">
                {items.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-4 rounded-xl border border-line bg-surface p-4"
                  >
                    <span
                      className="relative grid h-16 w-24 flex-none place-items-center overflow-hidden rounded-lg"
                      style={{ background: `color-mix(in srgb, ${c.color} 10%, white)` }}
                    >
                      <img src={c.logo} alt={c.category} className="h-7 max-w-[70%] object-contain" />
                      <span
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-1"
                        style={{ backgroundColor: c.color }}
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-[14px] font-semibold text-ink">{c.title}</p>
                      <p className="text-[12.5px] text-ink-faint">{c.instructor}</p>
                    </div>
                    <p className="font-mono text-[15px] font-bold text-ink">₹{c.price}</p>
                    <button
                      type="button"
                      onClick={() => cart.remove(c.id)}
                      aria-label="Remove from cart"
                      className="text-[13px] font-semibold text-ink-faint hover:text-ink"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <aside className="h-fit rounded-xl border border-line bg-surface p-5">
                <p className="text-[13px] text-ink-soft">Total</p>
                <p className="mt-1 font-mono text-[24px] font-bold text-ink">₹{subtotal}</p>
                <button
                  type="button"
                  onClick={checkout}
                  className="mt-4 w-full rounded-md bg-brand px-4 py-2.5 text-[14.5px] font-semibold text-white transition hover:bg-brand-dark"
                >
                  Proceed to checkout
                </button>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
