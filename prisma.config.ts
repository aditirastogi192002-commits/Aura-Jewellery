// ─── Prisma 7 Config ──────────────────────────────────────────────────────────
// Prisma 7 removed `url` from schema.prisma. Connection URL lives here.
// dotenv is loaded manually because Prisma CLI does not auto-load .env files.
// ─────────────────────────────────────────────────────────────────────────────

// Load .env.local first (real credentials), fall back to .env (placeholder)
import { config } from 'dotenv'
config({ path: '.env.local' })
config()                        // fallback: .env

import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  datasource: {
    url: env('DATABASE_URL'),
  },
})
