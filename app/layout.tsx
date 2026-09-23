import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { BnToque } from '@/components/bn-toque'
import { ThemeProvider } from '@/components/theme-provider'
import { siteConfig } from '@/lib/site-config'
import './globals.css'

const description =
  'Fotografía profesional de matrimonios, colegios, cumpleaños y deporte en Santiago, Chile. Cotiza por WhatsApp.'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: 'GABOFOTOS · Fotógrafo profesional en Santiago',
  description,
  alternates: { canonical: siteConfig.url },
  openGraph: {
    title: 'GABOFOTOS · Fotógrafo profesional en Santiago',
    description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: 'es_CL',
    type: 'website',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'GABOFOTOS' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GABOFOTOS · Fotógrafo profesional en Santiago',
    description,
    images: ['/og.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
}

// Datos estructurados para buscadores: negocio, contacto, servicios y redes oficiales.
// https://schema.org/ProfessionalService — lo que Google usa para el panel de búsqueda local.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: siteConfig.name,
  founder: { '@type': 'Person', name: siteConfig.owner },
  description,
  url: siteConfig.url,
  image: `${siteConfig.url}/og.jpg`,
  logo: `${siteConfig.url}/icon-512.png`,
  telephone: siteConfig.phone.tel,
  email: siteConfig.email,
  address: { '@type': 'PostalAddress', addressLocality: 'Santiago', addressRegion: 'Región Metropolitana', addressCountry: 'CL' },
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Región Metropolitana, Chile' },
    { '@type': 'Country', name: 'Chile' },
  ],
  knowsLanguage: 'es',
  sameAs: [
    siteConfig.social.instagram.url,
    siteConfig.social.instagramCorp.url,
    siteConfig.social.facebook.url,
    siteConfig.social.flickr.url,
    siteConfig.social.youtube.url,
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servicios de fotografía',
    itemListElement: [
      'Fotografía de matrimonios',
      'Fotografía escolar: licenciaturas, galas y cuadros de graduación',
      'Fotografía de cumpleaños',
      'Fotografía deportiva',
      'Fotografía para empresas: productos, comercial y profesional',
    ].map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="bg-slate-50 dark:bg-zinc-950" suppressHydrationWarning>
      <body className="antialiased bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
        <BnToque />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
