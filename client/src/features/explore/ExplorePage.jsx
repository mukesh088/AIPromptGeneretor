import { brand } from '@/lib/brand'
import { SearchBar } from '@/components/gallery/SearchBar'
import {
  TypeTabs,
  TagChips,
  CategoryChips,
  FilterControls,
  ActiveFilterChips,
} from '@/components/gallery/FilterBar'
import { PromptGallery } from '@/components/gallery/PromptGallery'
import { usePromptList } from '@/hooks/usePrompts'
import { useGalleryFilters } from '@/lib/filterParams'
import { Button } from '@/components/ui/Button'

export function ExplorePage({ contentType = '' }) {
  const { filters, setFilters } = useGalleryFilters({ contentType })
  const effective = {
    ...filters,
    contentType: contentType || filters.contentType || undefined,
  }
  const query = usePromptList(effective)
  const total = query.data?.pages[0]?.total

  return (
    <div className="px-3 pt-4 sm:px-4 md:px-6">
      <div className="mb-5 text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
          AI Photo Editing Prompts for ChatGPT & Gemini
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-[var(--muted)] md:text-base">
          {brand.description}
        </p>
      </div>

      <div className="mb-4 flex justify-center">
        <TypeTabs active={contentType || 'all'} activeTag={filters.tag} />
      </div>

      <SearchBar
        className="mx-auto mb-4 max-w-2xl"
        value={filters.q}
        onChange={(q) => setFilters({ ...effective, q })}
      />

      <div className="mb-3">
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Tags</p>
        <TagChips
          activeTag={filters.tag}
          onSelect={(tag) => setFilters({ ...effective, tag, category: tag ? '' : filters.category })}
        />
      </div>

      <div className="mb-4">
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Categories</p>
        <CategoryChips contentType={contentType || 'all'} activeSlug={filters.category} />
      </div>

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
                tag: '',
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
