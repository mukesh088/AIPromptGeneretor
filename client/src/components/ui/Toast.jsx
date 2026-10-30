import { useEffect } from 'react'
import { useUiStore } from '@/stores/uiStore'
import { cn } from '@/lib/cn'

export function ToastHost() {
  const toast = useUiStore((s) => s.toast)
  const clearToast = useUiStore((s) => s.clearToast)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(clearToast, toast.duration ?? 2200)
    return () => clearTimeout(t)
  }, [toast, clearToast])

  if (!toast) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed left-1/2 z-[60] w-[min(92vw,380px)] -translate-x-1/2 rounded-[var(--radius-btn)] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm shadow-lg',
        'bottom-[calc(var(--bottom-nav-h)+var(--safe-bottom)+12px)] md:bottom-6',
        toast.type === 'error' && 'border-[var(--danger)]',
        toast.type === 'success' && 'border-[var(--success)]',
      )}
    >
      {toast.message}
    </div>
  )
}

export function useToast() {
  const showToast = useUiStore((s) => s.showToast)
  return {
    success: (message) => showToast({ type: 'success', message }),
    error: (message) => showToast({ type: 'error', message }),
    info: (message) => showToast({ type: 'info', message }),
  }
}
