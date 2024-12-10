/**
 * @author Remco Stoeten
 * @description GitHub OAuth login initiation endpoint.
 * Redirects users to GitHub's authorization page with required scopes.
 */

import { NextResponse } from 'next/server'

export async function GET() {
  const githubAuthUrl = 'https://github.com/login/oauth/authorize'
  
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/github/callback`,
    scope: 'read:user user:email',
    state: crypto.randomUUID(),
  })

  return NextResponse.redirect(`${githubAuthUrl}?${params.toString()}`)
} 