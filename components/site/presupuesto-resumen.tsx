import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ESCENARIO_DEPORTIVO, DEPORTIVA, DIAS } from '@/lib/presupuesto'
import { formatCLP } from '@/lib/club'

/**
 * Resumen del costo del viaje, para /transparencia.
 *
 * El desglose línea por línea vive en /apoyanos, que es la página de la
 * campaña. Repetir la tabla completa acá duplicaba el mismo contenido en dos
 * rutas; este resumen confirma el monto y remite al lugar donde corresponde
 * verlo entero, sin copiar la tabla.
 */
export function PresupuestoResumen() {
  const { totalClp } = ESCENARIO_DEPORTIVO

  return (
    <div className="mt-16">
      <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
        Gastos del viaje a San Juan
      </h2>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-border bg-card p-6">
        <div>
          <p className="text-sm text-muted-foreground">
            Costo total de llevar a {DEPORTIVA} personas a San Juan por {DIAS} días
          </p>
          <p className="mt-1 font-heading text-3xl font-bold text-primary">
            {formatCLP(totalClp)}
          </p>
        </div>
        <Link
          href="/apoyanos#presupuesto"
          className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-semibold uppercase tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          Ver el desglose completo
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        El detalle línea por línea, cómo aportar y quién organiza el torneo están en{' '}
        <Link href="/apoyanos" className="text-primary underline underline-offset-4">
          Apóyanos
        </Link>
        .
      </p>
    </div>
  )
}
