import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const FILTER = [
  'boys',
  'girls',
  'couple',
  'birthday',
  'festival',
  'wedding',
  'cinematic',
  'aesthetic',
  'selfie',
  'travel',
  'horror',
  'cartoon',
  'templates',
  'portrait',
]

const rows = await prisma.prompt.findMany({ include: { category: true } })
let n = 0
for (const p of rows) {
  let tags = []
  try {
    tags = JSON.parse(p.tags || '[]')
  } catch {
    tags = []
  }
  const blob = `${p.title} ${p.slug} ${p.category?.slug || ''} ${tags.join(' ')}`.toLowerCase()
  const add = FILTER.filter((t) => blob.includes(t) || (p.category?.slug || '').includes(t))
  const next = [...new Set([...tags.map(String), ...add])]
  if (JSON.stringify(next.sort()) !== JSON.stringify([...tags].map(String).sort())) {
    await prisma.prompt.update({ where: { id: p.id }, data: { tags: JSON.stringify(next) } })
    n += 1
  }
}
console.log(`updated ${n} of ${rows.length}`)
await prisma.$disconnect()
