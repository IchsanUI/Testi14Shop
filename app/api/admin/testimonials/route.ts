import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const searchParams = request.nextUrl.searchParams

    // Search & filter params
    const search       = searchParams.get('search') ?? ''
    const service      = searchParams.get('service') ?? ''
    const approved     = searchParams.get('approved') // null = all
    const voucherStatus = searchParams.get('voucherStatus') ?? 'all' // all | none | active | used
    const dateFrom     = searchParams.get('dateFrom') ?? ''
    const dateTo       = searchParams.get('dateTo') ?? ''

    // Pagination
    const page  = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '10', 10)))
    const skip  = (page - 1) * limit

    const where: any = {}

    // ── Search (name, whatsapp, message)
    if (search.trim()) {
      const q = search.trim()
      where.OR = [
        { name:     { contains: q } },
        { whatsapp: { contains: q } },
        { message:  { contains: q } },
      ]
    }

    // ── Service filter
    if (service) {
      where.services = { contains: service }
    }

    // ── Approval filter
    if (approved !== null) {
      where.approved = approved === 'true'
    }

    // ── Date range
    if (dateFrom) {
      where.createdAt = { ...where.createdAt, gte: new Date(dateFrom) }
    }
    if (dateTo) {
      const endOfDay = new Date(dateTo)
      endOfDay.setHours(23, 59, 59, 999)
      where.createdAt = { ...where.createdAt, lte: endOfDay }
    }

    // ── Voucher status filter (applied after fetching)
    // We need redeem codes for this, so we filter in two steps

    // ── Get total count (before voucher status filter)
    const countResult = await prisma.testimonial.aggregate({
      where,
      _count: { id: true },
    })
    const total = countResult._count.id

    // ── Fetch paginated testimonials
    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    })

    // ── Fetch latest redeem codes for these testimonials
    const testimonialIds = testimonials.map(t => t.id)
    const redeemCodes = await prisma.redeemCode.findMany({
      where: { testimonialId: { in: testimonialIds } },
      orderBy: { createdAt: 'desc' },
    })
    const redeemCodeMap: Record<string, typeof redeemCodes[0] | undefined> = {}
    for (const rc of redeemCodes) {
      if (!redeemCodeMap[rc.testimonialId]) {
        redeemCodeMap[rc.testimonialId] = rc
      }
    }

    // ── Apply voucher status filter in-memory
    let filtered = testimonials.map(t => ({
      ...t,
      redeemCode: redeemCodeMap[t.id] ?? null,
    }))

    if (voucherStatus === 'none') {
      filtered = filtered.filter(t => !t.voucher)
    } else if (voucherStatus === 'active') {
      filtered = filtered.filter(t => t.voucher && !t.voucherUsed)
    } else if (voucherStatus === 'used') {
      filtered = filtered.filter(t => t.voucherUsed)
    }

    // ── Build voucher status label for each row
    const withVoucherStatus = filtered.map(t => {
      const rc = t.redeemCode
      const hasRedeemCode = !!rc
      const redeemUsed = rc?.used
      const redeemHasVoucher = !!t.voucher

      let voucherStatusLabel: string
      if (hasRedeemCode && redeemUsed && !redeemHasVoucher) {
        voucherStatusLabel = 'redeem_failed'
      } else if (t.voucher && t.voucherUsed) {
        voucherStatusLabel = 'used'
      } else if (t.voucher && !t.voucherUsed) {
        voucherStatusLabel = 'active'
      } else if (hasRedeemCode && !redeemUsed) {
        voucherStatusLabel = 'code_created'
      } else {
        voucherStatusLabel = 'none'
      }

      return { ...t, voucherStatusLabel }
    })

    return NextResponse.json({
      success: true,
      testimonials: withVoucherStatus,
      pagination: {
        page,
        limit,
        total,
        totalFiltered: withVoucherStatus.length,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}
