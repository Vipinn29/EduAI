import { PrismaClient } from '@prisma/client'

// Ensure production DATABASE_URL includes SSL mode for hosted Postgres (e.g. Supabase)
if (process.env.NODE_ENV === 'production' && typeof process.env.DATABASE_URL === 'string') {
  const url = process.env.DATABASE_URL
  // If the URL appears to be a Postgres URL and doesn't already contain sslmode or ssl=true, append sslmode=require
  if (url.startsWith('postgresql://') && !/([?&])ssl(mode)?=/.test(url) && !/([?&])ssl=true/.test(url)) {
    process.env.DATABASE_URL = url + (url.includes('?') ? '&' : '?') + 'sslmode=require'
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
