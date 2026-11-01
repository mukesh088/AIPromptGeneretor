const express = require('express')
const { prisma } = require('../prisma')
const { mapPrompt, slugify } = require('../mappers')
const { requireAdmin } = require('../auth')

const router = express.Router()

function mapCollection(row, { withPrompts = false } = {}) {
  if (!row) return null
  const promptIds = (row.items || []).map((i) => i.promptId)
  const base = {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description || '',
    coverGradient: row.coverGradient || 'preview-gradient-1',
    coverUrl: row.coverUrl || null,
    featured: !!row.featured,
    sortOrder: row.sortOrder ?? 0,
    promptIds,
    promptCount: row.items?.length ?? promptIds.length,
  }
  if (withPrompts) {
    base.prompts = (row.items || [])
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((i) => mapPrompt(i.prompt))
      .filter(Boolean)
  }
  return base
}

router.get('/', async (_req, res, next) => {
  try {
    const rows = await prisma.collection.findMany({
      orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { title: 'asc' }],
      include: { items: { select: { promptId: true } } },
    })
    res.json(rows.map((r) => mapCollection(r)))
  } catch (e) {
    next(e)
  }
})

router.get('/:slug', async (req, res, next) => {
  try {
    const row = await prisma.collection.findFirst({
      where: { OR: [{ slug: req.params.slug }, { id: req.params.slug }] },
      include: {
        items: {
          orderBy: { sortOrder: 'asc' },
          include: { prompt: true },
        },
      },
    })
    if (!row) return res.status(404).json({ error: 'Not found' })
    res.json(mapCollection(row, { withPrompts: true }))
  } catch (e) {
    next(e)
  }
})

router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const title = req.body?.title?.trim()
    if (!title) return res.status(400).json({ error: 'title required' })
    let slug = req.body.slug?.trim() || slugify(title)
    const exists = await prisma.collection.findUnique({ where: { slug } })
    if (exists) slug = `${slug}-${Date.now().toString(36)}`
    const row = await prisma.collection.create({
      data: {
        slug,
        title,
        description: req.body.description || '',
        coverGradient: req.body.coverGradient || 'preview-gradient-1',
        coverUrl: req.body.coverUrl || null,
        featured: !!req.body.featured,
        sortOrder: Number(req.body.sortOrder) || 0,
      },
      include: { items: true },
    })
    res.status(201).json(mapCollection(row))
  } catch (e) {
    next(e)
  }
})

router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const data = {}
    ;['title', 'slug', 'description', 'coverGradient', 'coverUrl'].forEach((k) => {
      if (req.body[k] !== undefined) data[k] = req.body[k]
    })
    if (req.body.featured !== undefined) data.featured = !!req.body.featured
    if (req.body.sortOrder !== undefined) data.sortOrder = Number(req.body.sortOrder) || 0
    const row = await prisma.collection.update({
      where: { id: req.params.id },
      data,
      include: { items: { select: { promptId: true } } },
    })
    res.json(mapCollection(row))
  } catch (e) {
    next(e)
  }
})

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    await prisma.collection.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
})

module.exports = router
