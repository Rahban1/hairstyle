import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-color)] bg-[var(--bg-base)] px-4 sm:px-6 backdrop-blur-lg transition-colors">
      <nav className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 py-4 sm:py-5">
        
        <h2 className="m-0 text-lg sm:text-xl font-serif tracking-widest uppercase text-center sm:text-left">
          <Link
            to="/"
            className="text-[var(--text-main)] no-underline hover:opacity-70 transition-opacity"
          >
            Optimal Hair
          </Link>
        </h2>

        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.15em] font-medium">
          <Link
            to="/"
            className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            activeProps={{ className: 'text-[var(--text-main)]' }}
          >
            Home
          </Link>
          <Link
            to="/analyze"
            className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            activeProps={{ className: 'text-[var(--text-main)]' }}
          >
            Assessment
          </Link>
          <Link
            to="/about"
            className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            activeProps={{ className: 'text-[var(--text-main)]' }}
          >
            Methodology
          </Link>

          <div className="w-px h-4 bg-[var(--border-color)]"></div>

          <ThemeToggle />
        </div>

      </nav>
    </header>
  )
}
