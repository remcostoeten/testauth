/**
 * @author Remco Stoeten
 * @description Google OAuth login initiation endpoint.
 * Redirects users to Google's consent screen with appropriate scopes.
 */

import { NextResponse } from 'next/server'

export async function GET() {
  const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
  
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
    state: crypto.randomUUID(),
    include_granted_scopes: 'true',
  })

  return NextResponse.redirect(`${googleAuthUrl}?${params.toString()}`)
} 