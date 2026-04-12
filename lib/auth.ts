import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import { prisma } from './prisma'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

const authConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.hashedPassword) return null

        const isValid = await bcrypt.compare(credentials.password as string, user.hashedPassword)

        if (!isValid) return null

        return { id: user.id, email: user.email, name: user.name }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  session: { 
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 15 * 24 * 60 * 60, // 15 days
    // Production secure settings
    ...(process.env.NODE_ENV === 'production' && {
      secure: true, // HTTPS only cookies
    }),
  },
  cookies: {
    // Production secure cookies
    ...(process.env.NODE_ENV === 'production' && {
      sessionToken: {
        name: `__Secure-next-auth.session-token`,
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: true,
        },
      },
      callbackToken: {
        name: `__Secure-next-auth.callback-token`,
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: true,
        },
      },
      jwt: {
        name: `__Secure-next-auth.jwt`,
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: true,
        },
      },
    }),
  },
  trustHost: true,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id
      }
      return session
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

export { authConfig }

