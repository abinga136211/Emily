import type { RequestHandler } from 'express'
import { appConfig } from '../config.js'
import { isAdminConfigured, verifyAdminToken } from '../auth.js'

export const requireAdmin: RequestHandler = (req, res, next) => {
  if (!isAdminConfigured()) {
    res.status(503).json({ error: 'Admin is not configured (set ADMIN_PASSWORD)' })
    return
  }
  const token = req.cookies?.[appConfig.cookieName] as string | undefined
  if (!verifyAdminToken(token)) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  next()
}
