import { brand } from '@/lib/brand'
import { SearchBar } from '@/components/gallery/SearchBar'
import { TypeTabs, FilterControls, ActiveFilterChips } from '@/components/gallery/FilterBar'
import { PromptGallery } from '@/components/gallery/PromptGallery'
import { usePromptList } from '@/hooks/usePrompts'
import { useGalleryFilters } from '@/lib/filterParams'
import { Button } from '@/components/ui/Button'

/** Templates feed — featured / curated prompts first (promptpin-style Templates menu). */
export function TemplatesPage() {
  const { filters, setFilters } = useGalleryFilters()
  const query = usePromptList({
    ...filters,
    featured: true,
    sort: filters.sort || 'curated',
  })
  const fallback = usePromptList({
    ...filters,
    sort: 'curated',
  })
  const activeQuery = (query.data?.pages?.[0]?.total || 0) > 0 ? query : fallback
  const total = activeQuery.data?.pages[0]?.total

  return (
    <div className="px-3 pt-4 sm:px-4 md:px-6">
      <div className="mb-4 text-center md:text-left">
        <h1 className="font-display text-2xl font-bold md:text-3xl">Templates</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Ready-to-use prompt templates for ChatGPT, Gemini, and more — {brand.name}.
        </p>
      </div>
      <div className="mb-4 flex justify-center md:justify-start">
        <TypeTabs active="templates" />
      </div>
      <SearchBar
        className="mb-4"
        value={filters.q}
        onChange={(q) => setFilters({ ...filters, q })}
      />
      <div className="mb-3 space-y-2">
        <FilterControls filters={filters} setFilters={setFilters} total={total} />
        <ActiveFilterChips filters={filters} setFilters={setFilters} />
      </div>
      <PromptGallery
        query={activeQuery}
        emptyAction={
          <Button className="mt-4" variant="secondary" onClick={() => setFilters({ sort: 'curated', q: '' })}>
            Reset filters
          </Button>
        }
      />
    </div>
  )
}
