import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'


const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, name } = signupSchema.parse(body)

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.upsert({
      where: { email },
      update: { hashedPassword, name },
      create: { email, hashedPassword, name },
    })

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name } })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

