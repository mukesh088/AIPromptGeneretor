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
  'diwali-golden-portrait': '1545558014-8694371b9c01',
  'anniversary-couple-portrait': '1516589178581-6cd7833ae3b2',
  'karwa-chauth-moonlit-look': '1507400494047-5a4d2f2f9b6d',
  'holi-color-splash-portrait': '1492684223066-81342ee5ff30',
  'navratri-garba-motion-freeze': '1504609813442-a8924e0418c9',
  'eid-family-soft-portrait': '1511895426328-dc8714191300',

  'rain-noir-alley-scene': '1519681393784-d120267933ba',
  'desert-epic-wide-hero': '1509316975850-ff9c8deb175b',
  'neo-noir-neon-portrait': '1550684848-fac1c5b4e853',
  'seventies-film-grain-still': '1492691527719-9d1e07e534b4',
  'retro-bollywood-poster-portrait': '1534528741775-53994a69daeb',
  'library-dolly-push-through': '1521587760476-6c12a41cff19',

  'mumbai-chai-tapri-morning': '1544787219-7f47ccb76574',
  'old-delhi-cafe-window-seat': '1495474472287-4ae41aa7e774',
  'retro-scooter-lane-portrait': '1558981403-c5f9899a28bc',

  'linkedin-executive-headshot': '1560250097-0b93528c311a',
  'creative-founder-headshot': '1573496359142-b8d87734a5a2',
  'actor-casting-headshot': '1507003211169-0a1dd7228f2d',
  'healthcare-professional-headshot': '1559839734-2b71ea197ec2',

  'skincare-bottle-hero': '1556228720-195a672e8a03',
  'floating-sneaker-product': '1542291026-7eec264c27ff',
  'jewelry-macro-sparkle': '1515562141207-7a88fb7ce338',
  'tech-gadget-desk-flatlay': '1498050108023-c5249f4df085',
  'product-reveal-unbox-spin': '1523275335684-37898b6baf30',
  'perfume-mist-macro-video': '1541643600914-78b084683601',

  'japandi-living-room': '1586023492125-27b2c045efd7',
  'cozy-reading-nook': '1481627834876-b4933e8771ab',
  'creator-studio-workspace': '1497366216548-37526070297c',

  'youtube-shock-face-thumbnail': '1492562085163-9c22f5d2c0e5',
  'podcast-episode-cover': '1478737270239-2fad36e3e2a0',
  'gaming-stream-thumbnail': '1542751371-adc38448a05e',

  'botanical-editorial-illustration': '1490750967868-88aa4486c946',
  'children-book-character': '1503454537195-1c733a64123b',
  'isometric-city-block': '1477959858617-67f85cf4f1df',
  'watercolor-travel-postcard': '1506905925346-21bda4d32df4',

  'dosa-steam-street-food': '1585937421612-70a008356fbe',
  'chai-latte-art-overhead': '1498804103071-bff87f82bbe2',
  'tandoor-sizzle-close-up': '1555939594-58d7cb561ad1',
  'pastry-glaze-pour-macro': '1578985545062-69928b1d9587',

  'himalayan-sunrise-ridge': '1464822759023-fed622ff2c3b',
  'kerala-backwaters-boat': '1507525428034-b723cf961d3e',
  'train-window-travel-drift': '1474487548415-ba34409295ea',
  'desert-caravan-aerial-drift': '1473580043148-24a3c0f0a9a8',

  'portrait-breeze-hair-motion': '1529626455594-4ff0802cfb7e',
  'fabric-swirl-slow-motion': '1483983386299-9a3b0f9d0a0f',
  'mughal-miniature-story-morph': '1564507592333-c60657eea523',
  'independence-era-photo-montage': '1461360224868-59ff3dceaa54',
  'explainer-whiteboard-camera-move': '1434030216411-0b793f4b4173',

  'youtube-script-outline': '1611162616475-46b635cb4958',
  'weekly-study-timetable': '1434030216411-0b793f4b4173',
  'banking-exam-revision-sprint': '1454165804606-c3d57bc86b40',
  'interview-star-answer-bank': '1521737711867-e3b97375f902',
  'blog-post-outline-seo': '1486312338219-ce68d2c6f44d',
  'social-content-plan-30-days': '1611224923853-80b023f02d71',
  'professional-email-drafter': '1596526131084-e5a8b6e2b0e5',
  'code-explanation-walkthrough': '1461749280684-dccba630e2f6',
  'presentation-outline-slides': '1552664730-d307ca884978',
  'product-description-ecommerce': '1556742049-0cfed4f6a45d',
  'spreadsheet-formula-helper': '1551288049-bebda4e38f71',
  'meeting-summary-action-items': '1556761175-b413da4baf72',
}

const BY_CATEGORY = {
  'festive-portraits': '1545558014-8694371b9c01',
  cinematic: '1519681393784-d120267933ba',
  'street-cafe': '1495474472287-4ae41aa7e774',
  headshots: '1507003211169-0a1dd7228f2d',
  product: '1523275335684-37898b6baf30',
  interiors: '1586023492125-27b2c045efd7',
  thumbnails: '1492562085163-9c22f5d2c0e5',
  illustration: '1490750967868-88aa4486c946',
  food: '1555939594-58d7cb561ad1',
  travel: '1464822759023-fed622ff2c3b',
  motion: '1529626455594-4ff0802cfb7e',
  'history-story': '1564507592333-c60657eea523',
  writing: '1486312338219-ce68d2c6f44d',
  study: '1434030216411-0b793f4b4173',
  coding: '1461749280684-dccba630e2f6',
  marketing: '1552664730-d307ca884978',
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

    // cleanup old svg
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
  fs.writeFileSync(path.join(__dirname, '../../client/public/assets/ATTRIBUTION.md'), md)

  console.log(`\nDone. OK=${ok} FAIL=${fail}`)
  console.log(`Files in ${uploadDir}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
