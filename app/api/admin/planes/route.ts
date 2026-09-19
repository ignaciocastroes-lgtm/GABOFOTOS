import { NextResponse } from "next/server"
import { exigirAdmin } from "@/lib/admin-auth"
import { esPlanId } from "@/lib/planes"
import { listarPlanImagenes, urlPublica } from "@/lib/supabase-rest"

export const runtime = "nodejs"

/** Lista las imágenes que Gabo cambió (los servicios que no aparecen usan la imagen original). */
export async function GET(request: Request) {
  const no = await exigirAdmin(request)
  if (no) return no
  try {
    const filas = await listarPlanImagenes()
    const imagenes = filas
      .filter((f) => esPlanId(f.clave))
      .map((f) => ({ clave: f.clave, url: urlPublica(f.path), ancho: f.ancho, alto: f.alto }))
    return NextResponse.json({ imagenes })
  } catch (e) {
    console.error("[GET /api/admin/planes]", e)
    return NextResponse.json({ error: e instanceof Error ? e.message : "No se pudo leer la base de datos." }, { status: 500 })
  }
}
