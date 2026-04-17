import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  // Check authentication
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const service = searchParams.get('service')
    const approved = searchParams.get('approved')

    const where: any = {}

    if (service) {
      where.services = {
        contains: service,
      }
    }

    if (approved !== null) {
      where.approved = approved === 'true'
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Fetch the latest redeem code for each testimonial
    const testimonialIds = testimonials.map(t => t.id)
    const redeemCodes = await prisma.redeemCode.findMany({
      where: {
        testimonialId: { in: testimonialIds },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Map latest redeem code per testimonial
    const redeemCodeMap: Record<string, typeof redeemCodes[0] | undefined> = {}
    for (const rc of redeemCodes) {
      if (!redeemCodeMap[rc.testimonialId]) {
        redeemCodeMap[rc.testimonialId] = rc
      }
    }

    // Attach redeemCode to each testimonial
    const testimonialsWithCode = testimonials.map(t => ({
      ...t,
      redeemCode: redeemCodeMap[t.id] ?? null,
    }))

    return NextResponse.json({
      success: true,
      testimonials: testimonialsWithCode,
    })
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}
