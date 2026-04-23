import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import fs from 'fs'
import path from 'path'
import * as dotenv from 'dotenv'
import { todosCriterios } from '../src/data/criterios'

dotenv.config()

const connectionString = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Starting seed...')

  // 1. Seed all base criteria
  console.log('Seeding base criteria...')
  for (const crit of todosCriterios) {
    await prisma.criterion.upsert({
      where: { id: crit.id },
      update: {
        description: crit.texto,
        group: crit.dimensao,
      },
      create: {
        id: crit.id,
        description: crit.texto,
        group: crit.dimensao,
      },
    })
  }

  // 2. Apply manual updates from JSON if exists
  const manualDataPath = path.join(process.cwd(), 'data', 'relatorio_pntp_manual.json')
  
  if (fs.existsSync(manualDataPath)) {
    console.log('Applying manual updates from JSON...')
    const fileContent = fs.readFileSync(manualDataPath, 'utf8')
    const data = JSON.parse(fileContent)
    const manualUpdates = data.manual_updates

    for (const [id, details] of Object.entries(manualUpdates)) {
      const item = details as any
      
      // Ensure criterion exists (redundant but safe)
      await prisma.criterion.upsert({
        where: { id },
        update: {},
        create: {
          id,
          description: `Critério ${id}`,
        },
      })

      // Create Audit entry for the manual update
      await prisma.audit.create({
        data: {
          criterionId: id,
          status: item.status || 'unknown',
          url: item.url || null,
          observation: item.obs || null,
          updatedAt: item.updated_at === 'manual' ? new Date() : new Date(item.updated_at),
        },
      })
    }
  }

  console.log('Seed finished successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
