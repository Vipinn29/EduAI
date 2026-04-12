import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Skip API, static, auth pages, home
  if (
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/auth/') ||
    request.nextUrl.pathname === '/'
  ) {
    return NextResponse.next()
  }

  // Get session from JWT
  const session = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })

  // Dashboard now accessible without login (personal features optional)


  return NextResponse.next()
}

export const config = {
  matcher: '/dashboard/:path*'
}

