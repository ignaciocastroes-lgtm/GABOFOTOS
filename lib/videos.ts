// Videos de YouTube administrables desde /admin (tabla `videos` de Supabase).
// Este archivo no toca el servidor: lo usan tanto las rutas como los componentes del navegador.

/** Cuántos videos muestra el sitio (tres modales). Para permitir más, basta subir este número. */
export const MAX_VIDEOS = 3

export type VideoDB = {
  id: string
  titulo: string
  youtube_id: string
  orden: number
  visible: boolean
  created_at: string
}

/** Lo que necesita el sitio público para dibujar un video. */
export type VideoPublico = {
  id: string
  titulo: string
  youtubeId: string
}

const ID_YOUTUBE = /^[A-Za-z0-9_-]{11}$/

export function esYoutubeId(valor: unknown): valor is string {
  return typeof valor === "string" && ID_YOUTUBE.test(valor)
}

/**
 * Saca el id de un enlace de YouTube. Acepta los formatos que se copian normalmente:
 *   https://www.youtube.com/watch?v=ID   https://youtu.be/ID   https://youtube.com/shorts/ID
 *   https://www.youtube.com/embed/ID     https://www.youtube.com/live/ID
 *   https://www.youtube.com/source/ID/shorts (el enlace que da "Compartir" en algunos Shorts)
 *   (con o sin www., m. o https://)
 * Devuelve null si no es un enlace de YouTube con un id válido.
 * El id se guarda y se usa en el iframe, por eso siempre se valida con el patrón de 11 caracteres.
 */
export function extraerYoutubeId(entrada: string): string | null {
  const texto = entrada.trim()
  if (!texto) return null

  let url: URL
  try {
    url = new URL(/^https?:\/\//i.test(texto) ? texto : `https://${texto}`)
  } catch {
    return null
  }

  const host = url.hostname.toLowerCase().replace(/^(www|m|music)\./, "")
  let id: string | null = null

  if (host === "youtu.be") {
    id = url.pathname.split("/")[1] ?? null
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") {
      id = url.searchParams.get("v")
    } else {
      const [, tipo, resto] = url.pathname.split("/")
      if (["embed", "shorts", "live", "v", "source"].includes(tipo)) id = resto ?? null
    }
  }

  return esYoutubeId(id) ? id : null
}

export function urlYoutube(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`
}

/** Imagen de portada que YouTube genera sola para cada video. */
export function miniaturaYoutube(id: string, tamano: "mq" | "hq" = "hq"): string {
  return `https://i.ytimg.com/vi/${id}/${tamano}default.jpg`
}
