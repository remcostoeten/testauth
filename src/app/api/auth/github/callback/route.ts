/**
 * @author Remco Stoeten
 * @description GitHub OAuth callback handler.
 * Processes the OAuth response and creates user session.
 */

import { NextRequest, NextResponse } from 'next/server'
import { setUserCookie } from '@/lib/auth'

// Add type for GitHub email response
type GitHubEmail = {
  email: string
  primary: boolean
  verified: boolean
  visibility: string | null
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  
  if (!code) {
    return new Response('No code provided', { status: 400 })
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/github/callback`,
      }),
    })

    const tokens = await tokenResponse.json()
    
    if (tokens.error) {
      console.error('Token Error:', tokens)
      return new Response(`Authentication failed: ${tokens.error}`, { status: 400 })
    }

    // Get user info
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
        'Accept': 'application/json',
      },
    })

    const userData = await userResponse.json()
    
    if (userData.error) {
      console.error('User Data Error:', userData)
      return new Response(`Failed to get user data: ${userData.error}`, { status: 400 })
    }

    // Get user email (might be private)
    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
        'Accept': 'application/json',
      },
    })

    const emails = await emailResponse.json() as GitHubEmail[]
    const primaryEmail = emails.find((email: GitHubEmail) => email.primary)?.email || userData.email

    // Set user cookie
    await setUserCookie({
      email: primaryEmail,
      name: userData.name || userData.login,
      picture: userData.avatar_url,
      id: userData.id.toString(),
    })

    // Redirect to home page
    return NextResponse.redirect(new URL('/', request.url))
  } catch (error) {
    console.error('Auth error:', error)
    return new Response('Authentication failed', { status: 500 })
  }
}

