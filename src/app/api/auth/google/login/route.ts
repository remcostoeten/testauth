import { NextResponse } from 'next/server'

export async function GET() {
  const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth'

  // Generate and store state parameter
  const state = crypto.randomUUID()

  // Set the state cookie in the response
  const response = NextResponse.redirect(`${googleAuthUrl}?${new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
    state,
    include_granted_scopes: 'true',
  }).toString()}`)

  // Set cookie in the response
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  })

  return response
} 