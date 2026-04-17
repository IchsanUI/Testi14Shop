import { NextRequest, NextResponse } from 'next/server'
import { login, createSessionCookie, generateToken } from '@/lib/auth'
import { logActivity } from '@/lib/logger'
import { checkRateLimit, getClientKey } from '@/lib/rateLimit'

// Rate limit: 5 attempts per 15 minutes per IP
const LOGIN_MAX_REQUESTS = 5
const LOGIN_WINDOW_MS = 15 * 60 * 1000 // 15 minutes

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const key = `login:${getClientKey(request)}`
  const { allowed, resetAt } = checkRateLimit(key, LOGIN_MAX_REQUESTS, LOGIN_WINDOW_MS)

  if (!allowed) {
    return NextResponse.json(
      {
        error: 'Terlalu banyak percobaan login. Silakan coba lagi nanti.',
        retryAfter: Math.ceil((resetAt - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': LOGIN_MAX_REQUESTS.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(resetAt).toISOString(),
        },
      }
    )
  }

  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password diperlukan' },
        { status: 400 }
      )
    }

    // Attempt login
    const result = await login(email, password)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      )
    }

    // Generate token
    const token = createSessionCookie(generateToken(result.user!))
    const tokenValue = token.value

    // Log login activity
    await logActivity({
      userId: result.user!.id,
      role: result.user!.role,
      action: 'login',
      description: 'User berhasil login',
      request,
    })

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      user: result.user,
    })

    // Set cookie
    response.cookies.set({
      name: token.name,
      value: tokenValue,
      httpOnly: token.httpOnly,
      secure: token.secure,
      sameSite: token.sameSite,
      maxAge: token.maxAge,
      path: token.path,
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat login' },
      { status: 500 }
    )
  }
}
