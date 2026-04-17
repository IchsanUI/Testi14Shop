import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get user info from headers set by middleware
    const userId = request.headers.get('x-user-id')
    const userEmail = request.headers.get('x-user-email')
    const userRole = request.headers.get('x-user-role')
    const userName = request.headers.get('x-user-name')

    if (!userId || !userEmail || !userRole || !userName) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: userEmail,
        role: userRole,
        name: userName,
      },
    })
  } catch (error) {
    console.error('GET /api/admin/me error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
