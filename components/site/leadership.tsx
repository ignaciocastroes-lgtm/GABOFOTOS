import { DIRECTIVA, DIRECTIVA_VIGENCIA } from '@/lib/club'

function fecha(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Directiva. El cuerpo técnico vive en su propia página: ver Profesores. */
export function Leadership() {
  return (
    <section id="directiva" className="bg-secondary py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
          Directiva
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Electa el {fecha(DIRECTIVA_VIGENCIA.electaEl)}, con mandato de{' '}
          {DIRECTIVA_VIGENCIA.duracionAnios} años.
        </p>

        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {DIRECTIVA.map((d) => (
            <li key={d.cargo} className="rounded-xl border border-border bg-card p-5">
              <p className="font-heading text-sm font-bold uppercase tracking-widest text-primary">
                {d.cargo}
              </p>
              <p className="mt-2 font-medium leading-snug text-foreground">{d.nombre}</p>
              {'representanteLegal' in d && d.representanteLegal && (
                <p className="mt-1 text-xs text-muted-foreground">Representante legal</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
