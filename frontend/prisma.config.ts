// ====================================
// TeddyBear's Room - Prisma Configuration
// Prisma 7+ configuration using defineConfig
// ====================================

import * as dotenv from 'dotenv'
import path from 'node:path'
import { defineConfig } from 'prisma/config'

// Load .env.local file explicitly
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

export default defineConfig({
  schema: 'prisma/schema.prisma',

  migrations: {
    path: 'prisma/migrations',
  },

  datasource: {
    url: process.env.DIRECT_URL || '',
  },
})
