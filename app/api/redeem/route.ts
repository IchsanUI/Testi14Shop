import { NextRequest, NextResponse } from 'next/server'
import { redeemCode } from '@/lib/redeemCode'
import { checkRateLimit, getClientKey } from '@/lib/rateLimit'

// Rate limit: 5 attempts per 10 minutes per IP
const REDEEM_MAX_REQUESTS = 5
const REDEEM_WINDOW_MS = 10 * 60 * 1000 // 10 minutes

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const key = `redeem:${getClientKey(request)}`
  const { allowed, remaining, resetAt } = checkRateLimit(
    key,
    REDEEM_MAX_REQUESTS,
    REDEEM_WINDOW_MS
  )

  if (!allowed) {
    return NextResponse.json(
      {
        error: 'Terlalu banyak percobaan. Silakan coba lagi nanti.',
        retryAfter: Math.ceil((resetAt - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': REDEEM_MAX_REQUESTS.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(resetAt).toISOString(),
        },
      }
    )
  }

  try {
    const body = await request.json()
    const { code } = body

    if (!code) {
      return NextResponse.json(
        { error: 'Kode redeem diperlukan' },
        { status: 400 }
      )
    }

    // Normalize code (uppercase, trim)
    const normalizedCode = code.toUpperCase().trim()

    if (normalizedCode.length !== 6) {
      return NextResponse.json(
        { error: 'Kode redeem harus 6 karakter' },
        { status: 400 }
      )
    }

    const result = await redeemCode(normalizedCode)

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          noMatch: 'noMatch' in result ? result.noMatch : undefined,
          customerSpend: 'customerSpend' in result ? result.customerSpend : undefined,
          lowestMinPurchase: 'lowestMinPurchase' in result ? result.lowestMinPurchase : undefined,
        },
        { status: 400 }
      )
    }

    const response = NextResponse.json({
      success: true,
      message: result.message,
      voucher: result.voucher,
    })

    // Set rate limit headers on success too
    response.headers.set('X-RateLimit-Limit', REDEEM_MAX_REQUESTS.toString())
    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    response.headers.set('X-RateLimit-Reset', new Date(resetAt).toISOString())

    return response
  } catch (error) {
    console.error('Error redeeming code:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menukarkan kode' },
      { status: 500 }
    )
  }
}