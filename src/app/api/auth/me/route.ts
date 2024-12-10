import { getUserFromCookie } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const user = await getUserFromCookie()
  return NextResponse.json({ user })
} 