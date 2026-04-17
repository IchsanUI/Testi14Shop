import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireSuperAdmin } from '@/lib/auth'

export async function POST() {
  // Require super admin access
  const auth = await requireSuperAdmin()
  if (auth instanceof NextResponse) return auth

  try {
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

    const results = []
    for (const voucher of vouchers) {
      const result = await prisma.voucher.upsert({
        where: { code: voucher.code },
        update: {},
        create: voucher,
      })
      results.push(result)
      console.log(`✅ Created voucher: ${voucher.name} (${voucher.code})`)
    }

    console.log('🎉 Seed completed!')

    return NextResponse.json(
      {
        success: true,
        message: 'Vouchers seeded successfully',
        vouchers: results,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Seed failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to seed vouchers',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
