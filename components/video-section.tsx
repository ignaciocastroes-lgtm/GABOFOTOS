import { agradecimientos } from "@/lib/agradecimientos"
import { siteConfig } from "@/lib/site-config"
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

// Mientras Gabo no cargue ningún video desde /admin, esta sección muestra en su lugar la fila fija
// de agradecimientos (lib/agradecimientos.ts). El día que suba uno desde /admin, esos pasan a
// mostrarse a ellos en vez de la fila fija, sin tocar código.
export async function VideoSection() {
  const subidos = await cargarVideos()

  if (subidos.length > 0) {
    return <VideoTunnel videos={subidos} kicker="VIDEOS" title="Míralo en movimiento" channelUrl={siteConfig.social.youtube.url} />
  }

  return (
    <VideoTunnel
      videos={agradecimientos}
      kicker="AGRADECIMIENTOS"
      title="Gracias por dejarme capturar tu historia"
      subtitle="Algunos momentos que he tenido el privilegio de registrar. Puedes ver más en el canal completo."
      channelUrl={siteConfig.social.youtube.url}
    />
  )
}
