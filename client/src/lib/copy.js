/** Sample names commonly used in prompt templates — swapped when user enters a real name. */
export const SAMPLE_NAMES = ['Priya', 'Aisha', 'Ananya', 'Riya', 'Neha', 'Rahul', 'Aarav', 'Kabir']

export async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return { ok: true }
    }
  } catch {
    /* fall through */
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok ? { ok: true } : { ok: false, error: 'Copy failed' }
  } catch (e) {
    return { ok: false, error: e?.message || 'Copy failed' }
  }
}

export async function shareOrCopyLink({ title, text, url }) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url })
      return { ok: true, method: 'share' }
    } catch (e) {
      if (e?.name === 'AbortError') return { ok: false, aborted: true }
    }
  }
  const result = await copyText(url)
  return { ...result, method: 'copy' }
}

function matchNameCase(sampleMatch, replacement) {
  const name = String(replacement).trim()
  if (!name) return sampleMatch
  if (sampleMatch === sampleMatch.toUpperCase()) return name.toUpperCase()
  if (sampleMatch[0] === sampleMatch[0].toUpperCase()) {
    return name.charAt(0).toUpperCase() + name.slice(1)
  }
  return name.toLowerCase()
}

/**
 * Build the final prompt:
 * - replaces {{name}}, {{city}}, etc.
 * - if a name is entered, also replaces sample names like "Priya" in the text
 */
export function resolvePrompt(template = '', values = {}) {
  let out = String(template || '').replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const v = values[key]
    return v != null && String(v).trim() !== '' ? String(v).trim() : `{{${key}}}`
  })

  const enteredName = values.name != null ? String(values.name).trim() : ''
  if (enteredName) {
    const pattern = new RegExp(`\\b(${SAMPLE_NAMES.map(escapeRegExp).join('|')})\\b`, 'gi')
    out = out.replace(pattern, (match) => matchNameCase(match, enteredName))
  }

  return out
}

function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function extractVariables(template = '') {
  const matches = [...String(template).matchAll(/\{\{(\w+)\}\}/g)]
  return [...new Set(matches.map((m) => m[1]))]
}

export function hasUnresolvedRequired(template, values, variables = []) {
  const required = variables.filter((v) => v.required !== false).map((v) => v.key)
  const keys = required.length ? required : extractVariables(template)
  return keys.filter((key) => {
    const v = values[key]
    return v == null || String(v).trim() === ''
  })
}
