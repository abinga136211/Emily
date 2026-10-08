import { Router } from 'express'
import { appConfig } from '../config.js'
import {
  createAdminToken,
  isAdminConfigured,
  verifyAdminPassword,
  verifyAdminToken
} from '../auth.js'
import { getDb } from '../db.js'
import {
  coreFromDefaultsFlags,
  mergeSiteConfig,
  validateChannelOrderInput,
  validateExtrasInput,
  validateLocalizedInput
} from '../defaults.js'
import { requireAdmin } from '../middleware/requireAdmin.js'

export const adminRouter = Router()

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: appConfig.isProd,
    path: '/',
    maxAge: appConfig.adminTokenTtlMs
  }
}

adminRouter.post('/login', (req, res) => {
  if (!isAdminConfigured()) {
    res.status(503).json({ error: 'Admin is not configured (set ADMIN_PASSWORD)' })
    return
  }
  const password = typeof req.body?.password === 'string' ? req.body.password : ''
  if (!verifyAdminPassword(password)) {
    res.status(401).json({ error: 'Invalid password' })
    return
  }
  res.cookie(appConfig.cookieName, createAdminToken(), cookieOptions())
  res.json({ ok: true })
})

adminRouter.post('/logout', (_req, res) => {
  res.clearCookie(appConfig.cookieName, { path: '/' })
  res.json({ ok: true })
})

adminRouter.get('/me', (req, res) => {
  if (!isAdminConfigured()) {
    res.status(503).json({ error: 'Admin is not configured' })
    return
  }
  const token = req.cookies?.[appConfig.cookieName] as string | undefined
  res.json({ authenticated: verifyAdminToken(token) })
})

adminRouter.get('/consultations', requireAdmin, (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20))
  const offset = (page - 1) * limit

  const qRaw = typeof req.query.q === 'string' ? req.query.q.trim() : ''
  const q = qRaw.slice(0, 200)
  const statusRaw = typeof req.query.status === 'string' ? req.query.status.trim() : 'all'
  const status = statusRaw === 'unread' || statusRaw === 'read' ? statusRaw : 'all'

  const where: string[] = []
  const params: Array<string | number> = []

  if (status === 'unread') {
    where.push('is_read = 0')
  } else if (status === 'read') {
    where.push('is_read = 1')
  }

  if (q) {
    const like = `%${q.replace(/[%_\\]/g, '\\$&')}%`
    where.push(
      `(name LIKE ? ESCAPE '\\' OR email LIKE ? ESCAPE '\\' OR message LIKE ? ESCAPE '\\' OR IFNULL(ip, '') LIKE ? ESCAPE '\\')`
    )
    params.push(like, like, like, like)
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''

  const db = getDb()
  const total = (
    db.prepare(`SELECT COUNT(*) AS c FROM consultations ${whereSql}`).get(...params) as {
      c: number
    }
  ).c
  const unreadTotal = (
    db.prepare(`SELECT COUNT(*) AS c FROM consultations WHERE is_read = 0`).get() as {
      c: number
    }
  ).c
  const items = db
    .prepare(
      `SELECT id, ip, name, email, message, created_at, is_read
       FROM consultations
       ${whereSql}
       ORDER BY is_read ASC, created_at DESC
       LIMIT ? OFFSET ?`
    )
    .all(...params, limit, offset)
    .map((row) => {
      const item = row as {
        id: number
        ip: string | null
        name: string
        email: string
        message: string
        created_at: string
        is_read: number
      }
      return { ...item, is_read: Boolean(item.is_read) }
    })

  res.json({
    items,
    page,
    limit,
    total,
    unreadTotal,
    totalPages: Math.ceil(total / limit) || 1
  })
})

adminRouter.patch('/consultations/:id/read', requireAdmin, (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: 'Invalid id' })
    return
  }

  const isRead =
    typeof req.body?.is_read === 'boolean'
      ? req.body.is_read
      : typeof req.body?.is_read === 'number'
        ? Boolean(req.body.is_read)
        : null
  if (isRead === null) {
    res.status(400).json({ error: 'is_read (boolean) is required' })
    return
  }

  const result = getDb()
    .prepare(`UPDATE consultations SET is_read = ? WHERE id = ?`)
    .run(isRead ? 1 : 0, id)
  if (result.changes === 0) {
    res.status(404).json({ error: 'Consultation not found' })
    return
  }

  res.json({ ok: true, id, is_read: isRead })
})

adminRouter.delete('/consultations/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: 'Invalid id' })
    return
  }

  const result = getDb().prepare(`DELETE FROM consultations WHERE id = ?`).run(id)
  if (result.changes === 0) {
    res.status(404).json({ error: 'Consultation not found' })
    return
  }

  res.json({ ok: true, id })
})

adminRouter.get('/config', requireAdmin, (_req, res) => {
  const row = getDb()
    .prepare(
      `SELECT email, email_en, wechat, wechat_en, address, address_en, website, website_en,
              extras, channel_order, updated_at
       FROM system_config WHERE id = 1`
    )
    .get() as
    | {
        email: string | null
        email_en: string | null
        wechat: string | null
        wechat_en: string | null
        address: string | null
        address_en: string | null
        website: string | null
        website_en: string | null
        extras: string | null
        channel_order: string | null
        updated_at: string | null
      }
    | undefined

  const merged = mergeSiteConfig(row)
  res.json({
    ...merged,
    updated_at: row?.updated_at ?? null,
    fromDefaults: coreFromDefaultsFlags(row)
  })
})

adminRouter.put('/config', requireAdmin, (req, res) => {
  const email = validateLocalizedInput(req.body?.email, 320)
  const wechat = validateLocalizedInput(req.body?.wechat, 200)
  const address = validateLocalizedInput(req.body?.address, 500)
  const website = validateLocalizedInput(req.body?.website, 320)
  const extras = validateExtrasInput(req.body?.extras)

  if (!email || !wechat || !address || !website) {
    res.status(400).json({
      error: 'email, wechat, address, and website each need zh and en values'
    })
    return
  }
  if (extras === null) {
    res.status(400).json({ error: 'Invalid extras: each item needs id and zh/en label and value' })
    return
  }

  const channelOrder = validateChannelOrderInput(req.body?.channelOrder, extras)
  if (channelOrder === null) {
    res.status(400).json({ error: 'Invalid channelOrder' })
    return
  }

  const updated_at = new Date().toISOString()
  const extrasJson = JSON.stringify(extras)
  const orderJson = JSON.stringify(channelOrder)
  getDb()
    .prepare(
      `INSERT INTO system_config (
         id, email, email_en, wechat, wechat_en, address, address_en, website, website_en,
         extras, channel_order, updated_at
       ) VALUES (
         1, @email, @email_en, @wechat, @wechat_en, @address, @address_en, @website, @website_en,
         @extras, @channel_order, @updated_at
       )
       ON CONFLICT(id) DO UPDATE SET
         email = excluded.email,
         email_en = excluded.email_en,
         wechat = excluded.wechat,
         wechat_en = excluded.wechat_en,
         address = excluded.address,
         address_en = excluded.address_en,
         website = excluded.website,
         website_en = excluded.website_en,
         extras = excluded.extras,
         channel_order = excluded.channel_order,
         updated_at = excluded.updated_at`
    )
    .run({
      email: email.zh,
      email_en: email.en,
      wechat: wechat.zh,
      wechat_en: wechat.en,
      address: address.zh,
      address_en: address.en,
      website: website.zh,
      website_en: website.en,
      extras: extrasJson,
      channel_order: orderJson,
      updated_at
    })

  res.json({ email, wechat, address, website, extras, channelOrder, updated_at })
})
