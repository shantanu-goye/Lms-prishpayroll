import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

// Prisma schema uses DATABASE_URL. In production, mirror TURSO_DATABASE_URL if needed.
if (!process.env.DATABASE_URL && process.env.TURSO_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.TURSO_DATABASE_URL
}

const prismaClientSingleton = () => {
  // Use Turso in production, local SQLite in development
  if (process.env.NODE_ENV === 'production' && process.env.TURSO_DATABASE_URL) {
    const libsql = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })
    const adapter = new PrismaLibSQL(libsql)
    // @ts-ignore - adapter is valid with driverAdapters preview feature
    return new PrismaClient({ adapter })
  }
  
  return new PrismaClient()
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}
