import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get only approved testimonials
    const testimonials = await prisma.testimonial.findMany({
      where: {
        approved: true,
        featured: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })

    return NextResponse.json({
      success: true,
      testimonials: testimonials.map((t) => ({
        id: t.id,
        name: t.name,
        services: t.services,
        rating: t.rating,
        message: t.message,
        photo: t.photo,
        createdAt: t.createdAt,
      })),
    })
  } catch (error) {
    console.error('Error fetching public testimonials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}
