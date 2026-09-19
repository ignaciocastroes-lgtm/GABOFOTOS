'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Minus, HeartHandshake } from 'lucide-react'
import { APORTES, DONACIONES, DISENOS, MUNDIALITO } from '@/lib/apoyo'
import { formatCLP } from '@/lib/club'
import { SupportModal } from './support-modal'
import { Countdown } from './countdown'
import { CampanaProgreso } from './campana-progreso'

export function Support() {
  const [carrito, setCarrito] = useState<Record<string, number>>({})
  const [donacion, setDonacion] = useState(0)
  const [otroMonto, setOtroMonto] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)

  const sumar = (id: string) => setCarrito((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }))
  const restar = (id: string) =>
    setCarrito((c) => {
      const next = { ...c }
      if ((next[id] ?? 0) <= 1) delete next[id]
      else next[id] -= 1
      return next
    })

  const totalStickers = APORTES.reduce((s, a) => s + a.precio * (carrito[a.id] ?? 0), 0)
  const total = totalStickers + donacion
  const unidades = APORTES.reduce((s, a) => s + a.unidades * (carrito[a.id] ?? 0), 0)

  function elegirDonacion(monto: number) {
    setDonacion((actual) => (actual === monto ? 0 : monto))
    setOtroMonto('')
  }

  function aplicarOtroMonto(valor: string) {
    setOtroMonto(valor)
    const n = Number(valor.replace(/\D/g, ''))
    setDonacion(Number.isFinite(n) && n >= 1000 ? n : 0)
  }

  return (
    <section
      id="apoyanos"
      className="relative overflow-hidden bg-foreground bg-[url('/images/plantel-2026.webp')] bg-cover bg-center py-20 md:py-28"
    >
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center text-white">
          <h2 className="font-heading text-3xl font-bold uppercase leading-tight tracking-tight text-balance md:text-5xl">
            Ayúdanos a llevar a la Sub 13 a San Juan
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-white/85 text-pretty">
            Nuestra {MUNDIALITO.categoria} fue invitada al {MUNDIALITO.nombre}, el Encuentro
            Internacional de Hockey sobre Patines que organiza el Club Unión Deportiva Bancaria en
            San Juan desde 1989. Se juega en el {MUNDIALITO.estadio} y reúne a más de 700 chicos y
            chicas de Argentina, Chile, Colombia, España e Italia. El club ya viajó a San Juan con
            sus series Sub 17 y Sub 19 damas al Torneo SEC, pero es la primera vez que compite en
            este torneo. Con stickers y aportes directos financiamos pasajes, alojamiento y
            alimentación.
          </p>
          <Countdown />
          <CampanaProgreso />
        </div>

        <div className="mx-auto max-w-5xl rounded-2xl bg-background p-6 shadow-2xl md:p-8">
          <h3 className="font-heading text-2xl font-bold uppercase tracking-tight text-foreground">
            Stickers
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Cada sticker acerca a las niñas a la cancha del Aldo Cantoni.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 rounded-xl bg-secondary p-5">
            {DISENOS.map((d) => (
              <figure key={d.id} className="w-24 text-center sm:w-28">
                <Image
                  src={d.img}
                  alt={`Sticker ${d.nombre}`}
                  width={200}
                  height={200}
                  className="h-auto w-full"
                />
                <figcaption className="mt-1 text-[11px] leading-tight text-muted-foreground">
                  {d.nombre}
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {APORTES.map((a) => (
              <article
                key={a.id}
                className={
                  a.destacado
                    ? 'flex flex-col rounded-xl border-2 border-primary bg-card p-4 text-center'
                    : 'flex flex-col rounded-xl border border-border bg-card p-4 text-center'
                }
              >
                {a.destacado && (
                  <span className="mx-auto mb-2 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
                    El más elegido
                  </span>
                )}
                <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-lg bg-secondary">
                  <Image
                    src={a.img}
                    alt={a.nombre}
                    width={300}
                    height={300}
                    className="h-full w-full object-contain p-3"
                  />
                  {a.unidades > 1 && (
                    <span className="absolute right-2 top-2 rounded-md bg-foreground px-2 py-1 text-xs font-bold text-background">
                      ×{a.unidades}
                    </span>
                  )}
                </div>
                <h4 className="mt-4 font-heading text-lg font-semibold uppercase tracking-tight text-foreground">
                  {a.nombre}
                </h4>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">{a.desc}</p>
                <p className="mt-3 font-heading text-2xl font-bold text-primary">
                  {formatCLP(a.precio)}
                </p>

                {carrito[a.id] ? (
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => restar(a.id)}
                      aria-label={`Quitar un ${a.nombre}`}
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-border transition-colors hover:border-primary hover:text-primary"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-6 text-center font-semibold">{carrito[a.id]}</span>
                    <button
                      type="button"
                      onClick={() => sumar(a.id)}
                      aria-label={`Agregar un ${a.nombre}`}
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-border transition-colors hover:border-primary hover:text-primary"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => sumar(a.id)}
                    className="mt-4 rounded-md bg-primary px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Agregar
                  </button>
                )}
              </article>
            ))}
          </div>

          {/* Aporte libre */}
          <div className="mt-10 rounded-xl border border-border bg-secondary p-6">
            <div className="flex items-start gap-3">
              <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h3 className="font-heading text-xl font-semibold uppercase tracking-tight text-foreground">
                  ¿Prefieres aportar sin stickers?
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Elige un monto o escribe el tuyo. Va directo al viaje.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {DONACIONES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => elegirDonacion(d.monto)}
                  aria-pressed={donacion === d.monto}
                  className={
                    donacion === d.monto
                      ? 'flex flex-col items-start rounded-lg border-2 border-primary bg-background px-4 py-3 text-left'
                      : 'flex flex-col items-start rounded-lg border border-border bg-background px-4 py-3 text-left transition-colors hover:border-primary'
                  }
                >
                  <span className="font-heading text-lg font-bold text-foreground">
                    {formatCLP(d.monto)}
                  </span>
                  <span className="text-xs text-muted-foreground">{d.etiqueta}</span>
                </button>
              ))}
              <label className="flex flex-col items-start rounded-lg border border-border bg-background px-4 py-2">
                <span className="text-xs text-muted-foreground">Otro monto</span>
                <input
                  inputMode="numeric"
                  value={otroMonto}
                  onChange={(e) => aplicarOtroMonto(e.target.value)}
                  placeholder="20.000"
                  className="w-28 bg-transparent font-heading text-lg font-bold text-foreground outline-none placeholder:font-sans placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground"
                />
              </label>
            </div>
          </div>

          {/* Barra de total */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl bg-secondary p-5 sm:flex-row">
            <div className="text-center sm:text-left">
              <p className="text-sm text-muted-foreground">
                {unidades > 0
                  ? `${unidades} sticker${unidades > 1 ? 's' : ''}${donacion > 0 ? ' + aporte libre' : ''}`
                  : donacion > 0
                    ? 'Aporte libre'
                    : 'Aún no eliges nada'}
              </p>
              <p className="font-heading text-2xl font-bold text-foreground">
                Total: {formatCLP(total)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setModalAbierto(true)}
              disabled={total === 0}
              className="rounded-md bg-primary px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>

      <SupportModal
        abierto={modalAbierto}
        onClose={() => setModalAbierto(false)}
        carrito={carrito}
        donacion={donacion}
      />
    </section>
  )
}
