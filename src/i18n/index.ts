// ============================================
// 轻量 i18n：单一 locale 状态 + 响应式内容选择
// ============================================
import { computed, ref } from 'vue'
import { en, zh } from '@/data/content'
import type { SiteContent } from '@/data/content'

const BASE_URL = import.meta.env.BASE_URL

export type Locale = 'zh' | 'en'

const STORAGE_KEY = 'skmc-locale'

function readInitialLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'en') return 'en'
  // 历史繁体偏好回落到简体
  if (stored === 'zh' || stored === 'zh-TW') return 'zh'
  return 'zh'
}

export const locale = ref<Locale>(readInitialLocale())

export interface CookieBannerCopy {
  title: string
  beforeLinks: string
  privacyLabel: string
  mid: string
  cookieLabel: string
  afterLinks: string
  reject: string
  accept: string
  ariaLabel: string
}

/** Cookie 提示双语文案（简 / 英） */
export const cookieBannerCopy: Record<Locale, CookieBannerCopy> = {
  zh: {
    title: 'Cookie 偏好设定',
    beforeLinks: '本网站使用 Cookie 为您提供更好的体验，继续浏览即表示您同意我们的',
    privacyLabel: '隐私政策',
    mid: '及',
    cookieLabel: 'Cookie 政策',
    afterLinks: '。',
    reject: '拒绝',
    accept: '同意',
    ariaLabel: 'Cookie 偏好设定'
  },
  en: {
    title: 'Cookie Preferences',
    beforeLinks:
      'This website uses cookies to provide you with a better experience. By continuing to browse, you agree to our ',
    privacyLabel: 'Privacy Policy',
    mid: 'and',
    cookieLabel: 'Cookie Policy',
    afterLinks: '.',
    reject: 'Decline',
    accept: 'Agree',
    ariaLabel: 'Cookie preferences'
  }
}

export const cookieCopy = computed(() => cookieBannerCopy[locale.value])

// 当前语言对应的全站内容（响应式）
export const content = computed<SiteContent>(() => {
  const c = locale.value === 'en' ? en : zh
  // 所有 public 资源路径统一拼接 BASE_URL，确保 dev (base=/Emily.github.io/) 与生产 (base=/) 行为一致
  return applyBaseUrl(c)
})

// 递归给 image 字段加上 BASE_URL 前缀
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyBaseUrl(obj: any): any {
  if (typeof obj === 'string') return obj
  if (Array.isArray(obj)) return obj.map(applyBaseUrl)
  if (obj && typeof obj === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(obj)) {
      out[k] = k === 'image' && typeof v === 'string' ? BASE_URL + v.replace(/^\/+/, '') : applyBaseUrl(v)
    }
    return out
  }
  return obj
}

function syncDocument(value: Locale) {
  const c = value === 'en' ? en : zh
  document.documentElement.lang = value === 'en' ? 'en' : 'zh-CN'
  document.title = c.meta.title
  // 清除历史遗留的整页 zoom（曾用于塞进英文长文案，会导致首屏无法铺满视口）
  document.documentElement.style.removeProperty('zoom')
  const meta = document.querySelector('meta[name="description"]')
  if (meta) meta.setAttribute('content', c.meta.description)
}

export function setLocale(value: Locale) {
  locale.value = value
  localStorage.setItem(STORAGE_KEY, value)
  syncDocument(value)
}

// 首次加载时同步 lang / title / meta
syncDocument(locale.value)
