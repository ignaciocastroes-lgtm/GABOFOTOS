"use client"

import { Suspense, useState } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

// Solo se puede volver a una ruta interna del panel (evita redirecciones a otros sitios).
function destinoSeguro(next: string | null) {
  return next && next.startsWith("/admin") && !next.startsWith("//") && !next.includes("://") ? next : "/admin"
}

function LoginForm() {
  const params = useSearchParams()
  const [password, setPassword] = useState("")
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(
    params.get("error") === "sin-configurar" ? "ADMIN_PASSWORD no está configurada todavía en Vercel." : null,
  )

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setCargando(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? "No se pudo iniciar sesión.")
        return
      }
      // Navegación completa: así el proxy ve la cookie nueva desde el primer momento.
      window.location.assign(destinoSeguro(params.get("next")))
    } catch {
      setError("No se pudo conectar. Intenta de nuevo.")
    } finally {
      setCargando(false)
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-zinc-950 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl bg-zinc-900 p-8 ring-1 ring-zinc-800 shadow-2xl"
      >
        <div className="flex flex-col items-center text-center">
          <Image src="/images/gabofotos-logo.jpg" alt="GABOFOTOS" width={96} height={96} className="h-20 w-20 rounded-sm object-contain" />
          <h1 className="mt-4 text-lg font-light tracking-[0.2em] text-zinc-100">ADMINISTRAR FOTOS</h1>
          <p className="mt-1 text-sm text-zinc-400">Solo para Gabo</p>
        </div>

        <label className="mt-6 block text-sm text-zinc-300">
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            autoComplete="current-password"
            className="mt-2 w-full rounded-lg bg-zinc-950 px-4 py-3 text-zinc-100 ring-1 ring-zinc-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </label>

        {error && (
          <p role="alert" className="mt-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={cargando || !password}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-yellow-400 px-6 py-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-yellow-300 disabled:opacity-60"
        >
          {cargando ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
        </button>
      </form>
    </main>
  )
}

export default function AdminLogin() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
