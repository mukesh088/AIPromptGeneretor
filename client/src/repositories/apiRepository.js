const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

function authHeaders() {
  const token = localStorage.getItem('promptora_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...authHeaders(),
      ...(options.headers || {}),
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || res.statusText || 'Request failed')
  return data
}

function toQuery(params = {}) {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '' || v === false) return
    if (k === 'requiresReferenceImage' && v === true) q.set('ref', '1')
    else if (k === 'contentType') q.set('contentType', v)
    else if (k === 'featured' && v) q.set('featured', 'true')
    else q.set(k, String(v))
  })
  const s = q.toString()
  return s ? `?${s}` : ''
}

export const apiRepository = {
  async listPrompts(params = {}) {
    return request(`/api/prompts${toQuery(params)}`)
  },

  async getPromptBySlug(slug) {
    return request(`/api/prompts/${encodeURIComponent(slug)}`)
  },

  async getPromptById(id) {
    return request(`/api/prompts/${encodeURIComponent(id)}`)
  },

  async getRelated(prompt, limit = 8) {
    const data = await request(`/api/prompts/${encodeURIComponent(prompt.id)}/related`)
    return Array.isArray(data) ? data.slice(0, limit) : []
  },

  async listCategories() {
    return request('/api/categories')
  },

  async getCategory(slug) {
    return request(`/api/categories/${encodeURIComponent(slug)}`)
  },

  async listCollections() {
    try {
      return await request('/api/collections')
    } catch {
      return []
    }
  },

  async getCollection(slug) {
    return request(`/api/collections/${encodeURIComponent(slug)}`)
  },

  async searchSuggestions(q) {
    return request(`/api/search/suggestions${toQuery({ q })}`)
  },

  async savePrompt(prompt) {
    if (prompt.id && !String(prompt.id).startsWith('p_new')) {
      return request(`/api/prompts/${prompt.id}`, {
        method: 'PUT',
        body: JSON.stringify(prompt),
      })
    }
    return request('/api/prompts', {
      method: 'POST',
      body: JSON.stringify(prompt),
    })
  },

  async createPrompt(partial) {
    return request('/api/prompts', {
      method: 'POST',
      body: JSON.stringify(partial),
    })
  },

  async deletePrompt(id) {
    return request(`/api/prompts/${id}`, { method: 'DELETE' })
  },

  async createCategory(data) {
    return request('/api/categories', { method: 'POST', body: JSON.stringify(data) })
  },

  async updateCategory(id, data) {
    return request(`/api/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) })
  },

  async deleteCategory(id) {
    return request(`/api/categories/${id}`, { method: 'DELETE' })
  },

  async uploadImage(file) {
    const form = new FormData()
    form.append('file', file)
    return request('/api/uploads', { method: 'POST', body: form })
  },

  async resetToSeed() {
    throw new Error('Reset seed from the server: npm run db:setup')
  },

  async recordEvent(type, promptId) {
    try {
      await request(`/api/prompts/${promptId}/events`, {
        method: 'POST',
        body: JSON.stringify({ type }),
      })
    } catch {
      /* ignore analytics failures */
    }
  },

  async login({ email, password }) {
    const data = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    if (data.token) localStorage.setItem('promptora_token', data.token)
    return data.user
  },

  async register({ email, password, displayName }) {
    const data = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName }),
    })
    if (data.token) localStorage.setItem('promptora_token', data.token)
    return data.user
  },

  async me() {
    const data = await request('/api/auth/me')
    return data.user
  },

  async logout() {
    localStorage.removeItem('promptora_token')
    try {
      await request('/api/auth/logout', { method: 'POST', body: '{}' })
    } catch {
      /* ignore */
    }
  },
}

export function apiBaseUrl() {
  return BASE
}
