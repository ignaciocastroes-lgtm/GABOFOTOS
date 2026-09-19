import { NextResponse } from 'next/server'
import { sha256 } from '@/lib/admin-auth'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const password = process.env.ADMIN_PASSWORD
  if (!password) {
    return NextResponse.json({ error: 'ADMIN_PASSWORD no está configurada en el servidor.' }, { status: 500 })
  }

  const { password: intento } = await request.json().catch(() => ({ password: '' }))

  if (typeof intento !== 'string' || intento !== password) {
    return NextResponse.json({ error: 'Contraseña incorrecta.' }, { status: 401 })
  }

  const hash = await sha256(password)
  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin_session', hash, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 14, // 14 días
  })
  return res
}
