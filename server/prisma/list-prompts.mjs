import { PrismaClient } from '@prisma/client'
const p = new PrismaClient()
const rows = await p.prompt.findMany({
  select: {
    slug: true,
    title: true,
    contentType: true,
    categoryId: true,
    tags: true,
    previewWidth: true,
    previewHeight: true,
  },
})
const cats = await p.category.findMany()
const map = Object.fromEntries(cats.map((c) => [c.id, c.slug]))
console.log(
  JSON.stringify(
    rows.map((r) => ({
      slug: r.slug,
      title: r.title,
      type: r.contentType,
      cat: map[r.categoryId],
      tags: JSON.parse(r.tags || '[]'),
      w: r.previewWidth,
      h: r.previewHeight,
    })),
    null,
    2,
  ),
)
await p.$disconnect()
