const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { prisma } = require('./prisma')

const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  process.env.JWT_SECRET ||
  process.env.ADMIN_PASSWORD ||
  'promptora-dev-session-secret'
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000

/** In-memory cache for fast lookup; signed tokens still validate after restart. */
const sessions = new Map()

function signSession(userId) {
  const issuedAt = Date.now().toString(36)
  const payload = `${userId}.${issuedAt}`
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex')
  const token = `${payload}.${sig}`
  sessions.set(token, { userId, createdAt: Date.now() })
  return token
}

function verifySignedToken(token) {
  if (!token || typeof token !== 'string') return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [userId, issuedAt, sig] = parts
  if (!userId || !issuedAt || !sig) return null
  const payload = `${userId}.${issuedAt}`
  const expected = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex')
  try {
    const a = Buffer.from(sig, 'hex')
    const b = Buffer.from(expected, 'hex')
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null
  } catch {
    return null
  }
  const issuedMs = parseInt(issuedAt, 36)
  if (!Number.isFinite(issuedMs) || Date.now() - issuedMs > SESSION_TTL_MS) return null
  return userId
}

function getSessionUserId(req) {
  const header = req.headers.authorization
  const bearer = header?.startsWith('Bearer ') ? header.slice(7).trim() : null
  const cookieToken = req.cookies?.promptora_session
  const token = bearer || cookieToken
  if (!token) return null

  const cached = sessions.get(token)
  if (cached) return cached.userId

  const userId = verifySignedToken(token)
  if (userId) {
    sessions.set(token, { userId, createdAt: Date.now() })
    return userId
  }
  return null
}

function destroySession(req) {
  const header = req.headers.authorization
  const bearer = header?.startsWith('Bearer ') ? header.slice(7).trim() : null
  const cookieToken = req.cookies?.promptora_session
  if (bearer) sessions.delete(bearer)
  if (cookieToken) sessions.delete(cookieToken)
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
  await requireUser(req, res, () => {
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
  destroySession,
  requireUser,
  requireAdmin,
  hashPassword,
  verifyPassword,
  publicUser,
  sessions,
}
