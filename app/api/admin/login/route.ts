import { NextResponse } from "next/server"
import {
  SESSION_COOKIE,
  SESSION_SEGUNDOS,
  adminConfigurado,
  contrasenaCorrecta,
  crearSesion,
  origenPermitido,
} from "@/lib/admin-auth"

export const runtime = "nodejs"

// Freno a la fuerza bruta: 5 fallos por IP cada 10 minutos. En serverless la memoria no se
// comparte entre instancias, así que es un freno "de mejor esfuerzo": además cada fallo espera
// casi un segundo antes de responder.
const VENTANA_MS = 10 * 60 * 1000
const MAX_FALLOS = 5
const fallos = new Map<string, { n: number; desde: number }>()

function ipDe(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "desconocida"
}

export async function POST(request: Request) {
  if (!adminConfigurado()) {
    return NextResponse.json({ error: "ADMIN_PASSWORD no está configurada en el servidor." }, { status: 500 })
  }
  if (!origenPermitido(request)) {
    return NextResponse.json({ error: "Origen no permitido." }, { status: 403 })
  }

  const ip = ipDe(request)
  const ahora = Date.now()
  const registro = fallos.get(ip)
  if (registro && ahora - registro.desde > VENTANA_MS) fallos.delete(ip)
  if ((fallos.get(ip)?.n ?? 0) >= MAX_FALLOS) {
    return NextResponse.json({ error: "Demasiados intentos. Espera unos minutos." }, { status: 429 })
  }

  const { password } = await request.json().catch(() => ({ password: "" }))

  if (typeof password !== "string" || !(await contrasenaCorrecta(password))) {
    const actual = fallos.get(ip)
    fallos.set(ip, { n: (actual?.n ?? 0) + 1, desde: actual?.desde ?? ahora })
    await new Promise((r) => setTimeout(r, 800))
    return NextResponse.json({ error: "Contraseña incorrecta." }, { status: 401 })
  }

  fallos.delete(ip)
  const sesion = await crearSesion()
  if (!sesion) return NextResponse.json({ error: "No se pudo crear la sesión." }, { status: 500 })

  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE, sesion, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_SEGUNDOS,
  })
  return res
}
