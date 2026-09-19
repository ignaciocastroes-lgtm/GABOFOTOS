import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Check } from 'lucide-react'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { PageHeader } from '@/components/site/page-header'
import { CamisetaInteractiva } from '@/components/site/camiseta-interactiva'
import { ApoyoLienzos } from '@/components/site/apoyo-lienzos'
import { ContactoCTA } from '@/components/site/contacto-cta'
import {
  PAQUETES,
  CAMISETA,
  CAMISETAS_POR_TEMPORADA,
  SERIES_AUSPICIABLES,
  TOTAL_CAMISETA_COMPLETA,
  APOYO_CLUB,
  TOMA_EL_MARCADOR,
} from '@/lib/auspicios'
import { CLUB, formatCLP, FEDERACION } from '@/lib/club'
import { CIFRAS } from '@/lib/historia'

export const metadata: Metadata = {
  title: 'Auspiciadores | Internacional Lo Espejo',
  description:
    'Auspicia al Club Hockey Patín Internacional Lo Espejo: club federado en la Liga Central, con ocho series en competencia. Camiseta, lienzo o colaboración.',
}

export default function Auspiciadores() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHeader
          titulo="Pon tu marca en el club"
          bajada={`Somos el único club de hockey patín de Lo Espejo. Más de 50 deportistas, ocho series en competencia y un campeón del mundo en el cuerpo técnico. Competimos federados, en la ${FEDERACION.liga}, bajo la ${FEDERACION.nacional}.`}
        />

        <section className="border-b border-border bg-background py-12">
          <div className="mx-auto grid max-w-5xl grid-cols-3 gap-8 px-4 md:px-6">
            {CIFRAS.map((c) => (
              <div key={c.etiqueta}>
                <p className="font-heading text-4xl font-bold text-primary">{c.valor}</p>
                <p className="mt-1 text-sm leading-snug text-muted-foreground">{c.etiqueta}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-background py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {PAQUETES.map((p) => (
                <article
                  key={p.id}
                  className={
                    p.destacado
                      ? 'flex flex-col rounded-2xl border-2 border-primary bg-card p-7 shadow-lg'
                      : 'flex flex-col rounded-2xl border border-border bg-card p-7'
                  }
                >
                  {p.destacado && (
                    <span className="mb-3 self-start rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                      El de mayor visibilidad
                    </span>
                  )}
                  <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-foreground">
                    {p.nombre}
                  </h2>
                  <p className="mt-3">
                    <span className="font-heading text-3xl font-bold text-primary">
                      {formatCLP(p.monto)}
                    </span>
                    <span className="ml-2 text-sm text-muted-foreground">{p.periodo}</span>
                  </p>
                  <ul className="mt-6 flex flex-1 flex-col gap-3">
                    {p.incluye.map((i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="leading-relaxed text-muted-foreground">{i}</span>
                      </li>
                    ))}
                  </ul>
                  <ContactoCTA
                    asunto={`Auspicio: paquete ${p.nombre}`}
                    mensaje={`Hola, me interesa el paquete de auspicio "${p.nombre}" (${formatCLP(p.monto)}) del Internacional Lo Espejo. ¿Podemos conversarlo?`}
                    className={
                      p.destacado
                        ? 'mt-7 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90'
                        : 'mt-7 inline-flex items-center justify-center gap-2 rounded-md border border-border px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary'
                    }
                  >
                    Conversemos
                  </ContactoCTA>
                </article>
              ))}
            </div>

            <p className="mt-8 text-sm text-muted-foreground">
              ¿Otro monto o alguna idea distinta? Los paquetes se pueden dividir entre varias
              empresas o adaptar. Escríbenos a{' '}
              <a href={`mailto:${CLUB.email}`} className="text-primary underline underline-offset-4">
                {CLUB.email}
              </a>
              .
            </p>
          </div>
        </section>

        {/* Camiseta interactiva del club, de local y de visita, para todas las series */}
        <section className="bg-secondary py-16 md:py-24">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <div className="mb-10 max-w-2xl">
              <h2 className="font-heading text-2xl font-bold uppercase leading-tight tracking-tight text-foreground text-balance md:text-4xl">
                Pon tu logo aquí
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground text-pretty">
                Cada posición significa algo distinto para el club y para quien la lleva. Toca una y
                mira qué implica. Esto es apoyo global al club: la camiseta de local y de visita para
                cualquiera de nuestras series federadas.
              </p>
            </div>

            <CamisetaInteractiva variante="temporada" />

            <div className="mt-12">
              <h3 className="font-heading text-xl font-bold uppercase tracking-tight text-foreground">
                Todas las posiciones
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Jugamos con camiseta de local y de visita en cada serie. La de local vale un 5% más
                porque es la que se usa en la mayoría de los partidos y la que aparece en las fotos
                oficiales.
              </p>

              <ul className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-background">
                {CAMISETA.map((c) => (
                  <li
                    key={c.id}
                    className="flex flex-wrap items-center justify-between gap-4 px-5 py-5"
                  >
                    <div className="min-w-40 flex-1">
                      <p className="font-heading text-lg font-semibold uppercase tracking-tight text-foreground">
                        {c.posicion}
                      </p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{c.nota}</p>
                    </div>

                    <div className="text-right text-sm">
                      <p>
                        <span className="text-muted-foreground">Local </span>
                        <span className="font-heading text-base font-bold text-foreground">
                          {formatCLP(c.titular)}
                        </span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Visita </span>
                        <span className="font-heading text-base font-bold text-foreground">
                          {formatCLP(c.alternativa)}
                        </span>
                      </p>
                      <p className="mt-1 font-heading text-lg font-bold text-primary">
                        {formatCLP(c.titular + c.alternativa)}
                        <span className="ml-1 text-xs font-normal text-muted-foreground">
                          las {CAMISETAS_POR_TEMPORADA}
                        </span>
                      </p>
                    </div>

                    <ContactoCTA
                      asunto={`Auspicio: ${c.posicion}`}
                      mensaje={`Hola, me interesa auspiciar al Internacional Lo Espejo en la posición "${c.posicion}". ¿Podemos conversarlo?`}
                    >
                      Consultar
                    </ContactoCTA>
                  </li>
                ))}
              </ul>
            </div>

            {/* La necesidad real detrás del auspicio de indumentaria */}
            <div className="mt-14 rounded-2xl bg-[#0a0a0a] p-8 text-white md:p-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                Apoyo global al club
              </p>
              <h3 className="mt-3 font-heading text-xl font-bold uppercase leading-tight tracking-tight text-balance md:text-3xl">
                {APOYO_CLUB.titulo}
              </h3>
              <p className="mt-4 max-w-2xl leading-relaxed text-white/85 text-pretty">
                {APOYO_CLUB.texto}
              </p>
              <p className="mt-4 max-w-2xl leading-relaxed text-white/70">
                Puedes auspiciar la camiseta completa de una serie —las cinco posiciones, de local y
                de visita— por{' '}
                <span className="font-heading font-bold text-white">
                  {formatCLP(TOTAL_CAMISETA_COMPLETA)}
                </span>
                , una sola posición como las de arriba, o varias series a la vez. Series disponibles:{' '}
                {SERIES_AUSPICIABLES.join(', ')}.
              </p>
              <ContactoCTA
                asunto="Quiero ser auspiciador del club"
                mensaje="Hola, quiero conversar sobre ser auspiciador del Internacional Lo Espejo. Nos interesa ser parte del club de forma sostenida."
                className="mt-7 inline-flex items-center gap-2 rounded-md bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Quiero ser parte del club
              </ContactoCTA>
            </div>
          </div>
        </section>

        <ApoyoLienzos />

        {/* Toma el marcador */}
        <section className="bg-background py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-4 md:px-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Un producto nuevo
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold uppercase leading-tight tracking-tight text-foreground text-balance md:text-4xl">
              {TOMA_EL_MARCADOR.titulo}
            </h2>
            <p className="mt-1 text-lg font-medium text-primary">{TOMA_EL_MARCADOR.bajada}</p>
            <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
              {TOMA_EL_MARCADOR.texto}
            </p>
            <ul className="mt-6 flex flex-col gap-2.5">
              {TOMA_EL_MARCADOR.incluye.map((i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="leading-relaxed text-muted-foreground">{i}</span>
                </li>
              ))}
            </ul>
            <ContactoCTA
              asunto="Quiero conversar sobre Toma el marcador"
              mensaje="Hola, vi Toma el marcador en la página de auspiciadores y quiero conversar sobre poner nuestra marca en el broadcast en vivo de los partidos."
              className="mt-7 inline-flex items-center gap-2 rounded-md border border-border px-8 py-4 text-sm font-bold uppercase tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Conversemos
            </ContactoCTA>
          </div>
        </section>

        {/* Gracias a quienes ya se sumaron */}
        <section className="bg-secondary py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-4 md:px-6">
            <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
              Gracias a quienes ya se sumaron
            </h2>
            <Link
              href="/noticias/nota-2026-09-bus-nunez"
              className="mt-6 flex items-center gap-4 rounded-xl border border-border bg-background p-5 transition-colors hover:border-primary"
            >
              <Image
                src="/images/noticias/bus-nunez-1.webp"
                alt="El profesor Quintanilla junto a Rodrigo Núñez de Buses Núñez"
                width={90}
                height={90}
                className="h-20 w-20 shrink-0 rounded-lg object-cover"
              />
              <div>
                <p className="font-heading text-lg font-bold uppercase tracking-tight text-foreground">
                  Buses Núñez
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Auspiciador del transporte de la delegación. Lee la historia completa →
                </p>
              </div>
            </Link>
          </div>
        </section>

        <section className="bg-secondary py-14">
          <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
            <p className="text-lg text-muted-foreground text-pretty">
              ¿Buscas apoyar puntualmente el viaje de la Sub 13 al Mundialito de San Juan? Eso vive
              en{' '}
              <Link href="/apoyanos" className="text-primary underline underline-offset-4">
                Apóyanos
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
