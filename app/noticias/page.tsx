import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { PageHeader } from '@/components/site/page-header'
import { NoticiasIndexClient } from '@/components/site/noticias-index-client'
import { obtenerNoticias } from '@/lib/noticias'

export const metadata: Metadata = {
  title: 'Noticias',
  description:
    'Resultados de partidos, novedades del club y de la escuelita del Internacional Lo Espejo.',
}

export const revalidate = 60

export default async function NoticiasPage() {
  const noticias = await obtenerNoticias()

  return (
    <>
      <SiteHeader />
      <main>
        <PageHeader
          titulo="Noticias"
          bajada="Resultados de partidos, novedades del club y de la escuelita."
        />
        <NoticiasIndexClient noticias={noticias} />
      </main>
      <SiteFooter />
    </>
  )
}
