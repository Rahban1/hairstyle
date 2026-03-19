export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--border-color)] px-6 py-12 text-[var(--text-muted)] bg-[var(--surface)]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="flex flex-col gap-1">
          <p className="m-0 text-xs uppercase tracking-widest font-semibold text-[var(--text-main)]">
            Optimal Hair
          </p>
          <p className="m-0 text-[10px] uppercase tracking-widest">
            Objective Algorithmic Aesthetics
          </p>
        </div>
        
        <p className="m-0 text-[10px] tracking-widest uppercase">
          &copy; {year} Optimal Hair AI. All Rights Reserved.
        </p>

        <p className="m-0 text-[10px] tracking-widest uppercase">
          Powered by TanStack & Effect
        </p>
      </div>
    </footer>
  )
}
