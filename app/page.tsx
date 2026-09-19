import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { Hero } from '@/components/site/hero'
import { Gallery } from '@/components/site/gallery'
import { Vias } from '@/components/site/vias'
import { RamasResumen } from '@/components/site/ramas-resumen'
import { NoticiaTarjeta } from '@/components/site/noticia-tarjeta'
import { Agradecimientos } from '@/components/site/agradecimientos'
import { EscudoFondo } from '@/components/site/escudo-fondo'
import { CIFRAS, PILARES } from '@/lib/historia'
import { obtenerNoticias, noticiasDestacadas } from '@/lib/noticias'
import { MUNDIALITO } from '@/lib/apoyo'
import { CLUB } from '@/lib/club'

export const revalidate = 60

export default async function Page() {
  const noticias = await obtenerNoticias()
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />

        {/* Cifras */}
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

        {/* Últimas noticias */}
        <section className="bg-secondary py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
                Últimas noticias
              </h2>
              <Link
                href="/noticias"
                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary underline underline-offset-4"
              >
                Ver todas
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {noticiasDestacadas(noticias, 3).map((n) => (
                <NoticiaTarjeta key={n.id} n={n} />
              ))}
            </div>
          </div>
        </section>

        {/* Quiénes somos */}
        <section className="relative overflow-hidden bg-background py-16 md:py-24">
          <EscudoFondo opacidad={0.035} />
          <div className="relative z-10 mx-auto max-w-5xl px-4 md:px-6">
            <div className="max-w-2xl">
              <h2 className="font-heading text-3xl font-bold uppercase leading-tight tracking-tight text-foreground text-balance md:text-5xl">
                Somos el N.° 1 club de hockey patín de la comuna
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground text-pretty">
                Con el apoyo de la Ilustre Municipalidad de Lo Espejo, formamos deportistas sobre
                patines desde 2022. Abiertos a cualquiera que quiera sumarse, sea de esta comuna o
                de otra.
              </p>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              {PILARES.slice(0, 4).map((p) => (
                <div key={p.titulo}>
                  <h3 className="font-heading text-lg font-semibold uppercase tracking-tight text-foreground">
                    {p.titulo}
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{p.texto}</p>
                </div>
              ))}
            </div>

            <Link
              href="/el-club"
              className="mt-10 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary underline underline-offset-4"
            >
              Conoce nuestra historia
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Escuela: la entrada principal */}
        <section className="bg-primary py-16 text-primary-foreground md:py-24">
          <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 md:px-6 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-heading text-3xl font-bold uppercase leading-tight tracking-tight text-balance md:text-5xl">
                La escuelita es gratuita
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-primary-foreground/90 text-pretty">
                Es un taller de la Ilustre Municipalidad de Lo Espejo que imparten nuestros profesores
                Rodrigo Quintanilla y Rodolfo Oyola. Lunes y viernes de 16:30 a 18:30 en el
                Gimnasio Municipal, y prestamos los patines para empezar.
              </p>
              <Link
                href="/escuela"
                className="mt-8 inline-flex items-center gap-2 rounded-md bg-background px-8 py-4 text-base font-bold uppercase tracking-wide text-primary transition-transform hover:-translate-y-0.5"
              >
                Cómo inscribirse
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="/images/plantel-2026.webp"
                alt="Deportistas del club junto a su cuerpo técnico en el gimnasio"
                width={1600}
                height={781}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* El cuerpo técnico como argumento */}
        <section className="relative overflow-hidden bg-background py-16 md:py-24">
          <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 md:px-6 lg:grid-cols-2 lg:gap-16">
            <figure className="overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/images/profesores/rodrigo-quintanilla.webp"
                alt="Rodrigo Quintanilla, profesor de la escuelita del club"
                width={800}
                height={1000}
                className="h-full w-full object-cover"
              />
            </figure>
            <div>
              <h2 className="font-heading text-3xl font-bold uppercase leading-tight tracking-tight text-foreground text-balance md:text-5xl">
                A tu hija la enseña un campeón del mundo
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground text-pretty">
                Rodrigo Quintanilla dirigió a Las Marcianitas al título mundial de 2006, el primer
                campeonato del mundo de un deporte colectivo chileno. Hoy hace clases en el taller
                municipal gratuito, junto a Rodolfo Oyola, ex cuerpo técnico de la selección, y un
                preparador de arqueros hexamundialista.
              </p>
              <Link
                href="/profesores"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary underline underline-offset-4"
              >
                Conoce a los profesores
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <Vias />

        {/* Teaser a /series */}
        <section className="border-y border-border bg-background py-14">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center md:px-6">
            <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
              Ocho series, un mismo club
            </h2>
            <p className="max-w-xl leading-relaxed text-muted-foreground text-pretty">
              Mixta, damas y masculina, todas federadas en la Liga Central. Mira los horarios de
              entrenamiento y quién dirige cada una.
            </p>
            <Link
              href="/series"
              className="mt-2 inline-flex items-center gap-2 rounded-md bg-primary px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Ver nuestras series
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Campaña vigente */}
        <section className="relative overflow-hidden bg-[#0a0a0a] py-16 text-white md:py-24">
          <EscudoFondo variante="blanco" opacidad={0.06} />
          <div className="relative z-10 mx-auto max-w-3xl px-4 text-center md:px-6">
            <p className="text-sm font-medium tracking-widest text-white/60">Campaña vigente</p>
            <h2 className="mt-4 font-heading text-3xl font-bold uppercase leading-tight tracking-tight text-balance md:text-5xl">
              Nuestra Sub 13 viaja a San Juan
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/85 text-pretty">
              Del 13 al 19 de diciembre juegan el {MUNDIALITO.nombre} en Argentina. Es la primera vez que el club
              participa en este torneo y lo estamos financiando entre todos.
            </p>
            <Link
              href="/apoyanos"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-8 py-4 text-base font-bold uppercase tracking-wide text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Cómo apoyar
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>

        <Gallery />
        <Agradecimientos />
      </main>
      <SiteFooter />
    </>
  )
}
