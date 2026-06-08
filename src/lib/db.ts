import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  dbInitialized: boolean | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasourceUrl: process.env.DATABASE_URL,
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Auto-initialize database: run prisma db push on first connection if tables are missing
export async function ensureDatabaseInitialized() {
  if (globalForPrisma.dbInitialized) return

  try {
    // Quick check if a core table exists
    await db.admin.findFirst()
    globalForPrisma.dbInitialized = true
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : ''
    if (msg.includes('does not exist') || msg.includes('table') || msg.includes('relation')) {
      console.log('[DB Init] Tables missing, running prisma db push...')
      try {
        const { execSync } = await import('child_process')
        execSync('npx prisma db push --skip-generate --accept-data-loss 2>&1', {
          stdio: 'pipe',
          timeout: 30000,
        })
        console.log('[DB Init] Tables created successfully')
        // Seed defaults
        await seedDefaults()
        globalForPrisma.dbInitialized = true
      } catch (pushError) {
        console.error('[DB Init] Failed to create tables:', pushError)
      }
    } else {
      console.error('[DB Init] Unexpected error:', error)
    }
  }
}

async function seedDefaults() {
  try {
    // Seed admin if not exists
    const adminCount = await db.admin.count()
    if (adminCount === 0) {
      const crypto = await import('crypto')
      await db.admin.create({
        data: {
          username: 'admin',
          password: crypto.createHash('sha256').update('bawarchi@2026').digest('hex'),
        },
      })
      console.log('[DB Init] Default admin created')
    }

    // Seed settings if not exists
    const settingsCount = await db.restaurantSetting.count()
    if (settingsCount === 0) {
      await db.restaurantSetting.createMany({
        data: [
          { key: 'packaging_charge', value: '20', label: 'Packaging Charge' },
          { key: 'delivery_charge', value: '30', label: 'Delivery Charge' },
          { key: 'gst_percent', value: '5', label: 'GST Percentage' },
          { key: 'upi_id', value: 'ruchitpatel.8866-5@oksbi', label: 'UPI ID' },
        ],
      })
      console.log('[DB Init] Default settings created')
    }
  } catch (seedError) {
    console.error('[DB Init] Seed error:', seedError)
  }
}
