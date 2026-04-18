import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { logActivity } from '@/lib/logger'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const banners = await prisma.siteBanner.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ success: true, banners })
  } catch (error) {
    console.error('Error fetching banners:', error)
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { imageUrl, linkUrl } = body

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
    }

    // Ensure active is boolean
    const isActive = body.active === true || body.active === 'true'

    // Deactivate all banners first if setting this as active
    if (isActive) {
      await prisma.siteBanner.updateMany({
        data: { active: false },
      })
    }

    const banner = await prisma.siteBanner.create({
      data: {
        imageUrl,
        linkUrl: linkUrl || null,
        active: isActive,
      },
    })

    // Fire and forget log — don't block the response
    logActivity({
      userId: session.id,
      role: session.role,
      action: 'create_banner',
      description: `Menambahkan banner baru`,
      metadata: { bannerId: banner.id },
      request,
    }).catch(err => console.error('Log activity error:', err))

    return NextResponse.json({ success: true, banner }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating banner:', error?.message || error)
    return NextResponse.json({ error: 'Failed to create banner', detail: error?.message }, { status: 500 })
  }
}
