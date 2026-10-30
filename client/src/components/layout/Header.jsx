import { Link, useNavigate } from 'react-router-dom'
import { Menu, Moon, Search, Sun, User } from 'lucide-react'
import { brand } from '@/lib/brand'
import { Button } from '@/components/ui/Button'
import { useThemeStore } from '@/stores/themeStore'
import { useAuthStore } from '@/stores/authStore'
import { useState } from 'react'
import { Sheet } from '@/components/ui/Sheet'

const desktopLinks = [
  { to: '/', label: 'Explore' },
  { to: '/categories', label: 'Categories' },
  { to: '/collections', label: 'Collections' },
  { to: '/create', label: 'Create' },
  { to: '/trending', label: 'Trending' },
]

export function Header() {
  const navigate = useNavigate()
  const setMode = useThemeStore((s) => s.setMode)
  const user = useAuthStore((s) => s.user)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : true,
  )

  const toggleTheme = () => {
    const dark = document.documentElement.classList.contains('dark')
    setMode(dark ? 'light' : 'dark')
    setIsDark(!dark)
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-3 px-3 sm:px-4 md:h-16 md:px-6">
          <Link to="/" className="font-display shrink-0 text-lg font-bold tracking-tight text-[var(--fg)] md:text-xl">
            {brand.logoText}
          </Link>

          <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Primary">
            {desktopLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-[var(--radius-btn)] px-3 py-2 text-sm font-medium text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search"
              className="md:hidden"
              onClick={() => navigate('/search')}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggleTheme}>
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Profile"
              className="hidden md:inline-flex"
              onClick={() => navigate(user ? '/profile' : '/login')}
            >
              <User className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Menu"
              className="md:hidden"
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Button variant="gradient" size="sm" className="hidden md:inline-flex" onClick={() => navigate('/create')}>
              Create
            </Button>
          </div>
        </div>
      </header>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen} title="Menu" side="bottom">
        <div className="flex flex-col gap-1 pb-2">
          {desktopLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className="rounded-[var(--radius-btn)] px-3 py-3 text-base font-medium hover:bg-[var(--surface-2)]"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to={user ? '/profile' : '/login'}
            onClick={() => setMenuOpen(false)}
            className="rounded-[var(--radius-btn)] px-3 py-3 text-base font-medium hover:bg-[var(--surface-2)]"
          >
            {user ? 'Profile' : 'Sign in'}
          </Link>
          <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
            className="rounded-[var(--radius-btn)] px-3 py-3 text-base font-medium hover:bg-[var(--surface-2)]"
          >
            About
          </Link>
        </div>
      </Sheet>
    </>
  )
}
