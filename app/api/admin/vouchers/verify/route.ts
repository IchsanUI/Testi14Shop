import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { logActivity } from '@/lib/logger'

export async function POST(request: NextRequest) {
  // Check authentication
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { barcode, redeem = false, purchaseAmount } = body

    if (!barcode) {
      return NextResponse.json(
        { error: 'Barcode diperlukan' },
        { status: 400 }
      )
    }

    // Find testimonial by barcode
    const testimonial = await prisma.testimonial.findFirst({
      where: { barcode },
    })

    if (!testimonial) {
      return NextResponse.json(
        {
          valid: false,
          message: 'Voucher tidak ditemukan',
        },
        { status: 404 }
      )
    }

    // Get voucher info
    const voucher = testimonial.voucherId
      ? await prisma.voucher.findUnique({
          where: { id: testimonial.voucherId },
        })
      : null

    if (!voucher) {
      return NextResponse.json(
        {
          valid: false,
          message: 'Voucher tidak valid',
        },
        { status: 404 }
      )
    }

    if (!voucher.active) {
      return NextResponse.json({
        valid: false,
        message: 'Voucher ini sudah tidak aktif',
        voucher: {
          name: voucher.name,
          code: voucher.code,
          value: voucher.value,
          valueType: voucher.valueType,
        },
      })
    }

    // Check if voucher is already used
    if (testimonial.voucherUsed) {
      return NextResponse.json({
        valid: false,
        message: 'Voucher ini sudah digunakan',
        voucher: {
          name: voucher.name,
          code: voucher.code,
          value: voucher.value,
          valueType: voucher.valueType,
        },
      })
    }

    // Check if voucher is expired
    const expiryDate = new Date(testimonial.createdAt)
    expiryDate.setDate(expiryDate.getDate() + voucher.expiryDays)
    const now = new Date()

    if (now > expiryDate) {
      return NextResponse.json({
        valid: false,
        message: `Voucher sudah kadaluarsa pada ${expiryDate.toLocaleDateString('id-ID')}`,
        voucher: {
          name: voucher.name,
          code: voucher.code,
          value: voucher.value,
          valueType: voucher.valueType,
        },
        expiredAt: expiryDate,
      })
    }

    // Check minimum purchase requirement
    if (redeem && purchaseAmount !== undefined) {
      if (purchaseAmount < Number(voucher.minPurchase)) {
        return NextResponse.json({
          valid: false,
          message: `Minimal pembelian Rp ${Number(voucher.minPurchase).toLocaleString('id-ID')}. Total pembelian saat ini Rp ${purchaseAmount.toLocaleString('id-ID')}`,
          voucher: {
            name: voucher.name,
            code: voucher.code,
            value: voucher.value,
            valueType: voucher.valueType,
            minPurchase: Number(voucher.minPurchase),
          },
          purchaseAmount,
        })
      }
    }

    // If redeem is true, mark voucher as USED (admin confirms transaction usage)
    if (redeem) {
      // Update testimonial to mark voucher as used
      await prisma.testimonial.update({
        where: { id: testimonial.id },
        data: {
          voucherUsed: true,
          voucherUsedAt: new Date()
        },
      })

      // Increment voucher transaction count (used count already incremented during initial redeem)
      await prisma.voucher.update({
        where: { id: voucher.id },
        data: {
          transactionCount: { increment: 1 }
        }
      })

      // Create voucher redeem record for tracking
      await prisma.voucherRedeem.create({
        data: {
          testimonialId: testimonial.id,
          voucherCode: voucher.code,
          barcode: testimonial.barcode || '',
        }
      })

      // Log activity
      await logActivity({
        userId: session.id,
        role: session.role,
        action: 'use_voucher',
        description: `Menggunakan voucher ${voucher.name} untuk pelanggan ${testimonial.name} di transaksi`,
        metadata: {
          testimonialId: testimonial.id,
          voucherId: voucher.id,
          voucherCode: voucher.code,
          customerName: testimonial.name,
          customerWhatsApp: testimonial.whatsapp,
          discountValue: voucher.value,
          discountType: voucher.valueType,
          purchaseAmount: purchaseAmount,
        },
        request,
      })

      return NextResponse.json({
        valid: true,
        message: 'Voucher berhasil digunakan!',
        voucher: {
          id: voucher.id,
          name: voucher.name,
          code: voucher.code,
          value: voucher.value,
          valueType: voucher.valueType,
          minPurchase: Number(voucher.minPurchase),
        },
        customer: {
          name: testimonial.name,
          whatsapp: testimonial.whatsapp,
          services: testimonial.services,
          rating: testimonial.rating,
          message: testimonial.message,
          photo: testimonial.photo,
          submittedAt: testimonial.createdAt,
        },
        usedAt: new Date().toISOString(),
      })
    }

    // Log verification activity
    await logActivity({
      userId: session.id,
      role: session.role,
      action: 'verify_voucher',
      description: `Memverifikasi voucher ${voucher.name} untuk pelanggan ${testimonial.name}`,
      metadata: {
        testimonialId: testimonial.id,
        voucherId: voucher.id,
        voucherCode: voucher.code,
      },
      request,
    })

    // Otherwise just verify (not redeem yet)
    return NextResponse.json({
      valid: true,
      message: 'Voucher valid',
      voucher: {
        id: voucher.id,
        name: voucher.name,
        code: voucher.code,
        value: voucher.value,
        valueType: voucher.valueType,
        minPurchase: Number(voucher.minPurchase),
      },
      customer: {
        name: testimonial.name,
        whatsapp: testimonial.whatsapp,
        services: testimonial.services,
        rating: testimonial.rating,
        message: testimonial.message,
        photo: testimonial.photo,
        submittedAt: testimonial.createdAt,
      },
      expiresAt: expiryDate,
    })
  } catch (error) {
    console.error('Error verifying voucher:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memverifikasi voucher' },
      { status: 500 }
    )
  }
}
