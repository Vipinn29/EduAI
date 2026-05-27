import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function GET(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookieNames = cookieHeader
    ? cookieHeader.split(';').map((cookie) => cookie.trim().split('=')[0])
    : [];
  const authCookieNames = cookieNames.filter((name) => name.includes('next-auth'));

  const token = await getToken({
    req: {
      headers: {
        cookie: cookieHeader,
      },
    } as any,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const userId = token?.id as string || token?.sub as string
  
  return NextResponse.json({
    token: token ? {
      id: token.id,
      sub: token.sub,
      email: token.email,
      name: token.name,
      iat: token.iat,
      exp: token.exp,
      jti: token.jti,
    } : null,
    userId: userId || 'NONE',
    cookiePresent: cookieHeader ? 'YES' : 'NO',
    authCookieNames,
    hasSecret: !!process.env.NEXTAUTH_SECRET,
  })
}
