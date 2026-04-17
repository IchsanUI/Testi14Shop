import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { logActivity } from '@/lib/logger'
import { createRedeemCode } from '@/lib/redeemCode'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, context: RouteContext) {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await context.params

    // Check if testimonial exists and is approved
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    })

    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimoni tidak ditemukan' },
        { status: 404 }
      )
    }

    if (!testimonial.approved) {
      return NextResponse.json(
        { error: 'Testimoni belum disetujui' },
        { status: 400 }
      )
    }

    // Check if voucher already assigned (successful redeem)
    if (testimonial.voucher && testimonial.voucherId) {
      return NextResponse.json(
        { error: 'Voucher sudah diberikan untuk testimoni ini' },
        { status: 400 }
      )
    }

    // Check if there's an existing unused redeem code
    const existingCode = await prisma.redeemCode.findFirst({
      where: {
        testimonialId: id,
        used: false,
      },
    })

    if (existingCode) {
      return NextResponse.json({
        success: true,
        message: 'Kode redeem sudah ada',
        code: existingCode.code,
        customer: {
          name: testimonial.name,
          whatsapp: testimonial.whatsapp,
        },
      })
    }

    // No valid code exists — create new one
    const code = await createRedeemCode(id)

    if (!code) {
      return NextResponse.json(
        { error: 'Gagal membuat kode redeem' },
        { status: 500 }
      )
    }

    // Log activity
    await logActivity({
      userId: session.id,
      role: session.role,
      action: 'generate_redeem_code',
      description: `Membuat kode redeem untuk testimoni pelanggan ${testimonial.name}`,
      metadata: {
        testimonialId: id,
        customerName: testimonial.name,
        customerWhatsapp: testimonial.whatsapp,
        redeemCode: code,
      },
      request,
    })

    return NextResponse.json({
      success: true,
      message: 'Kode redeem berhasil dibuat',
      code,
      customer: {
        name: testimonial.name,
        whatsapp: testimonial.whatsapp,
      },
    })
  } catch (error) {
    console.error('Error generating redeem code:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal membuat kode redeem' },
      { status: 500 }
    )
  }
}
