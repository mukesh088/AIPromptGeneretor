import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Filter, Columns2, Columns3 } from 'lucide-react'
import { contentTypes, sortOptions, aspectRatios, supportedTools } from '@/lib/brand'
import { Button } from '@/components/ui/Button'
import { Sheet } from '@/components/ui/Sheet'
import { useCategories } from '@/hooks/usePrompts'
import { useUiStore } from '@/stores/uiStore'
import { cn } from '@/lib/cn'

export function TypeTabs({ active }) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      <Link
        to="/"
        className={cn(
          'shrink-0 rounded-full px-4 py-2 text-sm font-semibold',
          !active || active === 'all'
            ? 'bg-[var(--accent)] text-white'
            : 'bg-[var(--surface-2)] text-[var(--muted)]',
        )}
      >
        All
      </Link>
      {contentTypes.map((t) => (
        <Link
          key={t.id}
          to={t.path}
          className={cn(
            'shrink-0 rounded-full px-4 py-2 text-sm font-semibold',
            active === t.id ? 'bg-[var(--accent)] text-white' : 'bg-[var(--surface-2)] text-[var(--muted)]',
          )}
        >
          {t.label}
        </Link>
      ))}
    </div>
  )
}

export function CategoryChips({ activeSlug, contentType }) {
  const { data: categories = [] } = useCategories()
  const list = categories.filter(
    (c) => !contentType || contentType === 'all' || c.contentTypes.includes(contentType),
  )
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
      {list.map((c) => (
        <Link
          key={c.id}
          to={`/category/${c.slug}`}
          className={cn(
            'shrink-0 rounded-full border border-[var(--border)] px-3 py-2 text-sm',
            activeSlug === c.slug
              ? 'border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--fg)]'
              : 'bg-[var(--surface)] text-[var(--muted)]',
          )}
        >
          {c.name}
        </Link>
      ))}
    </div>
  )
}

export function FilterControls({ filters, setFilters, total }) {
  const [open, setOpen] = useState(false)
  const galleryColumns = useUiStore((s) => s.galleryColumns)
  const setGalleryColumns = useUiStore((s) => s.setGalleryColumns)
  const { data: categories = [] } = useCategories()

  const activeCount = ['category', 'tool', 'aspect', 'requiresReferenceImage'].filter((k) => {
    const v = filters[k]
    return v != null && v !== '' && v !== false
  }).length

  const reset = () =>
    setFilters({
      ...filters,
      category: '',
      tool: '',
      aspect: '',
      requiresReferenceImage: undefined,
      sort: 'curated',
      q: filters.q || '',
    })

  return (
    <div className="flex flex-wrap items-center gap-2">
      <p className="mr-auto text-sm text-[var(--muted)]">{total != null ? `${total} prompts` : '…'}</p>
      <Button
        variant="outline"
        size="sm"
        className="md:hidden"
        aria-label="One column"
        onClick={() => setGalleryColumns(galleryColumns === '1' ? 'auto' : '1')}
      >
        {galleryColumns === '1' ? <Columns3 className="h-4 w-4" /> : <Columns2 className="h-4 w-4" />}
      </Button>
      <select
        aria-label="Sort"
        className="min-h-9 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
        value={filters.sort || 'curated'}
        onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
      >
        {sortOptions.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Filter className="h-4 w-4" />
        Filters{activeCount ? ` (${activeCount})` : ''}
      </Button>

      <Sheet open={open} onOpenChange={setOpen} title="Filters">
        <div className="space-y-4">
          <Field label="Category">
            <select
              className="w-full min-h-11 rounded-[var(--radius-btn)] border border-[var(--border)] bg-[var(--surface)] px-3"
              value={filters.category || ''}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">Any</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tool">
            <select
              className="w-full min-h-11 rounded-[var(--radius-btn)] border border-[var(--border)] bg-[var(--surface)] px-3"
              value={filters.tool || ''}
              onChange={(e) => setFilters({ ...filters, tool: e.target.value })}
            >
              <option value="">Any</option>
              {supportedTools.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Aspect ratio">
            <select
              className="w-full min-h-11 rounded-[var(--radius-btn)] border border-[var(--border)] bg-[var(--surface)] px-3"
              value={filters.aspect || ''}
              onChange={(e) => setFilters({ ...filters, aspect: e.target.value })}
            >
              <option value="">Any</option>
              {aspectRatios.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </Field>
          <label className="flex min-h-11 items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={!!filters.requiresReferenceImage}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  requiresReferenceImage: e.target.checked ? true : undefined,
                })
              }
            />
            Requires reference image
          </label>
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" className="flex-1" onClick={reset}>
              Reset
            </Button>
            <Button className="flex-1" onClick={() => setOpen(false)}>
              Apply
            </Button>
          </div>
        </div>
      </Sheet>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-medium">{label}</p>
      {children}
    </div>
  )
}

export function ActiveFilterChips({ filters, setFilters }) {
  const chips = []
  if (filters.q) chips.push({ key: 'q', label: `“${filters.q}”`, clear: () => setFilters({ ...filters, q: '' }) })
  if (filters.category)
    chips.push({
      key: 'category',
      label: filters.category,
      clear: () => setFilters({ ...filters, category: '' }),
    })
  if (filters.tool)
    chips.push({ key: 'tool', label: filters.tool, clear: () => setFilters({ ...filters, tool: '' }) })
  if (filters.aspect)
    chips.push({ key: 'aspect', label: filters.aspect, clear: () => setFilters({ ...filters, aspect: '' }) })
  if (filters.requiresReferenceImage)
    chips.push({
      key: 'ref',
      label: 'Needs reference',
      clear: () => setFilters({ ...filters, requiresReferenceImage: undefined }),
    })

  if (!chips.length) return null
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={c.clear}
          className="rounded-full bg-[var(--surface-2)] px-3 py-1.5 text-xs font-medium"
        >
          {c.label} ×
        </button>
      ))}
      <button
        type="button"
        className="text-xs font-semibold text-[var(--accent)]"
        onClick={() =>
          setFilters({
            ...filters,
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
      </button>
    </div>
  )
}
