const express = require('express')
const { prisma } = require('../prisma')
const { mapPrompt, slugify } = require('../mappers')
const { requireAdmin } = require('../auth')

const router = express.Router()

function buildWhere(query) {
  const where = {}
  const status = query.status || 'published'
  if (status !== 'all') where.status = status
  if (query.contentType && query.contentType !== 'all') where.contentType = query.contentType
  if (query.category) {
    where.AND = [
      ...(where.AND || []),
      {
        OR: [
          { categoryId: query.category },
          { category: { slug: query.category } },
          { tags: { contains: `"${query.category}"` } },
          { tags: { contains: query.category } },
        ],
      },
    ]
  }
  if (query.tag) {
    const tag = String(query.tag).toLowerCase().trim()
    where.AND = [
      ...(where.AND || []),
      {
        OR: [
          { tags: { contains: `"${tag}"` } },
          { tags: { contains: tag } },
          { category: { slug: tag } },
          { title: { contains: tag } },
          { slug: { contains: tag } },
        ],
      },
    ]
  }
  if (query.featured === 'true' || query.featured === true) where.featured = true
  if (query.tool) where.supportedTools = { contains: `"${query.tool}"` }
  if (query.aspect) where.supportedAspectRatios = { contains: query.aspect }
  if (query.ref === '1' || query.requiresReferenceImage === 'true') where.requiresReferenceImage = true
  if (query.q) {
    const q = String(query.q)
    where.AND = [
      ...(where.AND || []),
      {
        OR: [
          { title: { contains: q } },
          { shortDescription: { contains: q } },
          { promptTemplate: { contains: q } },
          { tags: { contains: q } },
          { slug: { contains: q } },
        ],
      },
    ]
  }
  return where
}

function sortOrder(sort) {
  // Pinned always first (all pinned rows, then the rest)
  const pinFirst = [{ pinned: 'desc' }, { updatedAt: 'desc' }]
  switch (sort) {
    case 'newest':
      return [...pinFirst, { publishedAt: 'desc' }, { createdAt: 'desc' }]
    case 'most_copied':
      return [...pinFirst, { copies: 'desc' }]
    case 'most_saved':
      return [...pinFirst, { saves: 'desc' }]
    case 'curated':
    default:
      return [...pinFirst, { featured: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }]
  }
}

router.get('/', async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 24, 200)
    const cursor = Number(req.query.cursor) || 0
    const where = buildWhere(req.query)
    const [total, rows] = await Promise.all([
      prisma.prompt.count({ where }),
      prisma.prompt.findMany({
        where,
        orderBy: sortOrder(req.query.sort),
        skip: cursor,
        take: limit,
      }),
    ])
    res.json({
      items: rows.map(mapPrompt),
      total,
      nextCursor: cursor + limit < total ? cursor + limit : null,
    })
  } catch (e) {
    next(e)
  }
})

router.get('/:slug', async (req, res, next) => {
  try {
    const row = await prisma.prompt.findFirst({
      where: {
        OR: [{ slug: req.params.slug }, { id: req.params.slug }],
      },
    })
    if (!row) return res.status(404).json({ error: 'Not found' })
    res.json(mapPrompt(row))
  } catch (e) {
    next(e)
  }
})

router.get('/:id/related', async (req, res, next) => {
  try {
    const prompt = await prisma.prompt.findFirst({
      where: { OR: [{ id: req.params.id }, { slug: req.params.id }] },
    })
    if (!prompt) return res.status(404).json({ error: 'Not found' })
    const rows = await prisma.prompt.findMany({
      where: {
        status: 'published',
        id: { not: prompt.id },
        OR: [
          { contentType: prompt.contentType },
          { categoryId: prompt.categoryId || undefined },
        ],
      },
      take: 8,
      orderBy: { featured: 'desc' },
    })
    res.json(rows.map(mapPrompt))
  } catch (e) {
    next(e)
  }
})

router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const body = req.body || {}
    const title = body.title?.trim()
    if (!title || !body.promptTemplate?.trim()) {
      return res.status(400).json({ error: 'title and promptTemplate are required' })
    }
    let slug = body.slug?.trim() || slugify(title)
    const exists = await prisma.prompt.findUnique({ where: { slug } })
    if (exists) slug = `${slug}-${Date.now().toString(36)}`

    const row = await prisma.prompt.create({
      data: {
        slug,
        title,
        shortDescription: body.shortDescription || '',
        contentType: body.contentType || 'image',
        categoryId: body.categoryId || null,
        tags: JSON.stringify(body.tags || []),
        language: body.language || 'en',
        promptTemplate: body.promptTemplate,
        negativePrompt: body.negativePrompt || null,
        variables: JSON.stringify(body.variables || []),
        previewUrl: body.preview?.url || body.previewUrl || null,
        previewAlt: body.preview?.alt || title,
        previewWidth: body.preview?.width || 800,
        previewHeight: body.preview?.height || 1000,
        previewGradient: body.preview?.gradient || 'preview-gradient-1',
        previewKind: body.preview?.kind || (body.preview?.url || body.previewUrl ? 'image' : 'gradient'),
        previewFormat: body.preview?.format || (body.preview?.url || body.previewUrl ? 'photo' : 'illustrative'),
        previewLabel: body.preview?.label || null,
        previewFit: body.preview?.fit || 'cover',
        previewPosition: body.preview?.position || 'center',
        supportedTools: JSON.stringify(body.supportedTools || ['chatgpt']),
        requiresReferenceImage: !!body.requiresReferenceImage,
        supportedAspectRatios: JSON.stringify(body.supportedAspectRatios || ['1:1', '3:4', '16:9']),
        usageStepsEn: JSON.stringify(body.usageSteps?.en || []),
        usageStepsHi: JSON.stringify(body.usageSteps?.hi || []),
        tipsEn: JSON.stringify(body.tips?.en || []),
        tipsHi: JSON.stringify(body.tips?.hi || []),
        attribution: body.attribution || '',
        status: body.status || 'draft',
        featured: !!body.featured,
        pinned: !!body.pinned,
        badge: body.badge || null,
        authorId: req.user.id,
        publishedAt: body.status === 'published' ? new Date() : null,
      },
    })
    res.status(201).json(mapPrompt(row))
  } catch (e) {
    next(e)
  }
})

router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const existing = await prisma.prompt.findUnique({ where: { id: req.params.id } })
    if (!existing) return res.status(404).json({ error: 'Not found' })
    const body = req.body || {}
    const data = {}
    const fields = [
      'title',
      'shortDescription',
      'contentType',
      'categoryId',
      'language',
      'promptTemplate',
      'negativePrompt',
      'requiresReferenceImage',
      'attribution',
      'status',
      'featured',
      'pinned',
      'badge',
      'previewAlt',
      'previewWidth',
      'previewHeight',
      'previewGradient',
      'previewKind',
      'previewFormat',
      'previewLabel',
      'previewUrl',
    ]
    for (const f of fields) {
      if (body[f] !== undefined) data[f] = body[f]
    }
    if (body.pinned !== undefined) data.pinned = !!body.pinned
    if (body.featured !== undefined) data.featured = !!body.featured
    if (body.attribution !== undefined) data.attribution = body.attribution || ''
    if (body.slug) data.slug = body.slug
    if (body.tags !== undefined) data.tags = JSON.stringify(body.tags || [])
    if (body.variables !== undefined) data.variables = JSON.stringify(body.variables || [])
    if (body.supportedTools) data.supportedTools = JSON.stringify(body.supportedTools)
    if (body.supportedAspectRatios) data.supportedAspectRatios = JSON.stringify(body.supportedAspectRatios)
    if (body.usageSteps?.en) data.usageStepsEn = JSON.stringify(body.usageSteps.en)
    if (body.usageSteps?.hi) data.usageStepsHi = JSON.stringify(body.usageSteps.hi)
    if (body.tips?.en) data.tipsEn = JSON.stringify(body.tips.en)
    if (body.tips?.hi) data.tipsHi = JSON.stringify(body.tips.hi)
    if (body.preview) {
      if (body.preview.url !== undefined) data.previewUrl = body.preview.url
      if (body.preview.alt !== undefined) data.previewAlt = body.preview.alt
      if (body.preview.width !== undefined) data.previewWidth = body.preview.width
      if (body.preview.height !== undefined) data.previewHeight = body.preview.height
      if (body.preview.gradient !== undefined) data.previewGradient = body.preview.gradient
      if (body.preview.kind !== undefined) data.previewKind = body.preview.kind
      if (body.preview.format !== undefined) data.previewFormat = body.preview.format
      if (body.preview.label !== undefined) data.previewLabel = body.preview.label
      if (body.preview.fit !== undefined) data.previewFit = body.preview.fit || 'cover'
      if (body.preview.position !== undefined) data.previewPosition = body.preview.position || 'center'
    }
    if (data.status === 'published' && !existing.publishedAt) data.publishedAt = new Date()
    const row = await prisma.prompt.update({ where: { id: existing.id }, data })
    res.json(mapPrompt(row))
  } catch (e) {
    next(e)
  }
})

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    await prisma.prompt.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
})

router.post('/:id/events', async (req, res, next) => {
  try {
    const type = req.body?.type
    const field = type === 'view' ? 'views' : type === 'copy' ? 'copies' : type === 'save' ? 'saves' : null
    if (!field) return res.status(400).json({ error: 'Invalid event' })
    await prisma.prompt.update({
      where: { id: req.params.id },
      data: { [field]: { increment: 1 } },
    })
    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
})

module.exports = router
