import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, Copy, Pin } from 'lucide-react'
import { PreviewMedia } from '@/components/media/PreviewMedia'
import { useBookmarkStore } from '@/stores/bookmarkStore'
import { copyText, resolvePrompt, hasUnresolvedRequired } from '@/lib/copy'
import { useToast } from '@/components/ui/Toast'
import { promptRepository } from '@/repositories'
import { cn } from '@/lib/cn'

export function PromptCard({ prompt }) {
  const toast = useToast()
  const isSaved = useBookmarkStore((s) => s.isSaved(prompt.id))
  const toggle = useBookmarkStore((s) => s.toggle)
  const [copied, setCopied] = useState(false)
  const variables = prompt.variables || []
  const [values, setValues] = useState(() =>
    Object.fromEntries(variables.map((v) => [v.key, ''])),
  )

  const finalPrompt = useMemo(
    () => resolvePrompt(prompt.promptTemplate || '', values),
    [prompt.promptTemplate, values],
  )

  const nameEntered = Boolean(String(values.name || '').trim())
  const showLivePreview = variables.some((v) => v.key === 'name') && nameEntered

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
    if (variables.length) {
      const missing = hasUnresolvedRequired(prompt.promptTemplate, values, variables)
      if (missing.length) {
        toast.error(`Enter ${missing.join(', ')} first`)
        return
      }
    }
    const text = variables.length ? finalPrompt : prompt.promptTemplate
    const result = await copyText(text)
    if (result.ok) {
      promptRepository.recordEvent('copy', prompt.id)
      setCopied(true)
      toast.success(nameEntered ? `Copied with name “${values.name.trim()}”` : 'Prompt copied')
      window.setTimeout(() => setCopied(false), 1800)
    } else toast.error(result.error || 'Copy failed')
  }

  return (
    <article className="masonry-item group relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)]">
      <Link
        to={`/prompt/${prompt.slug}`}
        className="block focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        <PreviewMedia
          preview={prompt.preview}
          title={prompt.title}
          badge={prompt.badge}
          typeLabel={prompt.contentType}
          pinned={!!prompt.pinned}
        />
        <div className="space-y-1 px-2.5 pt-2.5">
          <h3 className="flex items-start gap-1.5 font-display text-sm font-semibold leading-snug">
            {prompt.pinned && (
              <Pin className="mt-0.5 h-3.5 w-3.5 shrink-0 fill-[var(--accent)] text-[var(--accent)]" aria-hidden />
            )}
            <span className="line-clamp-2">{prompt.title}</span>
          </h3>
          <p className="truncate text-xs text-[var(--muted)]">
            {prompt.supportedTools.slice(0, 2).join(' · ')}
          </p>
        </div>
      </Link>
      <div className="space-y-2 p-2.5 pt-2">
        {variables.length > 0 && (
          <div className="space-y-1.5" onClick={(e) => e.stopPropagation()}>
            {variables.map((v) => (
              <input
                key={v.key}
                type="text"
                value={values[v.key] ?? ''}
                onChange={(e) => setValues((prev) => ({ ...prev, [v.key]: e.target.value }))}
                placeholder={v.placeholder || v.help || v.label || v.key}
                aria-label={v.label || v.key}
                className="w-full min-h-9 rounded-[var(--radius-btn)] border border-[var(--border)] bg-[var(--surface-2)] px-2.5 text-sm outline-none focus:border-[var(--accent)]"
              />
            ))}
            {showLivePreview && (
              <p className="line-clamp-3 rounded-lg bg-[var(--surface-2)] px-2 py-1.5 text-[11px] leading-snug text-[var(--muted)]">
                <span className="font-semibold text-[var(--fg)]">Live: </span>
                {finalPrompt}
              </p>
            )}
          </div>
        )}
        <button
          type="button"
          onClick={onCopy}
          className={cn(
            'inline-flex w-full min-h-9 items-center justify-center gap-1.5 rounded-[var(--radius-btn)] text-sm font-semibold transition',
            copied
              ? 'bg-emerald-500/15 text-emerald-600'
              : 'bg-[var(--accent)] text-white hover:opacity-95',
          )}
        >
          <Copy className="h-3.5 w-3.5" />
          {copied ? 'Copied!' : 'Copy it'}
        </button>
      </div>
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
