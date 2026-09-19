import { ESCENARIO_DEPORTIVO, DEPORTIVA, DIAS, TIPO_CAMBIO, APORTE_APODERADO } from '@/lib/presupuesto'
import { MUNDIALITO } from '@/lib/apoyo'
import { formatCLP } from '@/lib/club'

/**
 * Desglose abierto del costo del viaje.
 *
 * No es decoración: es el argumento. Un auspiciador o un evaluador de fondos
 * quiere ver en qué se gasta cada peso antes de aportar, y publicarlo de
 * entrada evita tener que explicarlo caso a caso.
 */
export function Presupuesto() {
  const { lineas, totalUsd, totalClp } = ESCENARIO_DEPORTIVO

  return (
    <section id="presupuesto" className="bg-secondary py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <h2 className="font-heading text-3xl font-bold uppercase tracking-tight text-foreground text-balance md:text-5xl">
            En qué se gasta cada peso
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Llevar a {DEPORTIVA} personas a San Juan por {DIAS} días. Publicamos el desglose
            completo porque quien aporta tiene derecho a saber a dónde va su plata.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-background">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Presupuesto del viaje al Mundialito Bancaria 2026</caption>
            <tbody>
              {lineas.map((l) => (
                <tr key={l.concepto} className="border-b border-border">
                  <th scope="row" className="px-5 py-4 font-medium text-foreground">
                    {l.concepto}
                    <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                      {l.detalle}
                    </span>
                  </th>
                  <td className="whitespace-nowrap px-5 py-4 text-right tabular-nums text-muted-foreground">
                    {formatCLP(l.usd * TIPO_CAMBIO)}
                  </td>
                </tr>
              ))}
              <tr className="bg-secondary">
                <th scope="row" className="px-5 py-4 font-heading text-lg font-bold uppercase text-foreground">
                  Total
                </th>
                <td className="whitespace-nowrap px-5 py-4 text-right font-heading text-2xl font-bold tabular-nums text-primary">
                  {formatCLP(totalClp)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
          Incluye un 10% para imprevistos. Los costos se pagan en dólares
          (USD&nbsp;{totalUsd.toLocaleString('es-CL')}) y se convierten a ${TIPO_CAMBIO} por dólar,
          así que el monto final puede variar con el tipo de cambio. El alojamiento no aparece
          porque la delegación se hospeda en casas de familias. Cada apoderado que viaja costea su
          propio pasaje y estadía, unos {formatCLP(APORTE_APODERADO * TIPO_CAMBIO)} por persona.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          Torneo organizado por el Club Unión Deportiva Bancaria,{' '}
          <a
            href={MUNDIALITO.sitio}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-primary"
          >
            mundialitobancaria.com.ar
          </a>
        </p>
      </div>
    </section>
  )
}
