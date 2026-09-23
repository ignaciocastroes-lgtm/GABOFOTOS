// Imágenes de los servicios del modal «Presupuestos y contacto».
//
// Cada servicio trae una imagen `original` (archivo en public/images), que se usa si no hay nada
// mejor. Si el servicio tiene `flickrAlbumId`, el sitio intenta traer la primera foto de ese
// álbum real de Flickr (mismo mecanismo sin clave que alimenta las galerías, ver lib/flickr.ts) y
// la usa en su lugar. Por encima de las dos, siempre gana lo que Gabo suba a mano desde
// /admin → pestaña «Presupuestos».
// Revisado el 23-sep-2026: los 4 servicios que también son categorías de la portada (Matrimonios,
// Colegios, Cumpleaños, Deporte) ya tienen álbum real y por lo tanto foto real. Bautizos no tiene
// álbum propio en Flickr; se usa el álbum «Familia» como la aproximación real más cercana (bodas,
// colegios y deportes sí son exactos; este no lo es del todo) hasta que Gabo suba una foto de
// bautizo de verdad desde /admin o cree un álbum «Bautizos».
// Este archivo no toca el servidor: lo usan las rutas, el panel y los componentes del navegador.

/** Fila de la tabla `plan_imagenes` (una por servicio con imagen cambiada). */
export type PlanImagenDB = {
  clave: string
  path: string
  ancho: number
  alto: number
  updated_at: string
}

export const PLANES = [
  {
    id: "matrimonios",
    titulo: "Matrimonios",
    flickrAlbumId: "72157625457217000",
    original: { src: "/images/portfolio/social-matrimonio-playa.jpg", ancho: 1040, alto: 1560, posicion: "50% 40%" },
  },
  {
    id: "colegios",
    titulo: "Colegios",
    flickrAlbumId: "72177720335758446",
    original: { src: "/images/portfolio/colegios-foto-de-curso.jpg", ancho: 1517, alto: 870, posicion: "50% 50%" },
  },
  {
    id: "cumpleanos",
    titulo: "Cumpleaños",
    flickrAlbumId: "72157645358669889",
    original: { src: "/images/portfolio/social-fiesta-gala.jpg", ancho: 1599, alto: 1066, posicion: "50% 40%" },
  },
  {
    id: "deporte",
    titulo: "Deporte",
    flickrAlbumId: "72157625457219402",
    original: { src: "/images/portfolio/deporte-futbol-terreno.jpg", ancho: 768, alto: 1024, posicion: "50% 40%" },
  },
  {
    id: "cuadros",
    titulo: "Cuadros de graduación",
    original: { src: "/images/portfolio/retratos-cuadro-licenciatura.jpg", ancho: 1125, alto: 1500, posicion: "50% 30%" },
  },
  {
    id: "sesiones",
    titulo: "Sesiones fotográficas",
    original: { src: "/images/portfolio/retratos-portada.jpg", ancho: 735, alto: 1310, posicion: "50% 25%" },
  },
  {
    id: "empresas",
    titulo: "Empresas: productos y comercial",
    original: { src: "/images/empresas/foto-producto-agua-tonica.jpg", ancho: 720, alto: 1340, posicion: "50% 75%" },
  },
  {
    id: "bautizos",
    titulo: "Bautizos",
    // «Familia» de Flickr, como la aproximación real más cercana (ver nota arriba).
    flickrAlbumId: "72157621802433227",
    original: { src: "/images/gabofotos-logo.jpg", ancho: 1378, alto: 1378, posicion: "50% 50%" },
  },
  {
    id: "otros",
    titulo: "Otros eventos",
    original: { src: "/images/portfolio/social-fiesta-gala.jpg", ancho: 1599, alto: 1066, posicion: "50% 50%" },
  },
] as const

export type PlanId = (typeof PLANES)[number]["id"]

export function esPlanId(valor: unknown): valor is PlanId {
  return typeof valor === "string" && PLANES.some((p) => p.id === valor)
}

/** Lo que necesita el sitio para dibujar la imagen de un servicio. */
export type PlanImagen = {
  src: string
  ancho: number
  alto: number
  /** true si la imagen viene de fuera (Flickr o Supabase): no pasa por el optimizador de Next. */
  remota: boolean
  /** Encuadre (object-position). Las imágenes remotas van centradas. */
  posicion: string
}

export type PlanImagenes = Record<PlanId, PlanImagen>

export function imagenesOriginales(): PlanImagenes {
  const salida = {} as PlanImagenes
  for (const p of PLANES) salida[p.id] = { ...p.original, remota: false }
  return salida
}
