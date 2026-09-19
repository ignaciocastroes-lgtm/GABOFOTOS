import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { SESSION_COOKIE, adminConfigurado, sesionValida } from "@/lib/admin-auth"

/**
 * Primera barrera de /admin y /api/admin/*: sin cookie de sesión válida no se pasa.
 * (Cada ruta /api/admin/* además revalida por su cuenta con exigirAdmin().)
 *
 * IMPORTANTE: /admin/login, /api/admin/login y /api/admin/logout tienen que quedar exceptuados.
 * Si no, nadie puede iniciar sesión nunca. Si se agrega otra ruta pública bajo /admin, va acá.
 */
export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] }

const RUTAS_PUBLICAS = ["/admin/login", "/api/admin/login", "/api/admin/logout"]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (RUTAS_PUBLICAS.includes(pathname)) return NextResponse.next()

  const esApi = pathname.startsWith("/api/admin/")

  if (!adminConfigurado()) {
    if (esApi) return NextResponse.json({ error: "ADMIN_PASSWORD no configurada." }, { status: 500 })
    return NextResponse.redirect(new URL("/admin/login?error=sin-configurar", request.url))
  }

  if (!(await sesionValida(request.cookies.get(SESSION_COOKIE)?.value))) {
    if (esApi) return NextResponse.json({ error: "No autorizado." }, { status: 401 })
    const url = new URL("/admin/login", request.url)
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
