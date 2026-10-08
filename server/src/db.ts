import fs from 'node:fs'
import path from 'node:path'
import Database from 'better-sqlite3'
import { appConfig } from './config.js'

let db: Database.Database | null = null

export function getDb(): Database.Database {
  if (db) return db

  fs.mkdirSync(path.dirname(appConfig.dbPath), { recursive: true })
  db = new Database(appConfig.dbPath)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  db.exec(`
    CREATE TABLE IF NOT EXISTS system_config (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      email TEXT,
      email_en TEXT,
      wechat TEXT,
      wechat_en TEXT,
      address TEXT,
      address_en TEXT,
      website TEXT,
      website_en TEXT,
      extras TEXT,
      channel_order TEXT,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS consultations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL,
      is_read INTEGER NOT NULL DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_consultations_created_at
      ON consultations (created_at DESC);
  `)

  const consultationCols = db
    .prepare(`PRAGMA table_info(consultations)`)
    .all() as Array<{ name: string }>
  if (!consultationCols.some((col) => col.name === 'is_read')) {
    db.exec(`ALTER TABLE consultations ADD COLUMN is_read INTEGER NOT NULL DEFAULT 0`)
  }

  const configCols = db
    .prepare(`PRAGMA table_info(system_config)`)
    .all() as Array<{ name: string }>
  const configColNames = new Set(configCols.map((col) => col.name))
  if (!configColNames.has('extras')) {
    db.exec(`ALTER TABLE system_config ADD COLUMN extras TEXT`)
  }
  for (const col of ['email_en', 'wechat_en', 'address_en', 'website_en', 'channel_order'] as const) {
    if (!configColNames.has(col)) {
      db.exec(`ALTER TABLE system_config ADD COLUMN ${col} TEXT`)
    }
  }

  return db
}
