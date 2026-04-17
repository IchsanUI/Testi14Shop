import { NextRequest, NextResponse } from 'next/server'
import { clearSessionCookie } from '@/lib/auth'
import { logActivity } from '@/lib/logger'
import { getSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Get current session for logging
    const session = await getSession()

    if (session) {
      // Log logout activity
      await logActivity({
        userId: session.id,
        role: session.role,
        action: 'logout',
        description: 'User berhasil logout',
        request,
      })
    }

    // Clear the session cookie
    const cookieOptions = clearSessionCookie()

    const response = NextResponse.json({
      success: true,
      message: 'Logout berhasil',
    })

    response.cookies.set({
      name: cookieOptions.name,
      value: cookieOptions.value,
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      maxAge: cookieOptions.maxAge,
      path: cookieOptions.path,
    })

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat logout' },
      { status: 500 }
    )
  }
}
