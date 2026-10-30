import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { promptRepository, isApiMode } from '@/repositories'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isDemo: !isApiMode,
      login: async ({ email, password, displayName }) => {
        if (isApiMode) {
          const user = await promptRepository.login({ email, password })
          set({ user, isDemo: false })
          return user
        }
        const user = {
          id: `demo_${btoa(email).slice(0, 12)}`,
          email,
          displayName: displayName || email.split('@')[0],
          role: email.endsWith('@admin.local') ? 'admin' : 'user',
          avatarUrl: null,
          createdAt: new Date().toISOString(),
        }
        set({ user, isDemo: true })
        return user
      },
      register: async ({ email, password, displayName }) => {
        if (isApiMode) {
          const user = await promptRepository.register({ email, password, displayName })
          set({ user, isDemo: false })
          return user
        }
        return get().login({ email, password, displayName })
      },
      logout: async () => {
        if (isApiMode) await promptRepository.logout()
        set({ user: null })
      },
      hydrateFromApi: async () => {
        if (!isApiMode) return
        try {
          const user = await promptRepository.me()
          set({ user, isDemo: false })
        } catch {
          set({ user: null })
        }
      },
      updateProfile: (patch) => {
        const { user } = get()
        if (!user) return
        set({ user: { ...user, ...patch } })
      },
      isAdmin: () => get().user?.role === 'admin',
    }),
    {
      name: 'promptora-auth',
      partialize: (s) => ({ user: s.user, isDemo: s.isDemo }),
    },
  ),
)
