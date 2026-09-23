import type { GalleryCategory, GalleryPhoto, GalleryResponse } from "./gallery"
import { fetchAlbumPhotos, interleave, resolveAlbums } from "./flickr"
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
 *   2. las de sus álbumes de Flickr (el feed público, sin api_key — ver lib/flickr.ts);
 *   3. si ninguna de las dos tiene nada, las fotos locales de respaldo.
 * Nunca lanza error: lo peor que pasa es mostrar el respaldo.
 */
export async function loadCategoryGallery(category: GalleryCategory): Promise<GalleryResponse> {
  const userId = process.env.FLICKR_USER_ID || siteConfig.flickr.userId

  const subidas = await cargarSubidas(category.id)

  const albums = resolveAlbums(category.albums)
  const results = await Promise.allSettled(albums.map((album) => fetchAlbumPhotos(album.id, userId)))

  const lists: GalleryPhoto[][] = []
  for (const result of results) {
    if (result.status === "fulfilled") lists.push(result.value)
    else console.error("[flickr]", result.reason)
  }
  const deFlickr = interleave(lists, MAX_FLICKR)

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
