const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function migrate() {
  try {
    // Add voucherUsedAt column if it doesn't exist
    await prisma.$executeRaw`
      ALTER TABLE Testimonial ADD COLUMN voucherUsedAt DATETIME
    `
    console.log('Column voucherUsedAt added successfully')
  } catch (error) {
    if (error.message.includes('duplicate column')) {
      console.log('Column voucherUsedAt already exists')
    } else {
      console.error('Error:', error.message)
    }
  } finally {
    await prisma.$disconnect()
  }
}

migrate()