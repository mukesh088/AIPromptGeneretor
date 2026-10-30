import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/data/prompts.js')
let s = fs.readFileSync(file, 'utf8')

const re =
  /preview: \{ kind: 'gradient', gradient: '([^']+)', alt: "([^"]+)", width: (\d+), height: (\d+), format: 'illustrative', poster: null, duration: null, label: null \}/g

let count = 0
s = s.replace(re, (_m, gradient, alt, w, h) => {
  count += 1
  const seed = alt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 48)
  return `preview: { kind: 'image', url: 'https://picsum.photos/seed/promptora-${seed}/${w}/${h}', gradient: '${gradient}', alt: "${alt}", width: ${w}, height: ${h}, format: 'illustrative', poster: null, duration: null, label: null }`
})

fs.writeFileSync(file, s)
console.log(`Injected ${count} preview URLs`)
