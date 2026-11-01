import { Link } from 'react-router-dom'
import { brand } from '@/lib/brand'
import { Button } from '@/components/ui/Button'
import { Sparkles, Smartphone } from 'lucide-react'

export function AppPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-center">
      <span className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent)] text-2xl font-bold text-white">
        P
      </span>
      <h1 className="font-display text-3xl font-bold">{brand.name} App</h1>
      <p className="mt-3 text-[var(--muted)]">
        Browse templates, copy prompts, and create looks on the go. Use the web app now — native apps coming soon.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button variant="gradient" asChild>
          <Link to="/create">
            <Sparkles className="h-4 w-4" /> Open Create Studio
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link to="/templates">Browse Templates</Link>
        </Button>
      </div>
      <div className="mt-10 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6 text-left">
        <div className="flex items-start gap-3">
          <Smartphone className="mt-0.5 h-5 w-5 text-[var(--accent)]" />
          <div>
            <p className="font-semibold">Get the app</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Install from your browser (Add to Home Screen) for a quick promptpin-style experience.
              Contact {brand.supportEmail} for updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
