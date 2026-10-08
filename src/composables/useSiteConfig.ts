import { computed, ref } from 'vue'
import {
  fetchSiteConfig,
  type ConfigExtraItem,
  type LocalizedText,
  type SiteConfig
} from '@/api/site'
import { content, locale } from '@/i18n'
import type { ContactChannel } from '@/data/content'

const CONFIG_CHANNEL = 'skmc-site-config'
const CONFIG_STORAGE_KEY = 'skmc-site-config-bump'
const POLL_MS = 3000
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CORE_IDS = ['email', 'wechat', 'address', 'website'] as const

const remoteConfig = ref<SiteConfig | null>(null)
const loadError = ref<string | null>(null)
const loaded = ref(false)
let loading: Promise<void> | null = null
let pollTimer: ReturnType<typeof setInterval> | null = null
let channel: BroadcastChannel | null = null
let listenersBound = false

function websiteHref(website: string): string {
  const v = website.trim()
  if (/^https?:\/\//i.test(v)) return v
  return `https://${v.replace(/^\/+/, '')}`
}

function valueHref(value: string): string | undefined {
  const v = value.trim()
  if (!v) return undefined
  if (EMAIL_RE.test(v)) return `mailto:${v}`
  if (/^https?:\/\//i.test(v)) return v
  if (/^(www\.)?[a-z0-9-]+(\.[a-z0-9-]+)+([/?#].*)?$/i.test(v)) {
    return websiteHref(v)
  }
  return undefined
}

function isLocalizedPair(raw: unknown): raw is LocalizedText {
  if (!raw || typeof raw !== 'object') return false
  const obj = raw as Record<string, unknown>
  return (
    typeof obj.zh === 'string' &&
    obj.zh.trim() !== '' &&
    typeof obj.en === 'string' &&
    obj.en.trim() !== ''
  )
}

function parseLocalizedClient(raw: unknown): LocalizedText | null {
  if (typeof raw === 'string') {
    const t = raw.trim()
    return t ? { zh: t, en: t } : null
  }
  if (!isLocalizedPair(raw)) return null
  return { zh: raw.zh.trim(), en: raw.en.trim() }
}

function parseExtrasClient(raw: unknown): ConfigExtraItem[] | null {
  if (raw === undefined || raw === null) return []
  if (!Array.isArray(raw)) return null
  const out: ConfigExtraItem[] = []
  const seen = new Set<string>()
  for (const item of raw) {
    if (!item || typeof item !== 'object') return null
    const obj = item as Record<string, unknown>
    const id = typeof obj.id === 'string' ? obj.id.trim() : ''
    if (!id || seen.has(id) || !isLocalizedPair(obj.label) || !isLocalizedPair(obj.value)) {
      return null
    }
    seen.add(id)
    out.push({
      id,
      label: { zh: obj.label.zh.trim(), en: obj.label.en.trim() },
      value: { zh: obj.value.zh.trim(), en: obj.value.en.trim() }
    })
  }
  return out
}

function buildChannelOrder(
  rawOrder: unknown,
  extras: ConfigExtraItem[]
): string[] {
  const valid = new Set<string>([...CORE_IDS, ...extras.map((e) => e.id)])
  const channelOrder: string[] = []
  const seen = new Set<string>()
  if (Array.isArray(rawOrder)) {
    for (const item of rawOrder) {
      if (typeof item !== 'string') continue
      const id = item.trim()
      if (!valid.has(id) || seen.has(id)) continue
      seen.add(id)
      channelOrder.push(id)
    }
  }
  for (const id of CORE_IDS) {
    if (!seen.has(id)) {
      seen.add(id)
      channelOrder.push(id)
    }
  }
  for (const extra of extras) {
    if (!seen.has(extra.id)) {
      seen.add(extra.id)
      channelOrder.push(extra.id)
    }
  }
  return channelOrder
}

/** Reject malformed payloads so the UI falls back to hardcoded channels. */
export function normalizeSiteConfig(raw: unknown): SiteConfig | null {
  if (!raw || typeof raw !== 'object') return null
  const obj = raw as Record<string, unknown>
  const email = parseLocalizedClient(obj.email)
  const wechat = parseLocalizedClient(obj.wechat)
  const address = parseLocalizedClient(obj.address)
  const website = parseLocalizedClient(obj.website)
  if (!email || !wechat || !address || !website) return null
  const extras = parseExtrasClient(obj.extras)
  if (extras === null) return null
  return {
    email,
    wechat,
    address,
    website,
    extras,
    channelOrder: buildChannelOrder(obj.channelOrder, extras)
  }
}

function sameLocalized(a: LocalizedText, b: LocalizedText): boolean {
  return a.zh === b.zh && a.en === b.en
}

function sameExtras(a: ConfigExtraItem[], b: ConfigExtraItem[]): boolean {
  if (a.length !== b.length) return false
  return a.every((item, i) => {
    const other = b[i]
    return (
      item.id === other.id &&
      sameLocalized(item.label, other.label) &&
      sameLocalized(item.value, other.value)
    )
  })
}

function sameConfig(a: SiteConfig | null, b: SiteConfig): boolean {
  if (!a) return false
  return (
    sameLocalized(a.email, b.email) &&
    sameLocalized(a.wechat, b.wechat) &&
    sameLocalized(a.address, b.address) &&
    sameLocalized(a.website, b.website) &&
    sameExtras(a.extras, b.extras) &&
    a.channelOrder.join('|') === b.channelOrder.join('|')
  )
}

function pickLocalized(text: LocalizedText, lang: 'zh' | 'en'): string {
  return lang === 'en' ? text.en : text.zh
}

function buildOrderedChannels(config: SiteConfig, lang: 'zh' | 'en'): ContactChannel[] {
  const extrasById = new Map(config.extras.map((item) => [item.id, item]))
  const out: ContactChannel[] = []

  for (const id of config.channelOrder) {
    if (id === 'email') {
      const value = pickLocalized(config.email, lang)
      out.push({
        id: 'core-email',
        label: lang === 'en' ? 'Business Email' : '商务邮箱',
        value,
        href: `mailto:${value}`
      })
      continue
    }
    if (id === 'wechat') {
      out.push({
        id: 'core-wechat',
        label: lang === 'en' ? 'Business WeChat' : '商务微信',
        value: pickLocalized(config.wechat, lang)
      })
      continue
    }
    if (id === 'address') {
      out.push({
        id: 'core-address',
        label: lang === 'en' ? 'Office Address' : '办公地址',
        value: pickLocalized(config.address, lang)
      })
      continue
    }
    if (id === 'website') {
      const value = pickLocalized(config.website, lang)
      out.push({
        id: 'core-website',
        label: lang === 'en' ? 'Website' : '官方网站',
        value,
        href: websiteHref(value)
      })
      continue
    }
    const extra = extrasById.get(id)
    if (!extra) continue
    const value = pickLocalized(extra.value, lang)
    out.push({
      id: extra.id,
      label: pickLocalized(extra.label, lang),
      value,
      href: valueHref(value)
    })
  }

  return out
}

export const displayChannels = computed<ContactChannel[]>(() => {
  const base = content.value.contactChannels
  if (!remoteConfig.value) return base
  return buildOrderedChannels(remoteConfig.value, locale.value)
})

export async function loadSiteConfig(force = false): Promise<void> {
  if (loading) {
    if (!force) return loading
    await loading
  }
  loading = (async () => {
    try {
      const raw = await fetchSiteConfig()
      const next = normalizeSiteConfig(raw)
      if (!next) {
        remoteConfig.value = null
        loadError.value = 'Invalid site config payload'
        return
      }
      if (!sameConfig(remoteConfig.value, next)) {
        remoteConfig.value = next
      }
      loadError.value = null
    } catch (err) {
      loadError.value = err instanceof Error ? err.message : 'Failed to load config'
      remoteConfig.value = null
    } finally {
      loaded.value = true
      loading = null
    }
  })()
  return loading
}

/** Notify other tabs/windows that system config changed (admin save). */
export function notifySiteConfigChanged(): void {
  const stamp = String(Date.now())
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, stamp)
  } catch {
    // ignore quota / private mode
  }
  try {
    if (!channel) channel = new BroadcastChannel(CONFIG_CHANNEL)
    channel.postMessage({ type: 'config-updated', at: stamp })
  } catch {
    // BroadcastChannel unsupported
  }
  void loadSiteConfig(true)
}

function onVisibility() {
  if (document.visibilityState === 'visible') {
    void loadSiteConfig(true)
  }
}

function onStorage(ev: StorageEvent) {
  if (ev.key === CONFIG_STORAGE_KEY && ev.newValue) {
    void loadSiteConfig(true)
  }
}

export function startSiteConfigSync(): void {
  void loadSiteConfig(true)

  if (!listenersBound) {
    listenersBound = true
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('storage', onStorage)
    try {
      channel = new BroadcastChannel(CONFIG_CHANNEL)
      channel.onmessage = () => {
        void loadSiteConfig(true)
      }
    } catch {
      channel = null
    }
  }

  if (pollTimer) return
  pollTimer = setInterval(() => {
    if (document.visibilityState === 'hidden') return
    void loadSiteConfig(true)
  }, POLL_MS)
}

export function stopSiteConfigSync(): void {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

export function useSiteConfig() {
  return {
    displayChannels,
    remoteConfig,
    loadError,
    loaded,
    loadSiteConfig,
    notifySiteConfigChanged,
    startSiteConfigSync,
    stopSiteConfigSync
  }
}
