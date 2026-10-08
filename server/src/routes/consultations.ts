import { Router } from 'express'
import type { Request } from 'express'
import { getDb } from '../db.js'

export const consultationsRouter = Router()

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RATE_WINDOW_MS = 60_000
const RATE_MAX = 5

type RateEntry = { count: number; resetAt: number }
const rateMap = new Map<string, RateEntry>()

function clientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim()
  }
  if (Array.isArray(forwarded) && forwarded[0]) {
    return forwarded[0].split(',')[0].trim()
  }
  return req.socket.remoteAddress || 'unknown'
}

function checkRate(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now >= entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_MAX) return false
  entry.count += 1
  return true
}

consultationsRouter.post('/consultations', (req, res) => {
  const ip = clientIp(req)
  if (!checkRate(ip)) {
    res.status(429).json({ error: 'Too many requests' })
    return
  }

  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : ''
  const email = typeof req.body?.email === 'string' ? req.body.email.trim() : ''
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : ''

  if (!name || !email || !message) {
    res.status(400).json({ error: 'name, email, and message are required' })
    return
  }
  if (!EMAIL_RE.test(email)) {
    res.status(400).json({ error: 'Invalid email' })
    return
  }
  if (name.length > 200 || email.length > 320 || message.length > 5000) {
    res.status(400).json({ error: 'Field too long' })
    return
  }

  const created_at = new Date().toISOString()
  const result = getDb()
    .prepare(
      `INSERT INTO consultations (ip, name, email, message, created_at)
       VALUES (@ip, @name, @email, @message, @created_at)`
    )
    .run({ ip, name, email, message, created_at })

  res.status(201).json({ id: Number(result.lastInsertRowid), created_at })
})
