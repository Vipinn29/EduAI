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

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword
        )

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
  },

  trustHost: true,

  callbacks: {
    jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id as string
        token.name = user.name || ""
      }
      return token
    },

    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
        session.user.name = token.name as string
      }
      return session
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
export { authConfig }