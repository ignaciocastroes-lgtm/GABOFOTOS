import { IntroSplash } from "@/components/intro-splash"
import { SiteNavbar } from "@/components/site-navbar"
import { cargarImagenesPlanes } from "@/lib/planes-data"
import { FeaturedStrip } from "@/components/featured-strip"
import { CategoryGrid } from "@/components/category-grid"
import { VideoSection } from "@/components/video-section"
import { ContactForm } from "@/components/contact-form"
import { SiteFooter } from "@/components/site-footer"

// Las fotos que Gabo sube desde /admin aparecen aquí como máximo en un minuto.
export const revalidate = 60

export default async function Home() {
  // Imágenes de «Presupuestos y contacto»: las que Gabo cambió desde /admin o, si no cambió, las originales.
  const planImagenes = await cargarImagenesPlanes()

  return (
    <main className="relative min-h-dvh bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100">
      <IntroSplash />

      <SiteNavbar planImagenes={planImagenes} />

      <section className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 pb-16 pt-28 sm:pt-32">
        <p className="text-sm tracking-[0.3em] text-slate-500 dark:text-zinc-400">FOTOGRAFÍA · BLANCO Y NEGRO</p>
        <h1 className="max-w-4xl text-balance text-5xl font-thin leading-[1.1] tracking-tight text-slate-900 transition-colors duration-300 dark:text-zinc-50 sm:text-7xl">
          Momentos capturados con luz, sombra y silencio.
        </h1>
        <p className="max-w-xl text-pretty leading-relaxed text-slate-600 dark:text-zinc-400">
          Bienvenido a GABOFOTOS. Explora las categorías del estudio y encuentra
          el servicio perfecto para tu historia.
        </p>
        <a
          href="#contacto"
          className="rounded-full bg-yellow-400 px-6 py-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-yellow-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-zinc-950"
        >
          Cotiza tu evento
        </a>
      </section>

      <FeaturedStrip />

      <CategoryGrid />

      <VideoSection />

      <ContactForm />

      <SiteFooter />
    </main>
  )
}
