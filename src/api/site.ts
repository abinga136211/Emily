export type LocalizedText = {
  zh: string
  en: string
}

export type ConfigExtraItem = {
  id: string
  label: LocalizedText
  value: LocalizedText
}

export type SiteConfig = {
  email: LocalizedText
  wechat: LocalizedText
  address: LocalizedText
  website: LocalizedText
  extras: ConfigExtraItem[]
  channelOrder: string[]
}

export type ConsultationPayload = {
  name: string
  email: string
  message: string
}

export type ConsultationItem = {
  id: number
  ip: string | null
  name: string
  email: string
  message: string
  created_at: string
  is_read: boolean
}

export type ConsultationStatusFilter = 'all' | 'unread' | 'read'

export type ConsultationsQuery = {
  page?: number
  limit?: number
  q?: string
  status?: ConsultationStatusFilter
}

export type ConsultationsPage = {
  items: ConsultationItem[]
  page: number
  limit: number
  total: number
  unreadTotal: number
  totalPages: number
}

export type AdminConfigResponse = SiteConfig & {
  updated_at: string | null
  fromDefaults: {
    email: boolean
    wechat: boolean
    address: boolean
    website: boolean
  }
}

async function parseJson<T>(res: Response): Promise<T> {
  const data = (await res.json().catch(() => ({}))) as T & { error?: string }
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`)
  }
  return data
}

export async function fetchSiteConfig(): Promise<SiteConfig> {
  const res = await fetch('/api/config')
  return parseJson<SiteConfig>(res)
}

export async function submitConsultation(payload: ConsultationPayload): Promise<{ id: number; created_at: string }> {
  const res = await fetch('/api/consultations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  return parseJson(res)
}

export async function adminLogin(password: string): Promise<void> {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ password })
  })
  await parseJson(res)
}

export async function adminLogout(): Promise<void> {
  const res = await fetch('/api/admin/logout', {
    method: 'POST',
    credentials: 'include'
  })
  await parseJson(res)
}

export async function adminMe(): Promise<{ authenticated: boolean }> {
  const res = await fetch('/api/admin/me', { credentials: 'include' })
  return parseJson(res)
}

export async function fetchAdminConsultations(
  query: ConsultationsQuery = {}
): Promise<ConsultationsPage> {
  const page = query.page ?? 1
  const limit = query.limit ?? 20
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit)
  })
  const q = query.q?.trim()
  if (q) params.set('q', q)
  if (query.status && query.status !== 'all') params.set('status', query.status)

  const res = await fetch(`/api/admin/consultations?${params}`, {
    credentials: 'include'
  })
  return parseJson(res)
}

export async function deleteAdminConsultation(id: number): Promise<{ ok: boolean; id: number }> {
  const res = await fetch(`/api/admin/consultations/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  })
  return parseJson(res)
}

export async function setAdminConsultationRead(
  id: number,
  is_read: boolean
): Promise<{ ok: boolean; id: number; is_read: boolean }> {
  const res = await fetch(`/api/admin/consultations/${id}/read`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ is_read })
  })
  return parseJson(res)
}

export async function fetchAdminConfig(): Promise<AdminConfigResponse> {
  const res = await fetch('/api/admin/config', { credentials: 'include' })
  return parseJson(res)
}

export async function saveAdminConfig(config: SiteConfig): Promise<SiteConfig & { updated_at: string }> {
  const res = await fetch('/api/admin/config', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(config)
  })
  return parseJson(res)
}
