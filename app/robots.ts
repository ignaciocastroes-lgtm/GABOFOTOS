import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://internacionalloespejo.cl'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/apoyo/', '/privacidad', '/admin'] },
    sitemap: `${BASE}/sitemap.xml`,
  }
}
