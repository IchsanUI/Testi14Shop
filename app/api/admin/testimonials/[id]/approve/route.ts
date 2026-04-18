import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { logActivity } from '@/lib/logger'
import { createRedeemCode } from '@/lib/redeemCode'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, context: RouteContext) {
  // Check authentication
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await context.params

    // Get testimonial info for logging
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id },
    })

    if (!existingTestimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      )
    }

    if (existingTestimonial.approved) {
      return NextResponse.json(
        { error: 'Testimoni sudah disetujui sebelumnya' },
        { status: 400 }
      )
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: { approved: true },
    })

    // Auto-generate redeem code when testimonial is approved
    let redeemCode: string | null = null
    try {
      redeemCode = await createRedeemCode(id)
    } catch (codeErr) {
      // Non-fatal: log but don't fail the approval
      console.error('Failed to auto-generate redeem code:', codeErr)
    }

    // Log activity
    await logActivity({
      userId: session.id,
      role: session.role,
      action: 'approve_testimonial',
      description: `Menyetujui testimoni dari ${testimonial.name}${redeemCode ? ` dan membuat kode redeem ${redeemCode}` : ''}`,
      metadata: {
        testimonialId: testimonial.id,
        customerName: testimonial.name,
        rating: testimonial.rating,
        redeemCode,
      },
      request,
    })

    return NextResponse.json({
      success: true,
      message: redeemCode
        ? `Testimonial approved dan kode redeem ${redeemCode} dibuat`
        : 'Testimonial approved',
      testimonial,
      redeemCode,
      whatsapp: existingTestimonial.whatsapp,
    })
  } catch (error) {
    console.error('Error approving testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to approve testimonial' },
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

    // Get testimonial info for logging
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id },
    })

    if (!existingTestimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      )
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: { approved: false },
    })

    // Log activity
    await logActivity({
      userId: session.id,
      role: session.role,
      action: 'reject_testimonial',
      description: `Menolak testimoni dari ${testimonial.name}`,
      metadata: {
        testimonialId: testimonial.id,
        customerName: testimonial.name,
        rating: testimonial.rating,
      },
      request,
    })

    return NextResponse.json({
      success: true,
      message: 'Testimonial rejected',
      testimonial,
    })
  } catch (error) {
    console.error('Error rejecting testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to reject testimonial' },
      { status: 500 }
    )
  }
}
