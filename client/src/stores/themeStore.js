import { create } from 'zustand'
import { persist } from 'zustand/middleware'

function getSystemDark() {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyTheme(mode) {
  const root = document.documentElement
  const dark = mode === 'system' ? getSystemDark() : mode === 'dark'
  root.classList.toggle('dark', dark)
  root.style.colorScheme = dark ? 'dark' : 'light'
}

export const useThemeStore = create(
  persist(
    (set, get) => ({
      mode: 'dark',
      setMode: (mode) => {
        applyTheme(mode)
        set({ mode })
      },
      hydrate: () => {
        applyTheme(get().mode)
      },
    }),
    { name: 'promptora-theme' },
  ),
)

if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (useThemeStore.getState().mode === 'system') applyTheme('system')
  })
}
