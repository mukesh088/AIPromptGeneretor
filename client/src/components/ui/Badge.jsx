import { cn } from '@/lib/cn'

const styles = {
  new: 'bg-emerald-500/90 text-white',
  featured: 'bg-[var(--accent)] text-white',
  curated: 'bg-[var(--accent-2)]/90 text-white',
  pinned: 'bg-[var(--accent)] text-white',
  demo: 'bg-amber-500/90 text-black',
  type: 'bg-black/55 text-white backdrop-blur-sm',
  muted: 'bg-[var(--surface-2)] text-[var(--muted)]',
}

export function Badge({ children, tone = 'muted', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
        styles[tone] || styles.muted,
        className,
      )}
    >
      {children}
    </span>
  )
}
