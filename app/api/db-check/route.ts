import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || ''
  let host = 'unknown'
  let port = ''
  let ssl = ''
  try {
    const parsed = new URL(dbUrl)
    host = parsed.hostname
    port = parsed.port
    ssl = parsed.searchParams.get('sslmode') || parsed.searchParams.get('ssl') || ''
  } catch {
    // ignore parse errors
  }

  try {
    // Attempt a light-weight connect to verify network reachability
    await prisma.$connect()
    await prisma.$disconnect()
    return NextResponse.json({ ok: true, host, port, ssl })
  } catch (err: any) {
    console.error('DB check error:', { message: err.message })
    return NextResponse.json({ ok: false, host, port, ssl, error: err.message }, { status: 500 })
  }
}
