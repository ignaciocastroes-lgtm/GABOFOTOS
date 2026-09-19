import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { Support } from '@/components/site/support'
import { Presupuesto } from '@/components/site/presupuesto'
import { CamisetaMundialito } from '@/components/site/camiseta-mundialito'

export const metadata: Metadata = {
  title: 'Apoya el viaje de la Sub 13 a San Juan',
  description:
    'Nuestra Sub 13 femenina viaja al Mundialito Bancaria de San Juan en diciembre de 2026. Aporta con stickers, una donación o auspiciando al club.',
}

export default function Apoyanos() {
  return (
    <>
      <SiteHeader />
      <main className="pt-16 md:pt-20">
        <Support />
        <CamisetaMundialito />
        <Presupuesto />
        {/* El Cantoni: la cancha donde juegan las niñas ya tiene historia para el club */}
        <section className="bg-secondary py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-4 md:px-6">
            <h2 className="font-heading text-2xl font-bold uppercase leading-tight tracking-tight text-foreground text-balance md:text-4xl">
              Ya conocemos esa cancha
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground text-pretty">
              El 13 de octubre de 1989, en el Estadio Aldo Cantoni de San Juan, Chile venció 3-2 a
              Argentina en un partido que del otro lado de la cordillera todavía se recuerda. Bajo
              los tres palos estaba Antonio Espinoza.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Es la misma cancha donde nuestra Sub 13 juega este diciembre, y Espinoza es hoy el
              preparador de arqueros del club. Las niñas van a jugar en el estadio donde su profesor
              hizo historia.
            </p>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  )
}
