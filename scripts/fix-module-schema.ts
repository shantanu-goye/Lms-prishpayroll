import { createClient } from '@libsql/client'
import * as dotenv from 'dotenv'
dotenv.config()

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

async function main() {
  console.log('🛠️ Adding missing columns to Module table...')
  
  try {
    await client.execute('ALTER TABLE "Module" ADD COLUMN "description" TEXT')
    console.log('  ✅ Added description column')
  } catch (err: any) {
    if (err.message.includes('duplicate column name')) {
      console.log('  ℹ️ Column description already exists')
    } else {
      console.error(`  ❌ Error adding description: ${err.message}`)
    }
  }

  try {
    await client.execute('ALTER TABLE "Module" ADD COLUMN "fileUrl" TEXT')
    console.log('  ✅ Added fileUrl column')
  } catch (err: any) {
    if (err.message.includes('duplicate column name')) {
      console.log('  ℹ️ Column fileUrl already exists')
    } else {
      console.error(`  ❌ Error adding fileUrl: ${err.message}`)
    }
  }

  console.log('\n✨ Database sync complete!')
}

main().catch(console.error)
