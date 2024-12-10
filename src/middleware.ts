import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAuth } from './lib/auth'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('user-token')?.value

  const verifiedToken =
    token &&
    (await verifyAuth(token).catch((err) => {
      console.error(err.message)
    }))

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/api/auth')

  if (isAuthPage) {
    if (verifiedToken) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  if (!verifiedToken) {
    const searchParams = new URLSearchParams({ 
      callbackUrl: request.nextUrl.pathname 
    })
    return NextResponse.redirect(new URL(`/login?${searchParams}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

