/** Align with src/data/content.ts contactChannels */
export type LocalizedText = {
  zh: string
  en: string
}

export const configDefaults = {
  email: {
    zh: 'contact@skmc-global.com',
    en: 'contact@skmc-global.com'
  },
  wechat: {
    zh: 'SK_Consulting_Global',
    en: 'SK_Consulting_Global'
  },
  address: {
    zh: '中国广东省深圳市南山区华润总部大厦2001室',
    en: 'Room 2001, CR Land HQ Building, Nanshan District, Shenzhen, Guangdong, China'
  },
  website: {
    zh: 'www.skmc-global.com',
    en: 'www.skmc-global.com'
  }
} as const satisfies Record<string, LocalizedText>

export type CoreConfigKey = keyof typeof configDefaults

export type SiteConfigFields = {
  email: LocalizedText
  wechat: LocalizedText
  address: LocalizedText
  website: LocalizedText
}

export type ConfigExtraItem = {
  id: string
  label: LocalizedText
  value: LocalizedText
}

export type SiteConfigPayload = SiteConfigFields & {
  extras: ConfigExtraItem[]
  channelOrder: string[]
}

export const DEFAULT_CORE_ORDER = ['email', 'wechat', 'address', 'website'] as const

export function parseChannelOrder(
  raw: unknown,
  extras: ConfigExtraItem[]
): string[] {
  const valid = new Set<string>([...DEFAULT_CORE_ORDER, ...extras.map((e) => e.id)])
  let list: unknown = raw
  if (typeof raw === 'string') {
    try {
      list = JSON.parse(raw)
    } catch {
      list = null
    }
  }

  const ordered: string[] = []
  const seen = new Set<string>()
  if (Array.isArray(list)) {
    for (const item of list) {
      if (typeof item !== 'string') continue
      const id = item.trim()
      if (!id || !valid.has(id) || seen.has(id)) continue
      seen.add(id)
      ordered.push(id)
    }
  }

  for (const id of DEFAULT_CORE_ORDER) {
    if (!seen.has(id)) {
      seen.add(id)
      ordered.push(id)
    }
  }
  for (const extra of extras) {
    if (!seen.has(extra.id)) {
      seen.add(extra.id)
      ordered.push(extra.id)
    }
  }
  return ordered
}

export function validateChannelOrderInput(
  raw: unknown,
  extras: ConfigExtraItem[]
): string[] | null {
  if (raw === undefined || raw === null) {
    return parseChannelOrder(null, extras)
  }
  if (!Array.isArray(raw)) return null
  const valid = new Set<string>([...DEFAULT_CORE_ORDER, ...extras.map((e) => e.id)])
  if (raw.length !== valid.size) return null
  const ordered: string[] = []
  const seen = new Set<string>()
  for (const item of raw) {
    if (typeof item !== 'string') return null
    const id = item.trim()
    if (!valid.has(id) || seen.has(id)) return null
    seen.add(id)
    ordered.push(id)
  }
  return ordered
}

function asTrimmedString(v: unknown): string | null {
  if (typeof v !== 'string') return null
  const t = v.trim()
  return t ? t : null
}

function parseLocalized(raw: unknown): LocalizedText | null {
  if (!raw || typeof raw !== 'object') return null
  const obj = raw as Record<string, unknown>
  const zh = asTrimmedString(obj.zh)
  const en = asTrimmedString(obj.en)
  if (!zh || !en) return null
  return { zh, en }
}

/** Accept legacy plain string (zh+en same) or { zh, en }. */
export function coerceLocalized(
  raw: unknown,
  fallback: LocalizedText
): LocalizedText {
  if (typeof raw === 'string') {
    const t = raw.trim()
    if (!t) return { zh: fallback.zh, en: fallback.en }
    return { zh: t, en: t }
  }
  const pair = parseLocalized(raw)
  return pair ?? { zh: fallback.zh, en: fallback.en }
}

export function parseExtras(raw: unknown): ConfigExtraItem[] {
  let list: unknown = raw
  if (typeof raw === 'string') {
    try {
      list = JSON.parse(raw)
    } catch {
      return []
    }
  }
  if (!Array.isArray(list)) return []

  const out: ConfigExtraItem[] = []
  const seen = new Set<string>()

  for (const item of list) {
    if (!item || typeof item !== 'object') continue
    const obj = item as Record<string, unknown>
    const id = asTrimmedString(obj.id)
    const label = parseLocalized(obj.label)
    const value = parseLocalized(obj.value)
    if (!id || !label || !value) continue
    if (seen.has(id)) continue
    seen.add(id)
    out.push({ id, label, value })
  }

  return out
}

/** Strict validation for admin save — returns null if invalid. */
export function validateExtrasInput(raw: unknown): ConfigExtraItem[] | null {
  if (raw === undefined || raw === null) return []
  if (!Array.isArray(raw)) return null
  if (raw.length > 50) return null

  const out: ConfigExtraItem[] = []
  const seen = new Set<string>()

  for (const item of raw) {
    if (!item || typeof item !== 'object') return null
    const obj = item as Record<string, unknown>
    const id = asTrimmedString(obj.id)
    const label = parseLocalized(obj.label)
    const value = parseLocalized(obj.value)
    if (!id || id.length > 64 || !label || !value) return null
    if (label.zh.length > 100 || label.en.length > 100) return null
    if (value.zh.length > 500 || value.en.length > 500) return null
    if (seen.has(id)) return null
    seen.add(id)
    out.push({ id, label, value })
  }

  return out
}

export function validateLocalizedInput(
  raw: unknown,
  maxLen = 500
): LocalizedText | null {
  const pair = parseLocalized(raw)
  if (!pair) return null
  if (pair.zh.length > maxLen || pair.en.length > maxLen) return null
  return pair
}

export function mergeConfig(row: {
  email?: string | null
  email_en?: string | null
  wechat?: string | null
  wechat_en?: string | null
  address?: string | null
  address_en?: string | null
  website?: string | null
  website_en?: string | null
} | null | undefined): SiteConfigFields {
  const pick = (key: CoreConfigKey, enCol: string | null | undefined): LocalizedText => {
    const zhRaw = row?.[key]
    const zh = typeof zhRaw === 'string' && zhRaw.trim() ? zhRaw.trim() : configDefaults[key].zh
    const en =
      typeof enCol === 'string' && enCol.trim() ? enCol.trim() : configDefaults[key].en
    return { zh, en }
  }

  return {
    email: pick('email', row?.email_en),
    wechat: pick('wechat', row?.wechat_en),
    address: pick('address', row?.address_en),
    website: pick('website', row?.website_en)
  }
}

export function mergeSiteConfig(row: {
  email?: string | null
  email_en?: string | null
  wechat?: string | null
  wechat_en?: string | null
  address?: string | null
  address_en?: string | null
  website?: string | null
  website_en?: string | null
  extras?: string | null
  channel_order?: string | null
} | null | undefined): SiteConfigPayload {
  const extras = parseExtras(row?.extras ?? null)
  return {
    ...mergeConfig(row),
    extras,
    channelOrder: parseChannelOrder(row?.channel_order ?? null, extras)
  }
}

export function coreFromDefaultsFlags(row: {
  email?: string | null
  email_en?: string | null
  wechat?: string | null
  wechat_en?: string | null
  address?: string | null
  address_en?: string | null
  website?: string | null
  website_en?: string | null
} | null | undefined) {
  return {
    email: !row?.email?.trim() && !row?.email_en?.trim(),
    wechat: !row?.wechat?.trim() && !row?.wechat_en?.trim(),
    address: !row?.address?.trim() && !row?.address_en?.trim(),
    website: !row?.website?.trim() && !row?.website_en?.trim()
  }
}
