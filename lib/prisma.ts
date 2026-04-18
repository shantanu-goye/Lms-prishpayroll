import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const prismaClientSingleton = () => {
  const url = process.env.TURSO_DATABASE_URL ?? process.env.DATABASE_URL
  if (!url) {
    throw new Error('Missing Turso database URL. Set TURSO_DATABASE_URL or DATABASE_URL.')
  }

  const clientConfig: { url: string; authToken?: string } = {
    url,
  }

  if (process.env.TURSO_AUTH_TOKEN) {
    clientConfig.authToken = process.env.TURSO_AUTH_TOKEN
  }

  const libsql = createClient(clientConfig)
  const adapter = new PrismaLibSQL(libsql)
  const clientOptions = { adapter } satisfies ConstructorParameters<typeof PrismaClient>[0]
  return new PrismaClient(clientOptions)
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}
