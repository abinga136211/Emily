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
  return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'zh'
}

export const locale = ref<Locale>(readInitialLocale())

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
  // 英文页面默认 90% 缩放，切回中文恢复 100%
  document.documentElement.style.zoom = value === 'en' ? '0.9' : ''
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