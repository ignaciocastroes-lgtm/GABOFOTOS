import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Users2, FileCheck } from 'lucide-react'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { PageHeader } from '@/components/site/page-header'
import { ContactoCTA } from '@/components/site/contacto-cta'
import { FEDERACION, CLUB } from '@/lib/club'

export const metadata: Metadata = {
  title: 'Pases entre clubes',
  description:
    'Jugadoras y jugadores federados de otro club que quieran sumarse al Internacional Lo Espejo: así funciona el pase.',
}

const PASOS = [
  {
    icon: Users2,
    titulo: 'Nos escribes',
    texto:
      'Cuéntanos tu categoría, tu club actual y qué serie te interesa. No hace falta nada más para partir la conversación.',
  },
  {
    icon: FileCheck,
    titulo: 'Revisamos tu situación',
    texto:
      'El pase entre clubes lo tramita la federación, según su reglamento vigente. Te decimos exactamente qué necesitas y te acompañamos en el trámite.',
  },
  {
    icon: ShieldCheck,
    titulo: 'Te sumas al Inter',
    texto:
      'Una vez resuelto el pase, entrenas con tu nueva serie y quedas habilitado para competir con la camiseta del club.',
  },
]

export default function Pases() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHeader
          titulo="Pases entre clubes"
          bajada="¿Ya juegas hockey patín federado en otro club y quieres ser parte del Inter? Así funciona."
        />

        <section className="bg-background py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-4 md:px-6">
            <p className="text-lg leading-relaxed text-muted-foreground text-pretty">
              Somos socio fundador de la {FEDERACION.liga} y competimos bajo el reglamento de la{' '}
              {FEDERACION.nacional}. Si ya estás federado en otro club de Chile —de cualquier
              región— y quieres jugar por el Inter, el camino se llama pase entre clubes.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
              El trámite lo define la federación, no nosotros: nosotros te acompañamos para que no
              tengas que resolverlo solo. Escríbenos y partimos por ahí.
            </p>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {PASOS.map((p, i) => (
                <div key={p.titulo} className="rounded-2xl border border-border bg-card p-6">
                  <span className="font-heading text-4xl font-bold leading-none text-primary/20">
                    {i + 1}
                  </span>
                  <p.icon className="mt-3 h-5 w-5 text-primary" />
                  <h3 className="mt-3 font-heading text-lg font-bold uppercase tracking-tight text-foreground">
                    {p.titulo}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.texto}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 rounded-2xl border border-border bg-card p-7 md:p-8">
              <h2 className="font-heading text-xl font-bold uppercase tracking-tight text-foreground">
                ¿Quién paga el pase?
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground text-pretty">
                En Chile existe la figura de los derechos formativos: cuando un club ficha a un
                jugador joven que se formó en otra institución, reconoce con una compensación
                económica el trabajo de ese club formador. Esa obligación es del club que recibe
                al jugador —en este caso, del Inter—, nunca de la familia ni del propio
                deportista. Se rige por la normativa de la federación y la liga correspondiente, y
                nosotros nos hacemos cargo de resolverlo.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-primary/5 border border-primary/30 p-7 md:p-8">
              <h2 className="font-heading text-xl font-bold uppercase tracking-tight text-foreground">
                ¿Tu club no tiene serie para ti el próximo año?
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground text-pretty">
                Pasa seguido: un club chico no siempre arma equipo en todas las categorías todas
                las temporadas. Si te quedas sin dónde jugar por eso, no es el fin de tu carrera —
                escríbenos. Bienvenido o bienvenida a nuestro proyecto.
              </p>
            </div>

            <div className="mt-12 rounded-2xl bg-secondary p-7 md:p-8">
              <h2 className="font-heading text-xl font-bold uppercase tracking-tight text-foreground">
                ¿Nunca has jugado hockey patín?
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground text-pretty">
                Esto es para quien ya está federado en otro club. Si nunca te has puesto un patín,
                el camino de entrada es la escuelita, gratuita y abierta a cualquiera.
              </p>
              <Link
                href="/escuela"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary underline underline-offset-4"
              >
                Conoce la escuelita
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-12 text-center">
              <ContactoCTA
                asunto="Quiero un pase al Internacional Lo Espejo"
                mensaje={`Hola, juego hockey patín federado y quiero conversar sobre un pase al ${CLUB.nombreCorto}.\n\nClub actual:\nCategoría:\nSerie de interés:`}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-8 py-4 text-base font-bold uppercase tracking-wide text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Quiero conversar mi pase
              </ContactoCTA>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
