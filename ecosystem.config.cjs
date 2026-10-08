module.exports = {
  apps: [
    {
      name: 'skmc-api',
      cwd: __dirname + '/server',
      script: 'dist/index.js',
      instances: 1,
      exec_mode: 'fork',
      // Prefer secrets in server/.env (loaded by dotenv). Override here if needed.
      env: {
        NODE_ENV: 'production',
        HOST: '0.0.0.0',
        PORT: 3001,
        TRUST_PROXY: '1',
        DB_PATH: './data/app.db',
        DIST_PATH: '../dist',
        CORS_ORIGIN: 'false'
        // Set ADMIN_PASSWORD and ADMIN_SECRET in server/.env before starting PM2
      }
    }
  ]
}
