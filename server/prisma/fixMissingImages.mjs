import fs from 'fs'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'
import { PrismaClient } from '@prisma/client'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadDir = path.join(__dirname, '..', 'uploads')
const prisma = new PrismaClient()

const RELIABLE = [
  '1545558014-8694371b9c01',
  '1516589178581-6cd7833ae3b2',
  '1492684223066-81342ee5ff30',
  '1504609813442-a8924e0418c9',
  '1511895426328-dc8714191300',
  '1519681393784-d120267933ba',
  '1509316975850-ff9c8deb175b',
  '1550684848-fac1c5b4e853',
  '1492691527719-9d1e07e534b4',
  '1534528741775-53994a69daeb',
  '1521587760476-6c12a41cff19',
  '1544787219-7f47ccb76574',
  '1495474472287-4ae41aa7e774',
  '1558981403-c5f9899a28bc',
  '1560250097-0b93528c311a',
  '1573496359142-b8d87734a5a2',
  '1507003211169-0a1dd7228f2d',
  '1559839734-2b71ea197ec2',
  '1556228720-195a672e8a03',
  '1542291026-7eec264c27ff',
  '1498050108023-c5249f4df085',
  '1523275335684-37898b6baf30',
  '1586023492125-27b2c045efd7',
  '1481627834876-b4933e8771ab',
  '1490750967868-88aa4486c946',
  '1503454537195-1c733a64123b',
  '1477959858617-67f85cf4f1df',
  '1506905925346-21bda4d32df4',
  '1585937421612-70a008356fbe',
  '1498804103071-bff87f82bbe2',
  '1555939594-58d7cb561ad1',
  '1578985545062-69928b1d9587',
  '1464822759023-fed622ff2c3b',
  '1507525428034-b723cf961d3e',
  '1474487548415-ba34409295ea',
  '1529626455594-4ff0802cfb7e',
  '1564507592333-c60657eea523',
  '1461360224868-59ff3dceaa54',
  '1434030216411-0b793f4b4173',
  '1461749280684-dccba630e2f6',
  '1552664730-d307ca884978',
  '1551288049-bebda4e38f71',
  '1556761175-b413da4baf72',
]

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'PromptoraPreviewSeeder/1.0', Accept: 'image/*' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return get(res.headers.location).then(resolve).catch(reject)
        }
        if (res.statusCode !== 200) {
          res.resume()
          return reject(new Error(`HTTP ${res.statusCode}`))
        }
        const chunks = []
        res.on('data', (c) => chunks.push(c))
        res.on('end', () => resolve(Buffer.concat(chunks)))
        res.on('error', reject)
      })
      .on('error', reject)
  })
}

async function main() {
  const prompts = await prisma.prompt.findMany()
  let fixed = 0
  for (const [i, p] of prompts.entries()) {
    const dest = path.join(uploadDir, `${p.slug}.jpg`)
    if (fs.existsSync(dest) && fs.statSync(dest).size > 3000) continue

    const w = Math.min(p.previewWidth || 800, 1200)
    const h = Math.min(p.previewHeight || 1000, 1400)
    let saved = false
    for (let attempt = 0; attempt < RELIABLE.length && !saved; attempt++) {
      const photoId = RELIABLE[(i + attempt) % RELIABLE.length]
      const url = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${w}&h=${h}&q=80`
      try {
        const buf = await get(url)
        if (buf.length < 3000) continue
        if (buf[0] !== 0xff && buf[0] !== 0x89 && buf.toString('ascii', 0, 4) !== 'RIFF') continue
        fs.writeFileSync(dest, buf)
        await prisma.prompt.update({
          where: { id: p.id },
          data: {
            previewUrl: `/uploads/${p.slug}.jpg`,
            previewKind: 'image',
            previewFormat: 'illustrative',
            attribution: `Unsplash photo (${photoId}) — free Unsplash License. Replace in Admin when ready.`,
          },
        })
        saved = true
        fixed += 1
        console.log('fixed', p.slug, buf.length)
      } catch (e) {
        /* try next */
      }
    }
    if (!saved) console.warn('still missing', p.slug)
  }
  console.log('fixed', fixed)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
