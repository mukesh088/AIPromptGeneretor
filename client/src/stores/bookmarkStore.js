import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useBookmarkStore = create(
  persist(
    (set, get) => ({
      ids: [],
      collections: [],
      toggle: (promptId) => {
        const { ids } = get()
        const next = ids.includes(promptId)
          ? ids.filter((id) => id !== promptId)
          : [...ids, promptId]
        set({ ids: next })
        return next.includes(promptId)
      },
      isSaved: (promptId) => get().ids.includes(promptId),
      createCollection: (name) => {
        const id = `uc_${Date.now()}`
        set({
          collections: [...get().collections, { id, name, promptIds: [], createdAt: new Date().toISOString() }],
        })
        return id
      },
      renameCollection: (id, name) => {
        set({
          collections: get().collections.map((c) => (c.id === id ? { ...c, name } : c)),
        })
      },
      deleteCollection: (id) => {
        set({ collections: get().collections.filter((c) => c.id !== id) })
      },
      addToCollection: (collectionId, promptId) => {
        set({
          collections: get().collections.map((c) =>
            c.id === collectionId && !c.promptIds.includes(promptId)
              ? { ...c, promptIds: [...c.promptIds, promptId] }
              : c,
          ),
        })
      },
      removeFromCollection: (collectionId, promptId) => {
        set({
          collections: get().collections.map((c) =>
            c.id === collectionId
              ? { ...c, promptIds: c.promptIds.filter((id) => id !== promptId) }
              : c,
          ),
        })
      },
      mergeServerIds: (serverIds = []) => {
        const merged = [...new Set([...get().ids, ...serverIds])]
        set({ ids: merged })
      },
    }),
    { name: 'promptora-bookmarks' },
  ),
)
