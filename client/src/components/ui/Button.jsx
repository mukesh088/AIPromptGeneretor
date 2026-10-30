import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 min-h-11 px-4 text-[15px] rounded-[var(--radius-btn)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
  {
    variants: {
      variant: {
        default: 'bg-[var(--accent)] text-white hover:brightness-110',
        gradient: 'gradient-cta text-white hover:brightness-110 shadow-sm',
        secondary: 'bg-[var(--surface-2)] text-[var(--fg)] hover:brightness-110',
        outline: 'border border-[var(--border)] bg-transparent hover:bg-[var(--surface-2)]',
        ghost: 'hover:bg-[var(--surface-2)]',
        danger: 'bg-[var(--danger)] text-white',
      },
      size: {
        default: 'min-h-11 px-4',
        sm: 'min-h-9 px-3 text-sm',
        lg: 'min-h-12 px-5 text-base',
        icon: 'h-11 w-11 p-0',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
