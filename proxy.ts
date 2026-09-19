import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { sha256 } from '@/lib/admin-auth'

/**
 * Protege /admin y /api/admin/* con una cookie firmada contra
 * ADMIN_PASSWORD.
 *
 * La cookie no es una sesión con estado: es sha256(ADMIN_PASSWORD). El
 * proxy recalcula el hash contra la variable de entorno actual y lo
 * compara. Ventaja: cambiar la contraseña en Vercel invalida todas las
 * sesiones abiertas al instante, sin tocar código ni base de datos.
 *
 * Las rutas /api/admin/* (crear, editar, borrar noticias) hacen además su
 * propia verificación con esAdminValido() — el proxy es la primera
 * barrera, no la única.
 */
export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] }

/**
 * Rutas que dejan pasar sin cookie: la propia puerta de entrada.
 * /api/admin/login la necesita quien todavía NO tiene sesión — si se
 * protegiera igual que el resto, nadie podría loguearse nunca.
 */
const RUTAS_PUBLICAS = ['/admin/login', '/api/admin/login', '/api/admin/logout']

export async function proxy(request: NextRequest) {
  if (RUTAS_PUBLICAS.includes(request.nextUrl.pathname)) return NextResponse.next()

  const esRutaApi = request.nextUrl.pathname.startsWith('/api/admin/')

  const password = process.env.ADMIN_PASSWORD
  if (!password) {
    if (esRutaApi) {
      return NextResponse.json({ error: 'ADMIN_PASSWORD no configurada.' }, { status: 500 })
    }
    return NextResponse.redirect(new URL('/admin/login?error=sin-configurar', request.url))
  }

  const cookie = request.cookies.get('admin_session')?.value
  const esperado = await sha256(password)

  if (cookie !== esperado) {
    if (esRutaApi) {
      return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
    }
    const url = new URL('/admin/login', request.url)
    url.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
