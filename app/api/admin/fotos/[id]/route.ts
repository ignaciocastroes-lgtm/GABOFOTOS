import { NextResponse } from "next/server"
import { exigirAdmin } from "@/lib/admin-auth"
import { esCategoria, esUuid } from "@/lib/fotos"
import { actualizarFoto, borrarFoto, borrarObjeto, obtenerFoto, urlPublica, type CambiosFoto } from "@/lib/supabase-rest"

export const runtime = "nodejs"

type Contexto = { params: Promise<{ id: string }> }

/** Cambia texto alternativo, visibilidad o categoría. El orden se cambia en /orden. */
export async function PATCH(request: Request, { params }: Contexto) {
  const no = await exigirAdmin(request)
  if (no) return no

  const { id } = await params
  if (!esUuid(id)) return NextResponse.json({ error: "Id inválido." }, { status: 400 })

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== "object") return NextResponse.json({ error: "JSON inválido." }, { status: 400 })

  const cambios: CambiosFoto = {}
  if (typeof body.alt === "string") cambios.alt = body.alt.trim().slice(0, 200)
  if (typeof body.visible === "boolean") cambios.visible = body.visible
  if (body.categoria !== undefined) {
    if (!esCategoria(body.categoria)) return NextResponse.json({ error: "Categoría inválida." }, { status: 422 })
    if (body.categoria === "colegios" && body.autorizado !== true) {
      return NextResponse.json({ error: "Para mover a Colegios hay que confirmar la autorización." }, { status: 422 })
    }
    cambios.categoria = body.categoria
    if (body.categoria === "colegios") cambios.autorizado = true
  }
  if (Object.keys(cambios).length === 0) return NextResponse.json({ error: "No hay nada que cambiar." }, { status: 422 })

  try {
    const foto = await actualizarFoto(id, cambios)
    if (!foto) return NextResponse.json({ error: "No existe esa foto." }, { status: 404 })
    return NextResponse.json({ foto: { ...foto, url: urlPublica(foto.path) } })
  } catch (e) {
    console.error("[PATCH /api/admin/fotos/[id]]", e)
    return NextResponse.json({ error: e instanceof Error ? e.message : "No se pudo guardar." }, { status: 500 })
  }
}

/** Borra la foto: el registro y el archivo. */
export async function DELETE(request: Request, { params }: Contexto) {
  const no = await exigirAdmin(request)
  if (no) return no

  const { id } = await params
  if (!esUuid(id)) return NextResponse.json({ error: "Id inválido." }, { status: 400 })

  try {
    const foto = await obtenerFoto(id)
    if (!foto) return NextResponse.json({ error: "No existe esa foto." }, { status: 404 })
    await borrarFoto(id)
    await borrarObjeto(foto.path).catch((e) => console.error("[DELETE objeto]", e)) // si el archivo ya no estaba, no importa
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("[DELETE /api/admin/fotos/[id]]", e)
    return NextResponse.json({ error: e instanceof Error ? e.message : "No se pudo eliminar." }, { status: 500 })
  }
}
