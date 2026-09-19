import type { MetadataRoute } from 'next'
import { CUERPO_TECNICO, SERIES } from '@/lib/club'

const BASE = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://internacionalloespejo.cl'

export default function sitemap(): MetadataRoute.Sitemap {
  const rutas = [
    { url: '/', priority: 1 },
    { url: '/escuela', priority: 0.9 },
    { url: '/hockey-patin', priority: 0.8 },
    { url: '/apoyanos', priority: 0.9 },
    { url: '/el-club', priority: 0.8 },
    { url: '/profesores', priority: 0.8 },
    { url: '/auspiciadores', priority: 0.8 },
    { url: '/pases', priority: 0.7 },
    { url: '/series', priority: 0.8 },
    { url: '/transparencia', priority: 0.7 },
    { url: '/contacto', priority: 0.6 },
    ...CUERPO_TECNICO.map((p) => ({ url: `/profesores/${p.id}`, priority: 0.6 })),
    ...SERIES.filter((s) => s.id !== 'escuelita').map((s) => ({ url: `/series/${s.id}`, priority: 0.6 })),
  ]
  return rutas.map((r) => ({
    url: `${BASE}${r.url}`,
    lastModified: new Date(),
    priority: r.priority,
  }))
}
