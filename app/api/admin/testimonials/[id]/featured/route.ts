import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { id } = await params
    const { featured } = await request.json()

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: { featured: Boolean(featured) },
    })

    return NextResponse.json({ success: true, featured: testimonial.featured })
  } catch (error) {
    console.error('Error toggling featured:', error)
    return NextResponse.json({ error: 'Failed to update featured status' }, { status: 500 })
  }
}