# SKMC 项目说明（return.md）

SK Management Consulting 官网 + Node/SQLite 后端，支持联系信息可配置、咨询表单落库，以及口令保护的管理后台。

---

## 1. 项目入口

| 角色 | 入口文件 / 命令 | 说明 |
|---|---|---|
| 前端应用挂载 | `src/main.ts` → `src/App.vue` | Vue 3 SPA |
| 前端路由 | `src/router/index.ts` | 页面与后台路由 |
| 前端内容数据 | `src/data/content.ts` | 中英硬编码文案（配置兜底来源） |
| 前端 i18n | `src/i18n/index.ts` | 语言切换与 `content` 选择 |
| 后端入口 | `server/src/index.ts` | Express API + 生产态静态托管 |
| 后端环境 | `server/.env`（参考 `server/.env.example`） | 端口、DB、口令等 |
| HTML 壳 | `index.html` | Vite 入口 HTML |

**常用脚本（仓库根目录 `package.json`）：**

```bash
npm run dev          # 仅前端 Vite
npm run dev:server   # 仅后端 API（默认 :3001）
npm run dev:all      # 前后端同时启动
npm run build        # 前端构建（base=/Emily/，适合 GitHub Pages）
npm run build:server # 前端 base=/ + 编译后端（适合 Node 同域托管）
npm start            # 生产启动后端（托管 dist + /api）
```

---

## 2. 技术栈

### 前端

- Vue 3 + TypeScript
- Vue Router 4
- Vite 5
- Sass / SCSS
- 轻量自研 i18n（非 vue-i18n）

### 后端

- Node.js（建议 20+，本机常用 22）
- Express 4
- better-sqlite3（原生 SQLite）
- cookie-parser、cors、dotenv
- TypeScript（`tsx` 开发，`tsc` 生产编译）

### 部署相关

- PM2：`ecosystem.config.cjs`
- Nginx 示例：`deploy/nginx.example.conf`
- 说明：`deploy/README.md`、`server/README.md`

---

## 3. 项目架构

```
浏览器
  ├─ 官网页面（Vue） ──GET/POST──► /api/* ──► Express
  └─ 管理后台 /admin ──Cookie──► /api/admin/* ──► Express
                                      │
                                      ▼
                                 SQLite (app.db)
```

**目录结构（要点）：**

```
Emily/
├── index.html
├── package.json                 # 根脚本、前端依赖
├── vite.config.ts               # base=/Emily/，开发代理 /api → :3001
├── src/
│   ├── main.ts / App.vue
│   ├── router/index.ts
│   ├── data/content.ts          # 全站文案
│   ├── i18n/index.ts
│   ├── api/site.ts              # 前端 API 封装
│   ├── composables/useSiteConfig.ts  # 配置拉取/轮询/跨标签同步
│   ├── views/                   # 官网页面
│   ├── views/admin/             # 后台页面
│   └── components/
├── public/                      # 静态图片等
├── server/
│   ├── package.json
│   ├── .env / .env.example
│   ├── data/app.db              # SQLite 文件（gitignore）
│   └── src/
│       ├── index.ts
│       ├── config.ts / db.ts / auth.ts / defaults.ts
│       ├── middleware/requireAdmin.ts
│       └── routes/              # health / config / consultations / admin
├── deploy/                      # Nginx + 部署说明
└── ecosystem.config.cjs         # PM2
```

**数据流要点：**

- 官网联系渠道：`GET /api/config` → `useSiteConfig` 合并进 `contactChannels` → Contact / Footer 展示；空库用硬编码兜底。
- 咨询表单：`POST /api/consultations` → 写入 `consultations`。
- 后台：口令登录发 httpOnly Cookie；可查看/删除咨询列表、编辑系统配置。
- 近实时：咨询列表约 2s 轮询；配置约 3s 轮询 + BroadcastChannel / localStorage 跨标签通知。

---

## 4. 数据库信息

### 4.1 位置

| 项 | 值 |
|---|---|
| 默认路径 | `server/data/app.db`（相对 `server/`） |
| 配置项 | 环境变量 `DB_PATH`（可改为绝对路径，如服务器数据盘） |
| 引擎 | SQLite，`better-sqlite3`，启动时 `journal_mode=WAL` |
| 建表时机 | 服务启动调用 `getDb()` 时 `CREATE TABLE IF NOT EXISTS` |

### 4.2 表结构

#### `system_config`（系统配置，单行 `id = 1`）

| 列 | 类型 | 说明 |
|---|---|---|
| id | INTEGER PK | 固定为 1 |
| email | TEXT | 商务邮箱 |
| wechat | TEXT | 商务微信 |
| address | TEXT | 办公地址 |
| website | TEXT | 官方网站 |
| updated_at | TEXT | ISO 更新时间 |

空库或字段为空时，公开接口用 `server/src/defaults.ts` 兜底（对齐现站中文联系信息）。

#### `consultations`（咨询表单）

| 列 | 类型 | 说明 |
|---|---|---|
| id | INTEGER PK AUTOINCREMENT | |
| ip | TEXT | 客户端 IP |
| name | TEXT NOT NULL | 姓名 |
| email | TEXT NOT NULL | 邮箱 |
| message | TEXT NOT NULL | 留言 |
| created_at | TEXT NOT NULL | ISO 创建时间 |

索引：`idx_consultations_created_at`（`created_at DESC`）。

### 4.3 建表代码

来源：`server/src/db.ts`

```sql
CREATE TABLE IF NOT EXISTS system_config (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  email TEXT,
  wechat TEXT,
  address TEXT,
  website TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS consultations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_consultations_created_at
  ON consultations (created_at DESC);
```

---

## 5. 接口信息

基址：开发环境由 Vite 将 `/api` 代理到 `http://127.0.0.1:3001`；生产同域直连 `/api`。

### 5.1 公开接口

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/health` | 健康检查，返回 `{ ok: true }` |
| GET | `/api/config` | 系统配置（DB + 兜底），`{ email, wechat, address, website }` |
| POST | `/api/consultations` | 提交咨询 |

**POST `/api/consultations`**

- Body：`{ name, email, message }`（均必填；email 需合法）
- 服务端写入 IP、`created_at`
- 按 IP 限流（约 5 次/分钟）
- 成功：`201 { id, created_at }`

### 5.2 管理接口（需登录 Cookie，除 login/me）

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/admin/login` | Body `{ password }`，设置 httpOnly Cookie |
| POST | `/api/admin/logout` | 清除 Cookie |
| GET | `/api/admin/me` | `{ authenticated: boolean }` |
| GET | `/api/admin/consultations?page=&limit=` | 咨询分页列表（倒序） |
| DELETE | `/api/admin/consultations/:id` | 按 ID 删除一条咨询记录 |
| GET | `/api/admin/config` | 配置 + `fromDefaults` 标记 |
| PUT | `/api/admin/config` | Body `{ email, wechat, address, website }` upsert |

口令：`ADMIN_PASSWORD`（见 `server/.env`）。未配置口令时管理接口返回 `503`。

---

## 6. 网页链接及对应信息

开发态 Vite `base` 为 `/Emily/`，本地地址形如：`http://localhost:5173/Emily/...`（端口以终端为准）。

| 路径（相对 base） | 名称 | 说明 |
|---|---|---|
| `/` | 首页 | Hero、定位、服务、行业、联系引导 |
| `/services` | 核心服务 | 服务详情 |
| `/industries` | 行业解决方案 | 行业方案 |
| `/about` | 关于我们 | 使命、保密、优势 |
| `/contact` | 联系咨询 | 表单提交 + 联系渠道（可被配置覆盖） |
| `/admin/login` | 后台登录 | 口令登录 |
| `/admin` / `/admin/consultations` | 咨询列表 | 查看/删除表单留言（自动刷新） |
| `/admin/config` | 系统配置 | 编辑邮箱/微信/地址/官网 |

生产 Node 同域托管时，`build:server` 使用 `base=/`，链接为站点根路径：`https://域名/`、`https://域名/contact`、`https://域名/admin/login` 等。

**配置与展示对应关系：**

| 配置字段 | 官网展示 |
|---|---|
| email | 商务邮箱 |
| wechat | 商务微信 |
| address | 办公地址 |
| website | 官方网站 |

---

## 7. 本地部署 / 启动

### 7.1 环境准备

1. 安装 Node.js（建议 20+）
2. Windows 首次安装 `better-sqlite3` 需 Python + Visual Studio Build Tools（原生编译）
3. 在仓库根目录：

```bash
cd C:\Users\13060\Desktop\Emily\Emily
npm install
```

（根目录 `postinstall` 会安装 `server/` 依赖。）

4. 配置后端环境：

```bash
cd server
copy .env.example .env
# 编辑 .env：至少设置 ADMIN_PASSWORD
```

### 7.2 启动

**方式 A — 一键：**

```bash
cd 仓库根目录
npm run dev:all
```

**方式 B — 两个 CMD 窗口：**

```bash
npm run dev:server
npm run dev
```

- 前端：终端打印的 Local 地址，如 `http://localhost:5173/Emily/`
- 后端：`http://127.0.0.1:3001`
- 后台：`http://localhost:5173/Emily/admin/login`

若原生模块加载失败：

```bash
npm run rebuild:sqlite --prefix server
```

---

## 8. 服务器部署

推荐：**同域** — Node 托管前端 `dist` + `/api`，前面可选 Nginx 做 HTTPS。

### 8.1 配置

编辑服务器上的 `server/.env`（勿提交仓库）：

| 变量 | 建议 |
|---|---|
| `NODE_ENV` | `production` |
| `HOST` / `PORT` | 如 `0.0.0.0` / `3001` |
| `DB_PATH` | 数据盘绝对路径 |
| `DIST_PATH` | 默认 `../dist` |
| `TRUST_PROXY` | `1`（经 Nginx 时必开，保证咨询 IP） |
| `CORS_ORIGIN` | `false`（同域） |
| `ADMIN_PASSWORD` / `ADMIN_SECRET` | 强口令与签名密钥 |

### 8.2 构建与启动

```bash
npm install
npm run build:server
npm start
# 或
pm2 start ecosystem.config.cjs
pm2 save
```

说明见 `deploy/README.md`；Nginx 反代示例见 `deploy/nginx.example.conf`。

### 8.3 备份

定期备份 `DB_PATH` 指向的 SQLite 文件（停服后一并备份 `-wal` / `-shm`，或使用 `sqlite3 .backup`）。

### 8.4 注意

- GitHub Pages 静态发布用 `npm run build`（`base=/Emily/`），不含 API/SQLite。
- 服务器 Node 托管必须用 `npm run build:server`（`base=/`）。
- Node 大版本升级后在服务器执行：`npm run rebuild:sqlite --prefix server`。

---

## 9. 接口请求 / 响应示例

### 健康检查

```http
GET /api/health
```

```json
{ "ok": true }
```

### 读取系统配置（公开）

```http
GET /api/config
```

```json
{
  "email": "contact@skmc-global.com",
  "wechat": "SK_Consulting_Global",
  "address": "中国广东省深圳市南山区华润总部大厦2001室",
  "website": "www.skmc-global.com"
}
```

### 提交咨询

```http
POST /api/consultations
Content-Type: application/json

{
  "name": "张三",
  "email": "zhang@example.com",
  "message": "想了解牌照申请"
}
```

成功：

```json
{ "id": 1, "created_at": "2026-09-29T06:45:37.507Z" }
```

常见错误：`400` 校验失败；`429` 触发限流（同 IP 约 5 次/分钟）。

### 后台登录

```http
POST /api/admin/login
Content-Type: application/json

{ "password": "你的ADMIN_PASSWORD" }
```

成功：`{ "ok": true }`，并设置 Cookie `skmc_admin`（httpOnly）。后续管理请求需携带该 Cookie（浏览器同源会自动带；`fetch` 需 `credentials: 'include'`）。

### 咨询列表（需登录）

```http
GET /api/admin/consultations?page=1&limit=20
```

```json
{
  "items": [
    {
      "id": 1,
      "ip": "127.0.0.1",
      "name": "张三",
      "email": "zhang@example.com",
      "message": "想了解牌照申请",
      "created_at": "2026-09-29T06:45:37.507Z"
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 1,
  "totalPages": 1
}
```

### 删除咨询（需登录）

```http
DELETE /api/admin/consultations/1
```

成功：

```json
{ "ok": true, "id": 1 }
```

常见错误：`400` ID 无效；`404` 记录不存在。后台咨询列表页每行有「删除」按钮，确认后调用本接口；删除后列表本地即时更新，空页时自动回退上一页。

### 更新系统配置（需登录）

```http
PUT /api/admin/config
Content-Type: application/json

{
  "email": "contact@skmc-global.com",
  "wechat": "SK_Consulting_Global",
  "address": "中国广东省深圳市南山区华润总部大厦2001室",
  "website": "www.skmc-global.com"
}
```

四个字段均必填。保存后官网 Contact / Footer 会通过轮询或跨标签广播更新展示。

---

## 10. 配置兜底默认值

来源：`server/src/defaults.ts`（与 `src/data/content.ts` 中文 `contactChannels` 对齐）

| 字段 | 默认值 |
|---|---|
| email | `contact@skmc-global.com` |
| wechat | `SK_Consulting_Global` |
| address | `中国广东省深圳市南山区华润总部大厦2001室` |
| website | `www.skmc-global.com` |

合并优先级：`数据库非空字段` → `上述 defaults` → 前端若 API 失败则整表回退 `content.contactChannels`。

---

## 11. 近实时同步说明

| 能力 | 实现 | 间隔 / 触发 |
|---|---|---|
| 后台咨询列表刷新 / 删除 | `AdminConsultationsView` 轮询列表；`DELETE /api/admin/consultations/:id` 删除单条 | 约 2 秒静默刷新；删除前二次确认 |
| 官网联系信息刷新 | `useSiteConfig.startSiteConfigSync` 轮询 `GET /api/config` | 约 3 秒；切回标签页立即拉一次 |
| 后台改配置后即时通知其他标签 | `BroadcastChannel('skmc-site-config')` + `localStorage` 键 `skmc-site-config-bump` | 保存成功时 `notifySiteConfigChanged()` |

这不是 WebSocket；属于短轮询 + 同源跨标签消息。实现文件：`src/composables/useSiteConfig.ts`、`src/views/admin/AdminConsultationsView.vue`。

---

## 12. 常见问题

| 现象 | 处理 |
|---|---|
| 前端能开、接口 404 / 代理失败 | 先起后端 `npm run dev:server`；确认 Vite 代理 `/api` → `3001` |
| `better-sqlite3` 安装或加载失败 | 安装 VS Build Tools + Python；执行 `npm run rebuild:sqlite --prefix server` |
| 后台登录 503 | `.env` 未设置 `ADMIN_PASSWORD` |
| 后台登录 401 | 口令与 `.env` 不一致；改 `.env` 后需重启后端进程 |
| 咨询 IP 一直是代理地址 | 生产设 `TRUST_PROXY=1`，Nginx 传 `X-Forwarded-For` |
| 改配置官网不变 | 确认保存成功；硬刷新官网标签；看 Network 是否有 `/api/config`；确认未只用静态 GH Pages（无后端） |
| 端口被占用 | 结束占用 `3001` / `5173` 的 node 进程后再启动 |
| 生产静态资源 404 | 必须用 `npm run build:server`（`base=/`），不要用 GH Pages 的 `/Emily/` 包直接给 Node 托管 |

---

## 13. 相关文件速查

| 文档 / 配置 | 路径 |
|---|---|
| 本说明 | `return.md` |
| 后端说明 | `server/README.md` |
| 部署说明 | `deploy/README.md` |
| Nginx 示例 | `deploy/nginx.example.conf` |
| PM2 | `ecosystem.config.cjs` |
| 环境变量模板 | `server/.env.example` |
| 前端 API 封装 | `src/api/site.ts` |
| 配置合并 / 轮询 | `src/composables/useSiteConfig.ts` |
| 建表逻辑 | `server/src/db.ts` |
