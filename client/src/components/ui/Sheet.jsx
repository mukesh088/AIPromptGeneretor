import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

export function Sheet({ open, onOpenChange, title, children, side = 'bottom' }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-in" />
        <Dialog.Content
          className={cn(
            'fixed z-50 border border-[var(--border)] bg-[var(--surface)] shadow-xl focus:outline-none',
            side === 'bottom' &&
              'inset-x-0 bottom-0 max-h-[85dvh] rounded-t-[20px] pb-[calc(16px+var(--safe-bottom))]',
            side === 'right' &&
              'inset-y-0 right-0 h-full w-full max-w-md rounded-l-[20px] sm:w-[420px]',
          )}
        >
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
            <Dialog.Title className="font-display text-lg font-semibold">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-[var(--surface-2)]"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>
          <div className="overflow-y-auto px-4 py-4">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
