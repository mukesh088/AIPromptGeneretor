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
  const variablesPath = pathToFileURL(
    path.join(__dirname, '..', '..', 'client', 'src', 'data', 'variableSchemas.js'),
  ).href

  // Ensure variableSchemas resolves when prompts.js imports it
  const { prompts } = await import(promptsPath)
  const { categories } = await import(categoriesPath)
  void variablesPath
  return { prompts, categories }
}

function imageUrlFor(prompt) {
  if (prompt.contentType === 'work') return null
  const w = prompt.preview?.width || 800
  const h = prompt.preview?.height || 1000
  // Deterministic illustrative stock photo per slug (Lorem Picsum / Unsplash source)
  return `https://picsum.photos/seed/promptora-${prompt.slug}/${w}/${h}`
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

  const { prompts, categories } = await loadClientSeed()

  const categoryIdByLegacy = {}
  for (const c of categories) {
    const row = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        description: c.description || '',
        contentTypes: JSON.stringify(c.contentTypes || ['image']),
      },
      create: {
        slug: c.slug,
        name: c.name,
        description: c.description || '',
        contentTypes: JSON.stringify(c.contentTypes || ['image']),
      },
    })
    categoryIdByLegacy[c.id] = row.id
  }

  for (const p of prompts) {
    const url = imageUrlFor(p)
    await prisma.prompt.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        shortDescription: p.shortDescription || '',
        contentType: p.contentType,
        categoryId: categoryIdByLegacy[p.categoryId] || null,
        tags: JSON.stringify(p.tags || []),
        promptTemplate: p.promptTemplate,
        negativePrompt: p.negativePrompt || null,
        variables: JSON.stringify(p.variables || []),
        previewUrl: url,
        previewAlt: p.preview?.alt || p.title,
        previewWidth: p.preview?.width || 800,
        previewHeight: p.preview?.height || 1000,
        previewGradient: p.preview?.gradient || 'preview-gradient-1',
        previewKind: p.contentType === 'work' ? 'work' : url ? 'image' : 'gradient',
        previewFormat: url ? 'illustrative' : 'illustrative',
        previewLabel: p.preview?.label || null,
        supportedTools: JSON.stringify(p.supportedTools || []),
        requiresReferenceImage: !!p.requiresReferenceImage,
        supportedAspectRatios: JSON.stringify(p.supportedAspectRatios || ['1:1', '3:4']),
        usageStepsEn: JSON.stringify(p.usageSteps?.en || []),
        usageStepsHi: JSON.stringify(p.usageSteps?.hi || []),
        tipsEn: JSON.stringify(p.tips?.en || []),
        tipsHi: JSON.stringify(p.tips?.hi || []),
        attribution: url
          ? 'Illustrative preview via Lorem Picsum (Unsplash). Replace with your own assets in Admin.'
          : p.attribution || '',
        status: p.status || 'published',
        featured: !!p.featured,
        badge: p.badge || null,
        publishedAt: p.publishedAt ? new Date(p.publishedAt) : new Date(),
        authorId: admin.id,
      },
      create: {
        slug: p.slug,
        title: p.title,
        shortDescription: p.shortDescription || '',
        contentType: p.contentType,
        categoryId: categoryIdByLegacy[p.categoryId] || null,
        tags: JSON.stringify(p.tags || []),
        language: p.language || 'en',
        promptTemplate: p.promptTemplate,
        negativePrompt: p.negativePrompt || null,
        variables: JSON.stringify(p.variables || []),
        previewUrl: url,
        previewAlt: p.preview?.alt || p.title,
        previewWidth: p.preview?.width || 800,
        previewHeight: p.preview?.height || 1000,
        previewGradient: p.preview?.gradient || 'preview-gradient-1',
        previewKind: p.contentType === 'work' ? 'work' : url ? 'image' : 'gradient',
        previewFormat: 'illustrative',
        previewLabel: p.preview?.label || null,
        supportedTools: JSON.stringify(p.supportedTools || []),
        requiresReferenceImage: !!p.requiresReferenceImage,
        supportedAspectRatios: JSON.stringify(p.supportedAspectRatios || ['1:1', '3:4']),
        usageStepsEn: JSON.stringify(p.usageSteps?.en || []),
        usageStepsHi: JSON.stringify(p.usageSteps?.hi || []),
        tipsEn: JSON.stringify(p.tips?.en || []),
        tipsHi: JSON.stringify(p.tips?.hi || []),
        attribution: url
          ? 'Illustrative preview via Lorem Picsum (Unsplash). Replace with your own assets in Admin.'
          : p.attribution || '',
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

  console.log(`Seeded ${categories.length} categories, ${prompts.length} prompts`)
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
