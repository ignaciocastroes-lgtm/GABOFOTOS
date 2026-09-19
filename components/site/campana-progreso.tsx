import { CAMPANA } from '@/lib/apoyo'
import { formatCLP } from '@/lib/club'

/**
 * Barra de avance de la recaudación.
 *
 * No se renderiza si CAMPANA.meta es 0. Una barra con cifras inventadas es
 * peor que no tener barra: si alguien pregunta cuánto se lleva juntado y el
 * número no calza con la tesorería, el daño de confianza es difícil de reparar.
 */
export function CampanaProgreso() {
  if (!CAMPANA.meta) return null

  const pct = Math.min(100, Math.round((CAMPANA.recaudado / CAMPANA.meta) * 100))
  const falta = Math.max(0, CAMPANA.meta - CAMPANA.recaudado)

  return (
    <div className="mx-auto mt-8 max-w-xl rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-heading text-2xl font-bold text-white">
          {formatCLP(CAMPANA.recaudado)}
        </span>
        <span className="text-sm text-white/70">meta {formatCLP(CAMPANA.meta)}</span>
      </div>

      <div
        className="mt-3 h-3 w-full overflow-hidden rounded-full bg-white/20"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Avance de la recaudación"
      >
        <div className="h-full rounded-full bg-white transition-[width]" style={{ width: `${pct}%` }} />
      </div>

      <p className="mt-3 text-sm text-white/85">
        {pct}% del viaje financiado. Faltan {formatCLP(falta)}.
      </p>
    </div>
  )
}
