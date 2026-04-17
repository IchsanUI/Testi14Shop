import { prisma } from './prisma'
import { NextRequest } from 'next/server'

export async function logActivity(params: {
  userId: string
  role: string
  action: string
  description: string
  metadata?: any
  request?: NextRequest
}): Promise<void> {
  const { userId, role, action, description, metadata, request } = params

  // Get IP address from request
  let ipAddress: string | undefined
  if (request) {
    // Try to get IP from various headers
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    ipAddress = forwarded?.split(',')[0] || realIp || undefined
  }

  // Convert metadata to JSON string if provided
  const metadataJson = metadata ? JSON.stringify(metadata) : undefined

  try {
    await prisma.activityLog.create({
      data: {
        userId,
        role,
        action,
        description,
        metadata: metadataJson,
        ipAddress,
      },
    })
  } catch (error) {
    console.error('Failed to log activity:', error)
    // Don't throw - logging shouldn't break the main flow
  }
}

export async function getLogs(params: {
  userId?: string
  action?: string
  startDate?: Date
  endDate?: Date
  page?: number
  limit?: number
}): Promise<{ logs: any[]; total: number }> {
  const { userId, action, startDate, endDate, page = 1, limit = 50 } = params

  const skip = (page - 1) * limit

  const where: any = {}

  if (userId) {
    where.userId = userId
  }

  if (action) {
    where.action = action
  }

  if (startDate || endDate) {
    where.createdAt = {}
    if (startDate) {
      where.createdAt.gte = startDate
    }
    if (endDate) {
      where.createdAt.lte = endDate
    }
  }

  const [logs, total] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.activityLog.count({ where }),
  ])

  // Parse metadata for each log
  const parsedLogs = logs.map(log => ({
    ...log,
    metadata: log.metadata ? JSON.parse(log.metadata) : null,
  }))

  return { logs: parsedLogs, total }
}

export async function getUserLogs(
  userId: string,
  page: number = 1,
  limit: number = 50
): Promise<{ logs: any[]; total: number }> {
  return getLogs({ userId, page, limit })
}

export async function getRecentLogs(limit: number = 20): Promise<any[]> {
  const { logs } = await getLogs({ limit })
  return logs
}
