import { Router } from 'express'
import { getDb } from '../db.js'
import { mergeSiteConfig } from '../defaults.js'

export const configRouter = Router()

configRouter.get('/config', (_req, res) => {
  const row = getDb()
    .prepare(
      `SELECT email, email_en, wechat, wechat_en, address, address_en, website, website_en,
              extras, channel_order
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
      }
    | undefined

  res.json(mergeSiteConfig(row))
})
