import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useHistoryStore = create(
  persist(
    (set, get) => ({
      jobs: [],
      addJob: (job) => set({ jobs: [job, ...get().jobs].slice(0, 50) }),
      updateJob: (id, patch) =>
        set({
          jobs: get().jobs.map((j) => (j.id === id ? { ...j, ...patch } : j)),
        }),
      clear: () => set({ jobs: [] }),
    }),
    { name: 'promptora-history' },
  ),
)
