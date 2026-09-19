import { NextResponse } from "next/server"
import { exigirAdmin } from "@/lib/admin-auth"
import { MAX_VIDEOS, extraerYoutubeId } from "@/lib/videos"
import { insertarVideo, listarVideos } from "@/lib/supabase-rest"

export const runtime = "nodejs"

const ENLACE_INVALIDO =
  "Ese enlace no parece de YouTube. Copia el enlace desde el botón Compartir del video (youtube.com o youtu.be)."

/** Lista todos los videos (también los ocultos) para el panel. */
export async function GET(request: Request) {
  const no = await exigirAdmin(request)
  if (no) return no
  try {
    return NextResponse.json({ videos: await listarVideos() })
  } catch (e) {
    console.error("[GET /api/admin/videos]", e)
    return NextResponse.json({ error: e instanceof Error ? e.message : "No se pudo leer la base de datos." }, { status: 500 })
  }
}

/** Agrega un video: recibe el título y el enlace de YouTube; el servidor saca el id del enlace. */
export async function POST(request: Request) {
  const no = await exigirAdmin(request)
  if (no) return no

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== "object") return NextResponse.json({ error: "JSON inválido." }, { status: 400 })

  const titulo = typeof body.titulo === "string" ? body.titulo.trim().slice(0, 100) : ""
  const youtubeId = typeof body.url === "string" ? extraerYoutubeId(body.url) : null
  if (!youtubeId) return NextResponse.json({ error: ENLACE_INVALIDO }, { status: 422 })

  try {
    const existentes = await listarVideos()
    if (existentes.length >= MAX_VIDEOS) {
      return NextResponse.json(
        { error: `Ya hay ${MAX_VIDEOS} videos. Elimina uno para poder agregar otro.` },
        { status: 422 },
      )
    }
    const ultimo = existentes.reduce((max, v) => Math.max(max, v.orden), -1)
    const video = await insertarVideo({
      id: crypto.randomUUID(),
      titulo,
      youtube_id: youtubeId,
      orden: ultimo + 1, // el video nuevo queda al final
      visible: true,
    })
    return NextResponse.json({ video }, { status: 201 })
  } catch (e) {
    console.error("[POST /api/admin/videos]", e)
    return NextResponse.json({ error: e instanceof Error ? e.message : "No se pudo guardar el video." }, { status: 500 })
  }
}
