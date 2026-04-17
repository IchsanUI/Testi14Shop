import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getLogs } from '@/lib/logger'

export async function GET(request: NextRequest) {
  // Check authentication
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Only Super Admin can view activity logs
  if (session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Forbidden - Super Admin only' }, { status: 403 })
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const action = searchParams.get('action') || undefined
    const userId = searchParams.get('userId') || undefined

    const { logs, total } = await getLogs({
      page,
      limit,
      action,
      userId,
    })

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      logs,
      total,
      totalPages,
      page,
      limit,
    })
  } catch (error) {
    console.error('Error fetching activity logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activity logs' },
      { status: 500 }
    )
  }
}
