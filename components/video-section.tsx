import { listarVideos } from "@/lib/supabase-rest"
import { MAX_VIDEOS, type VideoPublico } from "@/lib/videos"
import { VideoTunnel } from "./video-tunnel"

/** Videos que se cargan desde /admin (Supabase). Sin configuración, sin tabla o si falla: lista vacía. */
async function cargarVideos(): Promise<VideoPublico[]> {
  try {
    const filas = await listarVideos({ soloVisibles: true, revalidate: 60 })
    return filas.slice(0, MAX_VIDEOS).map((v) => ({ id: v.id, titulo: v.titulo, youtubeId: v.youtube_id }))
  } catch (error) {
    if (process.env.SUPABASE_URL) console.error("[videos]", error)
    return []
  }
}

// Sin videos cargados, la sección no aparece: nunca se muestra un espacio vacío.
export async function VideoSection() {
  const videos = await cargarVideos()
  if (videos.length === 0) return null
  return <VideoTunnel videos={videos} />
}
