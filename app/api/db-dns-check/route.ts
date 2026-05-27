import { NextResponse } from 'next/server'
import dns from 'dns'

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || ''
  let host = ''
  try {
    const parsed = new URL(dbUrl)
    host = parsed.hostname
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid DATABASE_URL' }, { status: 500 })
  }

  const lookup = (name: string) => new Promise<any>((res) => {
    dns.lookup(name, (err, address, family) => {
      if (err) return res({ ok: false, error: err.message })
      res({ ok: true, address, family })
    })
  })

  const resolve4 = (name: string) => new Promise<any>((res) => {
    dns.resolve4(name, (err, addresses) => {
      if (err) return res({ ok: false, error: err.message })
      res({ ok: true, addresses })
    })
  })

  const [l, r] = await Promise.all([lookup(host), resolve4(host)])

  return NextResponse.json({ ok: l.ok && r.ok, host, lookup: l, resolve4: r })
}
