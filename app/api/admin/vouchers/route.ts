import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { logActivity } from '@/lib/logger'

export async function GET(request: NextRequest) {
  // Check authentication
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const vouchers = await prisma.voucher.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Serialize BigInt to Number for JSON response
    const serializedVouchers = vouchers.map(v => ({
      ...v,
      minPurchase: Number(v.minPurchase),
    }))

    return NextResponse.json({
      success: true,
      vouchers: serializedVouchers,
    })
  } catch (error) {
    console.error('Error fetching vouchers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vouchers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Check authentication
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, code, value, valueType, minPurchase, quota, probability, active, expiryDays } = body

    // Validate required fields
    if (!name || !value || !quota || !probability) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Generate code from name if not provided
    const generatedCode = code || name.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 12)

    // Check if code already exists
    const existingVoucher = await prisma.voucher.findUnique({
      where: { code: generatedCode },
    })

    if (existingVoucher) {
      return NextResponse.json(
        { error: 'Voucher code already exists' },
        { status: 400 }
      )
    }

    const voucher = await prisma.voucher.create({
      data: {
        name,
        code: generatedCode,
        value,
        valueType: valueType || 'percentage',
        minPurchase: minPurchase ? BigInt(minPurchase) : BigInt(0),
        quota,
        probability,
        active: active ?? true,
        expiryDays: expiryDays || 7,
      },
    })

    // Serialize BigInt to Number for JSON response
    const serializedVoucher = {
      ...voucher,
      minPurchase: Number(voucher.minPurchase),
    }

    // Log activity
    await logActivity({
      userId: session.id,
      role: session.role,
      action: 'create_voucher',
      description: `Membuat voucher baru: ${voucher.name} (${voucher.code})`,
      metadata: {
        voucherId: voucher.id,
        voucherCode: voucher.code,
        value: voucher.value,
        valueType: voucher.valueType,
        quota: voucher.quota,
        probability: voucher.probability,
      },
      request,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Voucher created successfully',
        voucher: serializedVoucher,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating voucher:', error)
    return NextResponse.json(
      { error: 'Failed to create voucher' },
      { status: 500 }
    )
  }
}
