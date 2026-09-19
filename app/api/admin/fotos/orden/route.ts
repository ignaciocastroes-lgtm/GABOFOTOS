import { NextResponse } from "next/server"
import { exigirAdmin } from "@/lib/admin-auth"
import { esUuid } from "@/lib/fotos"
import { actualizarFoto } from "@/lib/supabase-rest"

export const runtime = "nodejs"

/** Guarda el orden: recibe los ids en el orden en que deben mostrarse. */
export async function POST(request: Request) {
  const no = await exigirAdmin(request)
  if (no) return no

  const body = await request.json().catch(() => null)
  const ids: unknown = body?.ids
  if (!Array.isArray(ids) || ids.length === 0 || ids.length > 200 || !ids.every(esUuid)) {
    return NextResponse.json({ error: "Lista de ids inválida." }, { status: 422 })
  }

  try {
    await Promise.all((ids as string[]).map((id, i) => actualizarFoto(id, { orden: i })))
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("[POST /api/admin/fotos/orden]", e)
    return NextResponse.json({ error: e instanceof Error ? e.message : "No se pudo guardar el orden." }, { status: 500 })
  }
}
