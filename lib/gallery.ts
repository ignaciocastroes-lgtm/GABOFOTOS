// Categorías del sitio y de dónde sale cada galería.
// Los `albums` son álbumes reales de https://www.flickr.com/photos/gcabezasplop/albums
//
// Cada álbum se puede indicar de dos formas:
//  - con `id` (el número al final de la URL del álbum), o
//  - solo con `title`: el sitio lo busca en Flickr por ese nombre exacto (sin importar
//    mayúsculas ni tildes). Crear en Flickr un álbum con ese nombre basta para que aparezca,
//    sin tocar código.
//
// Revisado el 23-sep-2026 contra los álbumes reales de Flickr. Gabo terminó de reorganizar su
// cuenta y pidió que la portada muestre exactamente 4 categorías, sus 4 trabajos principales:
// Matrimonios, Colegios, Cumpleaños y Deporte (antes eran Social, Colegios, Retratos y Deporte).
// Ya no queda ningún álbum por título que no exista: los 4 álbumes de abajo están confirmados,
// con sus ids reales, incluido Colegios, que antes no tenía álbum y ahora sí (19 fotos).
// El resto de los álbumes de Gabo en Flickr (Retrato, Modelos, Familia, Arquitectura, Arte,
// Modas, Publicitario, Restauraciones, Grifo, Paisaje, Aves, Flores, Pool, la exhibición de "Un
// techo para Chile") son su archivo personal o de portafolio y, a pedido de Gabo, no van en la
// portada: no se usan en ninguna categoría de este archivo.

export type GalleryPhoto = {
  id: string
  title: string
  src: string
  width: number
  height: number
  /** Descripción para lectores de pantalla (si no hay, se usa una genérica). */
  alt?: string
  /** Página de la foto en Flickr (solo fotos que vienen de Flickr). */
  href?: string
  /** true si la foto vive fuera del sitio (Supabase o Flickr): ya viene optimizada desde su CDN. */
  remote?: boolean
}

export type GalleryCategoryId = "matrimonios" | "colegios" | "cumpleanos" | "deporte"

export type GalleryCategory = {
  id: GalleryCategoryId
  title: string
  items: string[]
  /** Portada de la tarjeta del home. `null` = tarjeta sin foto hasta tener una real. */
  cover: string | null
  coverPosition: string
  albums: { id?: string; title: string }[]
  /** Fotos locales que se muestran si Flickr no está configurado o falla. */
  fallback: GalleryPhoto[]
}

export type GalleryResponse = {
  category: string
  label: string
  source: "remote" | "local"
  albums: { title: string; url: string }[]
  photos: GalleryPhoto[]
}

export const galleryCategories: GalleryCategory[] = [
  {
    id: "matrimonios",
    title: "Matrimonios",
    items: ["Ceremonia", "Fiesta", "Sesión de novios"],
    cover: "/images/portfolio/social-matrimonio-playa.jpg",
    coverPosition: "50% 30%",
    albums: [{ id: "72157625457217000", title: "Matrimonios" }],
    fallback: [
      { id: "local-matrimonios-1", title: "Matrimonio en la playa", src: "/images/portfolio/social-matrimonio-playa.jpg", width: 1040, height: 1560 },
      { id: "local-matrimonios-2", title: "Novios jugando en el sillón", src: "/images/portfolio/social-novios-sofa-juego.jpg", width: 1600, height: 1066 },
      { id: "local-matrimonios-3", title: "Novios bailando de noche", src: "/images/portfolio/social-novios-noche.jpg", width: 1066, height: 1599 },
      { id: "local-matrimonios-4", title: "Novios con sus amigos en el pasto", src: "/images/portfolio/social-novios-amigos-pasto.jpg", width: 1600, height: 1066 },
      { id: "local-matrimonios-5", title: "Saxofonista en el banquete", src: "/images/portfolio/social-saxofonista.jpg", width: 1560, height: 1040 },
      { id: "local-matrimonios-6", title: "Novios en el sillón", src: "/images/portfolio/social-novios-sofa-beso.jpg", width: 1455, height: 970 },
      { id: "local-matrimonios-7", title: "Mesa de novios", src: "/images/portfolio/social-mesa-novios.jpg", width: 1600, height: 1067 },
    ],
  },
  {
    id: "colegios",
    title: "Colegios",
    items: ["Licenciaturas", "Egreso de octavo", "Cuadros de graduación", "Fotos de curso", "Galas"],
    cover: "/images/portfolio/retratos-portada.jpg",
    coverPosition: "50% 10%",
    // Antes no tenía álbum en Flickr; Gabo ya creó uno (19 fotos) al reorganizar su cuenta.
    albums: [{ id: "72177720335758446", title: "Colegios" }],
    fallback: [
      { id: "local-colegios-1", title: "Licenciatura 4°B 2022", src: "/images/portfolio/colegios-licenciatura-cervellon-2022.jpg", width: 960, height: 1280 },
      { id: "local-colegios-2", title: "Egreso de octavo 2021", src: "/images/portfolio/colegios-egreso-8vo-rauli-2021.jpg", width: 1200, height: 1600 },
      { id: "local-colegios-3", title: "Licenciatura 4°A 2022", src: "/images/portfolio/colegios-licenciatura-carmen-arriaran-2022.jpg", width: 960, height: 1280 },
      { id: "local-colegios-4", title: "Licenciatura 4°B 2021", src: "/images/portfolio/colegios-licenciatura-cervellon-2021-b.jpg", width: 1200, height: 1600 },
      { id: "local-colegios-5", title: "Cuadro de licenciatura", src: "/images/portfolio/retratos-cuadro-licenciatura.jpg", width: 1125, height: 1500 },
      { id: "local-colegios-6", title: "Cuadros de graduación enmarcados", src: "/images/portfolio/colegios-cuadros-enmarcados.jpg", width: 720, height: 902 },
      { id: "local-colegios-7", title: "Foto de curso", src: "/images/portfolio/colegios-foto-de-curso.jpg", width: 1517, height: 870 },
    ],
  },
  {
    id: "cumpleanos",
    title: "Cumpleaños",
    items: ["Infantiles", "Familiares", "Aniversarios"],
    cover: "/images/portfolio/social-fiesta-gala.jpg",
    coverPosition: "50% 40%",
    albums: [{ id: "72157645358669889", title: "Cumpleaños" }],
    fallback: [
      { id: "local-cumpleanos-1", title: "Fiesta de gala", src: "/images/portfolio/social-fiesta-gala.jpg", width: 1599, height: 1066 },
    ],
  },
  {
    id: "deporte",
    title: "Deporte",
    items: ["Fútbol", "Hockey", "Golf", "Motor"],
    cover: "/images/portfolio/deporte-futbol-terreno.jpg",
    coverPosition: "50% 40%",
    albums: [
      { id: "72157625457219402", title: "Deporte" },
      { id: "72157652719900711", title: "Golf" },
      { id: "72157625489699452", title: "Rally Mobil" },
    ],
    fallback: [
      { id: "local-deporte-1", title: "Fútbol infantil", src: "/images/portfolio/deporte-futbol-terreno.jpg", width: 768, height: 1024 },
    ],
  },
]
