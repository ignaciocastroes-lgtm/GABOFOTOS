import type { GalleryPhoto } from "./gallery"

// Cliente mínimo de la API pública de Flickr (solo lectura, fotos públicas).
// Docs: https://www.flickr.com/services/api/flickr.photosets.getPhotos.html

const ENDPOINT = "https://api.flickr.com/services/rest/"
// De mayor a menor calidad disponible: l=1024px, c=800px, z=640px, m=500px
const SIZE_ORDER = ["l", "c", "z", "m"] as const

type FlickrApiPhoto = { id: string; title?: string } & Record<string, string | number | undefined>

export type FlickrAlbum = { id: string; title: string }

/** Minúsculas, sin tildes y sin espacios sobrantes: "Fútbol Joven " => "futbol joven". */
export function normalizeTitle(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
}

/** Todos los álbumes públicos de la cuenta (id y título). */
export async function fetchUserAlbums(apiKey: string, userId: string): Promise<FlickrAlbum[]> {
  const params = new URLSearchParams({
    method: "flickr.photosets.getList",
    api_key: apiKey,
    user_id: userId,
    per_page: "500",
    format: "json",
    nojsoncallback: "1",
  })

  const response = await fetch(`${ENDPOINT}?${params}`, { next: { revalidate: 3600 } })
  if (!response.ok) throw new Error(`Flickr respondió HTTP ${response.status}`)

  const data = await response.json()
  if (data.stat !== "ok") throw new Error(`Flickr error ${data.code}: ${data.message}`)

  const list: { id: string; title?: { _content?: string } }[] = data.photosets?.photoset ?? []
  return list.map((album) => ({ id: album.id, title: album.title?._content ?? "" }))
}

/**
 * Convierte los álbumes pedidos por una categoría en álbumes concretos de Flickr.
 * Los que traen `id` se usan tal cual; los que solo traen `title` se buscan por nombre.
 * Si un título no existe todavía en Flickr, simplemente se omite.
 */
export function resolveAlbums(
  wanted: { id?: string; title: string }[],
  available: FlickrAlbum[],
): FlickrAlbum[] {
  const seen = new Set<string>()
  const result: FlickrAlbum[] = []

  for (const album of wanted) {
    const id = album.id ?? available.find((a) => normalizeTitle(a.title) === normalizeTitle(album.title))?.id
    if (id && !seen.has(id)) {
      seen.add(id)
      result.push({ id, title: album.title })
    }
  }
  return result
}

export function toGalleryPhoto(photo: FlickrApiPhoto, owner: string): GalleryPhoto | null {
  for (const size of SIZE_ORDER) {
    const src = photo[`url_${size}`]
    const width = Number(photo[`width_${size}`])
    const height = Number(photo[`height_${size}`])
    if (typeof src === "string" && width > 0 && height > 0) {
      return {
        id: photo.id,
        title: photo.title ?? "",
        src,
        width,
        height,
        href: `https://www.flickr.com/photos/${owner}/${photo.id}`,
        remote: true,
      }
    }
  }
  return null
}

export async function fetchAlbumPhotos(
  albumId: string,
  apiKey: string,
  userId: string,
  perPage = 24,
): Promise<GalleryPhoto[]> {
  const params = new URLSearchParams({
    method: "flickr.photosets.getPhotos",
    api_key: apiKey,
    photoset_id: albumId,
    user_id: userId,
    extras: "url_c,url_l,url_z,url_m",
    media: "photos",
    per_page: String(perPage),
    format: "json",
    nojsoncallback: "1",
  })

  const response = await fetch(`${ENDPOINT}?${params}`, { next: { revalidate: 3600 } })
  if (!response.ok) throw new Error(`Flickr respondió HTTP ${response.status}`)

  const data = await response.json()
  if (data.stat !== "ok") throw new Error(`Flickr error ${data.code}: ${data.message}`)

  const owner: string = data.photoset?.owner ?? userId
  const photos: FlickrApiPhoto[] = data.photoset?.photo ?? []
  return photos
    .map((photo) => toGalleryPhoto(photo, owner))
    .filter((photo): photo is GalleryPhoto => photo !== null)
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
