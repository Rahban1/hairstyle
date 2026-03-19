import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-color)] bg-[var(--bg-base)] px-6 backdrop-blur-lg transition-colors">
      <nav className="w-full max-w-6xl mx-auto flex items-center justify-between py-5">
        
        <h2 className="m-0 text-xl font-serif tracking-widest uppercase">
          <Link
            to="/"
            className="text-[var(--text-main)] no-underline hover:opacity-70 transition-opacity"
          >
            Optimal Hair
          </Link>
        </h2>

        <div className="flex items-center gap-6 text-sm uppercase tracking-[0.15em] font-medium">
          <Link
            to="/"
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
