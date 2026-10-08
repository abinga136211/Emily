import crypto from 'node:crypto'
import { appConfig } from './config.js'

export function timingSafeEqualString(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

export function verifyAdminPassword(password: string): boolean {
  if (!appConfig.adminPassword) return false
  return timingSafeEqualString(password, appConfig.adminPassword)
}

export function isAdminConfigured(): boolean {
  return Boolean(appConfig.adminPassword)
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', appConfig.adminSecret).update(payload).digest('hex')
}

export function createAdminToken(): string {
  const exp = Date.now() + appConfig.adminTokenTtlMs
  const payload = `admin:${exp}`
  return `${payload}.${sign(payload)}`
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false
  const lastDot = token.lastIndexOf('.')
  if (lastDot <= 0) return false
  const payload = token.slice(0, lastDot)
  const sig = token.slice(lastDot + 1)
  const expected = sign(payload)
  if (!timingSafeEqualString(sig, expected)) return false
  const parts = payload.split(':')
  const exp = Number(parts[1])
  if (!Number.isFinite(exp) || Date.now() > exp) return false
  return parts[0] === 'admin'
}
