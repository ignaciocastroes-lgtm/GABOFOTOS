// Imágenes de los servicios para el sitio público: las que Gabo cambió desde /admin (Supabase) y,
// donde no cambió nada, las originales. Nunca lanza error: lo peor que pasa es mostrar las originales.

import { imagenesOriginales, esPlanId, type PlanImagenes } from "./planes"
import { listarPlanImagenes, urlPublica } from "./supabase-rest"

export async function cargarImagenesPlanes(): Promise<PlanImagenes> {
  const imagenes = imagenesOriginales()
  try {
    const filas = await listarPlanImagenes({ revalidate: 60 })
    for (const f of filas) {
      if (!esPlanId(f.clave)) continue
      imagenes[f.clave] = { src: urlPublica(f.path), ancho: f.ancho, alto: f.alto, personalizada: true, posicion: "50% 50%" }
    }
  } catch (error) {
    if (process.env.SUPABASE_URL) console.error("[planes]", error)
  }
  return imagenes
}
