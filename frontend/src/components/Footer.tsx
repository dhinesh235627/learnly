export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-[13px] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Learnly. Built as a learning-platform demo.</p>
        <div className="flex gap-5">
          <span>About</span>
          <span>Careers</span>
          <span>Terms</span>
          <span>Privacy</span>
        </div>
      </div>
    </footer>
  )
}
