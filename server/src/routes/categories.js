const express = require('express')
const { prisma } = require('../prisma')
const { mapCategory, slugify } = require('../mappers')
const { requireAdmin } = require('../auth')

const router = express.Router()

router.get('/', async (_req, res, next) => {
  try {
    const rows = await prisma.category.findMany({ orderBy: { name: 'asc' } })
    const withCounts = await Promise.all(
      rows.map(async (c) => {
        const count = await prisma.prompt.count({
          where: { categoryId: c.id, status: 'published' },
        })
        return mapCategory(c, count)
      }),
    )
    res.json(withCounts)
  } catch (e) {
    next(e)
  }
})

router.get('/:slug', async (req, res, next) => {
  try {
    const row = await prisma.category.findFirst({
      where: { OR: [{ slug: req.params.slug }, { id: req.params.slug }] },
    })
    if (!row) return res.status(404).json({ error: 'Not found' })
    res.json(mapCategory(row))
  } catch (e) {
    next(e)
  }
})

router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const name = req.body?.name?.trim()
    if (!name) return res.status(400).json({ error: 'name required' })
    let slug = req.body.slug?.trim() || slugify(name)
    const exists = await prisma.category.findUnique({ where: { slug } })
    if (exists) slug = `${slug}-${Date.now().toString(36)}`
    const row = await prisma.category.create({
      data: {
        slug,
        name,
        description: req.body.description || '',
        contentTypes: JSON.stringify(req.body.contentTypes || ['image']),
      },
    })
    res.status(201).json(mapCategory(row, 0))
  } catch (e) {
    next(e)
  }
})

router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const data = {}
    if (req.body.name !== undefined) data.name = req.body.name
    if (req.body.slug !== undefined) data.slug = req.body.slug
    if (req.body.description !== undefined) data.description = req.body.description
    if (req.body.contentTypes !== undefined) data.contentTypes = JSON.stringify(req.body.contentTypes)
    const row = await prisma.category.update({ where: { id: req.params.id }, data })
    res.json(mapCategory(row))
  } catch (e) {
    next(e)
  }
})

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    await prisma.prompt.updateMany({
      where: { categoryId: req.params.id },
      data: { categoryId: null },
    })
    await prisma.category.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
})

module.exports = router
