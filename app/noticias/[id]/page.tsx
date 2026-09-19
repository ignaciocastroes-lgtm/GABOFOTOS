import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, ShieldAlert } from 'lucide-react'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { EscudoFondo } from '@/components/site/escudo-fondo'
import { InstagramEmbed } from '@/components/site/instagram-embed'
import { ContactoCTA } from '@/components/site/contacto-cta'
import { obtenerNoticias, fusionarCronologia, type Noticia } from '@/lib/noticias'

/**
 * Sin generateStaticParams: los ids viven en Supabase y se pueden crear
 * desde /admin en cualquier momento, no solo en el momento del build. La
 * página se renderiza bajo demanda la primera vez que alguien la visita, y
 * después queda en caché por 60 segundos (revalidate más abajo) — no es
 * una consulta nueva a la base de datos en cada visita.
 */
export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const noticias = await obtenerNoticias()
  const n = noticias.find((x) => x.id === id)
  if (!n) return {}
  const titulo =
    n.tipo === 'partido'
      ? `${n.partido.local.nombre} ${n.partido.local.goles}-${n.partido.visita.goles} ${n.partido.visita.nombre}`
      : n.titulo
  return { title: titulo }
}

function fechaLarga(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function mmss(seg: number) {
  const m = Math.floor(seg / 60)
  const s = seg % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

/**
 * Color de cada tipo de tarjeta, con estilo inline en vez de clases de
 * Tailwind generadas dinámicamente. No es cosmético: `COLOR_TARJETA[t.tipo]`
 * con una clase como `bg-blue-500` depende de que `t.tipo` calce exacto con
 * la clave, y si ARDI entrega el valor con otra capitalización la búsqueda
 * falla en silencio — sin color, sin error visible. El estilo inline con hex
 * no depende de eso, y el fallback gris dice "no reconocido" en vez de nada.
 */
const COLOR_TARJETA: Record<string, string> = {
  blue: '#3b82f6',
  yellow: '#facc15',
  red: '#dc2626',
}
const COLOR_TARJETA_FALLBACK = '#9ca3af'

function colorDeTarjeta(tipo: string) {
  return COLOR_TARJETA[tipo.toLowerCase().trim()] ?? COLOR_TARJETA_FALLBACK
}

function DetallePartido({ n }: { n: Noticia & { tipo: 'partido' } }) {
  const { partido: p } = n
  return (
    <>
      <header className="relative overflow-hidden bg-[#0a0a0a] pb-14 pt-32 md:pb-20 md:pt-40">
        <EscudoFondo variante="blanco" opacidad={0.06} />
        <div className="relative z-10 mx-auto max-w-3xl px-4 md:px-6">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Todas las noticias
          </Link>

          <p className="mt-8 text-center text-xs font-semibold uppercase tracking-widest text-primary">
            {p.serie} · {p.campeonato}
          </p>

          <div className="mt-6 flex items-center justify-center gap-6 sm:gap-12">
            <div className="flex flex-1 flex-col items-center gap-2 text-center">
              {p.local.escudo ? (
                <Image
                  src={p.local.escudo}
                  alt={p.local.nombre}
                  width={72}
                  height={72}
                  className="h-16 w-16 object-contain sm:h-20 sm:w-20"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-lg font-bold text-white sm:h-20 sm:w-20">
                  {p.local.nombre
                    .split(' ')
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join('')}
                </div>
              )}
              <span className="text-sm font-medium text-white">{p.local.nombre}</span>
            </div>
            <div className="font-heading text-5xl font-bold text-white sm:text-6xl">
              {p.local.goles}–{p.visita.goles}
            </div>
            <div className="flex flex-1 flex-col items-center gap-2 text-center">
              {p.visita.escudo ? (
                <Image
                  src={p.visita.escudo}
                  alt={p.visita.nombre}
                  width={72}
                  height={72}
                  className="h-16 w-16 object-contain sm:h-20 sm:w-20"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-lg font-bold text-white sm:h-20 sm:w-20">
                  {p.visita.nombre
                    .split(' ')
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join('')}
                </div>
              )}
              <span className="text-sm font-medium text-white">{p.visita.nombre}</span>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-white/60">
            {fechaLarga(p.fecha)} · {p.hora} · {p.estadio}
          </p>
        </div>
      </header>

      <section className="border-b border-border bg-secondary py-8">
        <div className="mx-auto flex max-w-3xl justify-center gap-6 px-4 md:px-6">
          {p.parciales.map((par) => (
            <div key={par.periodo} className="text-center">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {par.periodo}
              </p>
              <p className="font-heading text-xl font-bold text-foreground">
                {par.local}-{par.visita}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto grid max-w-3xl gap-8 px-4 sm:grid-cols-2 md:px-6">
          {[p.local, p.visita].map((eq, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-heading text-lg font-bold uppercase tracking-tight text-foreground">
                {eq.nombre}
              </h3>

              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 shrink-0" />
                Posesión {eq.posesionPct}% ({mmss(eq.posesionSeg)})
              </div>

              {eq.goleadores.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Goleadoras
                  </p>
                  <ul className="mt-1.5 flex flex-col gap-1 text-sm text-foreground">
                    {eq.goleadores.map((g, gi) => (
                      <li key={gi}>
                        #{g.dorsal} · {g.minuto}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {eq.tarjetas.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Tarjetas
                  </p>
                  <ul className="mt-1.5 flex flex-col gap-1.5 text-sm text-foreground">
                    {eq.tarjetas.map((t, ti) => (
                      <li key={ti} className="flex items-center gap-2">
                        <span
                          className="h-3 w-2.5 shrink-0 rounded-sm"
                          style={{ backgroundColor: colorDeTarjeta(t.tipo) }}
                        />
                        #{t.dorsal} {t.banca && '(banca)'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="mt-4 text-xs text-muted-foreground">{eq.faltas} faltas</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
            Cómo se jugó
          </h2>
          <ol className="mt-8 border-l-2 border-border">
            {fusionarCronologia(p.cronologia).map((e, i) => (
              <li key={i} className="relative pb-6 pl-6 last:pb-0">
                <span
                  className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full ${
                    e.anulado ? 'bg-muted-foreground' : 'bg-primary'
                  }`}
                />
                <p
                  className={
                    e.anulado
                      ? 'text-sm text-muted-foreground line-through'
                      : 'text-sm text-foreground'
                  }
                >
                  <span className="font-semibold">{e.minuto}</span> — {e.texto}
                  {e.equipo && (
                    <span className="ml-1 text-muted-foreground">
                      ({e.equipo === 'local' ? p.local.nombre : p.visita.nombre})
                    </span>
                  )}
                </p>
                {e.notaAnulacion && (
                  <p className="mt-0.5 text-xs italic text-muted-foreground no-underline">
                    {e.notaAnulacion}
                  </p>
                )}
              </li>
            ))}
          </ol>
          <p className="mt-6 flex items-start gap-1.5 text-xs text-muted-foreground">
            <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Los goles anulados aparecen tachados y ya están descontados del marcador.
          </p>
        </div>
      </section>
    </>
  )
}

function DetalleNota({ n }: { n: Noticia & { tipo: 'nota' } }) {
  return (
    <>
      <header className="relative overflow-hidden bg-[#0a0a0a] pb-14 pt-32 md:pb-20 md:pt-40">
        <EscudoFondo variante="blanco" opacidad={0.06} />
        <div className="relative z-10 mx-auto max-w-3xl px-4 md:px-6">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Todas las noticias
          </Link>
          <p className="mt-8 text-sm text-white/60">{fechaLarga(n.fecha)}</p>
          <h1 className="mt-2 font-heading text-3xl font-bold uppercase leading-[1.05] tracking-tight text-white text-balance md:text-5xl">
            {n.titulo}
          </h1>
        </div>
      </header>

      <article className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          {n.fotos[0] && (
            <div className="mb-10 overflow-hidden rounded-2xl shadow-xl">
              <Image
                src={n.fotos[0].src}
                alt={n.fotos[0].alt}
                width={1200}
                height={800}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          )}

          <div className="flex flex-col gap-5">
            {n.cuerpo.map((par, i) => (
              <p key={i} className="leading-relaxed text-muted-foreground text-pretty">
                {par}
              </p>
            ))}
          </div>

          {n.fotos.length > 1 && (
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {n.fotos.slice(1).map((f, i) => (
                <div key={i} className="overflow-hidden rounded-lg">
                  <Image
                    src={f.src}
                    alt={f.alt}
                    width={400}
                    height={400}
                    className="aspect-square w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {n.masFotosUrl && (
            <a
              href={n.masFotosUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block text-sm font-semibold text-primary underline underline-offset-4"
            >
              Ver más fotos en Instagram
            </a>
          )}

          {(n.enlaceExterno || n.contactoInvitacion) && (
            <div className="mt-10 flex flex-wrap gap-4 border-t border-border pt-8">
              {n.enlaceExterno && (
                <a
                  href={n.enlaceExterno.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-semibold uppercase tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {n.enlaceExterno.label}
                </a>
              )}
              {n.contactoInvitacion && (
                <ContactoCTA
                  asunto="Coordinar invitación"
                  mensaje={n.contactoInvitacion.mensaje}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Coordinar invitación
                </ContactoCTA>
              )}
            </div>
          )}
        </div>
      </article>
    </>
  )
}

function DetalleVideo({ n }: { n: Noticia & { tipo: 'video' } }) {
  return (
    <>
      <header className="relative overflow-hidden bg-[#0a0a0a] pb-8 pt-32 md:pt-40">
        <div className="relative z-10 mx-auto max-w-3xl px-4 md:px-6">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Todas las noticias
          </Link>
          <h1 className="mt-6 font-heading text-2xl font-bold uppercase leading-tight tracking-tight text-white text-balance md:text-4xl">
            {n.titulo}
          </h1>
        </div>
      </header>
      <section className="bg-background py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-xl">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${n.youtubeId}`}
              title={n.titulo}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="mt-6 leading-relaxed text-muted-foreground">{n.resumen}</p>
        </div>
      </section>
    </>
  )
}

function DetalleInstagram({ n }: { n: Noticia & { tipo: 'instagram' } }) {
  return (
    <>
      <header className="relative overflow-hidden bg-[#0a0a0a] pb-8 pt-32 md:pt-40">
        <div className="relative z-10 mx-auto max-w-3xl px-4 md:px-6">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Todas las noticias
          </Link>
          <h1 className="mt-6 font-heading text-2xl font-bold uppercase leading-tight tracking-tight text-white text-balance md:text-4xl">
            {n.titulo}
          </h1>
          <p className="mt-3 text-white/70">{n.resumen}</p>
        </div>
      </header>
      <section className="bg-secondary py-12 md:py-16">
        <div className="mx-auto max-w-xl px-4 md:px-6">
          <InstagramEmbed url={n.url} />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            ¿No carga?{' '}
            <a
              href={n.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline underline-offset-4"
            >
              Ábrela directo en Instagram
            </a>
          </p>
        </div>
      </section>
    </>
  )
}

export default async function NoticiaDetalle({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const noticias = await obtenerNoticias()
  const n = noticias.find((x) => x.id === id)
  if (!n) notFound()

  return (
    <>
      <SiteHeader />
      <main>
        {n.tipo === 'partido' && <DetallePartido n={n} />}
        {n.tipo === 'nota' && <DetalleNota n={n} />}
        {n.tipo === 'video' && <DetalleVideo n={n} />}
        {n.tipo === 'instagram' && <DetalleInstagram n={n} />}
      </main>
      <SiteFooter />
    </>
  )
}
