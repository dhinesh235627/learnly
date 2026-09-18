import { AnimatePresence, motion } from "motion/react"
import type { ReactNode } from "react"

export default function AnimatedPopover({
  open,
  children,
  className = "",
}: {
  open: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -6 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
