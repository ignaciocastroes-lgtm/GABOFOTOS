import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Video as VideoIcon, PlayCircle } from 'lucide-react'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { EscudoFondo } from '@/components/site/escudo-fondo'
import { ContactoCTA } from '@/components/site/contacto-cta'
import { NoticiasFeed } from '@/components/site/noticias-feed'
import { CUERPO_TECNICO } from '@/lib/club'
import { PROFESORES_EXTENDIDO } from '@/lib/profesores-extendido'
import { obtenerNoticias, noticiasDeProfesor } from '@/lib/noticias'

export const revalidate = 60

export function generateStaticParams() {
  return CUERPO_TECNICO.map((p) => ({ id: p.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const p = CUERPO_TECNICO.find((x) => x.id === id)
  if (!p) return {}
  return {
    title: `${p.nombre} | Internacional Lo Espejo`,
    description: p.resumen,
  }
}

export default async function ProfesorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const p = CUERPO_TECNICO.find((x) => x.id === id)
  if (!p) notFound()

  const extendido = PROFESORES_EXTENDIDO[p.id]
  const noticias = noticiasDeProfesor(await obtenerNoticias(), p.id)

  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero */}
        <header className="relative overflow-hidden bg-[#0a0a0a] pb-14 pt-32 md:pb-20 md:pt-40">
          <EscudoFondo
            variante="blanco"
            opacidad={0.06}
            className="pointer-events-none absolute -right-20 top-1/2 w-[min(80vw,520px)] -translate-y-1/2 select-none"
          />
          <div className="relative z-10 mx-auto max-w-5xl px-4 md:px-6">
            <Link
              href="/profesores"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Todo el cuerpo técnico
            </Link>

            <div className="mt-8 grid gap-8 md:grid-cols-[240px_1fr] md:items-center md:gap-12">
              {p.foto && (
                <div className="w-40 shrink-0 overflow-hidden rounded-2xl shadow-2xl md:w-full">
                  <Image
                    src={p.foto}
                    alt={`${p.nombre}, ${p.cargo}`}
                    width={480}
                    height={600}
                    className="h-full w-full object-cover"
                    priority
                  />
                </div>
              )}
              <div>
                <h1 className="font-heading text-3xl font-bold uppercase leading-[1.02] tracking-tight text-white text-balance md:text-5xl">
                  {p.nombre}
                </h1>
                <p className="mt-3 text-lg font-medium text-primary">{p.cargo}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.origen && (
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                      {p.origen}
                    </span>
                  )}
                  {p.series.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 text-pretty">
                  {p.bio}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Relato completo */}
        {extendido && extendido.secciones.length > 0 && (
          <section className="bg-background py-16 md:py-24">
            <div className="mx-auto max-w-3xl px-4 md:px-6">
              <div className="flex flex-col gap-12">
                {extendido.secciones.map((s, i) => (
                  <div key={i}>
                    {s.titulo && (
                      <h2 className="font-heading text-xl font-bold uppercase tracking-tight text-foreground md:text-2xl">
                        {s.titulo}
                      </h2>
                    )}
                    <div className="mt-3 flex flex-col gap-4">
                      {s.parrafos.map((par, j) => (
                        <p key={j} className="leading-relaxed text-muted-foreground text-pretty">
                          {par}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <NoticiasFeed
          titulo={`Noticias de ${p.nombre}`}
          noticias={noticias}
          vacio="Todavía no hay noticias publicadas sobre este profesor."
        />

        {/* Clínicas y publicaciones — espacio propio del profesor */}
        <section className="bg-secondary py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-4 md:px-6">
            <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
              Clínicas y publicaciones
            </h2>

            {extendido && extendido.clinicas.length > 0 ? (
              <ul className="mt-8 flex flex-col gap-4">
                {extendido.clinicas.map((c, i) => (
                  <li
                    key={i}
                    className="rounded-xl border border-border bg-background p-5"
                  >
                    <div className="flex items-start gap-3">
                      <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <div>
                        <p className="font-heading text-lg font-semibold uppercase tracking-tight text-foreground">
                          {c.titulo}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {c.descripcion}
                        </p>
                        {c.enlace && (
                          <a
                            href={c.enlace}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block text-sm font-semibold text-primary underline underline-offset-2"
                          >
                            Ver más
                          </a>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-8 rounded-xl border border-dashed border-border bg-background p-8 text-center">
                <p className="leading-relaxed text-muted-foreground text-pretty">
                  Este es el espacio de {p.nombre.split(' ')[0]} para publicar sus clínicas,
                  charlas o trabajos con jugadoras y jugadores. Todavía no hay nada cargado —
                  cuéntanos qué quieres mostrar acá y lo sumamos.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Videos */}
        <section className="bg-background py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-4 md:px-6">
            <h2 className="flex items-center gap-2 font-heading text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
              <VideoIcon className="h-6 w-6 text-primary" />
              Videos
            </h2>

            {extendido && extendido.videos.length > 0 ? (
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {extendido.videos.map((v, i) => (
                  <li key={i}>
                    <a
                      href={v.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary"
                    >
                      <PlayCircle className="h-8 w-8 shrink-0 text-primary" />
                      <span className="font-medium text-foreground">{v.titulo}</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-8 rounded-xl border border-dashed border-border bg-secondary p-8 text-center">
                <p className="leading-relaxed text-muted-foreground text-pretty">
                  Todavía no hay videos publicados de {p.nombre.split(' ')[0]}. Cuando tengas
                  clínicas o partidos grabados que quieras mostrar, los subimos acá.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="border-t border-border bg-secondary py-14 text-center">
          <p className="text-sm text-muted-foreground">
            ¿Eres {p.nombre.split(' ')[0]} o parte de la directiva y quieres actualizar esta
            página?
          </p>
          <ContactoCTA
            asunto={`Actualizar la página de ${p.nombre}`}
            mensaje={`Hola, quiero actualizar la página de ${p.nombre} con nuevas clínicas, publicaciones o videos.`}
            className="mt-4 inline-flex items-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-semibold uppercase tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Escríbenos
          </ContactoCTA>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
