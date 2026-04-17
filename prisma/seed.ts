import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // ============================================
  // Create Admin Users
  // ============================================

  // Create Super Admin
  const superAdminPassword = await bcrypt.hash('superadmin123', 12)
  await prisma.user.upsert({
    where: { email: 'superadmin@14shop.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'superadmin@14shop.com',
      password: superAdminPassword,
      role: 'SUPER_ADMIN',
    },
  })
  console.log('Created Super Admin: superadmin@14shop.com (password: superadmin123)')

  // Create regular Admin
  const adminPassword = await bcrypt.hash('admin123', 12)
  await prisma.user.upsert({
    where: { email: 'admin@14shop.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@14shop.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('Created Admin: admin@14shop.com (password: admin123)')

  // ============================================
  // Create Vouchers
  // ============================================

  const vouchers = [
    {
      name: 'Diskon 50%',
      code: 'DISKON50',
      value: 50,
      valueType: 'percentage',
      minPurchase: 500000, // Min Rp 500.000
      quota: 10,
      probability: 10, // 10% chance
      expiryDays: 7, // Valid for 7 days
      active: true,
    },
    {
      name: 'Diskon 30%',
      code: 'DISKON30',
      value: 30,
      valueType: 'percentage',
      minPurchase: 300000, // Min Rp 300.000
      quota: 20,
      probability: 20, // 20% chance
      expiryDays: 7, // Valid for 7 days
      active: true,
    },
    {
      name: 'Diskon 20%',
      code: 'DISKON20',
      value: 20,
      valueType: 'percentage',
      minPurchase: 200000, // Min Rp 200.000
      quota: 30,
      probability: 30, // 30% chance
      expiryDays: 7, // Valid for 7 days
      active: true,
    },
    {
      name: 'Diskon 10%',
      code: 'DISKON10',
      value: 10,
      valueType: 'percentage',
      minPurchase: 100000, // Min Rp 100.000
      quota: 50,
      probability: 40, // 40% chance
      expiryDays: 7, // Valid for 7 days
      active: true,
    },
  ]

  for (const voucher of vouchers) {
    await prisma.voucher.upsert({
      where: { code: voucher.code },
      update: {},
      create: voucher,
    })
    console.log(`Created voucher: ${voucher.name} (${voucher.code})`)
  }

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
