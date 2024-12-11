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

export type OAuthProvider = 'github' | 'google'

export type OAuthProfile = {
  provider: OAuthProvider
  id: string
  email: string
  name: string
  picture?: string
  accessToken: string
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

export async function handleOAuthSignIn(provider: OAuthProvider, code: string): Promise<UserData | null> {
  try {
    const profile = await getOAuthProfile(provider, code)
    if (!profile) return null

    // Create or update user in your database here if needed
    const userData: UserData = {
      id: `${provider}:${profile.id}`,
      name: profile.name,
      email: profile.email,
      picture: profile.picture
    }

    await setUserCookie(userData)
    return userData
  } catch (error) {
    console.error(`OAuth ${provider} sign-in error:`, error)
    return null
  }
}

async function getOAuthProfile(provider: OAuthProvider, code: string): Promise<OAuthProfile | null> {
  const clientId = provider === 'github' 
    ? process.env.GITHUB_CLIENT_ID 
    : process.env.GOOGLE_CLIENT_ID
  const clientSecret = provider === 'github'
    ? process.env.GITHUB_CLIENT_SECRET
    : process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error(`${provider} OAuth credentials not configured`)
  }

  const tokenEndpoint = provider === 'github'
    ? 'https://github.com/login/oauth/access_token'
    : 'https://oauth2.googleapis.com/token'

  const tokenResponse = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/${provider}/callback`,
      grant_type: 'authorization_code',
    }),
  })

  const tokenData = await tokenResponse.json()
  if (!tokenData.access_token) return null

  const userEndpoint = provider === 'github'
    ? 'https://api.github.com/user'
    : 'https://www.googleapis.com/oauth2/v2/userinfo'

  const userResponse = await fetch(userEndpoint, {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  })

  const userData = await userResponse.json()
  
  return {
    provider,
    id: userData.id,
    email: userData.email,
    name: userData.name || userData.login,
    picture: userData.avatar_url || userData.picture,
    accessToken: tokenData.access_token,
  }
}

