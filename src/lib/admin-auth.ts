import { db } from '@/lib/db'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const TOKEN_EXPIRY_HOURS = 24

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  return hashPassword(password) === hashedPassword
}

export async function createToken(adminId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + TOKEN_EXPIRY_HOURS)

  await db.adminToken.create({
    data: {
      adminId,
      token,
      expiresAt,
    },
  })

  return token
}

export async function verifyToken(token: string): Promise<boolean> {
  if (!token) return false

  const adminToken = await db.adminToken.findUnique({
    where: { token },
    include: { admin: true },
  })

  if (!adminToken) return false
  if (adminToken.expiresAt < new Date()) {
    // Token expired, clean it up
    await db.adminToken.delete({ where: { token } })
    return false
  }

  return true
}

export async function getAdminFromToken(token: string) {
  if (!token) return null

  const adminToken = await db.adminToken.findUnique({
    where: { token },
    include: { admin: true },
  })

  if (!adminToken) return null
  if (adminToken.expiresAt < new Date()) {
    await db.adminToken.delete({ where: { token } })
    return null
  }

  return adminToken.admin
}

export async function getTokenFromRequest(request: Request): Promise<string | null> {
  // First check Authorization header
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // Then check cookies
  try {
    const cookieStore = await cookies()
    const tokenCookie = cookieStore.get('admin-token')
    if (tokenCookie) {
      return tokenCookie.value
    }
  } catch {
    // cookies() might fail in some contexts
  }

  return null
}

export async function requireAdmin(request: Request): Promise<{ authorized: boolean; token?: string }> {
  const token = await getTokenFromRequest(request)
  if (!token) return { authorized: false }

  const isValid = await verifyToken(token)
  if (!isValid) return { authorized: false }

  return { authorized: true, token }
}
