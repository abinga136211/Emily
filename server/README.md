# SKMC API Server

Node + SQLite backend for site config and consultation forms.

Uses **better-sqlite3** (native addon). On Windows you need Python + Visual Studio Build Tools for first install / rebuild.

## Local development

```bash
cd server
cp .env.example .env   # set ADMIN_PASSWORD
npm install            # compiles better-sqlite3 if no prebuild
npm run dev
```

If the native module fails to load after a Node upgrade:

```bash
npm run rebuild:sqlite
```

API: `http://127.0.0.1:3001`

From repo root (with frontend + Vite `/api` proxy):

```bash
npm run dev:all
```

Admin (dev): open `/Emily/admin/login` on the Vite origin (default password from `.env`).

## Environment

| Variable | Purpose |
|---|---|
| `PORT` / `HOST` | Listen address |
| `DB_PATH` | SQLite file (use absolute path on server data disk) |
| `DIST_PATH` | Vue `dist` directory when `NODE_ENV=production` (default `../dist`) |
| `ADMIN_PASSWORD` | Required for `/admin` login and admin APIs |
| `ADMIN_SECRET` | Cookie signing secret |
| `TRUST_PROXY` | Set `1` behind Nginx (correct client IP on consultations) |
| `CORS_ORIGIN` | `*` in dev; `false` for same-origin production |
| `NODE_ENV` | `production` serves SPA from `DIST_PATH` |

## Production

See [../deploy/README.md](../deploy/README.md) for Nginx + PM2 steps.

```bash
# from repo root
npm run build:server
npm start
# or: pm2 start ecosystem.config.cjs
```

Backup `DB_PATH` regularly. Change `ADMIN_PASSWORD` / `ADMIN_SECRET` before going live.
