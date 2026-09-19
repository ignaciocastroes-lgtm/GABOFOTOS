import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { SERIES, RAMAS } from '@/lib/club'

export function Categories() {
  return (
    <section id="categorias" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold uppercase tracking-tight text-foreground text-balance md:text-5xl">
            Nuestras series
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Ocho equipos en competencia esta temporada, más la escuelita. Busca tu edad y
            escríbenos para sumarte.
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {RAMAS.map((rama) => {
            const series = SERIES.filter((s) => s.rama === rama.id)
            if (series.length === 0) return null
            return (
              <div key={rama.id}>
                <div className="mb-5 border-b border-border pb-3">
                  <h3 className="font-heading text-xl font-bold uppercase tracking-tight text-foreground">
                    {rama.titulo}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{rama.bajada}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  {series.map((s) => (
                    <Link
                      key={s.id}
                      href={s.id === 'escuelita' ? '/escuela' : `/series/${s.id}`}
                      className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
                    >
                      <span className="font-heading text-xl font-bold uppercase tracking-tight text-foreground">
                        {s.nombre}
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
