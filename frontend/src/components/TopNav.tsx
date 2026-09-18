import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import AnimatedPopover from "./AnimatedPopover"
import { categories } from "../data/courses"
import { notifications } from "../data/notifications"
import { useClickOutside } from "../hooks/useClickOutside"
import { useIdSet } from "../hooks/useIdSet"

export default function TopNav() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [query, setQuery] = useState(params.get("q") ?? "")
  const [openNotif, setOpenNotif] = useState(false)
  const [openAvatar, setOpenAvatar] = useState(false)
  const cart = useIdSet("learnly:cart")

  const notifRef = useClickOutside<HTMLDivElement>(() => setOpenNotif(false))
  const avatarRef = useClickOutside<HTMLDivElement>(() => setOpenAvatar(false))

  const activeCategory = params.get("category")

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    navigate(trimmed ? `/home?q=${encodeURIComponent(trimmed)}` : "/home")
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface">
      <div className="mx-auto flex max-w-6xl items-center gap-5 px-5 py-3.5">
        <Link to="/home" className="flex items-center gap-2 font-display text-xl font-extrabold text-ink">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand font-display text-lg font-bold text-white">
            L
          </span>
          <span className="hidden sm:inline">Learnly</span>
        </Link>

        <form onSubmit={handleSearch} className="relative flex-1">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for AWS, Azure, GCP, SAP..."
            className="w-full rounded-full border border-line bg-paper px-4 py-2 text-[14px] text-ink outline-none focus:border-brand"
          />
        </form>

        <nav className="hidden items-center gap-5 lg:flex">
          <Link to="/business" className="text-[15px] font-semibold text-ink-soft hover:text-ink">
            Learnly Business
          </Link>
          <Link to="/teach" className="text-[15px] font-semibold text-ink-soft hover:text-ink">
            Teach on Learnly
          </Link>
          <Link to="/home" className="text-[15px] font-semibold text-ink-soft hover:text-ink">
            My learning
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-[18px] text-ink-soft hover:bg-paper hover:text-ink sm:flex"
          >
            ♡
          </Link>

          <Link
            to="/cart"
            aria-label="Cart"
            className="relative hidden h-9 w-9 items-center justify-center rounded-full text-[16px] text-ink-soft hover:bg-paper hover:text-ink sm:flex"
          >
            🛒
            {cart.ids.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-brand text-[9.5px] font-bold text-white">
                {cart.ids.length}
              </span>
            )}
          </Link>

          <div className="relative" ref={notifRef}>
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => {
                setOpenNotif((v) => !v)
                setOpenAvatar(false)
              }}
              className="hidden h-9 w-9 items-center justify-center rounded-full text-[16px] text-ink-soft hover:bg-paper hover:text-ink sm:flex"
            >
              🔔
            </button>
            <AnimatedPopover
              open={openNotif}
              className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl border border-line bg-surface p-2 shadow-lg"
            >
              <p className="px-2.5 py-1.5 text-[13px] font-bold text-ink">Notifications</p>
              <div className="flex flex-col">
                {notifications.map((n) => (
                  <Link
                    key={n.id}
                    to={`/course/${n.courseId}`}
                    onClick={() => setOpenNotif(false)}
                    className="rounded-lg px-2.5 py-2.5 text-[13px] leading-snug text-ink-soft hover:bg-paper"
                  >
                    <span className="text-ink">{n.text}</span>
                    <span className="mt-0.5 block text-[11.5px] text-ink-faint">{n.time}</span>
                  </Link>
                ))}
              </div>
            </AnimatedPopover>
          </div>

          <div className="relative" ref={avatarRef}>
            <button
              type="button"
              aria-label="Account menu"
              onClick={() => {
                setOpenAvatar((v) => !v)
                setOpenNotif(false)
              }}
              className="grid h-9 w-9 place-items-center rounded-full bg-brand-soft font-display text-[13px] font-bold text-brand"
            >
              DH
            </button>
            <AnimatedPopover
              open={openAvatar}
              className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-line bg-surface p-2 shadow-lg"
            >
              <div className="px-2.5 py-2">
                <p className="text-[13.5px] font-bold text-ink">Dhinesh</p>
                <p className="text-[12px] text-ink-faint">dhinesh.ad@aivisualz.com</p>
              </div>
              <div className="my-1 h-px bg-line" />
              {[
                { label: "My learning", to: "/home" },
                { label: "Wishlist", to: "/wishlist" },
                { label: "Cart", to: "/cart" },
                { label: "Public profile", to: "/profile" },
                { label: "Account settings", to: "/profile" },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setOpenAvatar(false)}
                  className="block rounded-lg px-2.5 py-2 text-[13.5px] text-ink-soft hover:bg-paper hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
              <div className="my-1 h-px bg-line" />
              <Link
                to="/"
                onClick={() => setOpenAvatar(false)}
                className="block rounded-lg px-2.5 py-2 text-[13.5px] font-semibold text-ink-soft hover:bg-paper hover:text-ink"
              >
                Log out
              </Link>
            </AnimatedPopover>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl gap-7 overflow-x-auto px-5 pb-3">
        {categories.map((cat) => (
          <Link
            key={cat}
            to={activeCategory === cat ? "/home" : `/home?category=${encodeURIComponent(cat)}`}
            className={
              "whitespace-nowrap text-[15px] font-semibold " +
              (activeCategory === cat ? "text-brand" : "text-ink-soft hover:text-ink")
            }
          >
            {cat}
          </Link>
        ))}
      </div>
    </header>
  )
}
