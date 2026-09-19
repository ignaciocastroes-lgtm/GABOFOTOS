import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { PageHeader } from '@/components/site/page-header'
import { Profesores } from '@/components/site/profesores'
import { EscudoFondo } from '@/components/site/escudo-fondo'
import { CUERPO_TECNICO } from '@/lib/club'
import { MUNDIALITO } from '@/lib/apoyo'

export const metadata: Metadata = {
  title: 'Profesores y cuerpo técnico',
  description:
    'El técnico campeón del mundo con Las Marcianitas enseña en la escuelita gratuita de Lo Espejo, junto a entrenadores formados en San Juan y un preparador de arqueros propio.',
}

// Solo los destacados que ya tienen retrato: sin foto el bloque grande no funciona.
const DESTACADOS = CUERPO_TECNICO.filter((p) => p.destacado && p.foto)

export default function ProfesoresPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHeader
          titulo="Profesores"
          bajada="Un campeón del mundo y la escuela sanjuanina, enseñando gratis en el Gimnasio Municipal Lo Espejo."
        />

        {/* Destacados */}
        <section className="bg-background py-16 md:py-24">
          <div className="mx-auto flex max-w-5xl flex-col gap-16 px-4 md:px-6 md:gap-24">
            {DESTACADOS.map((p, i) => (
              <article
                key={p.id}
                className={`grid items-center gap-8 md:grid-cols-2 md:gap-12 ${
                  i % 2 === 1 ? 'md:[&>figure]:order-2' : ''
                }`}
              >
                <figure className="overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    src={p.foto!}
                    alt={`${p.nombre}, ${p.cargo} del club`}
                    width={800}
                    height={1000}
                    className="h-full w-full object-cover"
                    priority={i === 0}
                  />
                </figure>

                <div>
                  <h2 className="font-heading text-3xl font-bold uppercase leading-[1.05] tracking-tight text-foreground md:text-5xl">
                    {p.nombre}
                  </h2>
                  <p className="mt-2 text-lg font-medium text-primary">{p.cargo}</p>
                  {p.origen && (
                    <p className="mt-1 text-sm text-muted-foreground">{p.origen}</p>
                  )}
                  <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
                    {p.resumen}
                  </p>
                  <Link
                    href={`/profesores/${p.id}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary underline underline-offset-4"
                  >
                    Leer su historia completa
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Por qué importa */}
        <section className="relative overflow-hidden bg-[#0a0a0a] py-16 text-white md:py-24">
          <EscudoFondo variante="blanco" opacidad={0.06} />
          <div className="relative z-10 mx-auto max-w-3xl px-4 md:px-6">
            <h2 className="font-heading text-2xl font-bold uppercase leading-tight tracking-tight text-balance md:text-4xl">
              Lo que esto significa para una niña de Lo Espejo
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-white/85 text-pretty">
              En 2006 Chile fue campeón del mundo de hockey patín femenino. Fue el primer título
              mundial de un deporte colectivo chileno, y lo dirigió Rodrigo Quintanilla.
            </p>
            <p className="mt-4 leading-relaxed text-white/70">
              Veinte años después, ese mismo entrenador recibe en el Gimnasio Municipal Lo Espejo
              a niñas que nunca se han puesto un patín, en una escuela gratuita.
            </p>
            <p className="mt-4 leading-relaxed text-white/70">
              Junto a él, Antonio Espinoza —seis mundiales con la Roja y tres cuartos lugares del
              mundo— entrena a las arqueras del club, y Rodolfo Oyola trae desde San Juan la escuela
              argentina, con un tercer lugar mundial Sub-20 en el currículum. Es un cuerpo técnico
              que la mayoría de los clubes amateur de Chile no puede reunir, y en Lo Espejo enseña
              gratis.
            </p>
          </div>
        </section>

        <Profesores titulo="Todo el cuerpo técnico" />

        {/* El puente con San Juan */}
        <section className="bg-secondary py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-4 md:px-6">
            <h2 className="font-heading text-2xl font-bold uppercase leading-tight tracking-tight text-foreground text-balance md:text-4xl">
              Un puente con San Juan
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground text-pretty">
              Rodolfo y Facundo Oyola son sanjuaninos. San Juan es la capital del hockey patín
              sudamericano y es, además, la ciudad donde nuestra Sub 13 femenina juega el{' '}
              {MUNDIALITO.nombre} este diciembre.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Las niñas no viajan a un lugar desconocido: van a competir a la ciudad donde se
              formaron sus profesores, con la escuela de juego que ellos mismos les enseñaron.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/apoyanos"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-8 py-4 text-base font-bold uppercase tracking-wide text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Apoya el viaje
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/escuela"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-8 py-4 text-base font-semibold uppercase tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                Inscríbete en la escuela
              </Link>
              <Link
                href="/pases"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-8 py-4 text-base font-semibold uppercase tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                ¿Ya juegas en otro club?
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
