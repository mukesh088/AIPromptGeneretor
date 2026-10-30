import { Link } from 'react-router-dom'
import { brand } from '@/lib/brand'
import { SearchBar } from '@/components/gallery/SearchBar'
import {
  TypeTabs,
  CategoryChips,
  FilterControls,
  ActiveFilterChips,
} from '@/components/gallery/FilterBar'
import { PromptGallery } from '@/components/gallery/PromptGallery'
import { usePromptList, useCollections } from '@/hooks/usePrompts'
import { useGalleryFilters } from '@/lib/filterParams'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

export function ExplorePage({ contentType = '' }) {
  const { filters, setFilters } = useGalleryFilters({ contentType })
  const effective = {
    ...filters,
    contentType: contentType || filters.contentType || undefined,
  }
  const query = usePromptList(effective)
  const { data: collections = [] } = useCollections()
  const total = query.data?.pages[0]?.total

  return (
    <div className="px-3 pt-4 sm:px-4 md:px-6">
      <div className="mb-4 max-w-2xl">
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{brand.tagline}</h1>
        <p className="mt-1 text-sm text-[var(--muted)] md:text-base">{brand.description}</p>
      </div>

      <SearchBar
        className="mb-4"
        value={filters.q}
        onChange={(q) => setFilters({ ...effective, q })}
      />

      <div className="mb-3">
        <TypeTabs active={contentType || 'all'} />
      </div>
      <div className="mb-4">
        <CategoryChips contentType={contentType || 'all'} />
      </div>

      {collections.filter((c) => c.featured).length > 0 && (
        <section className="mb-5" aria-label="Curated collections">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
              Curated inspiration
            </h2>
            <Link to="/collections" className="text-sm font-medium text-[var(--accent)]">
              See all
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {collections
              .filter((c) => c.featured)
              .map((c) => (
                <Link
                  key={c.id}
                  to={`/collection/${c.slug}`}
                  className={cn(
                    'relative h-28 w-44 shrink-0 overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] p-3',
                    c.coverGradient || 'preview-gradient-1',
                  )}
                >
                  <p className="font-display text-sm font-semibold text-white drop-shadow">{c.title}</p>
                </Link>
              ))}
          </div>
        </section>
      )}

      <div className="mb-3 space-y-2">
        <FilterControls
          filters={effective}
          setFilters={(next) => setFilters(next)}
          total={total}
        />
        <ActiveFilterChips filters={effective} setFilters={setFilters} />
      </div>

      <PromptGallery
        query={query}
        emptyAction={
          <Button
            className="mt-4"
            variant="secondary"
            onClick={() =>
              setFilters({
                contentType,
                q: '',
                category: '',
                tool: '',
                aspect: '',
                requiresReferenceImage: undefined,
                sort: 'curated',
              })
            }
          >
            Reset filters
          </Button>
        }
      />
    </div>
  )
}
