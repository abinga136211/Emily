import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const serverRoot = path.resolve(__dirname, '..')

dotenv.config({ path: path.join(serverRoot, '.env') })

function env(name: string, fallback?: string): string {
  const value = process.env[name]
  if (value !== undefined && value !== '') return value
  if (fallback !== undefined) return fallback
  return ''
}

const isProd = env('NODE_ENV', 'development') === 'production'

export const appConfig = {
  isProd,
  host: env('HOST', '0.0.0.0'),
  port: Number(env('PORT', '3001')),
  dbPath: path.isAbsolute(env('DB_PATH', ''))
    ? env('DB_PATH')
    : path.resolve(serverRoot, env('DB_PATH', './data/app.db')),
  trustProxy: env('TRUST_PROXY', '1') !== '0',
  corsOrigin: env('CORS_ORIGIN', isProd ? 'false' : '*'),
  bodyLimit: env('BODY_LIMIT', '32kb'),
  adminPassword: env('ADMIN_PASSWORD'),
  adminSecret: env('ADMIN_SECRET') || env('ADMIN_PASSWORD') || 'dev-insecure-secret',
  adminTokenTtlMs: Number(env('ADMIN_TOKEN_TTL_HOURS', '24')) * 60 * 60 * 1000,
  cookieName: 'skmc_admin',
  /** Vue build output; override with DIST_PATH absolute or relative to server/ */
  distPath: (() => {
    const raw = env('DIST_PATH', '')
    if (!raw) return path.resolve(serverRoot, '../dist')
    return path.isAbsolute(raw) ? raw : path.resolve(serverRoot, raw)
  })(),
  serverRoot
}
