// Categorías del sitio y de dónde sale cada galería.
// Los `albums` son álbumes reales de https://www.flickr.com/photos/gcabezasplop/albums
//
// Cada álbum se puede indicar de dos formas:
//  - con `id` (el número al final de la URL del álbum), o
//  - solo con `title`: el sitio lo busca en Flickr por ese nombre exacto (sin importar
//    mayúsculas ni tildes). Crear en Flickr un álbum con ese nombre basta para que aparezca,
//    sin tocar código.

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

export type GalleryCategoryId = "social" | "colegios" | "retratos" | "deporte"

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
    id: "social",
    title: "Social",
    items: ["Matrimonios", "Cumpleaños", "Eventos"],
    cover: "/images/portfolio/social-matrimonio-playa.jpg",
    coverPosition: "50% 30%",
    albums: [
      { id: "72157625457217000", title: "Matrimonios" },
      { id: "72157645358669889", title: "Cumpleaños" },
      { title: "Eventos" },
    ],
    fallback: [
      { id: "local-social-1", title: "Matrimonio en la playa", src: "/images/portfolio/social-matrimonio-playa.jpg", width: 1040, height: 1560 },
      { id: "local-social-2", title: "Novios jugando en el sillón", src: "/images/portfolio/social-novios-sofa-juego.jpg", width: 1600, height: 1066 },
      { id: "local-social-3", title: "Novios bailando de noche", src: "/images/portfolio/social-novios-noche.jpg", width: 1066, height: 1599 },
      { id: "local-social-4", title: "Novios con sus amigos en el pasto", src: "/images/portfolio/social-novios-amigos-pasto.jpg", width: 1600, height: 1066 },
      { id: "local-social-5", title: "Saxofonista en el banquete", src: "/images/portfolio/social-saxofonista.jpg", width: 1560, height: 1040 },
      { id: "local-social-6", title: "Fiesta de gala", src: "/images/portfolio/social-fiesta-gala.jpg", width: 1599, height: 1066 },
      { id: "local-social-7", title: "Novios en el sillón", src: "/images/portfolio/social-novios-sofa-beso.jpg", width: 1455, height: 970 },
      { id: "local-social-8", title: "Mesa de novios", src: "/images/portfolio/social-mesa-novios.jpg", width: 1600, height: 1067 },
    ],
  },
  {
    id: "colegios",
    title: "Colegios",
    items: ["Licenciaturas", "Egreso de octavo", "Cuadros de graduación", "Fotos de curso", "Galas"],
    cover: "/images/portfolio/retratos-portada.jpg",
    coverPosition: "50% 10%",
    albums: [
      { title: "Colegios" },
      { title: "Licenciaturas" },
      { title: "Galas" },
      { title: "Cuadros" },
    ],
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
    id: "retratos",
    title: "Retratos",
    items: ["Nacimientos", "Familia", "Sesiones"],
    cover: "/images/gabo/gabo-retrato-pareja.jpg",
    coverPosition: "50% 30%",
    albums: [
      { id: "72157666463650568", title: "Retratos" },
      { id: "72157621802433227", title: "Familia" },
      { title: "Nacimientos" },
    ],
    fallback: [
      {
        id: "local-retratos-1",
        title: "Retrato de pareja en el jardín",
        src: "/images/gabo/gabo-retrato-pareja.jpg",
        width: 1280,
        height: 1131,
      },
    ],
  },
  {
    id: "deporte",
    title: "Deporte",
    items: ["Fútbol", "Hockey"],
    cover: "/images/portfolio/deporte-futbol-terreno.jpg",
    coverPosition: "50% 40%",
    albums: [
      { title: "Hockey" },
      { id: "72157625457219402", title: "Fútbol Joven" },
      { id: "72157652719900711", title: "Golf 2015" },
      { id: "72157625489699452", title: "Rally Mobil" },
    ],
    fallback: [
      { id: "local-deporte-1", title: "Fútbol infantil", src: "/images/portfolio/deporte-futbol-terreno.jpg", width: 768, height: 1024 },
    ],
  },
]
