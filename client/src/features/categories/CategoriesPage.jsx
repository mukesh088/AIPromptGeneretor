import { Link, useParams } from 'react-router-dom'
import { useCategories, useCategory, usePromptList } from '@/hooks/usePrompts'
import { useGalleryFilters } from '@/lib/filterParams'
import { PromptGallery } from '@/components/gallery/PromptGallery'
import { FilterControls, ActiveFilterChips } from '@/components/gallery/FilterBar'

export function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories()
  return (
    <div className="px-3 py-4 sm:px-4 md:px-6">
      <h1 className="font-display text-2xl font-bold">Categories</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">Browse by look, format, and workflow.</p>
      {isLoading ? (
        <p className="mt-8 text-[var(--muted)]">Loading…</p>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                to={`/category/${c.slug}`}
                className="block rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-[var(--accent)]"
              >
                <p className="font-display font-semibold">{c.name}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{c.description}</p>
                <p className="mt-3 text-xs font-medium text-[var(--accent)]">{c.count} prompts</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function CategoryFeedPage() {
  const { slug } = useParams()
  const { data: category } = useCategory(slug)
  const { filters, setFilters } = useGalleryFilters({ category: slug })
  const query = usePromptList({ ...filters, category: slug })

  return (
    <div className="px-3 py-4 sm:px-4 md:px-6">
      <h1 className="font-display text-2xl font-bold">{category?.name || 'Category'}</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">{category?.description}</p>
      <div className="my-4 space-y-2">
        <FilterControls
          filters={{ ...filters, category: slug }}
          setFilters={setFilters}
          total={query.data?.pages[0]?.total}
        />
        <ActiveFilterChips filters={filters} setFilters={setFilters} />
      </div>
      <PromptGallery query={query} />
    </div>
  )
}
