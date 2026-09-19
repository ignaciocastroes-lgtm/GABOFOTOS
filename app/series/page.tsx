import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Sprout, ShieldCheck, ArrowDown } from 'lucide-react'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { PageHeader } from '@/components/site/page-header'
import { RamasResumen } from '@/components/site/ramas-resumen'
import { Categories } from '@/components/site/categories'
import { FEDERACION } from '@/lib/club'

export const metadata: Metadata = {
  title: 'Nuestras series',
  description:
    'Las ocho series federadas del Internacional Lo Espejo: de la escuelita a la serie según la edad, y qué significa quedar federado en la Liga Central.',
}

export default function SeriesIndex() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHeader
          titulo="Nuestras series"
          bajada="Una mixta, cinco damas y dos masculina. Acá se compite federado, en la Liga Central."
        />

        <RamasResumen />

        {/* De la escuelita a la serie */}
        <section className="bg-secondary py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-4 md:px-6">
            <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
              De la escuelita a la serie
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
              La escuelita y las series son dos etapas del mismo camino, no dos clubes distintos.
              Cuando un niño o niña alcanza la edad que le corresponde a una serie, pasa de forma
              natural de la escuelita a esa serie.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <div className="rounded-2xl border border-border bg-background p-6">
                <Sprout className="h-6 w-6 text-primary" />
                <h3 className="mt-3 font-heading text-lg font-bold uppercase tracking-tight text-foreground">
                  Escuelita
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Taller municipal, gratuito. Sin afiliación a ninguna federación. Se aprende, se
                  juega, no se compite oficialmente.
                </p>
              </div>

              <div className="flex justify-center text-muted-foreground sm:rotate-[-90deg]">
                <ArrowDown className="h-6 w-6" />
              </div>

              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <h3 className="mt-3 font-heading text-lg font-bold uppercase tracking-tight text-foreground">
                  Serie
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  El deportista queda federado: afiliado a la {FEDERACION.nacional} y a la{' '}
                  {FEDERACION.liga}. Recién ahí compite oficialmente por el club.
                </p>
              </div>
            </div>

            <p className="mt-8 leading-relaxed text-muted-foreground text-pretty">
              Ese paso tiene peso: mientras está en la escuelita, un niño o niña no está federado,
              y puede probar el deporte sin ningún compromiso más allá de venir a entrenar. Cuando
              entra a una serie, sí queda federado — con carné, con pase si viene de otro club, y
              habilitado para jugar torneos oficiales.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/escuela"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-semibold uppercase tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                Conoce la escuelita
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pases"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-semibold uppercase tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                ¿Ya juegas federado en otro club?
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <Categories />
      </main>
      <SiteFooter />
    </>
  )
}
