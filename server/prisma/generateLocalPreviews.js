const fs = require('fs')
const path = require('path')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const uploadDir = path.join(__dirname, '..', 'uploads')
fs.mkdirSync(uploadDir, { recursive: true })

const palettes = [
  ['#3b1d6e', '#7c3aed', '#1a1030'],
  ['#4c1d3d', '#ec4899', '#1b1928'],
  ['#0f2a3d', '#38bdf8', '#1b1928'],
  ['#1e3a2f', '#34d399', '#1b1928'],
  ['#3d2a0f', '#f59e0b', '#1b1928'],
  ['#1a1a3e', '#a78bfa', '#242137'],
]

function svgFor(prompt, index) {
  const [a, b, c] = palettes[index % palettes.length]
  const w = prompt.previewWidth || 800
  const h = prompt.previewHeight || 1000
  const title = (prompt.title || 'Prompt').replace(/[<>&]/g, '')
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${a}"/>
      <stop offset="55%" stop-color="${c}"/>
      <stop offset="100%" stop-color="${b}"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <circle cx="${w * 0.18}" cy="${h * 0.22}" r="${Math.min(w, h) * 0.2}" fill="rgba(255,255,255,0.14)"/>
  <circle cx="${w * 0.78}" cy="${h * 0.7}" r="${Math.min(w, h) * 0.28}" fill="rgba(236,72,153,0.2)"/>
  <rect x="0" y="${h * 0.72}" width="${w}" height="${h * 0.28}" fill="rgba(0,0,0,0.28)"/>
</svg>`
}

async function main() {
  const prompts = await prisma.prompt.findMany({
    where: { contentType: { in: ['image', 'video'] } },
  })
  let i = 0
  for (const p of prompts) {
    const filename = `${p.slug}.svg`
    const filePath = path.join(uploadDir, filename)
    fs.writeFileSync(filePath, svgFor(p, i), 'utf8')
    await prisma.prompt.update({
      where: { id: p.id },
      data: {
        previewUrl: `/uploads/${filename}`,
        previewKind: 'image',
        previewFormat: 'illustrative',
        attribution: 'Local illustrative preview — replace with your photo in Admin.',
      },
    })
    i += 1
  }
  console.log(`Wrote ${i} local preview images to uploads/`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
