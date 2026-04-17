import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Input validation and sanitization
function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

function validatePhoneNumber(phone: string): boolean {
  // Indonesian phone number validation
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length >= 10 && cleaned.length <= 14
}

function validateServices(services: string[]): boolean {
  const validServices = [
    'Pembelian HP',
    'Tukar Tambah',
    'COD',
    'Jual Beli',
    'Service HP',
    'Barbershop',
    'Cafe',
  ]
  return services.every((s) => validServices.includes(s))
}

function validateImage(base64: string | null): boolean {
  if (!base64) return true

  // Check if it's a valid base64 image
  const matches = base64.match(/^data:image\/(jpeg|jpg|png|gif);base64,(.+)$/)
  if (!matches) return false

  // Check size (5MB limit)
  const sizeInBytes = (base64.length * 3) / 4
  const sizeInMB = sizeInBytes / (1024 * 1024)

  return sizeInMB <= 5
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, whatsapp, email, address, transactionCount, lastTransactionAmount, services, rating, message, photo } = body

    // Validate required fields
    if (!name || !whatsapp || !rating || !message) {
      return NextResponse.json(
        { error: 'Field wajib harus diisi' },
        { status: 400 }
      )
    }

    // Validate transaction fields
    if (transactionCount !== undefined && (typeof transactionCount !== 'number' || transactionCount < 1)) {
      return NextResponse.json(
        { error: 'Jumlah transaksi tidak valid' },
        { status: 400 }
      )
    }

    if (lastTransactionAmount !== undefined && (typeof lastTransactionAmount !== 'number' || lastTransactionAmount < 0)) {
      return NextResponse.json(
        { error: 'Total belanja tidak valid' },
        { status: 400 }
      )
    }

    // Sanitize and validate name
    const sanitizedName = sanitizeString(name)
    if (sanitizedName.length < 2 || sanitizedName.length > 100) {
      return NextResponse.json(
        { error: 'Nama harus 2-100 karakter' },
        { status: 400 }
      )
    }

    // Validate WhatsApp number
    if (!validatePhoneNumber(whatsapp)) {
      return NextResponse.json(
        { error: 'Nomor WhatsApp tidak valid' },
        { status: 400 }
      )
    }

    // Validate services
    if (!services || !Array.isArray(services) || services.length === 0) {
      return NextResponse.json(
        { error: 'Pilih minimal satu layanan' },
        { status: 400 }
      )
    }

    if (!validateServices(services)) {
      return NextResponse.json(
        { error: 'Layanan tidak valid' },
        { status: 400 }
      )
    }

    // Validate rating
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating harus antara 1-5' },
        { status: 400 }
      )
    }

    // Sanitize and validate message
    const sanitizedMessage = sanitizeString(message)
    if (sanitizedMessage.length < 10 || sanitizedMessage.length > 1000) {
      return NextResponse.json(
        { error: 'Pesan harus 10-1000 karakter' },
        { status: 400 }
      )
    }

    // Validate image
    if (!validateImage(photo)) {
      return NextResponse.json(
        { error: 'Gambar tidak valid atau terlalu besar' },
        { status: 400 }
      )
    }

    // Save testimonial to database (voucher will be assigned later via redeem code)
    const testimonial = await prisma.testimonial.create({
      data: {
        name: sanitizedName,
        whatsapp: whatsapp.replace(/\D/g, ''),
        email: email ? sanitizeString(email) : null,
        address: address ? sanitizeString(address) : null,
        transactionCount: transactionCount || 1,
        lastTransactionAmount: lastTransactionAmount || 0,
        services: services.join(','),
        rating,
        message: sanitizedMessage,
        photo: photo || null,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Testimoni berhasil dikirim. Mohon tunggu, admin akan memverifikasi testimoni Anda.',
        testimonial: {
          id: testimonial.id,
          name: testimonial.name,
          services,
          rating: testimonial.rating,
          message: testimonial.message,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error saving testimonial:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan testimoni' },
      { status: 500 }
    )
  }
}

