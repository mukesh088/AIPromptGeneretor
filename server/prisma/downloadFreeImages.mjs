/**
 * Downloads free Unsplash photos (Unsplash License) into server/uploads.
 * Replace any file later via Admin → Upload.
 */
import fs from 'fs'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'
import { PrismaClient } from '@prisma/client'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadDir = path.join(__dirname, '..', 'uploads')
fs.mkdirSync(uploadDir, { recursive: true })

const prisma = new PrismaClient()

/** Unsplash photo IDs — https://unsplash.com/license */
const BY_SLUG = {
  'diwali-saree-night-girls': '1604608672950-c4f63d8c6d9a',
  'diwali-lehenga-balcony-girls': '1610030469983-98e550d6193c',
  'diwali-mirror-selfie-girls': '1515886657613-9f3515b0c78f',
  'diwali-couple-rooftop': '1522673607200-164d1b6ce486',
  'diwali-rangoli-pose-girls': '1604608672950-c4f63d8c6d9a',
  'diwali-kurta-boys': '1506794778202-cad84cf45f1d',
  'diwali-terrace-boys': '1500648767791-00dcc994a43e',
  'diwali-street-lights-boys': '1492562080023-ab3db95bfbce',
  'diwali-minimal-boys': '1539571696357-5a69c17a67c6',
  'diwali-family-festive': '1511895426328-dc8714191300',
  'casino-royale-couple': '1516589178581-6cd7833ae3b2',
  'sunset-couple-portrait': '1518199266791-5375a83190b7',
  'monsoon-cafe-couple': '1529636798458-92182e662485',
  'aesthetic-cafe-girls': '1529626455594-4ff0802cfb7e',
  'words-of-the-heart-girls': '1494790108377-be9c29b29330',
  'bold-horizon-girls': '1487412720507-e7ab37603c6f',
  'honey-fire-girls': '1534528741775-53994a69daeb',
  'urban-street-boys': '1507003211169-0a1dd7228f2d',
  'car-night-boys': '1492144534655-ae79c964c9d7',
  'car-sunset-boys': '1503376780353-7e6692767b70',
  'rakhi-sibling-portrait': '1604608672950-c4f63d8c6d9a',
  'rakhi-festive-girls': '1594744803329-e58b31de8bf5',
  '1980s-retro-girls': '1469334031218-e382a71b716b',
  '1980s-retro-boys': '1488161628813-04466f872be2',
  'ganesh-chaturthi-devotional': '1567593810070-7a3d471af022',
  'ganesh-festive-girls': '1604608672950-c4f63d8c6d9a',
  'birthday-cake-girls': '1464349095431-e9a21285b5f3',
  'birthday-party-boys': '1530103862676-de8c9debad1d',
  'birthday-couple': '1464366400600-7168b8af9bc3',
  'scarlet-reflections-girls': '1524504388940-b1c1722653e1',
  'midnight-minimal-girls': '1517841905240-472988babdf9',
  'car-drive-mood-boys': '1549317661-bd32c8ce0db2',
  'navratri-garba-girls': '1604608672950-c4f63d8c6d9a',
  'navratri-festive-boys': '1506794778202-cad84cf45f1d',
  'viral-template-collage': '1558618666-fcd25c85f82e',
  'vn-style-cinematic-cut': '1485846234645-a62644f84728',
  'capcut-trend-portrait': '1529626455594-4ff0802cfb7e',
  'anime-cartoon-transform': '1578632767115-351597cf2477',
  'travel-mountain-portrait': '1464822759023-fed622ff2c3b',
  'horror-cinematic-boys': '1509248961158-e54f6934749c',
  'wedding-bridal-portrait': '1519741497674-611481863552',
  'wedding-couple-portrait': '1511285560929-80b456fea0bc',
  'selfie-golden-hour-girls': '1438761681033-6461ffad8d80',
  'collage-memory-wall': '1452587925148-ce544e77e70d',
  'portrait-studio-clean': '1531746020798-e6953c6e8e04',
  'aesthetic-pastel-girls': '1524504388940-b1c1722653e1',
  'festive-days-general': '1511795409834-ef04bbd61622',
  'horror-aesthetic-girls': '1515886657613-9f3515b0c78f',
}

const BY_CATEGORY = {
  boys: '1507003211169-0a1dd7228f2d',
  girls: '1529626455594-4ff0802cfb7e',
  couple: '1516589178581-6cd7833ae3b2',
  templates: '1558618666-fcd25c85f82e',
  portrait: '1531746020798-e6953c6e8e04',
  cinematic: '1519681393784-d120267933ba',
  aesthetic: '1515886657613-9f3515b0c78f',
  collage: '1452587925148-ce544e77e70d',
  cartoon: '1578632767115-351597cf2477',
  travel: '1464822759023-fed622ff2c3b',
  festival: '1604608672950-c4f63d8c6d9a',
  birthday: '1464349095431-e9a21285b5f3',
  selfie: '1438761681033-6461ffad8d80',
  'festive-days': '1511795409834-ef04bbd61622',
  horror: '1509248961158-e54f6934749c',
  wedding: '1519741497674-611481863552',
}

const SAFE_FALLBACKS = [
  '1506905925346-21bda4d32df4',
  '1498050108023-c5249f4df085',
  '1529626455594-4ff0802cfb7e',
  '1542291026-7eec264c27ff',
  '1555939594-58d7cb561ad1',
  '1586023492125-27b2c045efd7',
]

function unsplashUrl(photoId, w, h) {
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${w}&h=${h}&q=85`
}

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          'User-Agent': 'PromptoraPreviewSeeder/1.0',
          Accept: 'image/*',
        },
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume()
          return fetchBuffer(res.headers.location).then(resolve).catch(reject)
        }
        if (res.statusCode !== 200) {
          res.resume()
          return reject(new Error(`HTTP ${res.statusCode}`))
        }
        const chunks = []
        res.on('data', (c) => chunks.push(c))
        res.on('end', () => resolve(Buffer.concat(chunks)))
        res.on('error', reject)
      },
    )
    req.setTimeout(25000, () => req.destroy(new Error('timeout')))
    req.on('error', reject)
  })
}

async function tryDownload(photoId, dest, w, h) {
  const buf = await fetchBuffer(unsplashUrl(photoId, w, h))
  if (buf.length < 3000) throw new Error('too small')
  const isJpeg = buf[0] === 0xff && buf[1] === 0xd8
  const isWebp = buf.toString('ascii', 0, 4) === 'RIFF'
  const isPng = buf[0] === 0x89 && buf[1] === 0x50
  if (!isJpeg && !isWebp && !isPng) throw new Error('not an image')
  fs.writeFileSync(dest, buf)
  return photoId
}

async function main() {
  const cats = await prisma.category.findMany()
  const catSlug = Object.fromEntries(cats.map((c) => [c.id, c.slug]))
  const prompts = await prisma.prompt.findMany()
  const attribution = []
  let ok = 0
  let fail = 0

  for (const [i, p] of prompts.entries()) {
    const w = Math.min(p.previewWidth || 800, 1400)
    const h = Math.min(p.previewHeight || 1000, 1600)
    const filename = `${p.slug}.jpg`
    const dest = path.join(uploadDir, filename)
    const candidates = [
      BY_SLUG[p.slug],
      BY_CATEGORY[catSlug[p.categoryId]],
      SAFE_FALLBACKS[i % SAFE_FALLBACKS.length],
      ...SAFE_FALLBACKS,
    ].filter(Boolean)

    const svg = path.join(uploadDir, `${p.slug}.svg`)
    if (fs.existsSync(svg)) fs.unlinkSync(svg)

    let used = null
    let lastErr = null
    for (const photoId of [...new Set(candidates)]) {
      try {
        used = await tryDownload(photoId, dest, w, h)
        break
      } catch (e) {
        lastErr = e
        try {
          if (fs.existsSync(dest)) fs.unlinkSync(dest)
        } catch {
          /* ignore */
        }
      }
    }

    if (!used) {
      console.warn(`\nFAIL ${p.slug}: ${lastErr?.message}`)
      fail += 1
      continue
    }

    await prisma.prompt.update({
      where: { id: p.id },
      data: {
        previewUrl: `/uploads/${filename}`,
        previewKind: 'image',
        previewFormat: 'illustrative',
        attribution: `Unsplash photo (${used}) — free Unsplash License. Replace in Admin when ready.`,
      },
    })

    attribution.push({
      slug: p.slug,
      title: p.title,
      file: filename,
      unsplash: `https://unsplash.com/photos/${used}`,
      license: 'Unsplash License',
    })
    ok += 1
    process.stdout.write('.')
  }

  fs.writeFileSync(
    path.join(uploadDir, 'ATTRIBUTION.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), items: attribution }, null, 2),
  )

  const md = [
    '# Preview image attribution',
    '',
    'Seed previews are from [Unsplash](https://unsplash.com) under the [Unsplash License](https://unsplash.com/license) (free to use).',
    'Replace any image anytime: **Admin → Edit prompt → Upload image**.',
    '',
    '| Prompt | File | Source |',
    '| --- | --- | --- |',
    ...attribution.map((a) => `| ${a.title} | \`${a.file}\` | [Unsplash](${a.unsplash}) |`),
    '',
  ].join('\n')

  fs.writeFileSync(path.join(uploadDir, 'ATTRIBUTION.md'), md)
  const clientAttr = path.join(__dirname, '../../client/public/assets/ATTRIBUTION.md')
  fs.mkdirSync(path.dirname(clientAttr), { recursive: true })
  fs.writeFileSync(clientAttr, md)

  console.log(`\nDone. OK=${ok} FAIL=${fail}`)
  console.log(`Files in ${uploadDir}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
