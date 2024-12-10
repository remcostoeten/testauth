/**
 * @author Remco Stoeten
 * @description Authentication utilities for handling JWT tokens and cookies.
 * Provides functions for user session management and verification.
 */

import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export type UserData = {
  id: string
  name: string
  email: string
  picture?: string
}

export async function getJwtSecretKey() {
  const secret = new TextEncoder().encode(JWT_SECRET)
  return secret
}

export async function verifyAuth(token: string): Promise<UserData | null> {
  try {
    const { payload } = await jwtVerify(token, await getJwtSecretKey())
    return payload as UserData
  } catch {
    return null
  }
}

export async function setUserCookie(user: UserData) {
  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(await getJwtSecretKey())

  const cookieStore = await cookies()
  cookieStore.set('user-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600,
    path: '/',
  })
}

export async function getUserFromCookie() {
  const cookieStore = await cookies()
  const token = cookieStore.get('user-token')
  if (!token) return null

  const user = await verifyAuth(token.value)
  return user
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.set('user-token', '', { maxAge: 0 })
}

