import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { logActivity } from '@/lib/logger'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()

    // If setting as active, deactivate all others first
    if (body.active) {
      await prisma.siteBanner.updateMany({
        data: { active: false },
      })
    }

    const banner = await prisma.siteBanner.update({
      where: { id },
      data: {
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
        ...(body.linkUrl !== undefined && { linkUrl: body.linkUrl }),
        ...(body.active !== undefined && { active: body.active }),
      },
    })

    logActivity({
      userId: session.id,
      role: session.role,
      action: body.active ? 'activate_banner' : 'update_banner',
      description: body.active ? 'Mengaktifkan banner' : 'Memperbarui banner',
      metadata: { bannerId: banner.id },
      request,
    }).catch(err => console.error('Log activity error:', err))

    return NextResponse.json({ success: true, banner })
  } catch (error) {
    console.error('Error updating banner:', error)
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    await prisma.siteBanner.delete({ where: { id } })

    logActivity({
      userId: session.id,
      role: session.role,
      action: 'delete_banner',
      description: 'Menghapus banner',
      metadata: { bannerId: id },
      request,
    }).catch(err => console.error('Log activity error:', err))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting banner:', error)
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 })
  }
}