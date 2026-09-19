import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { PageHeader } from '@/components/site/page-header'
import { Leadership } from '@/components/site/leadership'
import { Profesores } from '@/components/site/profesores'
import { Valores } from '@/components/site/valores'
import { Agradecimientos } from '@/components/site/agradecimientos'
import { RamasResumen } from '@/components/site/ramas-resumen'
import { HITOS, PILARES, CIFRAS } from '@/lib/historia'
import { CLUB } from '@/lib/club'

export const metadata: Metadata = {
  title: 'El Club | Internacional Lo Espejo',
  description:
    'Historia, misión y equipo del Club Deportivo Social y Cultural Hockey Internacional Lo Espejo, el único club de hockey patín de la comuna.',
}

export default function ElClub() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHeader
          titulo="El único club de hockey patín de Lo Espejo"
          bajada="Desde 2022 formamos deportistas sobre patines en Lo Espejo, sin cobrarles un peso. Abiertos a cualquiera que quiera sumarse, sea de esta comuna o de otra."
        />

        <section className="border-b border-border bg-background py-12">
          <div className="mx-auto grid max-w-5xl grid-cols-3 gap-8 px-4 md:px-6">
            {CIFRAS.map((c) => (
              <div key={c.etiqueta}>
                <p className="font-heading text-4xl font-bold text-primary md:text-5xl">{c.valor}</p>
                <p className="mt-1 text-sm leading-snug text-muted-foreground">{c.etiqueta}</p>
              </div>
            ))}
          </div>
        </section>

        <RamasResumen />

        <section className="bg-background py-16 md:py-24">
          <div className="mx-auto grid max-w-5xl gap-12 px-4 md:px-6 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
                Lo que nos mueve
              </h2>
              <div className="mt-8 flex flex-col gap-8">
                {PILARES.map((p) => (
                  <div key={p.titulo}>
                    <h3 className="font-heading text-lg font-semibold uppercase tracking-tight text-foreground">
                      {p.titulo}
                    </h3>
                    <p className="mt-2 leading-relaxed text-muted-foreground">{p.texto}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:pt-16">
              <div className="overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src="/images/plantel-2026.webp"
                  alt="El plantel del club junto al cuerpo técnico en el Gimnasio Municipal Lo Espejo"
                  width={1600}
                  height={781}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                El plantel del club en el {CLUB.sede.nombre}, 2026.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-secondary py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-4 md:px-6">
            <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
              Nuestra historia
            </h2>
            <ol className="mt-10 border-l-2 border-border">
              {HITOS.map((h, i) => (
                <li key={i} className="relative pb-10 pl-8 last:pb-0">
                  <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-primary" />
                  <p className="font-heading text-sm font-bold tracking-widest text-primary">
                    {h.anio}
                  </p>
                  <h3 className="mt-1 font-heading text-xl font-semibold uppercase tracking-tight text-foreground">
                    {h.titulo}
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{h.texto}</p>
                </li>
              ))}
            </ol>

            <p className="mt-10 text-sm text-muted-foreground">
              Los antecedentes legales del club están en{' '}
              <Link href="/transparencia" className="text-primary underline underline-offset-4">
                Transparencia
              </Link>
              .
            </p>
          </div>
        </section>

        <Valores />
        <Profesores />
        <Leadership />
        <Agradecimientos />
      </main>
      <SiteFooter />
    </>
  )
}
