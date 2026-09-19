/**
 * Autenticación del panel /admin (una sola contraseña, la del fotógrafo).
 *
 * Diferencias con una cookie "sha256(contraseña)":
 *  - La cookie NO deriva de la contraseña: es `expiración.firma`, firmada con HMAC-SHA256 y un
 *    secreto (ADMIN_SESSION_SECRET). Aunque alguien vea la cookie, no le sirve para adivinar la
 *    contraseña, y caduca sola a los 7 días.
 *  - Se compara en tiempo constante (no se filtra información por cuánto tarda en responder).
 *  - Cambiar ADMIN_SESSION_SECRET (o la contraseña, si no hay secreto) cierra todas las sesiones.
 *
 * Usa Web Crypto, así que funciona igual en el proxy y en las rutas.
 */

import { NextResponse } from "next/server"

export const SESSION_COOKIE = "admin_session"
export const SESSION_SEGUNDOS = 60 * 60 * 24 * 7

const enc = new TextEncoder()

function aHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

function deHex(hex: string): Uint8Array | null {
  if (hex.length === 0 || hex.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(hex)) return null
  const out = new Uint8Array(hex.length / 2)
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  return out
}

function hmacKey(secreto: string, usos: KeyUsage[]) {
  return crypto.subtle.importKey("raw", enc.encode(secreto), { name: "HMAC", hash: "SHA-256" }, false, usos)
}

function secretoDeSesion(): string | null {
  const s = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD
  return s ? `gabofotos-sesion:${s}` : null
}

/** ¿Está el panel configurado? (hace falta ADMIN_PASSWORD) */
export function adminConfigurado(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD)
}

/** Compara la contraseña ingresada con ADMIN_PASSWORD en tiempo constante. */
export async function contrasenaCorrecta(intento: string): Promise<boolean> {
  const real = process.env.ADMIN_PASSWORD
  if (!real) return false
  const key = await hmacKey("gabofotos-login", ["sign"])
  const [a, b] = await Promise.all([
    crypto.subtle.sign("HMAC", key, enc.encode(intento)),
    crypto.subtle.sign("HMAC", key, enc.encode(real)),
  ])
  const x = new Uint8Array(a)
  const y = new Uint8Array(b)
  let dif = 0
  for (let i = 0; i < x.length; i++) dif |= x[i] ^ y[i]
  return dif === 0
}

/** Crea el valor de la cookie de sesión: `expiración.firma`. */
export async function crearSesion(ahora = Date.now()): Promise<string | null> {
  const secreto = secretoDeSesion()
  if (!secreto) return null
  const exp = Math.floor(ahora / 1000) + SESSION_SEGUNDOS
  const firma = await crypto.subtle.sign("HMAC", await hmacKey(secreto, ["sign"]), enc.encode(String(exp)))
  return `${exp}.${aHex(firma)}`
}

export async function sesionValida(token: string | null | undefined, ahora = Date.now()): Promise<boolean> {
  const secreto = secretoDeSesion()
  if (!secreto || !token) return false
  const [expTexto, firmaHex] = token.split(".")
  const exp = Number(expTexto)
  if (!Number.isInteger(exp) || exp * 1000 < ahora) return false
  const firma = deHex(firmaHex ?? "")
  if (!firma) return false
  // crypto.subtle.verify compara en tiempo constante.
  return crypto.subtle.verify("HMAC", await hmacKey(secreto, ["verify"]), firma as BufferSource, enc.encode(expTexto))
}

function cookieDe(request: Request): string | undefined {
  const match = (request.headers.get("cookie") ?? "").match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`))
  return match?.[1]
}

/** Para escrituras: el Origin, si viene, tiene que ser este mismo sitio (defensa extra contra CSRF). */
export function origenPermitido(request: Request): boolean {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return true
  const origen = request.headers.get("origin")
  if (!origen) return true
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host")
  try {
    return new URL(origen).host === host
  } catch {
    return false
  }
}

/**
 * Guardia de las rutas /api/admin/*: devuelve null si todo está bien o la respuesta de error.
 * El proxy ya filtra, pero cada ruta lo revalida por su cuenta (nunca depende solo del proxy).
 */
export async function exigirAdmin(request: Request): Promise<NextResponse | null> {
  if (!adminConfigurado()) {
    return NextResponse.json({ error: "ADMIN_PASSWORD no está configurada en el servidor." }, { status: 500 })
  }
  if (!(await sesionValida(cookieDe(request)))) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }
  if (!origenPermitido(request)) {
    return NextResponse.json({ error: "Origen no permitido." }, { status: 403 })
  }
  return null
}

/** Solo se permite volver a rutas internas del panel (evita redirecciones a otros sitios). */
export function destinoSeguro(next: string | null | undefined): string {
  if (next && next.startsWith("/admin") && !next.startsWith("//") && !next.includes("://")) return next
  return "/admin"
}
