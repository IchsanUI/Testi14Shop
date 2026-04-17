import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from './prisma'

const JWT_SECRET = (() => {
  const secret = process.env.JWT_SECRET
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is required in production')
  }
  return secret || 'dev-only-insecure-secret-do-not-use-in-prod'
})()
const TOKEN_NAME = '14shop_session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export type SessionUser = {
  id: string
  name: string
  email: string
  role: string
  tokenVersion: number
}

export type Session = {
  user: SessionUser
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(user: SessionUser): string {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string): SessionUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionUser
  } catch {
    return null
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(TOKEN_NAME)?.value

  if (!token) {
    return null
  }

  const payload = verifyToken(token)
  if (!payload) return null

  // Revoke session if tokenVersion has been bumped (e.g. password changed)
  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { tokenVersion: true },
  })

  if (!user || user.tokenVersion !== payload.tokenVersion) {
    return null
  }

  return payload
}

export async function requireAuth(): Promise<SessionUser | NextResponse> {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return session
}

export async function requireSuperAdmin(): Promise<SessionUser | NextResponse> {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Forbidden - Super Admin only' }, { status: 403 })
  }

  return session
}

export function createSessionCookie(token: string) {
  return {
    name: TOKEN_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  }
}

export function clearSessionCookie() {
  return {
    name: TOKEN_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 0,
    path: '/',
  }
}

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string; user?: SessionUser }> {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return { success: false, error: 'Email atau password salah' }
  }

  const isValid = await verifyPassword(password, user.password)

  if (!isValid) {
    return { success: false, error: 'Email atau password salah' }
  }

  const sessionUser: SessionUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    tokenVersion: user.tokenVersion,
  }

  return { success: true, user: sessionUser }
}
