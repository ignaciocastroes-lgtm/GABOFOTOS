'use client'

import { useState } from 'react'
import { Plane } from 'lucide-react'
import { CAMISETA, CAMISETAS_POR_TEMPORADA } from '@/lib/auspicios'
import { formatCLP } from '@/lib/club'

/**
 * Camiseta dibujada en SVG con las posiciones de auspicio marcadas.
 *
 * Al tocar una posición se muestra qué significa para el club y cuánto cuesta.
 * La idea es que el auspiciador vea su logo puesto antes de decidir, en vez de
 * leer una tabla de precios abstracta.
 */
export function CamisetaInteractiva({
  variante = 'temporada',
}: {
  /**
   * 'mundialito' → las dos camisetas del viaje a San Juan: muestra qué línea
   *   del presupuesto financia cada posición. Etiquetas "Titular"/"Alternativa".
   * 'temporada'  → auspicio del club federado, camisetas de local y de visita
   *   para cualquiera de las ocho series. Etiquetas "Local"/"Visita".
   */
  variante?: 'mundialito' | 'temporada'
}) {
  const [activa, setActiva] = useState<string>('pecho')
  const sel = CAMISETA.find((c) => c.id === activa)!
  const etiquetas =
    variante === 'mundialito'
      ? { primera: 'Titular', segunda: 'Alternativa' }
      : { primera: 'Local', segunda: 'Visita' }

  const zonas: Record<string, { cx: number; cy: number; rx: number; ry: number }> = {
    pecho: { cx: 150, cy: 132, rx: 46, ry: 26 },
    espalda: { cx: 150, cy: 205, rx: 52, ry: 24 },
    hombros: { cx: 150, cy: 74, rx: 78, ry: 15 },
    mangas: { cx: 150, cy: 108, rx: 108, ry: 16 },
    short: { cx: 150, cy: 300, rx: 40, ry: 20 },
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 md:items-center">
      {/* Camiseta */}
      <div className="mx-auto w-full max-w-sm">
        <svg viewBox="0 0 300 360" className="h-auto w-full" role="img" aria-label="Camiseta del club con las posiciones de auspicio">
          {/* Cuerpo de la camiseta */}
          <path
            d="M96,42 L124,30 Q150,48 176,30 L204,42 L246,74 L222,112 L200,98 L200,246 L100,246 L100,98 L78,112 L54,74 Z"
            fill="#CC1A1D"
            stroke="#1a1a1a"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Franjas del club */}
          <path d="M100,150 L200,150" stroke="#1a1a1a" strokeWidth="6" opacity=".25" />
          <path d="M100,168 L200,168" stroke="#1a1a1a" strokeWidth="6" opacity=".25" />
          {/* Cuello */}
          <path d="M124,30 Q150,48 176,30" fill="none" stroke="#1a1a1a" strokeWidth="6" />
          {/* Número */}
          <text
            x="150"
            y="222"
            textAnchor="middle"
            className="font-heading"
            fontSize="46"
            fontWeight="bold"
            fill="#ffffff"
            opacity=".65"
          >
            {variante === 'mundialito' ? '13' : '10'}
          </text>
          {/* Short */}
          <path
            d="M104,254 L196,254 L204,326 L158,326 L150,286 L142,326 L96,326 Z"
            fill="#1e2a52"
            stroke="#1a1a1a"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Zonas de auspicio */}
          {CAMISETA.map((c) => {
            const z = zonas[c.id]
            const esta = activa === c.id
            return (
              <g
                key={c.id}
                onClick={() => setActiva(c.id)}
                onMouseEnter={() => setActiva(c.id)}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`Posición ${c.posicion}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setActiva(c.id)
                }}
              >
                <ellipse
                  cx={z.cx}
                  cy={z.cy}
                  rx={z.rx}
                  ry={z.ry}
                  fill={esta ? '#ffffff' : '#ffffff'}
                  fillOpacity={esta ? 0.95 : 0.18}
                  stroke={esta ? '#1a1a1a' : '#ffffff'}
                  strokeWidth={esta ? 2.5 : 1.5}
                  strokeDasharray={esta ? '0' : '5 4'}
                  className="transition-all"
                />
                <text
                  x={z.cx}
                  y={z.cy + 4}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="bold"
                  fill={esta ? '#CC1A1D' : '#ffffff'}
                  className="pointer-events-none select-none uppercase"
                >
                  {esta ? 'TU LOGO' : c.posicion.split(' ')[0]}
                </text>
              </g>
            )
          })}
        </svg>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Toca una posición de la camiseta
        </p>
      </div>

      {/* Detalle de la posición */}
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <p className="font-heading text-sm font-bold uppercase tracking-widest text-primary">
          {sel.posicion}
        </p>
        <p className="mt-4 text-lg leading-relaxed text-foreground text-pretty">
          {sel.significado}
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6">
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              {etiquetas.primera}
            </dt>
            <dd className="font-heading text-2xl font-bold text-foreground">
              {formatCLP(sel.titular)}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              {etiquetas.segunda}
            </dt>
            <dd className="font-heading text-2xl font-bold text-foreground">
              {formatCLP(sel.alternativa)}
            </dd>
          </div>
        </dl>

        <p className="mt-4 rounded-lg bg-secondary px-4 py-3 text-sm text-muted-foreground">
          Las {CAMISETAS_POR_TEMPORADA} camisetas:{' '}
          <span className="font-heading text-base font-bold text-primary">
            {formatCLP(sel.titular + sel.alternativa)}
          </span>
        </p>

        {variante === 'mundialito' && (
          <p className="mt-3 flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm leading-relaxed text-foreground">
            <Plane className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {sel.cubre}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {CAMISETA.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiva(c.id)}
              aria-pressed={activa === c.id}
              className={
                activa === c.id
                  ? 'rounded-md bg-primary px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary-foreground'
                  : 'rounded-md border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:border-primary hover:text-primary'
              }
            >
              {c.posicion}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
