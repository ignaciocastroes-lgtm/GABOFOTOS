import { NextResponse } from "next/server"
import { exigirAdmin } from "@/lib/admin-auth"
import { esUuid } from "@/lib/fotos"
import { extraerYoutubeId } from "@/lib/videos"
import { actualizarVideo, borrarVideo, type CambiosVideo } from "@/lib/supabase-rest"

export const runtime = "nodejs"

type Contexto = { params: Promise<{ id: string }> }

/** Cambia título, enlace o visibilidad. El orden se cambia en /orden. */
export async function PATCH(request: Request, { params }: Contexto) {
  const no = await exigirAdmin(request)
  if (no) return no

  const { id } = await params
  if (!esUuid(id)) return NextResponse.json({ error: "Id inválido." }, { status: 400 })

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== "object") return NextResponse.json({ error: "JSON inválido." }, { status: 400 })

  const cambios: CambiosVideo = {}
  if (typeof body.titulo === "string") cambios.titulo = body.titulo.trim().slice(0, 100)
  if (typeof body.visible === "boolean") cambios.visible = body.visible
  if (body.url !== undefined) {
    const youtubeId = typeof body.url === "string" ? extraerYoutubeId(body.url) : null
    if (!youtubeId) {
      return NextResponse.json(
        { error: "Ese enlace no parece de YouTube. Copia el enlace desde el botón Compartir del video." },
        { status: 422 },
      )
    }
    cambios.youtube_id = youtubeId
  }
  if (Object.keys(cambios).length === 0) return NextResponse.json({ error: "No hay nada que cambiar." }, { status: 422 })

  try {
    const video = await actualizarVideo(id, cambios)
    if (!video) return NextResponse.json({ error: "No existe ese video." }, { status: 404 })
    return NextResponse.json({ video })
  } catch (e) {
    console.error("[PATCH /api/admin/videos/[id]]", e)
    return NextResponse.json({ error: e instanceof Error ? e.message : "No se pudo guardar." }, { status: 500 })
  }
}

/** Borra el video de la lista (no toca el video en YouTube). */
export async function DELETE(request: Request, { params }: Contexto) {
  const no = await exigirAdmin(request)
  if (no) return no

  const { id } = await params
  if (!esUuid(id)) return NextResponse.json({ error: "Id inválido." }, { status: 400 })

  try {
    await borrarVideo(id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("[DELETE /api/admin/videos/[id]]", e)
    return NextResponse.json({ error: e instanceof Error ? e.message : "No se pudo eliminar." }, { status: 500 })
  }
}
