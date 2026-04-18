import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { writeFile } from 'fs/promises'
import path from 'path'
import { logActivity } from '@/lib/logger'

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, WebP, and GIF are allowed.' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size too large. Maximum 5MB allowed.' }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(7)
    const ext = path.extname(file.name) || '.jpg'
    const filename = `banner-${timestamp}-${random}${ext}`

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    const filePath = path.join(uploadDir, filename)

    await writeFile(filePath, buffer)

    // Return the URL
    const url = `/uploads/${filename}`

    await logActivity({
      userId: session.id,
      role: session.role,
      action: 'upload_image',
      description: `Mengupload gambar: ${filename}`,
      metadata: { filename, url, size: file.size, type: file.type },
      request,
    })

    return NextResponse.json({ success: true, url })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
