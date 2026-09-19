import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Calendar, Clock, AlertTriangle, ImageIcon } from 'lucide-react'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { EscudoFondo } from '@/components/site/escudo-fondo'
import { ContactoCTA } from '@/components/site/contacto-cta'
import { NoticiasFeed } from '@/components/site/noticias-feed'
import { SERIES, CUERPO_TECNICO } from '@/lib/club'
import { obtenerNoticias, noticiasDeSerie } from '@/lib/noticias'
import {
  SERIES_DETALLE,
  HORARIOS_BLOQUE,
  NOMBRE_BLOQUE,
  ENTRENAMIENTO_ARQUEROS,
  GALERIA_SERIE,
  detalleDe,
} from '@/lib/series-detalle'

export const revalidate = 60

export function generateStaticParams() {
  return SERIES.filter((s) => s.id !== 'escuelita').map((s) => ({ id: s.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const s = SERIES.find((x) => x.id === id)
  if (!s) return {}
  return {
    title: `${s.nombre} ${s.detalle} | Internacional Lo Espejo`,
    description: `Horarios de entrenamiento, cuerpo técnico y todo lo que necesitas saber sobre la serie ${s.nombre} ${s.detalle} del Internacional Lo Espejo.`,
  }
}

export default async function SeriePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const serie = SERIES.find((x) => x.id === id)
  if (!serie || serie.id === 'escuelita') notFound()

  const detalle = detalleDe(serie.id)
  const profesores = detalle
    ? detalle.profesores
        .map((pid) => CUERPO_TECNICO.find((p) => p.id === pid))
        .filter(Boolean)
    : []
  const horarios = detalle ? HORARIOS_BLOQUE[detalle.bloque] : []
  const galeria = GALERIA_SERIE[serie.id] ?? []
  const noticias = noticiasDeSerie(await obtenerNoticias(), serie.id)

  return (
    <>
      <SiteHeader />
      <main>
        <header className="relative overflow-hidden bg-[#0a0a0a] pb-14 pt-32 md:pb-20 md:pt-40">
          <EscudoFondo
            variante="blanco"
            opacidad={0.06}
            className="pointer-events-none absolute -right-20 top-1/2 w-[min(80vw,520px)] -translate-y-1/2 select-none"
          />
          <div className="relative z-10 mx-auto max-w-4xl px-4 md:px-6">
            <Link
              href="/el-club"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Todas las series
            </Link>
            <h1 className="mt-6 font-heading text-4xl font-bold uppercase leading-[1.02] tracking-tight text-white text-balance md:text-6xl">
              {serie.nombre}
            </h1>
            <p className="mt-3 text-lg font-medium text-primary">{serie.detalle}</p>
          </div>
        </header>

        {/* Años de referencia */}
        <section className="border-b border-border bg-secondary py-10">
          <div className="mx-auto max-w-4xl px-4 md:px-6">
            <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-5">
              <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="font-heading text-lg font-bold uppercase tracking-tight text-foreground">
                  {detalle?.notaEdad
                    ? detalle.notaEdad
                    : detalle?.nacidosDesde && detalle?.nacidosHasta
                      ? `Nacidos entre ${detalle.nacidosDesde} y ${detalle.nacidosHasta}`
                      : 'Consulta el año que corresponde'}
                </p>
                <p className="mt-2 leading-relaxed text-muted-foreground text-pretty">
                  Así funciona la regla en Chile: la serie agrupa a quienes cumplen los dos años
                  anteriores al número de la serie durante la temporada — nunca a quien cumple
                  justo ese número, porque ese año pasa a la siguiente serie. Por ejemplo, quien
                  cumple 11 este año juega en Sub 13, no en Sub 11.
                </p>
                <p className="mt-2 leading-relaxed text-muted-foreground text-pretty">
                  Además de su serie natural, un jugador puede jugar también en las dos series
                  inmediatamente superiores — nunca hacia abajo, nunca más de tres a la vez.
                </p>
                <p className="mt-2 flex items-start gap-1.5 text-sm leading-relaxed text-muted-foreground">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  Escríbenos para confirmar el año exacto de tu hijo o hija antes de inscribirte.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Horarios */}
        <section className="bg-background py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-4 md:px-6">
            <div className="flex items-center gap-2 text-primary">
              <Clock className="h-5 w-5" />
              <p className="text-xs font-semibold uppercase tracking-widest">
                Bloque {detalle ? NOMBRE_BLOQUE[detalle.bloque] : ''}
              </p>
            </div>
            <h2 className="mt-2 font-heading text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
              Horarios de entrenamiento
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground text-pretty">
              Esto es el entrenamiento competitivo del club, distinto de la escuelita municipal
              (lunes y viernes, 16:30 a 18:30). Se entrena en el Gimnasio Municipal Lo Espejo.
            </p>

            <ul className="mt-8 grid gap-4 sm:grid-cols-3">
              {horarios.map((h) => (
                <li
                  key={h.dia}
                  className="rounded-xl border border-border bg-card p-5 text-center"
                >
                  <p className="font-heading text-sm font-bold uppercase tracking-widest text-primary">
                    {h.dia}
                  </p>
                  <p className="mt-2 font-heading text-2xl font-bold text-foreground">
                    {h.desde} – {h.hasta}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              Pueden haber cambios. Confirma el horario vigente con el club.
            </p>

            <div className="mt-8 rounded-xl border border-dashed border-border bg-secondary p-5">
              <p className="text-sm leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">Arqueras y arqueros</span> tienen
                además entrenamiento propio con Toño Espinoza, los lunes:{' '}
                {ENTRENAMIENTO_ARQUEROS.map((b, i) => (
                  <span key={i}>
                    {i > 0 && ' y '}
                    {b.desde} a {b.hasta}
                  </span>
                ))}
                .
              </p>
            </div>
          </div>
        </section>

        {/* Profesores */}
        {profesores.length > 0 && (
          <section className="bg-secondary py-16 md:py-24">
            <div className="mx-auto max-w-4xl px-4 md:px-6">
              <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
                Quiénes entrenan esta serie
              </h2>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {profesores.map((p) => (
                  <Link
                    key={p!.id}
                    href={`/profesores/${p!.id}`}
                    className="group flex items-center gap-4 rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary"
                  >
                    {p!.foto ? (
                      <Image
                        src={p!.foto}
                        alt={p!.nombre}
                        width={72}
                        height={90}
                        className="h-[72px] w-[58px] shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-[72px] w-[58px] shrink-0 items-center justify-center rounded-lg bg-[#0a0a0a] text-white/40">
                        {p!.nombre[0]}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-heading text-sm font-bold uppercase leading-tight tracking-tight text-foreground group-hover:text-primary">
                        {p!.nombre}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{p!.cargo}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <NoticiasFeed
          titulo={`Noticias de ${serie.nombre} ${serie.detalle}`}
          noticias={noticias}
          vacio="Todavía no hay resultados ni noticias publicadas de esta serie."
        />

        {/* Galería */}
        <section className="bg-background py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-4 md:px-6">
            <h2 className="flex items-center gap-2 font-heading text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
              <ImageIcon className="h-6 w-6 text-primary" />
              Galería de {serie.nombre} {serie.detalle}
            </h2>

            {galeria.length > 0 ? (
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {galeria.map((g, i) => (
                  <div key={i} className="overflow-hidden rounded-lg">
                    <Image
                      src={g.src}
                      alt={g.alt}
                      width={400}
                      height={400}
                      className="aspect-square w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-xl border border-dashed border-border bg-secondary p-8 text-center">
                <p className="leading-relaxed text-muted-foreground text-pretty">
                  Todavía no hay fotos propias de esta serie. Si tienes fotos de partidos o
                  entrenamientos que quieras mostrar acá, mándanoslas.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-[#0a0a0a] py-16 text-white md:py-24">
          <EscudoFondo variante="blanco" opacidad={0.06} />
          <div className="relative z-10 mx-auto max-w-2xl px-4 text-center md:px-6">
            <h2 className="font-heading text-2xl font-bold uppercase leading-tight tracking-tight text-balance md:text-4xl">
              ¿Quieres sumarte a {serie.nombre} {serie.detalle}?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/85 text-pretty">
              Si nunca has jugado hockey patín, el camino de entrada es la escuelita. Si ya juegas
              federado en otro club, revisa cómo funciona el pase.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/escuela"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-8 py-4 text-base font-bold uppercase tracking-wide text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Conoce la escuelita
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/pases"
                className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/5 px-8 py-4 text-base font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/15"
              >
                Ya juego en otro club
              </Link>
            </div>
            <div className="mt-6">
              <ContactoCTA
                asunto={`Consulta sobre ${serie.nombre} ${serie.detalle}`}
                mensaje={`Hola, tengo una consulta sobre la serie ${serie.nombre} ${serie.detalle} del Internacional Lo Espejo.`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 underline underline-offset-4 hover:text-white"
              >
                O escríbenos directamente
              </ContactoCTA>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
