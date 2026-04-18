import { config } from 'dotenv'
import { defineConfig } from 'prisma/config'

config()

export default defineConfig({
  schema: './prisma/schema.prisma',
  db: {
    url: process.env.DATABASE_URL,
    adapter: 'libsql',
  },
})