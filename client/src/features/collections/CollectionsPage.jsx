import { Link, useParams } from 'react-router-dom'
import { useCollections, useCollection } from '@/hooks/usePrompts'
import { PromptCard } from '@/components/gallery/PromptCard'
import { cn } from '@/lib/cn'

export function CollectionsPage() {
  const { data: collections = [], isLoading } = useCollections()
  return (
    <div className="px-3 py-4 sm:px-4 md:px-6">
      <h1 className="font-display text-2xl font-bold">Collections</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">Editorial sets — curated inspiration, not measured trends.</p>
      {isLoading ? (
        <p className="mt-8 text-sm text-[var(--muted)]">Loading collections…</p>
      ) : collections.length === 0 ? (
        <p className="mt-8 text-sm text-[var(--muted)]">No collections yet. Run server seed to load them.</p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <li key={c.id}>
              <Link
                to={`/collection/${c.slug}`}
                className={cn(
                  'flex h-40 flex-col justify-end rounded-[var(--radius-card)] border border-[var(--border)] p-4',
                  c.coverGradient || 'preview-gradient-1',
                )}
              >
                <p className="font-display text-lg font-semibold text-white drop-shadow">{c.title}</p>
                <p className="text-sm text-white/80">
                  {c.promptCount ?? c.promptIds?.length ?? 0} prompts
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function CollectionDetailPage() {
  const { slug } = useParams()
  const { data: collection, isLoading } = useCollection(slug)

  if (isLoading) return <p className="p-6 text-[var(--muted)]">Loading…</p>
  if (!collection) return <p className="p-6">Collection not found.</p>

  return (
    <div className="px-3 py-4 sm:px-4 md:px-6">
      <div className={cn('mb-6 rounded-[var(--radius-card)] p-6', collection.coverGradient)}>
        <h1 className="font-display text-2xl font-bold text-white">{collection.title}</h1>
        <p className="mt-2 text-white/85">{collection.description}</p>
      </div>
      <div className="masonry">
        {(collection.prompts || []).map((p) => (
          <PromptCard key={p.id} prompt={p} />
        ))}
      </div>
    </div>
  )
}
