const express = require('express')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const { requireAdmin } = require('../auth')

const router = express.Router()

const uploadDir = path.join(__dirname, '..', '..', 'uploads')
fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg'
    const safe = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
    cb(null, safe)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image uploads are allowed'))
    }
    cb(null, true)
  },
})

router.post('/', requireAdmin, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  const url = `/uploads/${req.file.filename}`
  res.status(201).json({
    url,
    filename: req.file.filename,
    size: req.file.size,
    mime: req.file.mimetype,
  })
})

module.exports = router
