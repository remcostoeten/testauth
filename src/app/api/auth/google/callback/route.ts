/**
 * @author Remco Stoeten
 * @description Google OAuth callback handler.
 * Processes the OAuth response and creates user session.
 */

import { NextRequest, NextResponse } from 'next/server'
import { setUserCookie } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const storedState = request.cookies.get('oauth_state')?.value
  
  if (!code) {
    return new Response('No code provided', { status: 400 })
  }

  // Verify state to prevent CSRF attacks
  if (!state || !storedState || state !== storedState) {
    return new Response('Invalid state', { status: 400 })
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    })

    const tokens = await tokenResponse.json()
    
    if (tokens.error) {
      console.error('Token Error:', tokens)
      return new Response(`Authentication failed: ${tokens.error}`, { status: 400 })
    }

    // Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    const userData = await userResponse.json()
    
    if (userData.error) {
      console.error('User Data Error:', userData)
      return new Response(`Failed to get user data: ${userData.error}`, { status: 400 })
    }

    // Verify email is verified by Google
    if (!userData.verified_email) {
      return new Response('Email not verified with Google', { status: 400 })
    }

    // Store refresh token if provided
    if (tokens.refresh_token) {
      // TODO: Store refresh_token securely in database
      // This should be associated with the user's account
      // await prisma.user.update({
      //   where: { email: userData.email },
      //   data: { googleRefreshToken: tokens.refresh_token }
      // })
    }

    // Set user cookie
    await setUserCookie({
      email: userData.email,
      name: userData.name,
      picture: userData.picture || undefined,
      id: userData.id,
    })

    // Redirect to dashboard (consistent with other auth flows)
    return NextResponse.redirect(new URL('/dashboard', request.url))
  } catch (error) {
    console.error('Auth error:', error)
    return new Response('Authentication failed', { status: 500 })
  }
}

