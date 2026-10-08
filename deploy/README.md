# Production deployment

Same-origin model: Node serves the Vue `dist/` and `/api/*`. Nginx (optional) terminates TLS and reverse-proxies to Node.

## Prerequisites

- Node.js 20+ (22 recommended) with build tools for `better-sqlite3` on the target OS
- Copy `server/.env.example` → `server/.env` and set at least:
  - `ADMIN_PASSWORD` — admin login for `/admin`
  - `ADMIN_SECRET` — cookie signing secret
  - `DB_PATH` — prefer an absolute path on a data disk
  - `TRUST_PROXY=1` when behind Nginx
  - `NODE_ENV=production`
  - `CORS_ORIGIN=false` for same-origin

## Build & run

```bash
# install (root + server)
npm install

# build SPA with base=/ (required for Node static hosting) + compile server
npm run build:server

# foreground
npm start

# or PM2
pm2 start ecosystem.config.cjs
pm2 save
```

Admin UI: `https://your-domain/admin/login`  
Health: `GET /api/health`

## Nginx

See [nginx.example.conf](nginx.example.conf). Point DNS + TLS at the box, then reload Nginx.

## Backup

Copy the SQLite file at `DB_PATH` (and `-wal`/`-shm` if present while the app is stopped, or use `sqlite3 .backup`).

## Notes

- Do not commit `server/.env` or `*.db`.
- After changing Node major version on the server, run `npm run rebuild:sqlite --prefix server`.
- For GitHub Pages (`base: /Emily/`), use `npm run build` only; use `npm run build:server` for this Node hosting path.
