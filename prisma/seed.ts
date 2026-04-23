import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  const manualDataPath = path.join(process.cwd(), 'data', 'relatorio_pntp_manual.json')
  
  if (!fs.existsSync(manualDataPath)) {
    console.log('Manual data file not found.')
    return
  }

  const fileContent = fs.readFileSync(manualDataPath, 'utf8')
  const data = JSON.parse(fileContent)
  const manualUpdates = data.manual_updates

  console.log('Starting seed...')

  for (const [id, details] of Object.entries(manualUpdates)) {
    const item = details as any
    
    // Create or update Criterion
    await prisma.criterion.upsert({
      where: { id },
      update: {},
      create: {
        id,
        description: `Critério ${id}`, // Default description
      },
    })

    // Create Audit entry
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

  console.log('Seed finished successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
