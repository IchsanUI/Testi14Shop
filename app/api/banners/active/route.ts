import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const banner = await prisma.siteBanner.findFirst({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ success: true, banner: banner ?? null })
  } catch (error) {
    console.error('Error fetching active banner:', error)
    return NextResponse.json({ success: false, banner: null }, { status: 500 })
  }
}
