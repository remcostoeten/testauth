import { checkAuth } from '@/lib/session'
import { NextResponse } from 'next/server'

export async function GET() {
  const isAuthenticated = await checkAuth()
  
  if (!isAuthenticated) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  return NextResponse.json({ message: 'Protected data' })
} 