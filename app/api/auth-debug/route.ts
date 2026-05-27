import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function GET(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie') || '';
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
    cookiePresent: request.headers.get('cookie') ? 'YES' : 'NO',
    hasSecret: !!process.env.NEXTAUTH_SECRET,
  })
}
