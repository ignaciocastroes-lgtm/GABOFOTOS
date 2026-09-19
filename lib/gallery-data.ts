import type { GalleryCategory, GalleryPhoto, GalleryResponse } from "./gallery"
import {
  fetchAlbumPhotos,
  fetchUserAlbums,
  interleave,
  resolveAlbums,
  type FlickrAlbum,
} from "./flickr"
import { listarFotos, urlPublica } from "./supabase-rest"
import { siteConfig } from "./site-config"

const MAX_FLICKR = 36
const MAX_TOTAL = 60

/** Fotos que Gabo sube desde /admin (Supabase). Sin configuración o si falla: lista vacía. */
async function cargarSubidas(categoria: GalleryCategory["id"]): Promise<GalleryPhoto[]> {
  try {
    const filas = await listarFotos({ categoria, soloVisibles: true, revalidate: 60 })
    return filas.map((f) => ({
      id: f.id,
      title: f.alt,
      alt: f.alt || undefined,
      src: urlPublica(f.path),
      width: f.ancho,
      height: f.alto,
      remote: true,
    }))
  } catch (error) {
    if (process.env.SUPABASE_URL) console.error("[fotos]", error)
    return []
  }
}

/**
 * Arma la galería de una categoría, de más a menos prioritaria:
 *   1. las fotos subidas desde /admin, en el orden que Gabo les dio;
 *   2. las de sus álbumes de Flickr (solo si hay FLICKR_API_KEY);
 *   3. si no hay ninguna de las dos, las fotos locales de respaldo.
 * Nunca lanza error: lo peor que pasa es mostrar el respaldo.
 */
export async function loadCategoryGallery(category: GalleryCategory): Promise<GalleryResponse> {
  const apiKey = process.env.FLICKR_API_KEY
  const userId = process.env.FLICKR_USER_ID || siteConfig.flickr.userId

  const subidas = await cargarSubidas(category.id)

  // Sin API key solo se pueden enlazar los álbumes que ya tienen id.
  let albums: FlickrAlbum[] = resolveAlbums(category.albums, [])
  let deFlickr: GalleryPhoto[] = []

  if (apiKey) {
    // Los álbumes indicados solo por título se buscan entre los de la cuenta.
    const available = await fetchUserAlbums(apiKey, userId).catch((error) => {
      console.error("[flickr]", error)
      return [] as FlickrAlbum[]
    })
    albums = resolveAlbums(category.albums, available)

    const results = await Promise.allSettled(
      albums.map((album) => fetchAlbumPhotos(album.id, apiKey, userId)),
    )

    const lists: GalleryPhoto[][] = []
    for (const result of results) {
      if (result.status === "fulfilled") lists.push(result.value)
      else console.error("[flickr]", result.reason)
    }
    deFlickr = interleave(lists, MAX_FLICKR)
  }

  const remotas = [...subidas, ...deFlickr].slice(0, MAX_TOTAL)
  const source: GalleryResponse["source"] = remotas.length > 0 ? "remote" : "local"

  return {
    category: category.id,
    label: category.title,
    source,
    albums: albums.map((album) => ({
      title: album.title,
      url: `${siteConfig.flickr.albumsUrl}${album.id}`,
    })),
    photos: source === "local" ? category.fallback.map((p) => ({ ...p, alt: p.alt ?? p.title })) : remotas,
  }
}
