import { NextResponse } from 'next/server'
import net from 'net'

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || ''
  let host = 'unknown'
  let port = '5432'
  try {
    const parsed = new URL(dbUrl)
    host = parsed.hostname
    port = parsed.port || port
  } catch {
    // ignore
  }

  const timeoutMs = 5000

  const result = await new Promise<{ ok: boolean; error?: string }>((resolve) => {
    const socket = new net.Socket()
    let settled = false

    const onSuccess = () => {
      if (settled) return
      settled = true
      socket.destroy()
      resolve({ ok: true })
    }

    const onFail = (err?: Error) => {
      if (settled) return
      settled = true
      try { socket.destroy() } catch {}
      resolve({ ok: false, error: err?.message || 'connection failed' })
    }

    socket.setTimeout(timeoutMs, () => onFail(new Error('timeout')))
    socket.once('error', onFail)
    socket.once('connect', onSuccess)
    socket.connect(Number(port), host)
  })

  if (result.ok) {
    return NextResponse.json({ ok: true, host, port })
  }

  return NextResponse.json({ ok: false, host, port, error: result.error }, { status: 500 })
}
