import { Link } from 'react-router-dom'
import { brand } from '@/lib/brand'

export function Footer() {
  return (
    <footer className="mt-10 hidden border-t border-[var(--border)] bg-[var(--surface)] md:block">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg font-bold">{brand.name}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">{brand.description}</p>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">Explore</p>
          <ul className="space-y-1.5 text-sm text-[var(--muted)]">
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/collections">Collections</Link></li>
            <li><Link to="/trending">Trending</Link></li>
            <li><Link to="/submit">Submit a prompt</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">Help</p>
          <ul className="space-y-1.5 text-sm text-[var(--muted)]">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/history">Generation history</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">Legal</p>
          <ul className="space-y-1.5 text-sm text-[var(--muted)]">
            <li><Link to="/privacy">Privacy</Link></li>
            <li><Link to="/terms">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--border)] px-6 py-4 text-center text-xs text-[var(--muted)]">
        © {new Date().getFullYear()} {brand.name}. Demo frontend — not affiliated with reference sites.
      </div>
    </footer>
  )
}
