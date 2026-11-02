require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const path = require('path')
const fs = require('fs')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const promptsRouter = require('./routes/prompts')
const categoriesRouter = require('./routes/categories')
const collectionsRouter = require('./routes/collections')
const authRouter = require('./routes/auth')
const uploadsRouter = require('./routes/uploads')
const { prisma } = require('./prisma')

const app = express()
const PORT = process.env.PORT || 4000
const isProd = process.env.NODE_ENV === 'production'
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || (isProd ? true : 'http://localhost:5173')
const clientDist = path.join(__dirname, '..', '..', 'client', 'dist')

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  }),
)
app.use(express.json({ limit: '2mb' }))
app.use(cookieParser())
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.get('/api/health', (_req, res) => res.json({ ok: true, mode: 'sqlite' }))

app.use('/api/auth', authRouter)
app.use('/api/prompts', promptsRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/collections', collectionsRouter)
app.use('/api/uploads', uploadsRouter)

app.get('/api/search/suggestions', async (req, res, next) => {
  try {
    const q = String(req.query.q || '').trim()
    if (!q) return res.json([])
    const [prompts, categories] = await Promise.all([
      prisma.prompt.findMany({
        where: {
          status: 'published',
          OR: [
            { title: { contains: q } },
            { tags: { contains: q } },
            { slug: { contains: q } },
          ],
        },
        take: 6,
      }),
      prisma.category.findMany({
        where: { OR: [{ name: { contains: q } }, { slug: { contains: q } }] },
        take: 3,
      }),
    ])
    res.json([
      ...categories.map((c) => ({ type: 'category', label: c.name, slug: c.slug })),
      ...prompts.map((p) => ({
        type: 'prompt',
        label: p.title,
        slug: p.slug,
        contentType: p.contentType,
      })),
    ])
  } catch (e) {
    next(e)
  }
})

// Hostinger / production: serve the Vite React build from the same Node process
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist, { index: false, maxAge: isProd ? '1h' : 0 }))
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next()
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next()
    res.sendFile(path.join(clientDist, 'index.html'))
  })
} else if (isProd) {
  console.warn(`Client build missing at ${clientDist}. Run: npm run build`)
}

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Server error' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Promptora on http://0.0.0.0:${PORT}${fs.existsSync(clientDist) ? ' (API + web)' : ' (API only)'}`)
})
