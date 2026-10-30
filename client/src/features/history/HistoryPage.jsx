import { Link } from 'react-router-dom'
import { useHistoryStore } from '@/stores/historyStore'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export function HistoryPage() {
  const jobs = useHistoryStore((s) => s.jobs)
  const clear = useHistoryStore((s) => s.clear)

  return (
    <div className="px-3 py-4 sm:px-4 md:px-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="font-display text-2xl font-bold">History</h1>
        {jobs.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clear}>
            Clear
          </Button>
        )}
      </div>
      <p className="mt-1 text-sm text-[var(--muted)]">Demo generation jobs stored on this device.</p>

      {jobs.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="text-[var(--muted)]">No jobs yet.</p>
          <Button asChild className="mt-4">
            <Link to="/create">Open studio</Link>
          </Button>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {jobs.map((j) => (
            <li key={j.id} className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="demo" className="normal-case">Demo</Badge>
                <Badge tone="muted">{j.status}</Badge>
                <span className="text-xs text-[var(--muted)]">{new Date(j.createdAt).toLocaleString()}</span>
              </div>
              <p className="mt-2 line-clamp-3 text-sm">{j.prompt}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {j.mode} · {j.providerId}
                {j.ratio ? ` · ${j.ratio}` : ''}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
