import { Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled 
          ? 'bg-[var(--bg-base)]/95 backdrop-blur-md border-b border-[var(--border-color)]' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="w-full max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 py-5">
        
        <Link 
          to="/" 
          className="text-lg tracking-[0.2em] uppercase font-serif text-[var(--text-main)] hover:opacity-70 transition-opacity"
        >
          Optimal Hair
        </Link>

        <div className="hidden md:flex items-center gap-8 text-xs tracking-[0.15em] uppercase font-medium">
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

          <div className="w-px h-4 bg-[var(--border-color)]" />

          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-[var(--text-main)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-main)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] rounded"
          aria-label="Open menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

      </nav>
    </header>
  )
}
