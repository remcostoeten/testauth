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
  
  if (!code) {
    return new Response('No code provided', { status: 400 })
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

    // Set user cookie
    await setUserCookie({
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
      id: userData.id,
    })

    // Redirect to home page
    return NextResponse.redirect(new URL('/', request.url))
  } catch (error) {
    console.error('Auth error:', error)
    return new Response('Authentication failed', { status: 500 })
  }
}

