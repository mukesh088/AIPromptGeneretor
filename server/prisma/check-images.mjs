import fs from 'fs'
import path from 'path'
import { PrismaClient } from '@prisma/client'

const p = new PrismaClient()
const rows = await p.prompt.findMany({ select: { slug: true, previewUrl: true } })
const missing = rows.filter((r) => !fs.existsSync(path.join('uploads', `${r.slug}.jpg`)))
console.log('total', rows.length)
console.log('missing', missing.length)
console.log(missing.map((m) => `${m.slug} => ${m.previewUrl}`).join('\n'))
await p.$disconnect()
