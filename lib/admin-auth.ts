/**
 * Autenticación del admin, en un solo lugar.
 *
 * Antes esta función vivía duplicada en proxy.ts y en
 * app/api/admin/login/route.ts. Ahora las rutas de escritura de noticias
 * también la necesitan, así que quedó acá — un solo lugar si el método de
 * verificación cambia algún día.
 */

export async function sha256(texto: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto))
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Verifica la cookie de sesión de una request contra ADMIN_PASSWORD.
 * Se usa en las rutas /api/admin/* para no depender solo del proxy — si
 * algún día una de estas rutas se llama desde otro lado (un cron, un test),
 * sigue estando protegida.
 */
export async function esAdminValido(request: Request): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return false

  const cookieHeader = request.headers.get('cookie') ?? ''
  const match = cookieHeader.match(/(?:^|;\s*)admin_session=([^;]+)/)
  const cookie = match?.[1]
  if (!cookie) return false

  const esperado = await sha256(password)
  return cookie === esperado
}
