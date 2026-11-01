import { prompts as seedPrompts } from '@/data/prompts'
import { categories } from '@/data/categories'
import { collections as seedCollections } from '@/data/collections'

const STORAGE_KEY = 'promptora-demo-prompts-v2'

function loadPrompts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length) return parsed
    }
  } catch {
    /* ignore */
  }
  return structuredClone(seedPrompts)
}

let prompts = typeof window !== 'undefined' ? loadPrompts() : structuredClone(seedPrompts)
let collections = structuredClone(seedCollections)

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts))
  } catch {
    /* ignore quota */
  }
}

function delay(ms = 120) {
  return new Promise((r) => setTimeout(r, ms))
}

function normalize(s = '') {
  return s.toLowerCase().normalize('NFKD')
}

/** Lightweight fuzzy: substring + simple typo tolerance via includes of tokens */
function fuzzyMatch(haystack, needle) {
  const h = normalize(haystack)
  const n = normalize(needle).trim()
  if (!n) return true
  if (h.includes(n)) return true
  const tokens = n.split(/\s+/).filter(Boolean)
  return tokens.every((t) => {
    if (h.includes(t)) return true
    if (t.length < 4) return false
    for (let i = 0; i < h.length - t.length + 1; i++) {
      let miss = 0
      for (let j = 0; j < t.length; j++) {
        if (h[i + j] !== t[j]) miss++
        if (miss > 1) break
      }
      if (miss <= 1) return true
    }
    return false
  })
}

function sortWithinGroup(list, sort) {
  const copy = [...list]
  switch (sort) {
    case 'newest':
      return copy.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    case 'most_copied':
      return copy.sort(
        (a, b) =>
          (b.demoMetrics?.copies || b.metrics?.copies || 0) -
          (a.demoMetrics?.copies || a.metrics?.copies || 0),
      )
    case 'most_saved':
      return copy.sort(
        (a, b) =>
          (b.demoMetrics?.saves || b.metrics?.saves || 0) -
          (a.demoMetrics?.saves || a.metrics?.saves || 0),
      )
    case 'curated':
    default:
      return copy.sort((a, b) => {
        const score = (p) => {
          let s = 0
          if (p.featured || p.badge === 'featured') s += 40
          if (p.badge === 'curated') s += 25
          if (p.badge === 'new') s += 10
          if (p.contentType === 'image') s += 8
          else if (p.contentType === 'video') s += 4
          return s
        }
        const diff = score(b) - score(a)
        if (diff) return diff
        return new Date(b.publishedAt) - new Date(a.publishedAt)
      })
  }
}

function sortPrompts(list, sort) {
  const pinned = sortWithinGroup(
    list.filter((p) => p.pinned),
    sort,
  )
  const rest = sortWithinGroup(
    list.filter((p) => !p.pinned),
    sort,
  )
  return [...pinned, ...rest]
}

function filterPrompts(params = {}) {
  const {
    contentType,
    category,
    tag,
    tool,
    aspect,
    q,
    requiresReferenceImage,
    featured,
    status = 'published',
  } = params

  return prompts.filter((p) => {
    if (status && p.status !== status && status !== 'all') return false
    if (contentType && contentType !== 'all' && p.contentType !== contentType) return false
    if (category) {
      const cat = categories.find((c) => c.slug === category || c.id === category)
      const catId = cat?.id || category
      const inPrimary = p.categoryId === catId
      const inExtra = Array.isArray(p.categoryIds) && p.categoryIds.includes(catId)
      const inTags = Array.isArray(p.tags) && (p.tags.includes(category) || p.tags.includes(cat?.slug))
      if (!inPrimary && !inExtra && !inTags) return false
    }
    if (tag) {
      const t = String(tag).toLowerCase()
      const cat = categories.find((c) => c.id === p.categoryId)
      const hit =
        (p.tags || []).some((x) => String(x).toLowerCase() === t || String(x).toLowerCase().includes(t)) ||
        cat?.slug === t ||
        (p.categoryIds || []).some((id) => id === `cat_${t}` || id.replace(/^cat_/, '').replace(/_/g, '-') === t) ||
        normalize(p.title).includes(t) ||
        normalize(p.slug).includes(t)
      if (!hit) return false
    }
    if (tool && !p.supportedTools.includes(tool)) return false
    if (aspect && !p.supportedAspectRatios.includes(aspect)) return false
    if (requiresReferenceImage === true && !p.requiresReferenceImage) return false
    if (requiresReferenceImage === false && p.requiresReferenceImage) return false
    if (featured && !p.featured) return false
    if (q) {
      const blob = [p.title, p.shortDescription, p.promptTemplate, ...(p.tags || [])].join(' ')
      const catName = categories.find((c) => c.id === p.categoryId)?.name || ''
      if (!fuzzyMatch(`${blob} ${catName}`, q)) return false
    }
    return true
  })
}

export const demoRepository = {
  async listPrompts(params = {}) {
    await delay()
    const { sort = 'curated', cursor = 0, limit = 24 } = params
    const filtered = sortPrompts(filterPrompts(params), sort)
    const start = Number(cursor) || 0
    const slice = filtered.slice(start, start + limit)
    const nextCursor = start + limit < filtered.length ? start + limit : null
    return {
      items: slice,
      total: filtered.length,
      nextCursor,
    }
  },

  async getPromptBySlug(slug) {
    await delay()
    return prompts.find((p) => p.slug === slug) || null
  },

  async getPromptById(id) {
    await delay()
    return prompts.find((p) => p.id === id) || null
  },

  async getRelated(prompt, limit = 8) {
    await delay()
    return prompts
      .filter(
        (p) =>
          p.id !== prompt.id &&
          p.status === 'published' &&
          (p.contentType === prompt.contentType ||
            p.categoryId === prompt.categoryId ||
            p.tags.some((t) => prompt.tags.includes(t))),
      )
      .slice(0, limit)
  },

  async listCategories({ includeAll = false } = {}) {
    await delay(40)
    return categories.map((c) => ({
      ...c,
      count: prompts.filter((p) => {
        if (!includeAll && p.status !== 'published') return false
        if (p.categoryId === c.id) return true
        if (Array.isArray(p.categoryIds) && p.categoryIds.includes(c.id)) return true
        if (Array.isArray(p.tags) && (p.tags.includes(c.slug) || p.tags.includes(c.id))) return true
        return false
      }).length,
    }))
  },

  async getCategory(slug) {
    await delay(40)
    return categories.find((c) => c.slug === slug) || null
  },

  async listCollections() {
    await delay(40)
    return collections
  },

  async getCollection(slug) {
    await delay(40)
    const col = collections.find((c) => c.slug === slug)
    if (!col) return null
    return {
      ...col,
      prompts: col.promptIds.map((id) => prompts.find((p) => p.id === id)).filter(Boolean),
    }
  },

  async searchSuggestions(q) {
    await delay(60)
    if (!q || q.length < 1) return []
    const hits = filterPrompts({ q, status: 'published' }).slice(0, 6)
    const catHits = categories
      .filter((c) => fuzzyMatch(c.name, q))
      .slice(0, 3)
      .map((c) => ({ type: 'category', label: c.name, slug: c.slug }))
    return [
      ...catHits,
      ...hits.map((p) => ({ type: 'prompt', label: p.title, slug: p.slug, contentType: p.contentType })),
    ]
  },

  async savePrompt(prompt) {
    await delay(80)
    const idx = prompts.findIndex((p) => p.id === prompt.id)
    if (idx >= 0) prompts[idx] = { ...prompts[idx], ...prompt, updatedAt: new Date().toISOString() }
    else prompts.unshift({ ...prompt, id: prompt.id || `p_${Date.now()}` })
    persist()
    return prompts.find((p) => p.id === prompt.id) || prompts[0]
  },

  async createPrompt(partial) {
    const prompt = {
      metrics: { views: 0, copies: 0, saves: 0 },
      demoMetrics: null,
      badge: null,
      featured: false,
      pinned: false,
      status: 'draft',
      language: 'en',
      tags: [],
      variables: [],
      negativePrompt: null,
      pairedBeforeAfter: null,
      requiresReferenceImage: false,
      supportedAspectRatios: ['1:1', '3:4', '16:9'],
      supportedTools: ['chatgpt'],
      usageSteps: { en: [], hi: [] },
      tips: { en: [], hi: [] },
      authorId: 'admin-demo',
      attribution: 'Demo admin entry',
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preview: {
        kind: 'gradient',
        gradient: 'preview-gradient-1',
        alt: partial.title || 'Preview',
        width: 800,
        height: 1000,
        format: 'illustrative',
        poster: null,
        duration: null,
        label: null,
      },
      ...partial,
      id: partial.id || `p_${Date.now()}`,
      slug: partial.slug || `draft-${Date.now()}`,
    }
    prompts.unshift(prompt)
    persist()
    return prompt
  },

  async deletePrompt(id) {
    prompts = prompts.filter((p) => p.id !== id)
    persist()
  },

  async resetToSeed() {
    prompts = structuredClone(seedPrompts)
    collections = structuredClone(seedCollections)
    persist()
  },

  async recordEvent(type, promptId) {
    const p = prompts.find((x) => x.id === promptId)
    if (!p) return
    if (!p.demoMetrics) p.demoMetrics = { views: 0, copies: 0, saves: 0 }
    if (type === 'view') p.demoMetrics.views += 1
    if (type === 'copy') p.demoMetrics.copies += 1
    if (type === 'save') p.demoMetrics.saves += 1
    persist()
  },
}

/** Swap this export in Phase 2 for an HTTP repository. */
export const promptRepository = demoRepository
