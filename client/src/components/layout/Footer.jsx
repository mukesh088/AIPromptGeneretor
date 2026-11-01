import { Link } from 'react-router-dom'
import { brand } from '@/lib/brand'
import { footerNav } from '@/lib/nav'

export function Footer() {
  return (
    <footer className="mt-10 hidden border-t border-[var(--border)] bg-[var(--surface)] md:block">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-6 py-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold text-[var(--accent)]">{brand.domain}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">{brand.description}</p>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">Menu</p>
          <ul className="space-y-1.5 text-sm text-[var(--muted)]">
            {footerNav.map((l) => (
              <li key={l.to}>
                <Link to={l.to}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">Contact</p>
          <p className="text-sm text-[var(--muted)]">{brand.supportEmail}</p>
          <ul className="mt-4 space-y-1.5 text-sm text-[var(--muted)]">
            <li><Link to="/collections">Collections</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/templates">Templates</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--border)] px-6 py-4 text-center text-xs text-[var(--muted)]">
        © {new Date().getFullYear()} {brand.name}
      </div>
    </footer>
  )
}
