function parseJson(value, fallback) {
  if (value == null || value === '') return fallback
  if (typeof value !== 'string') return value
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

function mapPrompt(row) {
  if (!row) return null
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.shortDescription,
    contentType: row.contentType,
    categoryId: row.categoryId,
    tags: parseJson(row.tags, []),
    language: row.language,
    promptTemplate: row.promptTemplate,
    negativePrompt: row.negativePrompt,
    variables: parseJson(row.variables, []),
    preview: {
      kind: row.previewKind || (row.previewUrl ? 'image' : 'gradient'),
      url: row.previewUrl || null,
      gradient: row.previewGradient || 'preview-gradient-1',
      alt: row.previewAlt || row.title,
      width: row.previewWidth || 800,
      height: row.previewHeight || 1000,
      format: row.previewFormat || (row.previewUrl ? 'photo' : 'illustrative'),
      poster: null,
      duration: null,
      label: row.previewLabel || null,
      fit: row.previewFit || 'cover',
      position: row.previewPosition || 'center',
    },
    pairedBeforeAfter: null,
    supportedTools: parseJson(row.supportedTools, []),
    requiresReferenceImage: !!row.requiresReferenceImage,
    supportedAspectRatios: parseJson(row.supportedAspectRatios, ['1:1', '3:4', '16:9']),
    usageSteps: {
      en: parseJson(row.usageStepsEn, []),
      hi: parseJson(row.usageStepsHi, []),
    },
    tips: {
      en: parseJson(row.tipsEn, []),
      hi: parseJson(row.tipsHi, []),
    },
    authorId: row.authorId || 'editorial',
    attribution: row.attribution || '',
    status: row.status,
    publishedAt: row.publishedAt ? new Date(row.publishedAt).toISOString() : null,
    updatedAt: row.updatedAt ? new Date(row.updatedAt).toISOString() : null,
    featured: !!row.featured,
    pinned: !!row.pinned,
    badge: row.badge || null,
    metrics: { views: row.views || 0, copies: row.copies || 0, saves: row.saves || 0 },
    demoMetrics: null,
  }
}

function mapCategory(row, count) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description || '',
    contentTypes: parseJson(row.contentTypes, ['image']),
    count: count ?? undefined,
  }
}

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80)
}

module.exports = { mapPrompt, mapCategory, parseJson, slugify }
