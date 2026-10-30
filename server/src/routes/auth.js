const express = require('express')
const { prisma } = require('../prisma')
const {
  hashPassword,
  verifyPassword,
  signSession,
  requireUser,
  publicUser,
  sessions,
  getSessionUserId,
} = require('../auth')

const router = express.Router()

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, displayName } = req.body || {}
    if (!email || !password) return res.status(400).json({ error: 'email and password required' })
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existing) return res.status(409).json({ error: 'Email already registered' })
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash: await hashPassword(password),
        displayName: displayName || email.split('@')[0],
        role: email.toLowerCase().endsWith('@admin.local') ? 'admin' : 'user',
      },
    })
    const token = signSession(user.id)
    res.cookie('promptora_session', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    res.status(201).json({ user: publicUser(user), token })
  } catch (e) {
    next(e)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {}
    const user = await prisma.user.findUnique({ where: { email: String(email || '').toLowerCase() } })
    if (!user || !(await verifyPassword(password || '', user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    const token = signSession(user.id)
    res.cookie('promptora_session', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    res.json({ user: publicUser(user), token })
  } catch (e) {
    next(e)
  }
})

router.post('/logout', (req, res) => {
  const token = req.cookies?.promptora_session
  if (token) sessions.delete(token)
  res.clearCookie('promptora_session')
  res.json({ ok: true })
})

router.get('/me', async (req, res, next) => {
  try {
    const userId = getSessionUserId(req)
    if (!userId) return res.json({ user: null })
    const user = await prisma.user.findUnique({ where: { id: userId } })
    res.json({ user: publicUser(user) })
  } catch (e) {
    next(e)
  }
})

router.patch('/me', requireUser, async (req, res, next) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        displayName: req.body.displayName ?? undefined,
        avatarUrl: req.body.avatarUrl ?? undefined,
      },
    })
    res.json({ user: publicUser(user) })
  } catch (e) {
    next(e)
  }
})

module.exports = router
