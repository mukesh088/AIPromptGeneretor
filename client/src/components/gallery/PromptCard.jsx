import { Link } from 'react-router-dom'
import { Bookmark, Copy } from 'lucide-react'
import { PreviewMedia } from '@/components/media/PreviewMedia'
import { useBookmarkStore } from '@/stores/bookmarkStore'
import { copyText } from '@/lib/copy'
import { useToast } from '@/components/ui/Toast'
import { promptRepository } from '@/repositories'
import { cn } from '@/lib/cn'

export function PromptCard({ prompt }) {
  const toast = useToast()
  const isSaved = useBookmarkStore((s) => s.isSaved(prompt.id))
  const toggle = useBookmarkStore((s) => s.toggle)

  const onSave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const saved = toggle(prompt.id)
    if (saved) promptRepository.recordEvent('save', prompt.id)
    toast.success(saved ? 'Saved on this device' : 'Removed from saved')
  }

  const onCopy = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const result = await copyText(prompt.promptTemplate)
    if (result.ok) {
      promptRepository.recordEvent('copy', prompt.id)
      toast.success('Prompt copied')
    } else toast.error(result.error || 'Copy failed')
  }

  return (
    <article className="masonry-item group relative">
      <Link
        to={`/prompt/${prompt.slug}`}
        className="block overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        <PreviewMedia
          preview={prompt.preview}
          title={prompt.title}
          badge={prompt.badge}
          typeLabel={prompt.contentType}
        />
        <div className="space-y-1 p-2.5">
          <h3 className="line-clamp-2 font-display text-sm font-semibold leading-snug">{prompt.title}</h3>
          <p className="truncate text-xs text-[var(--muted)]">
            {prompt.supportedTools.slice(0, 2).join(' · ')}
          </p>
        </div>
      </Link>
      <div className="absolute right-2 top-2 flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
        <button
          type="button"
          aria-label={isSaved ? 'Remove bookmark' : 'Save prompt'}
          onClick={onSave}
          className={cn(
            'inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm',
            isSaved && 'text-pink-300',
          )}
        >
          <Bookmark className="h-4 w-4" fill={isSaved ? 'currentColor' : 'none'} />
        </button>
        <button
          type="button"
          aria-label="Quick copy prompt"
          onClick={onCopy}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm"
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>
    </article>
  )
}

export function PromptCardSkeleton() {
  return (
    <div className="masonry-item animate-pulse overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)]">
      <div className="aspect-[3/4] bg-[var(--surface-2)]" />
      <div className="space-y-2 p-2.5">
        <div className="h-4 w-4/5 rounded bg-[var(--surface-2)]" />
        <div className="h-3 w-1/2 rounded bg-[var(--surface-2)]" />
      </div>
    </div>
  )
}
