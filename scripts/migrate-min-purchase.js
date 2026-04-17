const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function migrate() {
  try {
    // Add minPurchase column if it doesn't exist
    await prisma.$executeRaw`
      ALTER TABLE Voucher ADD COLUMN minPurchase INTEGER DEFAULT 0
    `
    console.log('Column minPurchase added successfully')
  } catch (error) {
    if (error.message.includes('duplicate column')) {
      console.log('Column minPurchase already exists')
    } else {
      console.error('Error:', error.message)
    }
  } finally {
    await prisma.$disconnect()
  }
}

migrate()