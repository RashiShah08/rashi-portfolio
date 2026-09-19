import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// Serves /api/contact during `npm run dev`, the way Vercel serves it in production.
// With no DATABASE_URL in .env.local, messages go to an in-memory Postgres and the
// alert email is printed here instead of sent, so the form can be tried safely.
function contactApi() {
  return {
    name: 'contact-api',
    apply: 'serve',
    async configureServer(server) {
      Object.assign(process.env, loadEnv(server.config.mode, process.cwd(), ''))
      if (!process.env.DATABASE_URL) {
        const { PGlite } = await import('@electric-sql/pglite')
        globalThis.__contactDb = new PGlite()
      }
      if (!process.env.GMAIL_REFRESH_TOKEN) {
        globalThis.__contactMail = async (v) =>
          server.config.logger.info(`\n[contact] would email: ${v.name} <${v.email}>\n${v.message}\n`)
      }
      server.middlewares.use('/api/contact', async (req, res) => {
        const { default: handler } = await server.ssrLoadModule('/api/contact.js')
        await handler(req, res)
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), contactApi()],
})
