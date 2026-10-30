import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ExplorePage } from '@/features/explore/ExplorePage'

const PromptDetailPage = lazy(() =>
  import('@/features/detail/PromptDetailPage').then((m) => ({ default: m.PromptDetailPage })),
)
const StudioPage = lazy(() =>
  import('@/features/studio/StudioPage').then((m) => ({ default: m.StudioPage })),
)
const CategoriesPage = lazy(() =>
  import('@/features/categories/CategoriesPage').then((m) => ({ default: m.CategoriesPage })),
)
const CategoryFeedPage = lazy(() =>
  import('@/features/categories/CategoriesPage').then((m) => ({ default: m.CategoryFeedPage })),
)
const CollectionsPage = lazy(() =>
  import('@/features/collections/CollectionsPage').then((m) => ({ default: m.CollectionsPage })),
)
const CollectionDetailPage = lazy(() =>
  import('@/features/collections/CollectionsPage').then((m) => ({ default: m.CollectionDetailPage })),
)
const SearchPage = lazy(() =>
  import('@/features/search/SearchPage').then((m) => ({ default: m.SearchPage })),
)
const TrendingPage = lazy(() =>
  import('@/features/trending/TrendingPage').then((m) => ({ default: m.TrendingPage })),
)
const SavedPage = lazy(() =>
  import('@/features/saved/SavedPage').then((m) => ({ default: m.SavedPage })),
)
const HistoryPage = lazy(() =>
  import('@/features/history/HistoryPage').then((m) => ({ default: m.HistoryPage })),
)
const LoginPage = lazy(() =>
  import('@/features/auth/AuthPages').then((m) => ({ default: m.LoginPage })),
)
const RegisterPage = lazy(() =>
  import('@/features/auth/AuthPages').then((m) => ({ default: m.RegisterPage })),
)
const ProfilePage = lazy(() =>
  import('@/features/auth/AuthPages').then((m) => ({ default: m.ProfilePage })),
)
const AdminPage = lazy(() =>
  import('@/features/admin/AdminPage').then((m) => ({ default: m.AdminPage })),
)
const AboutPage = lazy(() =>
  import('@/features/static/StaticPages').then((m) => ({ default: m.AboutPage })),
)
const ContactPage = lazy(() =>
  import('@/features/static/StaticPages').then((m) => ({ default: m.ContactPage })),
)
const PrivacyPage = lazy(() =>
  import('@/features/static/StaticPages').then((m) => ({ default: m.PrivacyPage })),
)
const TermsPage = lazy(() =>
  import('@/features/static/StaticPages').then((m) => ({ default: m.TermsPage })),
)
const SubmitPage = lazy(() =>
  import('@/features/static/StaticPages').then((m) => ({ default: m.SubmitPage })),
)
const NotFoundPage = lazy(() =>
  import('@/features/static/StaticPages').then((m) => ({ default: m.NotFoundPage })),
)

function L({ children }) {
  return <Suspense fallback={<div className="p-6 text-sm text-[var(--muted)]">Loading…</div>}>{children}</Suspense>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <ExplorePage /> },
      { path: 'images', element: <ExplorePage contentType="image" /> },
      { path: 'videos', element: <ExplorePage contentType="video" /> },
      { path: 'work', element: <ExplorePage contentType="work" /> },
      { path: 'trending', element: <L><TrendingPage /></L> },
      { path: 'categories', element: <L><CategoriesPage /></L> },
      { path: 'category/:slug', element: <L><CategoryFeedPage /></L> },
      { path: 'collections', element: <L><CollectionsPage /></L> },
      { path: 'collection/:slug', element: <L><CollectionDetailPage /></L> },
      { path: 'prompt/:slug', element: <L><PromptDetailPage /></L> },
      { path: 'search', element: <L><SearchPage /></L> },
      { path: 'create', element: <L><StudioPage /></L> },
      { path: 'saved', element: <L><SavedPage /></L> },
      { path: 'history', element: <L><HistoryPage /></L> },
      { path: 'profile', element: <L><ProfilePage /></L> },
      { path: 'login', element: <L><LoginPage /></L> },
      { path: 'register', element: <L><RegisterPage /></L> },
      { path: 'submit', element: <L><SubmitPage /></L> },
      { path: 'admin', element: <L><AdminPage /></L> },
      { path: 'about', element: <L><AboutPage /></L> },
      { path: 'contact', element: <L><ContactPage /></L> },
      { path: 'privacy', element: <L><PrivacyPage /></L> },
      { path: 'terms', element: <L><TermsPage /></L> },
      { path: '*', element: <L><NotFoundPage /></L> },
    ],
  },
])
