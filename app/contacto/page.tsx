import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { PageHeader } from '@/components/site/page-header'
import { Contact } from '@/components/site/contact'
import { CLUB } from '@/lib/club'

export const metadata: Metadata = {
  title: 'Contacto | Internacional Lo Espejo',
  description: `Cómo llegar al ${CLUB.sede.nombre} y cómo comunicarte con el club.`,
}

export default function Contacto() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHeader
          titulo="Contacto"
          bajada={`Entrenamos en el ${CLUB.sede.nombre}. Escríbenos y te respondemos.`}
        />
        <Contact />
      </main>
      <SiteFooter />
    </>
  )
}
