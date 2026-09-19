/**
 * Noticias del club: partidos, notas, videos y publicaciones de Instagram.
 *
 * Los datos viven en Supabase (tabla `noticias`), no en este archivo — acá
 * solo están los tipos y las funciones puras para filtrar y ordenar. Se
 * pasó de un arreglo estático a una base de datos real porque la fricción
 * de "cada publicación necesita que alguien pegue código y despliegue" no
 * calzaba con querer publicar sin depender de un desarrollador cada vez.
 * Ver README, sección "Noticias con base de datos", para el porqué completo
 * y cómo configurar el proyecto de Supabase.
 */

import { cache } from 'react'

// ─────────────────────────────────────────────────────────────────────────
// Partidos — formato ardi:partido, tal como lo entrega la mesa de control
// ─────────────────────────────────────────────────────────────────────────

export type TarjetaAmonestacion = {
  tipo: 'blue' | 'yellow' | 'red'
  dorsal: string
  banca: boolean
}

export type Goleador = { minuto: string; dorsal: string }

export type EquipoPartido = {
  nombre: string
  /** URL del escudo. Vacío si no se tiene el del rival. */
  escudo: string
  goles: number
  penales: number
  faltas: number
  posesionSeg: number
  posesionPct: number
  goleadores: Goleador[]
  tarjetas: TarjetaAmonestacion[]
}

export type EventoCronologia = {
  minuto: string
  periodo: string
  equipo: 'local' | 'visita' | null
  texto: string
  /**
   * Gol anulado por el árbitro. Ya está descontado del marcador en
   * `goles` — nunca sumarlo de nuevo. Se muestra tachado en la crónica.
   */
  anulado: boolean
}

export type Partido = {
  formato: 'ardi:partido'
  version: number
  /** Estable (fecha + equipos). Es la clave: pegar el mismo id reemplaza, no duplica. */
  id: string
  fecha: string
  hora: string
  estadio: string
  campeonato: string
  /** Texto libre, tal como lo entrega ARDI (ej. "Sub-15 Fem"). No una lista fija. */
  serie: string
  rama: string
  local: EquipoPartido
  visita: EquipoPartido
  ganador: 'local' | 'visita' | 'empate'
  hubopenales: boolean
  parciales: { periodo: string; local: number; visita: number }[]
  duracionRealSeg: number
  cronologia: EventoCronologia[]
}

// ─────────────────────────────────────────────────────────────────────────
// Noticia — envoltorio común para partidos, notas y videos
// ─────────────────────────────────────────────────────────────────────────

export type NoticiaComun = {
  id: string
  fecha: string // ISO yyyy-mm-dd, para ordenar
  /** Aparece en el bloque destacado de la portada. */
  destacada?: boolean
  /** ids de SERIES (lib/club.ts) a los que aplica. */
  series?: string[]
  /** ids de CUERPO_TECNICO (lib/club.ts) a los que aplica. */
  profesores?: string[]
  /** Aplica a la escuelita municipal, no a una serie federada. */
  escuelita?: boolean
}

export type NoticiaPartido = NoticiaComun & {
  tipo: 'partido'
  partido: Partido
}

export type NoticiaNota = NoticiaComun & {
  tipo: 'nota'
  titulo: string
  resumen: string
  /** Párrafos del cuerpo. */
  cuerpo: string[]
  fotos: { src: string; alt: string }[]
  /** Si hay más fotos de las que se muestran, el link a la publicación completa. */
  masFotosUrl?: string
  /** Link externo relevante (el sitio de un auspiciador, por ejemplo). */
  enlaceExterno?: { label: string; url: string }
  /** Si la nota invita a coordinar algo con un profesor, qué profesor y con qué mensaje. */
  contactoInvitacion?: { profesorId: string; mensaje: string }
}

export type NoticiaVideo = NoticiaComun & {
  tipo: 'video'
  titulo: string
  resumen: string
  /** Solo el ID de YouTube (los 11 caracteres), no la URL completa. */
  youtubeId: string
}

export type NoticiaInstagram = NoticiaComun & {
  tipo: 'instagram'
  titulo: string
  resumen: string
  /** El link completo a la publicación: https://www.instagram.com/p/XXXX/ */
  url: string
}

export type Noticia = NoticiaPartido | NoticiaNota | NoticiaVideo | NoticiaInstagram


// ─────────────────────────────────────────────────────────────────────────
// Utilidades
// ─────────────────────────────────────────────────────────────────────────

export function ordenarPorFecha(lista: Noticia[]): Noticia[] {
  return [...lista].sort((a, b) => (a.fecha < b.fecha ? 1 : -1))
}

export function noticiasDeSerie(noticias: Noticia[], id: string): Noticia[] {
  return ordenarPorFecha(noticias.filter((n) => n.series?.includes(id)))
}

export function noticiasDeProfesor(noticias: Noticia[], id: string): Noticia[] {
  return ordenarPorFecha(noticias.filter((n) => n.profesores?.includes(id)))
}

export function noticiasDeEscuelita(noticias: Noticia[]): Noticia[] {
  return ordenarPorFecha(noticias.filter((n) => n.escuelita))
}

export function noticiasDestacadas(noticias: Noticia[], limite = 4): Noticia[] {
  return ordenarPorFecha(noticias.filter((n) => n.destacada)).slice(0, limite)
}

/**
 * Las series de partidos que existen en los datos, tal como las entregó ARDI
 * (texto libre). No es lib/club.ts SERIES: el club puede crear series nuevas
 * y el filtro debe seguir funcionando sin tocar código.
 */
export function seriesDePartidosEnDatos(noticias: Noticia[]): string[] {
  const set = new Set<string>()
  for (const n of noticias) if (n.tipo === 'partido') set.add(n.partido.serie)
  return Array.from(set).sort()
}

/**
 * Un evento de cronología ya normalizado para mostrar: el gol anulado y su
 * explicación fusionados en una sola línea, en vez de las dos que entrega el
 * matchLog crudo de ARDI.
 */
export type EventoCronologiaMostrado = EventoCronologia & { notaAnulacion?: string }

/**
 * ARDI registra un gol anulado en DOS líneas seguidas con el mismo minuto:
 * una con `texto: 'Gol'` y `anulado: true`, y otra informativa con
 * `texto: 'GOL ANULADO por el árbitro (#20)'` y `anulado: false`. Mostradas
 * tal cual, se ven como dos eventos distintos — uno tachado y el de al lado
 * sin tachar — cuando en realidad describen el mismo hecho.
 *
 * Esta función las fusiona: la línea del gol queda tachada (`anulado: true`)
 * y el texto de la segunda línea pasa a ser su nota explicativa, sin
 * aparecer como una entrada aparte en la cronología.
 */
/**
 * ARDI registra un gol anulado en DOS líneas seguidas con el mismo minuto:
 * una del gol (texto: 'Gol') y otra informativa con el motivo
 * (texto: 'GOL ANULADO por el árbitro (#20)'). Mostradas tal cual, se ven
 * como dos eventos distintos cuando describen el mismo hecho.
 *
 * La detección se apoya en el texto de la segunda línea (que sí es
 * confiable: siempre dice "ANULADO"), no en que la primera ya venga con
 * `anulado: true` — así funciona aunque ese campo llegue en cualquier
 * estado desde ARDI. La línea del gol queda tachada y el texto de la
 * segunda pasa a ser su nota explicativa, sin aparecer como entrada aparte.
 */
export function fusionarCronologia(cronologia: EventoCronologia[]): EventoCronologiaMostrado[] {
  const resultado: EventoCronologiaMostrado[] = []

  for (let i = 0; i < cronologia.length; i++) {
    const actual = cronologia[i]
    const siguiente = cronologia[i + 1]

    const esParDeAnulacion =
      siguiente &&
      siguiente.minuto === actual.minuto &&
      siguiente.equipo === actual.equipo &&
      /anulad/i.test(siguiente.texto) &&
      !/anulad/i.test(actual.texto)

    if (esParDeAnulacion) {
      resultado.push({ ...actual, anulado: true, notaAnulacion: siguiente.texto })
      i++ // saltar la línea explicativa: ya quedó fusionada arriba
      continue
    }

    resultado.push(actual)
  }

  return resultado
}

// ─────────────────────────────────────────────────────────────────────────
// Lectura desde la base de datos (server-only)
// ─────────────────────────────────────────────────────────────────────────

/**
 * Trae todas las noticias, ordenadas por fecha descendente.
 *
 * Server-only: usa el cliente de Supabase con la llave de service role
 * (lib/supabase/server.ts), que nunca debe llegar al navegador. Por eso
 * esta función solo se llama desde Server Components (páginas) — nunca
 * desde un componente 'use client'. El panel de admin, que sí corre en el
 * navegador, usa /api/noticias en su lugar.
 *
 * Si Supabase no responde (por ejemplo, si las variables de entorno no
 * están configuradas todavía), devuelve un arreglo vacío en vez de romper
 * la página — el sitio sigue funcionando, solo sin noticias.
 */
export const obtenerNoticias = cache(async (): Promise<Noticia[]> => {
  try {
    const { createServiceClient } = await import('./supabase/server')
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('noticias')
      .select('data')
      .order('fecha', { ascending: false })

    if (error) {
      console.error('[obtenerNoticias]', error)
      return []
    }

    return (data ?? []).map((fila) => fila.data as Noticia)
  } catch (e) {
    console.error('[obtenerNoticias]', e)
    return []
  }
})
