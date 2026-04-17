const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'file:./dev.db'
})

async function main() {
  console.log('🌱 Starting seed...')

  // Create vouchers with different probabilities and quotas
  const vouchers = [
    {
      name: 'Diskon 50%',
      code: 'DISKON50',
      value: 50,
      quota: 10,
      probability: 10, // 10% chance
      active: true,
    },
    {
      name: 'Diskon 30%',
      code: 'DISKON30',
      value: 30,
      quota: 20,
      probability: 20, // 20% chance
      active: true,
    },
    {
      name: 'Diskon 20%',
      code: 'DISKON20',
      value: 20,
      quota: 30,
      probability: 30, // 30% chance
      active: true,
    },
    {
      name: 'Diskon 10%',
      code: 'DISKON10',
      value: 10,
      quota: 50,
      probability: 40, // 40% chance
      active: true,
    },
  ]

  for (const voucher of vouchers) {
    await prisma.voucher.upsert({
      where: { code: voucher.code },
      update: {},
      create: voucher,
    })
    console.log(`✅ Created voucher: ${voucher.name} (${voucher.code})`)
  }

  console.log('🎉 Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
