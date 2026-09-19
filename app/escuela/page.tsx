import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { PageHeader } from '@/components/site/page-header'
import { EscuelitaMunicipal } from '@/components/site/escuelita-municipal'
import { NoticiasFeed } from '@/components/site/noticias-feed'
import { obtenerNoticias, noticiasDeEscuelita } from '@/lib/noticias'
import { Profesores } from '@/components/site/profesores'
import { Valores } from '@/components/site/valores'
import { Vias } from '@/components/site/vias'
import { Agradecimientos } from '@/components/site/agradecimientos'
import { Contact } from '@/components/site/contact'

export const metadata: Metadata = {
  title: 'Escuela de hockey patín gratuita en Lo Espejo',
  description:
    'Taller municipal gratuito de hockey patín en Lo Espejo, lunes y viernes de 16:30 a 18:30 en el Gimnasio Municipal. Lo imparten Rodrigo Quintanilla, campeón del mundo con Las Marcianitas, y Rodolfo Oyola.',
}

export const revalidate = 60

export default async function Escuela() {
  const todasLasNoticias = await obtenerNoticias()
  const noticias = noticiasDeEscuelita(todasLasNoticias)

  return (
    <>
      <SiteHeader />
      <main>
        <PageHeader
          titulo="Escuela de hockey patín gratuita"
          bajada="Escuelita de Hockey Patín Municipal para niños, niñas y adolescentes. Taller gratuito de la Ilustre Municipalidad de Lo Espejo, impartido por los profesores Rodrigo Quintanilla y Rodolfo Oyola. Lunes y viernes de 16:30 a 18:30 en el Gimnasio Municipal."
        />

        <div className="border-b border-border bg-secondary py-4 text-center">
          <p className="text-sm text-muted-foreground">
            ¿No conoces el deporte todavía?{' '}
            <Link href="/hockey-patin" className="font-semibold text-primary underline underline-offset-4">
              Te lo explicamos acá
            </Link>
          </p>
        </div>

        <EscuelitaMunicipal />
        <NoticiasFeed
          titulo="Noticias de la escuelita"
          noticias={noticias}
          vacio="Todavía no hay noticias publicadas de la escuelita."
        />
        <Vias />
        <Valores />

        {/* Teaser a /series: cuando cumplan la edad, este es el paso siguiente */}
        <section className="border-y border-border bg-secondary py-14">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center md:px-6">
            <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
              ¿Y cuando ya sepa patinar?
            </h2>
            <p className="max-w-xl leading-relaxed text-muted-foreground text-pretty">
              Cuando tu hijo o hija alcance la edad que corresponde, pasa de la escuelita a una
              serie federada. Mira cómo funciona ese paso y qué serie le tocaría.
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

        <Profesores titulo="Quiénes van a entrenar a tu hijo o hija" />
        <Agradecimientos />
        <Contact />
      </main>
      <SiteFooter />
    </>
  )
}
