import { NavLink } from 'react-router-dom'
import { FolderKanban, Home, LayoutGrid, Layers, User } from 'lucide-react'
import { cn } from '@/lib/cn'

const items = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/templates', label: 'Templates', icon: Layers },
  { to: '/categories', label: 'Categories', icon: LayoutGrid },
  { to: '/collections', label: 'Collections', icon: FolderKanban },
  { to: '/profile', label: 'Profile', icon: User },
]

export function BottomNav() {
  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: 'var(--safe-bottom)' }}
    >
      <ul className="mx-auto grid h-16 max-w-lg grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex h-full flex-col items-center justify-center gap-0.5 text-[11px] font-medium',
                    isActive ? 'text-[var(--accent)]' : 'text-[var(--muted)]',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        'inline-flex h-9 w-9 items-center justify-center rounded-full',
                        isActive && 'bg-[var(--surface-2)]',
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    {item.label}
                  </>
                )}
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
