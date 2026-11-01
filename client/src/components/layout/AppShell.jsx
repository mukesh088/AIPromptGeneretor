import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { BottomNav } from './BottomNav'
import { Footer } from './Footer'
import { ToastHost } from '@/components/ui/Toast'

export function AppShell() {
  const { pathname } = useLocation()
  const hideChrome = pathname.startsWith('/admin')

  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--fg)]">
      {!hideChrome && <Header />}
      <main className={hideChrome ? 'min-h-dvh' : 'page-pad-bottom mx-auto min-h-[60dvh] max-w-[1440px]'}>
        <Outlet />
      </main>
      {!hideChrome && <Footer />}
      {!hideChrome && <BottomNav />}
      <ToastHost />
    </div>
  )
}
