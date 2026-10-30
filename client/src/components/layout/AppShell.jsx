import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { BottomNav } from './BottomNav'
import { Footer } from './Footer'
import { ToastHost } from '@/components/ui/Toast'
import { brand } from '@/lib/brand'
import { Badge } from '@/components/ui/Badge'
import { isApiMode } from '@/repositories'

export function AppShell() {
  const { pathname } = useLocation()
  const hideChrome = pathname.startsWith('/admin')

  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--fg)]">
      {!hideChrome && <Header />}
      {!hideChrome && (
        <div className="border-b border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-center text-xs text-[var(--muted)]">
          {isApiMode ? (
            <>
              <Badge tone="featured" className="mr-2 normal-case">Live data</Badge>
              Connected to the Promptora API database. Admin can add photos, prompts, and categories.
            </>
          ) : (
            <>
              <Badge tone="demo" className="mr-2 normal-case">Demo mode</Badge>
              {brand.demoMode
                ? 'Browse without API keys. Start the server for admin + database.'
                : 'Offline seed data'}
            </>
          )}
        </div>
      )}
      <main className="page-pad-bottom mx-auto min-h-[60dvh] max-w-[1440px]">
        <Outlet />
      </main>
      {!hideChrome && <Footer />}
      {!hideChrome && <BottomNav />}
      <ToastHost />
    </div>
  )
}
