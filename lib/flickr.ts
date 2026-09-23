import type { GalleryPhoto } from "./gallery"

// Cliente del "feed" público de Flickr (RSS/JSON de toda la vida, sin api_key).
// Se cambió a esto el 23-sep-2026: la API normal de Flickr (flickr.photosets.getPhotos, la que
// usaba este archivo antes) pasó a exigir una cuenta Flickr Pro para conseguir una api_key, y la
// cuenta de Gabo es Free. Este feed es un mecanismo más viejo y separado, pensado para que
// cualquiera pueda "suscribirse" a un álbum público como si fuera un blog — no depende de si la
// cuenta es Free o Pro, y no pide ninguna clave.
// Doc (no oficial, Flickr ya no la mantiene, pero el feed sigue funcionando): busca
// "flickr services feeds photoset.gne" — devuelve como mucho los últimos ítems del álbum (en la
// práctica, unos 20), no el álbum completo si tiene más fotos. Para álbumes grandes (Matrimonios
// tiene 107), el sitio muestra los ~20 más recientes en vez de los 107. Sigue siendo muchísimo
// mejor que no mostrar ninguna foto real, y no cuesta nada.
const FEED = "https://api.flickr.com/services/feeds/photoset.gne"

export type FlickrAlbum = { id: string; title: string }

/** Minúsculas, sin tildes y sin espacios sobrantes: "Fútbol Joven " => "futbol joven". */
export function normalizeTitle(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
}

/**
 * Convierte los álbumes pedidos por una categoría en álbumes concretos: los que traen `id` se
 * usan tal cual. (Antes también se podían pedir solo por `title` y el sitio los buscaba en la
 * cuenta de Flickr, pero esa búsqueda usaba la API con clave; sin clave no hay forma de listar
 * los álbumes de la cuenta, así que un álbum sin `id` simplemente se omite.)
 */
export function resolveAlbums(wanted: { id?: string; title: string }[]): FlickrAlbum[] {
  const seen = new Set<string>()
  const result: FlickrAlbum[] = []
  for (const album of wanted) {
    if (album.id && !seen.has(album.id)) {
      seen.add(album.id)
      result.push({ id: album.id, title: album.title })
    }
  }
  return result
}

// Entidades HTML que aparecen en los títulos y descripciones del feed (viene en XML/RSS de origen).
const ENTIDADES: Record<string, string> = {
  "&amp;": "&",
  "&quot;": '"',
  "&#039;": "'",
  "&apos;": "'",
  "&lt;": "<",
  "&gt;": ">",
}

function desescapar(texto: string): string {
  return texto.replace(/&(?:amp|quot|#039|apos|lt|gt);/g, (m) => ENTIDADES[m] ?? m)
}

// El feed da una sola imagen ("_m", 240px de lado largo) por foto. Su nombre de archivo sigue el
// patrón {servidor}/{id}_{secret}_m.jpg, y Flickr sirve el mismo archivo en otros tamaños con solo
// cambiar el sufijo (documentado y estable desde hace más de una década):
//   _q=150  _n=320  _z=640  _c=800  _b=1024 (si la foto original es así de grande)
// Se usa _c (800px): calidad de sobra para la web y casi cualquier foto de cámara lo tiene.
const SUFIJO_ORIGEN = "_m.jpg"
const SUFIJO_DESTINO = "_c.jpg"
const LADO_ORIGEN = 240 // el lado largo de "_m", fijo por definición del feed
const LADO_DESTINO = 800

type FeedItem = {
  title?: string
  link?: string
  media?: { m?: string }
  description?: string
}

/**
 * Saca el ancho y alto reales de la foto. El feed no los da como campos propios, pero sí quedan
 * escritos en el <img width="…" height="…"> que trae embebido en la descripción de cada ítem.
 */
function medidasDesdeDescripcion(descripcion: string | undefined): { width: number; height: number } | null {
  const m = descripcion?.match(/width="(\d+)"\s+height="(\d+)"/)
  if (!m) return null
  const width = Number(m[1])
  const height = Number(m[2])
  return width > 0 && height > 0 ? { width, height } : null
}

function toGalleryPhoto(item: FeedItem): GalleryPhoto | null {
  const srcOrigen = item.media?.m
  if (!srcOrigen || !srcOrigen.includes(SUFIJO_ORIGEN)) return null

  const idMatch = srcOrigen.match(/\/(\d+)_([0-9a-f]+)_m\.jpg$/)
  if (!idMatch) return null
  const [, id] = idMatch

  const medidas = medidasDesdeDescripcion(item.description)
  if (!medidas) return null

  // Escala proporcional de 240px (lo que da el feed) a 800px (lo que se pide en su lugar).
  const factor = LADO_DESTINO / LADO_ORIGEN
  const width = Math.round(medidas.width * factor)
  const height = Math.round(medidas.height * factor)

  return {
    id,
    title: item.title ? desescapar(item.title) : "",
    src: srcOrigen.replace(SUFIJO_ORIGEN, SUFIJO_DESTINO),
    width,
    height,
    href: item.link,
    remote: true,
  }
}

export async function fetchAlbumPhotos(albumId: string, ownerNsid: string): Promise<GalleryPhoto[]> {
  const params = new URLSearchParams({ nsid: ownerNsid, set: albumId, format: "json", nojsoncallback: "1" })
  const response = await fetch(`${FEED}?${params}`, { next: { revalidate: 3600 } })
  if (!response.ok) throw new Error(`Flickr respondió HTTP ${response.status}`)

  const data = (await response.json()) as { items?: FeedItem[] }
  const items = data.items ?? []
  return items.map(toGalleryPhoto).filter((photo): photo is GalleryPhoto => photo !== null)
}

/** Mezcla varias listas alternando una foto de cada una, sin repetir ids. */
export function interleave(lists: GalleryPhoto[][], limit: number): GalleryPhoto[] {
  const seen = new Set<string>()
  const result: GalleryPhoto[] = []
  const longest = Math.max(0, ...lists.map((list) => list.length))

  for (let i = 0; i < longest && result.length < limit; i++) {
    for (const list of lists) {
      const photo = list[i]
      if (photo && !seen.has(photo.id) && result.length < limit) {
        seen.add(photo.id)
        result.push(photo)
      }
    }
  }
  return result
}
