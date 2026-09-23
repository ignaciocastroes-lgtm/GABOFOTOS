// Imágenes de los servicios para el sitio público, de más a menos prioridad:
//   1. lo que Gabo subió a mano desde /admin (Supabase) — su última palabra;
//   2. la primera foto real del álbum de Flickr del servicio, si tiene uno (lib/planes.ts);
//   3. la imagen original fija del código.
// Nunca lanza error: lo peor que pasa es mostrar la original.

import { fetchAlbumPhotos } from "./flickr"
import { esPlanId, imagenesOriginales, PLANES, type PlanImagenes } from "./planes"
import { listarPlanImagenes, urlPublica } from "./supabase-rest"
import { siteConfig } from "./site-config"

export async function cargarImagenesPlanes(): Promise<PlanImagenes> {
  const imagenes = imagenesOriginales()
  const userId = process.env.FLICKR_USER_ID || siteConfig.flickr.userId

  // 2. Flickr: se intenta con cada servicio que tenga álbum, en paralelo.
  const conAlbum = PLANES.filter((plan) => "flickrAlbumId" in plan) as (typeof PLANES[number] & { flickrAlbumId: string })[]
  const resultados = await Promise.allSettled(conAlbum.map((plan) => fetchAlbumPhotos(plan.flickrAlbumId, userId)))
  resultados.forEach((resultado, i) => {
    if (resultado.status !== "fulfilled") {
      console.error("[planes: flickr]", conAlbum[i].id, resultado.reason)
      return
    }
    const foto = resultado.value[0]
    if (!foto) return
    imagenes[conAlbum[i].id] = { src: foto.src, ancho: foto.width, alto: foto.height, remota: true, posicion: "50% 50%" }
  })

  // 1. Supabase: gana sobre todo lo anterior.
  try {
    const filas = await listarPlanImagenes({ revalidate: 60 })
    for (const fila of filas) {
      if (!esPlanId(fila.clave)) continue
      imagenes[fila.clave] = { src: urlPublica(fila.path), ancho: fila.ancho, alto: fila.alto, remota: true, posicion: "50% 50%" }
    }
  } catch (error) {
    if (process.env.SUPABASE_URL) console.error("[planes: supabase]", error)
  }

  return imagenes
}
