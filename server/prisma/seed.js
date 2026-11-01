const path = require('path')
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function loadClientSeed() {
  const { pathToFileURL } = require('url')
  const promptsPath = pathToFileURL(
    path.join(__dirname, '..', '..', 'client', 'src', 'data', 'prompts.js'),
  ).href
  const categoriesPath = pathToFileURL(
    path.join(__dirname, '..', '..', 'client', 'src', 'data', 'categories.js'),
  ).href
  const collectionsPath = pathToFileURL(
    path.join(__dirname, '..', '..', 'client', 'src', 'data', 'collections.js'),
  ).href

  const { prompts } = await import(promptsPath)
  const { categories } = await import(categoriesPath)
  const { collections } = await import(collectionsPath)
  return { prompts, categories, collections }
}

function normalizePrompt(p) {
  const template = p.promptTemplate || p.promptText || ''
  const gradient = p.preview?.gradient || p.previewGradient || 'preview-gradient-1'
  const url = p.preview?.url || p.imageUrl || null
  return {
    ...p,
    promptTemplate: template,
    shortDescription:
      p.shortDescription ||
      `Copy this ${p.contentType || 'image'} prompt and paste it into ChatGPT with your photo.`,
    preview: {
      url,
      alt: p.preview?.alt || p.title,
      width: p.preview?.width || 800,
      height: p.preview?.height || 1000,
      gradient,
      kind: url ? 'image' : 'gradient',
      format: 'illustrative',
      label: p.preview?.label || null,
    },
    supportedTools: p.supportedTools || ['chatgpt', 'gemini', 'midjourney'],
    requiresReferenceImage: p.requiresReferenceImage !== false,
    supportedAspectRatios: p.supportedAspectRatios || ['4:5', '3:4', '1:1'],
    usageSteps: p.usageSteps || {
      en: [
        'Tap Copy prompt to copy the full text.',
        'Open ChatGPT and start a new chat.',
        'Upload the photo you want to transform.',
        'Paste the prompt and send it.',
        'Regenerate once or twice if needed.',
      ],
      hi: [],
    },
    tips: p.tips || { en: [], hi: [] },
    status: p.status || 'published',
    featured: p.featured ?? true,
    demoMetrics: {
      views: p.demoMetrics?.views || p.likes || 0,
      copies: p.demoMetrics?.copies || p.copies || 0,
      saves: p.demoMetrics?.saves || p.saves || 0,
    },
    publishedAt: p.publishedAt || p.createdAt || new Date().toISOString(),
    attribution:
      p.attribution ||
      'Illustrative preview via Unsplash License. Replace with your own assets in Admin.',
  }
}

async function wipeContent() {
  await prisma.collectionItem.deleteMany()
  await prisma.collection.deleteMany()
  await prisma.prompt.deleteMany()
  await prisma.category.deleteMany()
  console.log('Cleared previous categories, prompts, and collections')
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@admin.local'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      displayName: 'Admin',
      role: 'admin',
      passwordHash: await bcrypt.hash(adminPassword, 10),
    },
  })

  await wipeContent()

  const { prompts: rawPrompts, categories, collections } = await loadClientSeed()
  const prompts = rawPrompts.map(normalizePrompt)
  const legacyIdToSlug = Object.fromEntries(prompts.map((p) => [p.id, p.slug]))
  const legacyCatToSlug = Object.fromEntries(categories.map((c) => [c.id, c.slug]))

  const categoryIdByLegacy = {}
  for (const c of categories) {
    const row = await prisma.category.create({
      data: {
        slug: c.slug,
        name: c.name,
        description: c.description || '',
        contentTypes: JSON.stringify(c.contentTypes || ['image']),
      },
    })
    categoryIdByLegacy[c.id] = row.id
  }

  for (const p of prompts) {
    const url = p.preview.url
    const catSlugs = [p.categoryId, ...(p.categoryIds || [])]
      .map((id) => legacyCatToSlug[id])
      .filter(Boolean)
    const tags = [...new Set([...(p.tags || []), ...catSlugs])]
    await prisma.prompt.create({
      data: {
        slug: p.slug,
        title: p.title,
        shortDescription: p.shortDescription || '',
        contentType: p.contentType || 'image',
        categoryId: categoryIdByLegacy[p.categoryId] || null,
        tags: JSON.stringify(tags),
        language: p.language || 'en',
        promptTemplate: p.promptTemplate,
        negativePrompt: p.negativePrompt || null,
        variables: JSON.stringify(p.variables || []),
        previewUrl: url,
        previewAlt: p.preview.alt,
        previewWidth: p.preview.width,
        previewHeight: p.preview.height,
        previewGradient: p.preview.gradient,
        previewKind: p.contentType === 'work' ? 'work' : url ? 'image' : 'gradient',
        previewFormat: 'illustrative',
        previewLabel: p.preview.label,
        supportedTools: JSON.stringify(p.supportedTools || []),
        requiresReferenceImage: !!p.requiresReferenceImage,
        supportedAspectRatios: JSON.stringify(p.supportedAspectRatios || ['4:5', '3:4']),
        usageStepsEn: JSON.stringify(p.usageSteps?.en || []),
        usageStepsHi: JSON.stringify(p.usageSteps?.hi || []),
        tipsEn: JSON.stringify(p.tips?.en || []),
        tipsHi: JSON.stringify(p.tips?.hi || []),
        attribution: p.attribution || '',
        status: p.status || 'published',
        featured: !!p.featured,
        badge: p.badge || null,
        publishedAt: p.publishedAt ? new Date(p.publishedAt) : new Date(),
        authorId: admin.id,
        views: p.demoMetrics?.views || 0,
        copies: p.demoMetrics?.copies || 0,
        saves: p.demoMetrics?.saves || 0,
      },
    })
  }

  for (const [index, col] of collections.entries()) {
    const collection = await prisma.collection.create({
      data: {
        slug: col.slug,
        title: col.title,
        description: col.description || '',
        coverGradient: col.coverGradient || 'preview-gradient-1',
        featured: col.featured !== false,
        sortOrder: col.sortOrder ?? index + 1,
      },
    })

    let sortOrder = 0
    for (const legacyId of col.promptIds || []) {
      const slug = legacyIdToSlug[legacyId]
      if (!slug) continue
      const prompt = await prisma.prompt.findUnique({ where: { slug } })
      if (!prompt) continue
      await prisma.collectionItem.create({
        data: {
          collectionId: collection.id,
          promptId: prompt.id,
          sortOrder: sortOrder++,
        },
      })
    }
  }

  console.log(
    `Seeded ${categories.length} categories, ${prompts.length} prompts, ${collections.length} collections`,
  )
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
