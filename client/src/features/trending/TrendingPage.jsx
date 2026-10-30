import { usePromptList } from '@/hooks/usePrompts'
import { PromptGallery } from '@/components/gallery/PromptGallery'
import { Badge } from '@/components/ui/Badge'

export function TrendingPage() {
  const curated = usePromptList({ featured: true, sort: 'curated' })
  const popular = usePromptList({ sort: 'most_copied' })

  return (
    <div className="px-3 py-4 sm:px-4 md:px-6">
      <h1 className="font-display text-2xl font-bold">Trending</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Editorial picks are manually curated. Popularity uses demo metrics only until live analytics exist.
      </p>

      <section className="mt-6">
        <div className="mb-3 flex items-center gap-2">
          <h2 className="font-display text-lg font-semibold">Curated inspiration</h2>
          <Badge tone="curated">Editorial</Badge>
        </div>
        <PromptGallery query={curated} />
      </section>

      <section className="mt-10">
        <div className="mb-3 flex items-center gap-2">
          <h2 className="font-display text-lg font-semibold">Most copied (demo metrics)</h2>
          <Badge tone="demo" className="normal-case">Demo</Badge>
        </div>
        <PromptGallery query={popular} />
      </section>
    </div>
  )
}
