import { SearchBar } from '@/components/gallery/SearchBar'
import { PromptGallery } from '@/components/gallery/PromptGallery'
import { FilterControls, ActiveFilterChips } from '@/components/gallery/FilterBar'
import { useGalleryFilters } from '@/lib/filterParams'
import { usePromptList } from '@/hooks/usePrompts'
import { Button } from '@/components/ui/Button'

export function SearchPage() {
  const { filters, setFilters } = useGalleryFilters()
  const query = usePromptList(filters)

  return (
    <div className="px-3 py-4 sm:px-4 md:px-6">
      <h1 className="mb-3 font-display text-2xl font-bold">Search</h1>
      <SearchBar autoFocus value={filters.q} onChange={(q) => setFilters({ ...filters, q })} className="mb-4" />
      <div className="mb-3 space-y-2">
        <FilterControls filters={filters} setFilters={setFilters} total={query.data?.pages[0]?.total} />
        <ActiveFilterChips filters={filters} setFilters={setFilters} />
      </div>
      <PromptGallery
        query={query}
        emptyAction={
          <Button className="mt-4" variant="secondary" onClick={() => setFilters({ ...filters, q: '', category: '', tool: '', aspect: '' })}>
            Reset filters
          </Button>
        }
      />
    </div>
  )
}
