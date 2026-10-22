import { existsSync } from 'node:fs'

// Si existe public/GaboFotos-Brochure.pdf, el pie de página muestra "Descargar ficha técnica".
// Se decide al compilar (no en tiempo de ejecución): en Vercel la carpeta public no está en el servidor.
const BROCHURE = 'GaboFotos-Brochure.pdf'
const brochureUrl = existsSync(new URL(`./public/${BROCHURE}`, import.meta.url)) ? `/${BROCHURE}` : ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: { NEXT_PUBLIC_BROCHURE: brochureUrl },
  typescript: {
    ignoreBuildErrors: true,
  },
  poweredByHeader: false,
  // Cabeceras de seguridad para todo el sitio (no cambian nada visible).
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
        ],
      },
    ]
  },
  images: {
    // Las fotos de Flickr se sirven desde su CDN (live.staticflickr.com).
    remotePatterns: [
      { protocol: 'https', hostname: 'live.staticflickr.com' },
      { protocol: 'https', hostname: '*.staticflickr.com' },
      // Fotos que Gabo sube desde /admin (bucket público de Supabase Storage).
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
  },
}

export default nextConfig
