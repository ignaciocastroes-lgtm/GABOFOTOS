'use client'

import { useEffect, useRef, useState } from 'react'
import { X, Copy, Check, Building2, CreditCard, Mail, Loader2, AlertCircle, Shirt } from 'lucide-react'
import { CUENTA, CLUB, formatCLP, whatsappHref } from '@/lib/club'
import { WhatsappButton } from './whatsapp-button'
import { APORTES } from '@/lib/apoyo'

type Carrito = Record<string, number>

export function SupportModal({
  abierto,
  onClose,
  carrito,
  donacion,
}: {
  abierto: boolean
  onClose: () => void
  carrito: Carrito
  donacion: number
}) {
  const [metodo, setMetodo] = useState<'transferencia' | 'tarjeta'>('transferencia')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const cerrarRef = useRef<HTMLButtonElement>(null)

  const lineas = APORTES.filter((a) => carrito[a.id]).map((a) => ({
    ...a,
    cantidad: carrito[a.id],
    subtotal: a.precio * carrito[a.id],
  }))
  const total = lineas.reduce((s, l) => s + l.subtotal, 0) + donacion

  const resumen = [
    ...lineas.map((l) => `${l.cantidad}x ${l.nombre}`),
    donacion > 0 ? `Aporte libre ${formatCLP(donacion)}` : null,
  ]
    .filter(Boolean)
    .join(', ')

  // Cerrar con Escape y bloquear el scroll del fondo
  useEffect(() => {
    if (!abierto) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    cerrarRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [abierto, onClose])

  if (!abierto) return null

  async function pagarConTarjeta() {
    setCargando(true)
    setError(null)
    try {
      const res = await fetch('/api/mercadopago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: lineas.map((l) => ({ id: l.id, cantidad: l.cantidad })),
          donacion,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.url) {
        setError(data.error ?? 'No pudimos iniciar el pago.')
        return
      }
      window.location.href = data.url
    } catch {
      setError('No pudimos conectar. Revisa tu conexión o usa transferencia.')
    } finally {
      setCargando(false)
    }
  }

  const asunto = `Comprobante de aporte - ${CLUB.nombreCorto}`
  const cuerpoCorreo = `Hola,

Adjunto el comprobante de mi transferencia.

Aporte: ${resumen}
Total: ${formatCLP(total)}

Nombre:
Teléfono:
Dirección de despacho (si corresponde):
`
  const mailto = `mailto:${CUENTA.email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpoCorreo)}`

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-apoyo"
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-background shadow-2xl sm:rounded-2xl"
      >
        {/* Cabecera */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-background px-6 py-5">
          <div>
            <h2
              id="titulo-apoyo"
              className="font-heading text-xl font-bold uppercase tracking-tight text-foreground"
            >
              Confirma tu aporte
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Viaje de la Sub 13 al Mundialito de San Juan
            </p>
          </div>
          <button
            ref={cerrarRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="-mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          {/* Resumen */}
          <ul className="flex flex-col gap-2 text-sm">
            {lineas.map((l) => (
              <li key={l.id} className="flex justify-between gap-4">
                <span className="text-foreground">
                  {l.cantidad} × {l.nombre}
                </span>
                <span className="shrink-0 text-muted-foreground">{formatCLP(l.subtotal)}</span>
              </li>
            ))}
            {donacion > 0 && (
              <li className="flex justify-between gap-4">
                <span className="text-foreground">Aporte libre</span>
                <span className="shrink-0 text-muted-foreground">{formatCLP(donacion)}</span>
              </li>
            )}
          </ul>
          <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
            <span className="text-sm font-medium text-foreground">Total</span>
            <span className="font-heading text-3xl font-bold text-primary">
              {formatCLP(total)}
            </span>
          </div>

          {/* Selector de método */}
          <div className="mt-6 grid grid-cols-2 gap-2 rounded-lg bg-secondary p-1">
            <MetodoTab
              activo={metodo === 'transferencia'}
              onClick={() => setMetodo('transferencia')}
              icon={Building2}
              label="Transferencia"
            />
            <MetodoTab
              activo={metodo === 'tarjeta'}
              onClick={() => setMetodo('tarjeta')}
              icon={CreditCard}
              label="Tarjeta"
            />
          </div>

          {metodo === 'transferencia' ? (
            <div className="mt-5">
              <dl className="divide-y divide-border rounded-lg border border-border">
                <Dato label="Banco" valor={CUENTA.banco} />
                <Dato label="Tipo de cuenta" valor={CUENTA.tipo} />
                <Dato label="N° de cuenta" valor={CUENTA.numero} copiable />
                <Dato label="Titular" valor={CUENTA.titular} />
                <Dato label="RUT" valor={CUENTA.rut} copiable />
                <Dato label="Correo" valor={CUENTA.email} copiable />
              </dl>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Transfiere el total y envíanos el comprobante indicando tu nombre y qué stickers
                pediste. Te confirmamos la entrega apenas lo recibamos.
              </p>

              <div className="mt-5 flex flex-col gap-3">
                <WhatsappButton
                  mensaje={`Hola, transferí ${formatCLP(total)} para apoyar a la Sub 13. Aporte: ${resumen}. Adjunto el comprobante.`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Enviar comprobante por WhatsApp
                </WhatsappButton>
                <a
                  href={mailto}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Mail className="h-4 w-4" />
                  Enviar comprobante por correo
                </a>
              </div>
            </div>
          ) : (
            <div className="mt-5">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Te llevamos a Mercado Pago para pagar con débito, crédito o saldo. Al volver te
                confirmamos el aporte.
              </p>

              {error && (
                <p className="mt-4 flex items-start gap-2 rounded-md bg-accent p-3 text-sm text-accent-foreground">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={pagarConTarjeta}
                disabled={cargando}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                {cargando ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Conectando…
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Pagar {formatCLP(total)}
                  </>
                )}
              </button>
            </div>
          )}

          <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">
            Los aportes van íntegros al viaje de la Sub 13.{' '}
            <a href={`mailto:${CUENTA.email}`} className="underline underline-offset-2">
              Escríbenos
            </a>{' '}
            si necesitas boleta.
          </p>

          <a
            href="#camiseta"
            onClick={onClose}
            className="mt-4 flex items-start gap-3 rounded-lg border border-border p-4 transition-colors hover:border-primary"
          >
            <Shirt className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <span className="text-sm leading-relaxed">
              <span className="block font-semibold text-foreground">
                ¿Representas a una empresa?
              </span>
              <span className="text-muted-foreground">
                Puedes poner tu logo en la camiseta con que las niñas juegan en San Juan.
              </span>
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}

function MetodoTab({
  activo,
  onClick,
  icon: Icon,
  label,
}: {
  activo: boolean
  onClick: () => void
  icon: React.ElementType
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={
        activo
          ? 'flex items-center justify-center gap-2 rounded-md bg-background px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm'
          : 'flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
      }
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

function Dato({ label, valor, copiable }: { label: string; valor: string; copiable?: boolean }) {
  const [copiado, setCopiado] = useState(false)

  async function copiar() {
    try {
      await navigator.clipboard.writeText(valor)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1800)
    } catch {
      /* el usuario puede seleccionar el texto a mano */
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="truncate text-sm font-medium text-foreground">{valor}</dd>
      </div>
      {copiable && (
        <button
          type="button"
          onClick={copiar}
          aria-label={`Copiar ${label}`}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          {copiado ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
        </button>
      )}
    </div>
  )
}
