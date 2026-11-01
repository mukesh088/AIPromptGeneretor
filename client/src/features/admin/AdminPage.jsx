import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import {
  ArrowLeft,
  FolderOpen,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  Menu,
  Pencil,
  Pin,
  Plus,
  Search,
  Tags,
  Trash2,
  X,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useAdminPrompts, useCategories, useSavePromptMutation } from '@/hooks/usePrompts'
import { Button } from '@/components/ui/Button'
import { Input, Textarea, Label } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { promptRepository, isApiMode } from '@/repositories'
import { useToast } from '@/components/ui/Toast'
import { useQueryClient } from '@tanstack/react-query'
import { PreviewMedia } from '@/components/media/PreviewMedia'
import { apiBaseUrl } from '@/repositories/apiRepository'
import { brand, supportedTools, filterTags } from '@/lib/brand'
import { cn } from '@/lib/cn'
import { sortPinnedFirst } from '@/lib/sortPinned'
import { personalizeFields, buildPersonalizeVariable } from '@/data/variableSchemas'

function resolvePreviewUrl(url) {
  if (!url) return null
  if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) return url
  return `${apiBaseUrl()}${url}`
}

const emptyPrompt = (categoryId = '') => ({
  id: '',
  title: '',
  slug: '',
  shortDescription: '',
  contentType: 'image',
  categoryId: categoryId || '',
  promptTemplate: '',
  negativePrompt: '',
  tags: [],
  status: 'draft',
  featured: false,
  pinned: false,
  badge: null,
  supportedTools: ['chatgpt'],
  supportedAspectRatios: ['1:1', '3:4', '16:9'],
  variables: [],
  usageSteps: { en: ['Copy the prompt into your AI tool.'], hi: ['प्रॉम्प्ट को AI टूल में पेस्ट करें।'] },
  tips: { en: [], hi: [] },
  preview: {
    kind: 'image',
    url: '',
    alt: '',
    width: 800,
    height: 1000,
    gradient: 'preview-gradient-1',
    format: 'photo',
    label: null,
    fit: 'cover',
    position: 'center',
  },
})

export function AdminPage() {
  const user = useAuthStore((s) => s.user)
  const isAdmin = useAuthStore((s) => s.isAdmin)
  const logout = useAuthStore((s) => s.logout)
  const [section, setSection] = useState('dashboard') // dashboard | categories | list
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [editing, setEditing] = useState(null)
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', contentTypes: ['image'] })
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [lightbox, setLightbox] = useState(null) // { url, title }
  const toast = useToast()
  const qc = useQueryClient()
  const saveMutation = useSavePromptMutation()
  const { data: categories = [] } = useCategories({ includeAll: true })
  const { data, isLoading } = useAdminPrompts({ status: 'all', limit: 500, sort: 'newest' })
  const allPrompts = data?.items || []

  useEffect(() => {
    if (!lightbox) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  const stats = useMemo(() => {
    const published = allPrompts.filter((p) => p.status === 'published').length
    const drafts = allPrompts.filter((p) => p.status === 'draft').length
    return {
      prompts: allPrompts.length,
      published,
      drafts,
      categories: categories.length,
    }
  }, [allPrompts, categories])

  const uncategorizedCount = useMemo(
    () => allPrompts.filter((p) => !p.categoryId).length,
    [allPrompts],
  )

  const categoryCards = useMemo(() => {
    const fromApi = categories.map((c) => ({
      ...c,
      count: allPrompts.filter((p) => p.categoryId === c.id).length || c.count || 0,
    }))
    return [
      {
        id: '__all__',
        name: 'All prompts',
        slug: 'all',
        description: 'Every prompt',
        count: allPrompts.length,
      },
      ...fromApi,
      {
        id: '__none__',
        name: 'Uncategorized',
        slug: 'uncategorized',
        description: 'No category assigned',
        count: uncategorizedCount,
      },
    ]
  }, [categories, allPrompts, uncategorizedCount])

  const listItems = useMemo(() => {
    let list = allPrompts
    if (selectedCategory?.id === '__none__') list = list.filter((p) => !p.categoryId)
    else if (selectedCategory && selectedCategory.id !== '__all__') {
      list = list.filter((p) => p.categoryId === selectedCategory.id)
    }
    if (status !== 'all') list = list.filter((p) => p.status === status)
    if (q) {
      const n = q.toLowerCase()
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(n) ||
          p.slug.includes(n) ||
          (p.promptTemplate || '').toLowerCase().includes(n),
      )
    }
    return sortPinnedFirst(list)
  }, [allPrompts, selectedCategory, status, q])

  if (!user || !isAdmin()) {
    return <Navigate to="/login" replace />
  }

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['prompts'] })
    qc.invalidateQueries({ queryKey: ['admin-prompts'] })
    qc.invalidateQueries({ queryKey: ['categories'] })
    qc.invalidateQueries({ queryKey: ['prompt'] })
  }

  const openCategory = (cat) => {
    setSelectedCategory(cat)
    setQ('')
    setStatus('all')
    setSection('list')
    setSidebarOpen(false)
  }

  const onUpload = async (file) => {
    if (!file || !editing) return
    if (!isApiMode) {
      toast.error('Start the API server to upload images')
      return
    }
    setUploading(true)
    try {
      const result = await promptRepository.uploadImage(file)
      const absolute = result.url.startsWith('http') ? result.url : `${apiBaseUrl()}${result.url}`
      setEditing({
        ...editing,
        attribution: '',
        preview: {
          ...editing.preview,
          kind: 'image',
          url: absolute,
          format: 'photo',
          alt: editing.preview?.alt || editing.title,
        },
      })
      toast.success('Image uploaded')
    } catch (e) {
      const msg = e.message || 'Upload failed'
      toast.error(
        /unauthor/i.test(msg)
          ? 'Session expired — log out and log in again, then retry upload'
          : msg,
      )
    } finally {
      setUploading(false)
    }
  }

  const savePrompt = async () => {
    try {
      await saveMutation.mutateAsync({
        ...editing,
        attribution: editing.attribution || '',
        variables: Array.isArray(editing.variables) ? editing.variables : [],
        tags: Array.isArray(editing.tags)
          ? editing.tags
          : String(editing.tags || '')
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean),
        previewUrl: editing.preview?.url,
        preview: editing.preview,
      })
      toast.success('Saved')
      setEditing(null)
      refresh()
    } catch (e) {
      toast.error(e.message || 'Save failed')
    }
  }

  const deletePrompt = async (p) => {
    if (!confirm(`Delete “${p.title}”?`)) return
    try {
      await promptRepository.deletePrompt(p.id)
      toast.success('Deleted')
      refresh()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const togglePinned = async (p) => {
    try {
      await saveMutation.mutateAsync({ ...p, pinned: !p.pinned })
      toast.success(p.pinned ? 'Unpinned' : 'Pinned — shows first')
      refresh()
    } catch (e) {
      toast.error(e.message || 'Could not update pin')
    }
  }

  const createCategory = async () => {
    try {
      await promptRepository.createCategory(categoryForm)
      toast.success('Category created')
      setCategoryForm({ name: '', description: '', contentTypes: ['image'] })
      setShowAddCategory(false)
      refresh()
    } catch (e) {
      toast.error(e.message || 'Could not create category')
    }
  }

  const deleteCategory = async (c) => {
    if (!confirm(`Delete category “${c.name}”?`)) return
    try {
      await promptRepository.deleteCategory(c.id)
      toast.success('Category deleted')
      if (selectedCategory?.id === c.id) {
        setSection('categories')
        setSelectedCategory(null)
      }
      refresh()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const categoryName = (id) => categories.find((c) => c.id === id)?.name || 'Uncategorized'

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'categories', label: 'Categories', icon: Tags },
  ]

  const Sidebar = (
    <aside className="flex h-full w-64 flex-col border-r border-[var(--border)] bg-[#0c0b14] text-[var(--fg)]">
      <div className="flex h-16 items-center gap-2 border-b border-[var(--border)] px-5">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-sm font-bold text-white">
          P
        </span>
        <div>
          <p className="font-display text-sm font-bold">Admin</p>
          <p className="text-[10px] text-[var(--muted)]">{brand.name}</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = section === item.id || (item.id === 'categories' && section === 'list')
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setSection(item.id)
                setSelectedCategory(null)
                setSidebarOpen(false)
              }}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                active
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--muted)] hover:bg-white/5 hover:text-[var(--fg)]',
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          )
        })}
        <Link
          to="/"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--muted)] hover:bg-white/5 hover:text-[var(--fg)]"
        >
          <ArrowLeft className="h-4 w-4" />
          View site
        </Link>
      </nav>
      <div className="border-t border-[var(--border)] p-4">
        <p className="truncate text-sm font-medium">{user.displayName || user.email}</p>
        <p className="truncate text-xs text-[var(--muted)]">{user.email}</p>
        <Button
          variant="ghost"
          size="sm"
          className="mt-3 w-full justify-start"
          onClick={async () => {
            await logout()
          }}
        >
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>
    </aside>
  )

  return (
    <div className="flex min-h-dvh bg-[var(--bg)]">
      <div className="hidden md:block">{Sidebar}</div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <button type="button" className="absolute inset-0 bg-black/60" aria-label="Close" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 h-full shadow-xl">{Sidebar}</div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-lg font-semibold">
              {section === 'dashboard' && 'Dashboard'}
              {section === 'categories' && 'Categories'}
              {section === 'list' && (selectedCategory?.name || 'Prompts')}
            </h1>
            <p className="text-xs text-[var(--muted)]">
              {isApiMode ? 'Live database' : 'Demo mode'} · Manage prompts & media
            </p>
          </div>
          <Button
            size="sm"
            variant="gradient"
            onClick={() =>
              setEditing(
                emptyPrompt(
                  selectedCategory && !String(selectedCategory.id).startsWith('__')
                    ? selectedCategory.id
                    : '',
                ),
              )
            }
          >
            <Plus className="h-4 w-4" /> New prompt
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {section === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: 'Total prompts', value: stats.prompts },
                  { label: 'Published', value: stats.published },
                  { label: 'Drafts', value: stats.drafts },
                  { label: 'Categories', value: stats.categories },
                ].map((card) => (
                  <div
                    key={card.label}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm"
                  >
                    <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">{card.label}</p>
                    <p className="mt-2 font-display text-3xl font-bold">{isLoading ? '—' : card.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-display font-semibold">Categories</h2>
                    <Button size="sm" variant="secondary" onClick={() => setSection('categories')}>
                      Manage
                    </Button>
                  </div>
                  <ul className="space-y-2">
                    {categoryCards.slice(0, 6).map((c) => (
                      <li key={c.id}>
                        <button
                          type="button"
                          onClick={() => openCategory(c)}
                          className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left hover:bg-[var(--surface-2)]"
                        >
                          <span className="font-medium">{c.name}</span>
                          <Badge tone="muted" className="normal-case">{c.count}</Badge>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-display font-semibold">Recent prompts</h2>
                    <Button size="sm" variant="secondary" onClick={() => openCategory(categoryCards[0])}>
                      View all
                    </Button>
                  </div>
                  <ul className="space-y-3">
                    {sortPinnedFirst(allPrompts)
                      .slice(0, 5)
                      .map((p) => (
                      <li key={p.id} className="flex items-center gap-3">
                        <button
                          type="button"
                          className="h-12 w-10 shrink-0 overflow-hidden rounded-lg ring-offset-2 transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                          aria-label={`View ${p.title} image`}
                          onClick={() => {
                            const url = resolvePreviewUrl(p.preview?.url)
                            if (url) setLightbox({ url, title: p.title })
                          }}
                        >
                          <PreviewMedia
                            preview={p.preview}
                            title={p.title}
                            showIllustrative={false}
                            fixedAspect
                            className="!h-full !rounded-lg"
                          />
                        </button>
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center gap-1 truncate text-sm font-medium">
                            {p.pinned && <Pin className="h-3 w-3 shrink-0 fill-[var(--accent)] text-[var(--accent)]" />}
                            <span className="truncate">{p.title}</span>
                          </p>
                          <p className="text-xs text-[var(--muted)]">{p.status}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setEditing({
                              ...emptyPrompt(),
                              ...p,
                              tags: p.tags || [],
                              preview: {
                                ...emptyPrompt().preview,
                                ...(p.preview || {}),
                                fit: p.preview?.fit || 'cover',
                                position: p.preview?.position || 'center',
                              },
                            })
                          }
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {section === 'categories' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-[var(--muted)]">Click a category to open its prompt list.</p>
                <Button size="sm" variant="secondary" onClick={() => setShowAddCategory((v) => !v)}>
                  {showAddCategory ? 'Cancel' : '+ Category'}
                </Button>
              </div>

              {showAddCategory && (
                <div className="max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <Label>Name</Label>
                  <Input
                    className="mb-3"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  />
                  <Label>Description</Label>
                  <Textarea
                    className="mb-3"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  />
                  <Button onClick={createCategory}>Create category</Button>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {categoryCards.map((c) => {
                  const isSpecial = c.id === '__all__' || c.id === '__none__'
                  return (
                    <div
                      key={c.id}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition hover:border-[var(--accent)]"
                    >
                      <button type="button" className="w-full p-4 text-left" onClick={() => openCategory(c)}>
                        <div className="mb-3 flex items-center justify-between">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/15 text-[var(--accent)]">
                            <FolderOpen className="h-5 w-5" />
                          </span>
                          <Badge tone="muted" className="normal-case">
                            {c.count}
                          </Badge>
                        </div>
                        <p className="font-display font-semibold">{c.name}</p>
                        <p className="mt-1 line-clamp-2 text-xs text-[var(--muted)]">{c.description || c.slug}</p>
                      </button>
                      {!isSpecial && (
                        <div className="border-t border-[var(--border)] px-2 py-1">
                          <Button size="sm" variant="ghost" className="text-[var(--danger)]" onClick={() => deleteCategory(c)}>
                            <Trash2 className="h-4 w-4" /> Delete category
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {section === 'list' && (
            <div className="space-y-4">
              <Button size="sm" variant="ghost" onClick={() => setSection('categories')}>
                <ArrowLeft className="h-4 w-4" /> All categories
              </Button>

              <div className="flex flex-wrap gap-2">
                <div className="relative min-w-[220px] flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                  <Input className="pl-9" placeholder="Search prompts…" value={q} onChange={(e) => setQ(e.target.value)} />
                </div>
                <select
                  className="min-h-11 rounded-[var(--radius-btn)] border border-[var(--border)] bg-[var(--surface)] px-3"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {['all', 'published', 'draft', 'pending', 'archived'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                <div className="hidden grid-cols-[72px_1fr_120px_100px_160px] gap-3 border-b border-[var(--border)] bg-[var(--surface-2)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)] md:grid">
                  <span>Media</span>
                  <span>Prompt</span>
                  <span>Type</span>
                  <span>Status</span>
                  <span>Actions</span>
                </div>
                {listItems.length === 0 ? (
                  <p className="px-4 py-12 text-center text-sm text-[var(--muted)]">No prompts in this list.</p>
                ) : (
                  listItems.map((p) => (
                    <div
                      key={p.id}
                      className="grid grid-cols-1 gap-3 border-t border-[var(--border)] px-4 py-3 md:grid-cols-[72px_1fr_120px_100px_160px] md:items-center"
                    >
                      <button
                        type="button"
                        className="h-16 w-14 shrink-0 overflow-hidden rounded-lg ring-offset-2 transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                        aria-label={`View ${p.title} image`}
                        onClick={() => {
                          const url = resolvePreviewUrl(p.preview?.url)
                          if (url) setLightbox({ url, title: p.title })
                        }}
                      >
                        <PreviewMedia
                          preview={p.preview}
                          title={p.title}
                          showIllustrative={false}
                          fixedAspect
                          className="!h-full !rounded-lg"
                        />
                      </button>
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 truncate font-medium">
                          {p.pinned && <Pin className="h-3.5 w-3.5 shrink-0 fill-[var(--accent)] text-[var(--accent)]" aria-label="Pinned" />}
                          <span className="truncate">{p.title}</span>
                        </p>
                        <p className="truncate text-xs text-[var(--muted)]">
                          {categoryName(p.categoryId)} · {p.slug}
                        </p>
                      </div>
                      <p className="text-sm capitalize text-[var(--muted)]">{p.contentType}</p>
                      <div className="flex flex-wrap gap-1">
                        {p.pinned && (
                          <Badge tone="pinned" className="w-fit normal-case gap-1">
                            <Pin className="h-3 w-3 fill-current" />
                            Pinned
                          </Badge>
                        )}
                        <Badge tone="muted" className="w-fit normal-case">{p.status}</Badge>
                        {(p.variables || []).length > 0 && (
                          <Badge tone="featured" className="w-fit normal-case">
                            {(p.variables || []).map((v) => v.key).join(', ')}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant={p.pinned ? 'secondary' : 'ghost'}
                          aria-label={p.pinned ? 'Unpin' : 'Pin to top'}
                          title={p.pinned ? 'Unpin' : 'Pin to top'}
                          onClick={() => togglePinned(p)}
                        >
                          <Pin className={cn('h-4 w-4', p.pinned && 'fill-current')} />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            setEditing({
                              ...emptyPrompt(),
                              ...p,
                              tags: p.tags || [],
                              preview: {
                                ...emptyPrompt().preview,
                                ...(p.preview || {}),
                                fit: p.preview?.fit || 'cover',
                                position: p.preview?.position || 'center',
                              },
                            })
                          }
                        >
                          <Pencil className="h-4 w-4" /> Edit
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => deletePrompt(p)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title || 'Image preview'}
          onClick={() => setLightbox(null)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setLightbox(null)
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 top-3 z-10 bg-black/40 text-white hover:bg-black/60"
            aria-label="Close image"
            onClick={() => setLightbox(null)}
          >
            <X className="h-5 w-5" />
          </Button>
          <img
            src={lightbox.url}
            alt={lightbox.title || ''}
            className="max-h-[90dvh] max-w-[min(96vw,1100px)] rounded-lg object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-3 sm:items-center">
          <div className="max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3">
              <h2 className="font-display text-lg font-semibold">{editing.id ? 'Edit prompt' : 'New prompt'}</h2>
              <Button variant="ghost" size="icon" aria-label="Close" onClick={() => setEditing(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="grid gap-6 p-4 md:grid-cols-2 md:p-6">
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                </div>
                <div>
                  <Label>Short description</Label>
                  <Textarea
                    className="min-h-20"
                    value={editing.shortDescription || ''}
                    onChange={(e) => setEditing({ ...editing, shortDescription: e.target.value })}
                  />
                </div>
                <div>
                  <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                    <Label>Full Prompt text</Label>
                    <div className="flex flex-wrap gap-1">
                      {personalizeFields.map((f) => (
                        <button
                          key={f.key}
                          type="button"
                          className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[11px] font-medium text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--fg)]"
                          title={`Insert {{${f.key}}} placeholder`}
                          onClick={() => {
                            const token = `{{${f.key}}}`
                            const cur = editing.promptTemplate || ''
                            setEditing({
                              ...editing,
                              promptTemplate: cur.includes(token) ? cur : `${cur}${cur ? ' ' : ''}${token}`,
                            })
                          }}
                        >
                          + {`{{${f.key}}}`}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Textarea
                    className="min-h-52"
                    value={editing.promptTemplate}
                    onChange={(e) => setEditing({ ...editing, promptTemplate: e.target.value })}
                    placeholder="Use {{name}} where the visitor’s name should appear…"
                  />
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Write prompts with <strong>Priya</strong> or <code className="text-[var(--fg)]">{'{{name}}'}</code>.
                    When a visitor types a name, both are replaced live in the prompt.
                  </p>
                </div>
                <div>
                  <Label>Ask visitor for</Label>
                  <p className="mb-2 text-xs text-[var(--muted)]">
                    Check fields to show on this prompt’s card (name, etc.). Only enabled prompts show the input.
                  </p>
                  <div className="space-y-2">
                    {personalizeFields.map((field) => {
                      const active = (editing.variables || []).some((v) => v.key === field.key)
                      const current = (editing.variables || []).find((v) => v.key === field.key)
                      return (
                        <div
                          key={field.key}
                          className={cn(
                            'rounded-xl border p-3',
                            active ? 'border-[var(--accent)]/50 bg-[var(--accent)]/5' : 'border-[var(--border)]',
                          )}
                        >
                          <label className="flex items-center gap-2 text-sm font-medium">
                            <input
                              type="checkbox"
                              checked={active}
                              onChange={(e) => {
                                const enabled = e.target.checked
                                let nextVars = [...(editing.variables || [])]
                                if (enabled) {
                                  if (!nextVars.some((v) => v.key === field.key)) {
                                    nextVars.push(buildPersonalizeVariable(field.key, field.defaultHint))
                                  }
                                } else {
                                  nextVars = nextVars.filter((v) => v.key !== field.key)
                                }
                                setEditing({ ...editing, variables: nextVars })
                              }}
                            />
                            Show {field.label} input
                          </label>
                          {active && (
                            <div className="mt-2">
                              <Label>Hint / placeholder</Label>
                              <Input
                                value={current?.placeholder || current?.help || field.defaultHint}
                                onChange={(e) => {
                                  const hint = e.target.value
                                  setEditing({
                                    ...editing,
                                    variables: (editing.variables || []).map((v) =>
                                      v.key === field.key
                                        ? { ...v, help: hint, placeholder: hint }
                                        : v,
                                    ),
                                  })
                                }}
                                placeholder={field.defaultHint}
                              />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div>
                  <Label>Tags</Label>
                  <p className="mb-2 text-xs text-[var(--muted)]">Boys, girls, couple, and other filter tags.</p>
                  <div className="flex flex-wrap gap-2">
                    {filterTags.map((tag) => {
                      const selected = (editing.tags || []).includes(tag.id)
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => {
                            const current = editing.tags || []
                            const next = selected
                              ? current.filter((id) => id !== tag.id)
                              : [...current, tag.id]
                            setEditing({ ...editing, tags: next })
                          }}
                          className={cn(
                            'rounded-full border px-3 py-1.5 text-sm font-medium transition',
                            selected
                              ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                              : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--fg)] hover:border-[var(--accent)]/60',
                          )}
                        >
                          {tag.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div>
                  <Label>Best with</Label>
                  <p className="mb-2 text-xs text-[var(--muted)]">Select the AI platforms this prompt works with.</p>
                  <div className="flex flex-wrap gap-2">
                    {supportedTools.map((tool) => {
                      const selected = (editing.supportedTools || []).includes(tool.id)
                      return (
                        <button
                          key={tool.id}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => {
                            const current = editing.supportedTools || []
                            const next = selected
                              ? current.filter((id) => id !== tool.id)
                              : [...current, tool.id]
                            setEditing({ ...editing, supportedTools: next })
                          }}
                          className={cn(
                            'rounded-full border px-3 py-1.5 text-sm font-medium transition',
                            selected
                              ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                              : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--fg)] hover:border-[var(--accent)]/60',
                          )}
                        >
                          {tool.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div>
                  <button
                    type="button"
                    aria-pressed={!!editing.pinned}
                    onClick={() => setEditing({ ...editing, pinned: !editing.pinned })}
                    className={cn(
                      'inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-btn)] border px-3 py-2.5 text-sm font-medium transition',
                      editing.pinned
                        ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                        : 'border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--accent)]/60',
                    )}
                  >
                    <Pin className={cn('h-4 w-4', editing.pinned && 'fill-current')} />
                    {editing.pinned ? 'Pinned — shows first' : 'Pin to top'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Status</Label>
                    <select
                      className="w-full min-h-11 rounded-[var(--radius-btn)] border border-[var(--border)] bg-[var(--surface)] px-3"
                      value={editing.status}
                      onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                    >
                      {['draft', 'pending', 'published', 'archived'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <select
                      className="w-full min-h-11 rounded-[var(--radius-btn)] border border-[var(--border)] bg-[var(--surface)] px-3"
                      value={editing.categoryId || ''}
                      onChange={(e) => setEditing({ ...editing, categoryId: e.target.value || null })}
                    >
                      <option value="">None</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <Label>Preview image</Label>
                <p className="text-xs text-[var(--muted)]">Same 3:4 frame as the website gallery.</p>
                <button
                  type="button"
                  className="mx-auto block w-full max-w-[280px] cursor-zoom-in rounded-[var(--radius-card)] text-left ring-offset-2 transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  aria-label="View full preview image"
                  onClick={() => {
                    const url = resolvePreviewUrl(editing.preview?.url)
                    if (url) setLightbox({ url, title: editing.title || 'Preview' })
                  }}
                >
                  <PreviewMedia
                    preview={editing.preview}
                    title={editing.title || 'Preview'}
                    showIllustrative={false}
                    fixedAspect
                  />
                </button>
                <label className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-btn)] border border-dashed border-[var(--border)] bg-[var(--surface-2)] text-sm font-medium">
                  <ImagePlus className="h-4 w-4" />
                  {uploading ? 'Uploading…' : 'Change / upload image'}
                  <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => onUpload(e.target.files?.[0])} />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Fit</Label>
                    <select
                      className="w-full min-h-11 rounded-[var(--radius-btn)] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
                      value={editing.preview?.fit || 'cover'}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          preview: { ...editing.preview, fit: e.target.value },
                        })
                      }
                    >
                      <option value="cover">Cover (crop to fill)</option>
                      <option value="contain">Contain (show full)</option>
                      <option value="fill">Stretch</option>
                    </select>
                  </div>
                  <div>
                    <Label>Focus</Label>
                    <select
                      className="w-full min-h-11 rounded-[var(--radius-btn)] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
                      value={editing.preview?.position || 'center'}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          preview: { ...editing.preview, position: e.target.value },
                        })
                      }
                    >
                      <option value="center">Center</option>
                      <option value="top">Top</option>
                      <option value="bottom">Bottom</option>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Image URL</Label>
                  <Input
                    value={editing.preview?.url || ''}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        preview: { ...editing.preview, url: e.target.value, kind: e.target.value ? 'image' : 'gradient' },
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 border-t border-[var(--border)] p-4">
              <Button className="flex-1" onClick={savePrompt} disabled={saveMutation.isPending}>Save changes</Button>
              <Button variant="secondary" className="flex-1" onClick={() => setEditing(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
