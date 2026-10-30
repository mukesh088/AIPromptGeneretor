import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUiStore = create(
  persist(
    (set) => ({
      recentSearches: [],
      galleryColumns: 'auto',
      instructionLang: 'en',
      toast: null,
      addRecentSearch: (q) =>
        set((s) => {
          const cleaned = q.trim()
          if (!cleaned) return s
          const next = [cleaned, ...s.recentSearches.filter((x) => x !== cleaned)].slice(0, 8)
          return { recentSearches: next }
        }),
      clearRecentSearches: () => set({ recentSearches: [] }),
      setGalleryColumns: (galleryColumns) => set({ galleryColumns }),
      setInstructionLang: (instructionLang) => set({ instructionLang }),
      showToast: (toast) => set({ toast }),
      clearToast: () => set({ toast: null }),
    }),
    {
      name: 'promptora-ui',
      partialize: (s) => ({
        recentSearches: s.recentSearches,
        galleryColumns: s.galleryColumns,
        instructionLang: s.instructionLang,
      }),
    },
  ),
)
