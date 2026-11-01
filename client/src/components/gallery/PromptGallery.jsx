import { PromptCard, PromptCardSkeleton } from './PromptCard'
import { Button } from '@/components/ui/Button'
import { useUiStore } from '@/stores/uiStore'
import { cn } from '@/lib/cn'
import { sortPinnedFirst } from '@/lib/sortPinned'

export function PromptGallery({ query, emptyAction }) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = query
  const galleryColumns = useUiStore((s) => s.galleryColumns)

  const items = sortPinnedFirst(data?.pages.flatMap((p) => p.items) ?? [])
  const total = data?.pages[0]?.total ?? 0

  if (isLoading) {
    return (
      <div className={cn('masonry', galleryColumns === '1' && 'masonry-cols-1')}>
        {Array.from({ length: 8 }).map((_, i) => (
          <PromptCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (isError) {
    return <p className="py-12 text-center text-[var(--danger)]">Could not load prompts.</p>
  }

  if (!items.length) {
    return (
      <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] px-4 py-14 text-center">
        <p className="font-display text-lg font-semibold">No prompts match</p>
        <p className="mt-1 text-sm text-[var(--muted)]">Try clearing filters or searching a different look.</p>
        {emptyAction}
      </div>
    )
  }

  return (
    <div>
      <div className={cn('masonry', galleryColumns === '1' && 'masonry-cols-1')}>
        {items.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))}
      </div>
      {hasNextPage && (
        <div className="mt-6 flex justify-center">
          <Button variant="secondary" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? 'Loading…' : `Load more (${items.length} of ${total})`}
          </Button>
        </div>
      )}
    </div>
  )
}
