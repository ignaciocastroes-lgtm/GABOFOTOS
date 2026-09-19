import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Oswald } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-oswald',
  display: 'swap',
})

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://internacionalloespejo.cl'

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: 'Club Hockey Patín Internacional Lo Espejo',
    template: '%s | Internacional Lo Espejo',
  },
  description:
    'El único club de hockey patín de Lo Espejo. Escuela gratuita para niñas, niños y adolescentes, ocho series en competencia y una rama femenina en crecimiento.',
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    siteName: 'Internacional Lo Espejo',
    images: ['/escudo.webp'],
  },
  alternates: { canonical: '/' },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#cc1a1d',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${oswald.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
