import { useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
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

const emptyPrompt = () => ({
  id: '',
  title: '',
  slug: '',
  shortDescription: '',
  contentType: 'image',
  categoryId: '',
  promptTemplate: '',
  negativePrompt: '',
  tags: [],
  status: 'draft',
  featured: false,
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
  },
})

export function AdminPage() {
  const user = useAuthStore((s) => s.user)
  const isAdmin = useAuthStore((s) => s.isAdmin)
  const [tab, setTab] = useState('prompts')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [editing, setEditing] = useState(null)
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', contentTypes: ['image'] })
  const [uploading, setUploading] = useState(false)
  const toast = useToast()
  const qc = useQueryClient()
  const saveMutation = useSavePromptMutation()
  const { data: categories = [] } = useCategories()

  const { data } = useAdminPrompts({ q, status: 'all', limit: 200, sort: 'newest' })
  const items = useMemo(() => {
    let list = data?.items || []
    if (status !== 'all') list = list.filter((p) => p.status === status)
    if (q) {
      const n = q.toLowerCase()
      list = list.filter((p) => p.title.toLowerCase().includes(n) || p.slug.includes(n))
    }
    return list
  }, [data, q, status])

  if (!user || !isAdmin()) {
    return <Navigate to="/login" replace />
  }

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['prompts'] })
    qc.invalidateQueries({ queryKey: ['admin-prompts'] })
    qc.invalidateQueries({ queryKey: ['categories'] })
    qc.invalidateQueries({ queryKey: ['prompt'] })
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
      toast.error(e.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const savePrompt = async () => {
    try {
      const payload = {
        ...editing,
        tags: Array.isArray(editing.tags)
          ? editing.tags
          : String(editing.tags || '')
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean),
        previewUrl: editing.preview?.url,
      }
      await saveMutation.mutateAsync(payload)
      toast.success('Prompt saved to database')
      setEditing(null)
      refresh()
    } catch (e) {
      toast.error(e.message || 'Save failed')
    }
  }

  const createCategory = async () => {
    try {
      await promptRepository.createCategory(categoryForm)
      toast.success('Category created')
      setCategoryForm({ name: '', description: '', contentTypes: ['image'] })
      refresh()
    } catch (e) {
      toast.error(e.message || 'Could not create category')
    }
  }

  return (
    <div className="min-h-dvh bg-[var(--bg)] px-3 py-4 sm:px-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Link to="/" className="text-sm text-[var(--accent)]">
          ← Back to site
        </Link>
        <Badge tone={isApiMode ? 'featured' : 'demo'} className="normal-case">
          {isApiMode ? 'Connected to database API' : 'Local demo only'}
        </Badge>
      </div>
      <h1 className="font-display text-2xl font-bold">Admin</h1>
      <p className="text-sm text-[var(--muted)]">
        Add prompts, upload preview photos, and manage categories. Sign in as admin@admin.local / admin123
      </p>

      <div className="mt-4 flex gap-2">
        {['prompts', 'categories'].map((t) => (
          <Button key={t} variant={tab === t ? 'default' : 'secondary'} size="sm" onClick={() => setTab(t)}>
            {t === 'prompts' ? 'Prompts' : 'Categories'}
          </Button>
        ))}
        <Button
          size="sm"
          variant="gradient"
          onClick={() => setEditing(emptyPrompt())}
        >
          + New prompt
        </Button>
      </div>

      {tab === 'prompts' && (
        <>
          <div className="mt-4 flex flex-wrap gap-2">
            <Input placeholder="Search title or slug" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
            <select
              className="min-h-11 rounded-[var(--radius-btn)] border border-[var(--border)] bg-[var(--surface)] px-3"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {['all', 'published', 'draft', 'pending', 'archived'].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 overflow-x-auto rounded-[var(--radius-card)] border border-[var(--border)]">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[var(--surface-2)] text-xs uppercase text-[var(--muted)]">
                <tr>
                  <th className="px-3 py-2">Preview</th>
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="border-t border-[var(--border)]">
                    <td className="px-3 py-2">
                      <div className="h-14 w-10 overflow-hidden rounded-md">
                        <PreviewMedia preview={p.preview} title={p.title} showIllustrative={false} className="!rounded-md" />
                      </div>
                    </td>
                    <td className="px-3 py-2 font-medium">{p.title}</td>
                    <td className="px-3 py-2">{p.contentType}</td>
                    <td className="px-3 py-2">{p.status}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => setEditing({ ...emptyPrompt(), ...p, tags: p.tags || [] })}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={async () => {
                            if (!confirm('Delete this prompt?')) return
                            try {
                              await promptRepository.deletePrompt(p.id)
                              toast.success('Deleted')
                              refresh()
                            } catch (e) {
                              toast.error(e.message)
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'categories' && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4">
            <h2 className="font-display text-lg font-semibold">Add category</h2>
            <div className="mt-3 space-y-3">
              <div>
                <Label>Name</Label>
                <Input value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                />
              </div>
              <Button onClick={createCategory}>Create category</Button>
            </div>
          </div>
          <ul className="space-y-2">
            {categories.map((c) => (
              <li key={c.id} className="flex items-center justify-between rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] px-3 py-3">
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {c.slug} · {c.count ?? 0} prompts
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    if (!confirm(`Delete category “${c.name}”?`)) return
                    try {
                      await promptRepository.deleteCategory(c.id)
                      toast.success('Category deleted')
                      refresh()
                    } catch (e) {
                      toast.error(e.message)
                    }
                  }}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-3 sm:items-center">
          <div className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4">
            <h2 className="font-display text-lg font-semibold">{editing.id ? 'Edit prompt' : 'New prompt'}</h2>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <Label>Title</Label>
                  <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                </div>
                <div>
                  <Label>Slug (optional)</Label>
                  <Input value={editing.slug || ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
                </div>
                <div>
                  <Label>Short description</Label>
                  <Textarea
                    value={editing.shortDescription || ''}
                    onChange={(e) => setEditing({ ...editing, shortDescription: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Type</Label>
                    <select
                      className="w-full min-h-11 rounded-[var(--radius-btn)] border border-[var(--border)] bg-[var(--surface)] px-3"
                      value={editing.contentType}
                      onChange={(e) => setEditing({ ...editing, contentType: e.target.value })}
                    >
                      {['image', 'video', 'work'].map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <select
                      className="w-full min-h-11 rounded-[var(--radius-btn)] border border-[var(--border)] bg-[var(--surface)] px-3"
                      value={editing.status}
                      onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                    >
                      {['draft', 'pending', 'published', 'archived'].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
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
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Tags (comma separated)</Label>
                  <Input
                    value={Array.isArray(editing.tags) ? editing.tags.join(', ') : editing.tags || ''}
                    onChange={(e) => setEditing({ ...editing, tags: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Prompt template</Label>
                  <Textarea
                    className="min-h-40"
                    value={editing.promptTemplate}
                    onChange={(e) => setEditing({ ...editing, promptTemplate: e.target.value })}
                  />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!editing.featured}
                    onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                  />
                  Featured
                </label>
              </div>

              <div className="space-y-3">
                <Label>Preview image</Label>
                <PreviewMedia preview={editing.preview} title={editing.title || 'Preview'} />
                <Input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={(e) => onUpload(e.target.files?.[0])}
                />
                <div>
                  <Label>Or image URL</Label>
                  <Input
                    value={editing.preview?.url || ''}
                    placeholder="https://… or /uploads/…"
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        preview: { ...editing.preview, url: e.target.value, kind: e.target.value ? 'image' : 'gradient' },
                      })
                    }
                  />
                </div>
                <p className="text-xs text-[var(--muted)]">
                  Upload stores the file on the server (`/uploads`). Set status to <strong>published</strong> to show it on Explore.
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button className="flex-1" onClick={savePrompt} disabled={saveMutation.isPending}>
                Save to database
              </Button>
              <Button variant="secondary" className="flex-1" onClick={() => setEditing(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
