import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { promptRepository } from '@/repositories'
import { useBookmarkStore } from '@/stores/bookmarkStore'
import { PromptCard } from '@/components/gallery/PromptCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'

export function SavedPage() {
  const ids = useBookmarkStore((s) => s.ids)
  const collections = useBookmarkStore((s) => s.collections)
  const createCollection = useBookmarkStore((s) => s.createCollection)
  const deleteCollection = useBookmarkStore((s) => s.deleteCollection)
  const renameCollection = useBookmarkStore((s) => s.renameCollection)
  const [name, setName] = useState('')

  const { data: prompts = [] } = useQuery({
    queryKey: ['saved-prompts', ids],
    queryFn: async () => {
      const list = await Promise.all(ids.map((id) => promptRepository.getPromptById(id)))
      return list.filter(Boolean)
    },
  })

  const byCollection = useMemo(() => collections, [collections])

  return (
    <div className="px-3 py-4 sm:px-4 md:px-6">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="font-display text-2xl font-bold">Saved</h1>
        <Badge tone="demo" className="normal-case">On this device</Badge>
      </div>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Guest bookmarks stay in local storage until you sign in with a real backend (Phase 2).
      </p>

      <section className="mt-6">
        <h2 className="font-display text-lg font-semibold">Bookmarks ({prompts.length})</h2>
        {prompts.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--muted)]">No saved prompts yet.</p>
        ) : (
          <div className="masonry mt-4">
            {prompts.map((p) => (
              <PromptCard key={p.id} prompt={p} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold">Your collections</h2>
        <div className="mt-3 flex gap-2">
          <Input placeholder="New collection name" value={name} onChange={(e) => setName(e.target.value)} />
          <Button
            onClick={() => {
              if (!name.trim()) return
              createCollection(name.trim())
              setName('')
            }}
          >
            Create
          </Button>
        </div>
        <ul className="mt-4 space-y-3">
          {byCollection.map((c) => (
            <li key={c.id} className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-3">
              <div className="flex items-center gap-2">
                <Input
                  value={c.name}
                  onChange={(e) => renameCollection(c.id, e.target.value)}
                  className="font-semibold"
                />
                <Button variant="ghost" onClick={() => deleteCollection(c.id)}>
                  Delete
                </Button>
              </div>
              <p className="mt-1 text-xs text-[var(--muted)]">{c.promptIds.length} prompts</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
