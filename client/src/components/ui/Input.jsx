import { cn } from '@/lib/cn'

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'flex w-full min-h-11 rounded-[var(--radius-btn)] border border-[var(--border)] bg-[var(--surface)] px-3 text-base text-[var(--fg)] placeholder:text-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        'flex w-full min-h-28 rounded-[var(--radius-btn)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-base text-[var(--fg)] placeholder:text-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export function Label({ className, ...props }) {
  return (
    <label className={cn('mb-1.5 block text-sm font-medium text-[var(--fg)]', className)} {...props} />
  )
}
