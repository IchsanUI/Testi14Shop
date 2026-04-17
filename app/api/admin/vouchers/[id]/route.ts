import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { logActivity } from '@/lib/logger'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  // Check authentication
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await context.params

    const voucher = await prisma.voucher.findUnique({
      where: { id },
    })

    if (!voucher) {
      return NextResponse.json(
        { error: 'Voucher not found' },
        { status: 404 }
      )
    }

    // Serialize BigInt to Number for JSON response
    const serializedVoucher = {
      ...voucher,
      minPurchase: Number(voucher.minPurchase),
    }

    return NextResponse.json({
      success: true,
      voucher: serializedVoucher,
    })
  } catch (error) {
    console.error('Error fetching voucher:', error)
    return NextResponse.json(
      { error: 'Failed to fetch voucher' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  // Check authentication
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await context.params
    const body = await request.json()
    const { name, code, value, valueType, minPurchase, quota, probability, active, expiryDays } = body

    // Check if new code already exists (and it's not the same voucher)
    if (code) {
      const existingVoucher = await prisma.voucher.findUnique({
        where: { code },
      })

      if (existingVoucher && existingVoucher.id !== id) {
        return NextResponse.json(
          { error: 'Voucher code already exists' },
          { status: 400 }
        )
      }
    }

    // Get existing voucher for logging
    const existingVoucher = await prisma.voucher.findUnique({
      where: { id },
    })

    if (!existingVoucher) {
      return NextResponse.json(
        { error: 'Voucher not found' },
        { status: 404 }
      )
    }

    const voucher = await prisma.voucher.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(code && { code }),
        ...(value !== undefined && { value }),
        ...(valueType && { valueType }),
        ...(minPurchase !== undefined && { minPurchase: BigInt(minPurchase) }),
        ...(quota !== undefined && { quota }),
        ...(probability !== undefined && { probability }),
        ...(active !== undefined && { active }),
        ...(expiryDays !== undefined && { expiryDays }),
      },
    })

    // Log activity
    await logActivity({
      userId: session.id,
      role: session.role,
      action: 'update_voucher',
      description: `Mengupdate voucher: ${voucher.name} (${voucher.code})`,
      metadata: {
        voucherId: voucher.id,
        changes: body,
      },
      request,
    })

    // Serialize BigInt to Number for JSON response
    const serializedVoucher = {
      ...voucher,
      minPurchase: Number(voucher.minPurchase),
    }

    return NextResponse.json({
      success: true,
      message: 'Voucher updated successfully',
      voucher: serializedVoucher,
    })
  } catch (error) {
    console.error('Error updating voucher:', error)
    return NextResponse.json(
      { error: 'Failed to update voucher' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  // Check authentication
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await context.params

    // Get voucher for logging before deletion
    const voucher = await prisma.voucher.findUnique({
      where: { id },
    })

    if (!voucher) {
      return NextResponse.json(
        { error: 'Voucher not found' },
        { status: 404 }
      )
    }

    await prisma.voucher.delete({
      where: { id },
    })

    // Log activity
    await logActivity({
      userId: session.id,
      role: session.role,
      action: 'delete_voucher',
      description: `Menghapus voucher: ${voucher.name} (${voucher.code})`,
      metadata: {
        deletedVoucherId: id,
        voucherCode: voucher.code,
      },
      request,
    })

    return NextResponse.json({
      success: true,
      message: 'Voucher deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting voucher:', error)
    return NextResponse.json(
      { error: 'Failed to delete voucher' },
      { status: 500 }
    )
  }
}
