const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { prisma } = require('./prisma')

const sessions = new Map()

function signSession(userId) {
  const token = crypto.randomBytes(32).toString('hex')
  sessions.set(token, { userId, createdAt: Date.now() })
  return token
}

function getSessionUserId(req) {
  const header = req.headers.authorization
  const bearer = header?.startsWith('Bearer ') ? header.slice(7) : null
  const token = req.cookies?.promptora_session || bearer
  if (!token) return null
  const session = sessions.get(token)
  if (!session) return null
  return session.userId
}

async function requireUser(req, res, next) {
  try {
    const userId = getSessionUserId(req)
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return res.status(401).json({ error: 'Unauthorized' })
    req.user = user
    next()
  } catch (e) {
    next(e)
  }
}

async function requireAdmin(req, res, next) {
  await requireUser(req, res, async () => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' })
    next()
  })
}

async function hashPassword(password) {
  return bcrypt.hash(password, 10)
}

async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash)
}

function publicUser(user) {
  if (!user) return null
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  }
}

module.exports = {
  signSession,
  getSessionUserId,
  requireUser,
  requireAdmin,
  hashPassword,
  verifyPassword,
  publicUser,
  sessions,
}
