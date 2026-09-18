import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import { Link } from "react-router-dom"

export default function PromoBanner() {
  const [dismissed, setDismissed] = useState(false)

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="flex items-center justify-center gap-3 bg-teal-soft px-5 py-2.5 text-center text-[13.5px] text-ink">
            <p>
              <span className="font-semibold">4 days left!</span> Always-on learning for less ·{" "}
              <Link to="/business" className="font-semibold underline hover:text-brand">
                Save 30% on your first year of Learnly Plan
              </Link>
            </p>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => setDismissed(true)}
              className="text-[14px] text-ink-faint hover:text-ink"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
