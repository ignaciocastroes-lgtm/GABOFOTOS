// Imágenes de los servicios del modal «Presupuestos y contacto».
//
// Cada servicio trae una imagen `original` (archivo en public/images), que se usa si no hay nada
// mejor. Si el servicio tiene `flickrAlbumId`, el sitio intenta traer la primera foto de ese
// álbum real de Flickr (mismo mecanismo sin clave que alimenta las galerías, ver lib/flickr.ts) y
// la usa en su lugar. Por encima de las dos, siempre gana lo que Gabo suba a mano desde
// /admin → pestaña «Presupuestos».
// Revisado el 26-sep-2026: los 4 servicios que también son categorías de la portada (Matrimonios,
// Colegios, Cumpleaños, Deporte) ya tienen álbum real y por lo tanto foto real. Bautizos ya tiene
// su propia foto real (globos) como original, así que tampoco necesita álbum de Flickr.
// Este archivo no toca el servidor: lo usan las rutas, el panel y los componentes del navegador.

/** Fila de la tabla `plan_imagenes` (una por servicio con imagen cambiada). */
export type PlanImagenDB = {
  clave: string
  path: string
  ancho: number
  alto: number
  updated_at: string
}

/** Cómo encaja la imagen en su caja: "cover" (llena y recorta, el default) o "contain" (se ve
 *  completa, con la caja de fondo asomando a los lados si la proporción no calza exacto). */
type Ajuste = "cover" | "contain"

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
    // Foto de la señora de Gabo: se muestra completa (ajuste "contain"), sin recortarla.
    original: {
      src: "/images/sesiones/sesion-vestido-negro.jpg",
      ancho: 533,
      alto: 799,
      posicion: "50% 50%",
      ajuste: "contain" as Ajuste,
    },
  },
  {
    id: "empresas",
    titulo: "Empresas: productos y comercial",
    // Foto de botella de vino de Gabo (su álbum de Flickr, gcabezasplop). No se pudo bajar el
    // archivo a este proyecto por una restricción de red del entorno donde se hizo este cambio,
    // así que por ahora enlaza directo al original en Flickr (remota: true). Ideal: que Gabo suba
    // el archivo real desde /admin → Presupuestos → Empresas, para no depender de un link externo.
    original: {
      src: "https://live.staticflickr.com/65535/55543738175_14e2cc51a7_b.jpg",
      ancho: 686,
      alto: 1024,
      posicion: "50% 50%",
      remota: true as const,
    },
  },
  {
    id: "bautizos",
    titulo: "Bautizos",
    // Foto real de un bautizo (decoración con globos) que reemplaza la aproximación del álbum
    // «Familia» de Flickr (ver nota de cabecera): ya no hace falta flickrAlbumId aquí.
    original: {
      src: "/images/bautizos/bautizo-globos-azules.webp",
      ancho: 500,
      alto: 500,
      posicion: "50% 50%",
    },
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
  /** "cover" (default, llena y recorta) o "contain" (se ve completa, sin recortar). */
  ajuste?: Ajuste
}

export type PlanImagenes = Record<PlanId, PlanImagen>

export function imagenesOriginales(): PlanImagenes {
  const salida = {} as PlanImagenes
  for (const p of PLANES) {
    const original: { remota?: boolean } = p.original
    salida[p.id] = { ...p.original, remota: original.remota ?? false }
  }
  return salida
}
