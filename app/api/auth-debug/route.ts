import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function GET(request: NextRequest) {
  const token = await getToken({
    req: request,
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
