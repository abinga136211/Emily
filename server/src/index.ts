import fs from 'node:fs'
import path from 'node:path'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { appConfig } from './config.js'
import { getDb } from './db.js'
import { healthRouter } from './routes/health.js'
import { configRouter } from './routes/config.js'
import { consultationsRouter } from './routes/consultations.js'
import { adminRouter } from './routes/admin.js'

getDb()

const app = express()

if (appConfig.trustProxy) {
  app.set('trust proxy', 1)
}

const corsOrigin =
  appConfig.corsOrigin === 'false' || appConfig.corsOrigin === ''
    ? false
    : appConfig.corsOrigin === '*'
      ? true
      : appConfig.corsOrigin.split(',').map((s) => s.trim())

app.use(
  cors({
    origin: corsOrigin,
    credentials: true
  })
)
app.use(express.json({ limit: appConfig.bodyLimit }))
app.use(cookieParser())

app.use('/api', healthRouter)
app.use('/api', configRouter)
app.use('/api', consultationsRouter)
app.use('/api/admin', adminRouter)

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

if (appConfig.isProd) {
  const dist = appConfig.distPath
  if (fs.existsSync(dist)) {
    app.use(
      express.static(dist, {
        index: false,
        maxAge: '1h',
        etag: true
      })
    )
    app.get(/^(?!\/api).*/, (_req, res) => {
      res.sendFile(path.join(dist, 'index.html'))
    })
    console.log(`[skmc] Serving SPA from ${dist}`)
  } else {
    console.warn(`[skmc] Production dist not found at ${dist}`)
  }
}

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
)

app.listen(appConfig.port, appConfig.host, () => {
  console.log(
    `[skmc] API listening on http://${appConfig.host}:${appConfig.port} (${appConfig.isProd ? 'production' : 'development'})`
  )
  console.log(`[skmc] DB: ${appConfig.dbPath}`)
  console.log(`[skmc] trust proxy: ${appConfig.trustProxy}`)
})
