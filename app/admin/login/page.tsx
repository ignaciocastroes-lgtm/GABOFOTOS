'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [password, setPassword] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(
    params.get('error') === 'sin-configurar'
      ? 'ADMIN_PASSWORD no está configurada todavía en Vercel.'
      : null,
  )

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setCargando(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'No se pudo iniciar sesión.')
        return
      }
      router.push(params.get('next') || '/admin')
      router.refresh()
    } catch {
      setError('No se pudo conectar. Intenta de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <main className="flex min-h-[100svh] items-center justify-center bg-secondary px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-border bg-background p-8 shadow-lg"
      >
        <div className="flex flex-col items-center text-center">
          <Image src="/escudo.webp" alt="" width={64} height={64} className="h-14 w-14" />
          <h1 className="mt-4 font-heading text-xl font-bold uppercase tracking-tight text-foreground">
            Administración
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Solo para el club</p>
        </div>

        <label className="mt-6 block text-sm font-medium text-foreground">
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-foreground outline-none focus:border-primary"
          />
        </label>

        {error && <p className="mt-3 text-sm text-primary">{error}</p>}

        <button
          type="submit"
          disabled={cargando || !password}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {cargando ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Entrar'}
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
