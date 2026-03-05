import { createClient } from '@libsql/client'
import { hash } from 'bcryptjs'
import * as dotenv from 'dotenv'
dotenv.config()

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

async function main() {
  console.log('🌱 Seeding Turso database...')

  const adminPassword = await hash('admin123', 10)
  const studentPassword = await hash('student123', 10)
  const now = new Date().toISOString()

  await client.execute({
    sql: `INSERT OR IGNORE INTO "User" ("email", "password", "name", "role", "createdAt", "updatedAt") VALUES (?, ?, ?, ?, ?, ?)`,
    args: ['admin@school.com', adminPassword, 'Admin User', 'ADMIN', now, now],
  })
  console.log('  ✅ Admin user created')

  await client.execute({
    sql: `INSERT OR IGNORE INTO "User" ("email", "password", "name", "role", "createdAt", "updatedAt") VALUES (?, ?, ?, ?, ?, ?)`,
    args: ['student@school.com', studentPassword, 'Student User', 'STUDENT', now, now],
  })
  console.log('  ✅ Student user created')

  console.log('\n✨ Seeding complete!')
}

main().catch(console.error)
