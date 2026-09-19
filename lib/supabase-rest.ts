// Cliente mínimo de Supabase (base de datos + Storage) usando solo fetch.
//
// A propósito NO usa @supabase/supabase-js: agregar una dependencia obliga a regenerar
// pnpm-lock.yaml, y Vercel corre `pnpm install --frozen-lockfile` y aborta el deploy si el
// lockfile no calza con package.json. Con fetch no hay nada que sincronizar.
//
// Solo para código de servidor: usa la llave secreta (SUPABASE_SERVICE_ROLE_KEY).

import { esUuid, type CategoriaFoto, type FotoDB } from "./fotos"
import type { VideoDB } from "./videos"

const BUCKET = "fotos"

function config() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "")
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.")
  return { url, key }
}

function cabeceras(key: string, extra: Record<string, string> = {}) {
  const h: Record<string, string> = { apikey: key, ...extra }
  // Las llaves antiguas (service_role) son JWT y van también como Bearer; las nuevas (sb_secret_…) no.
  if (key.startsWith("eyJ")) h.Authorization = `Bearer ${key}`
  return h
}

type Opciones = {
  method?: string
  headers?: Record<string, string>
  body?: BodyInit | null
  cache?: RequestCache
  next?: { revalidate?: number }
}

async function pedir(ruta: string, opciones: Opciones = {}): Promise<Response> {
  const { url, key } = config()
  const { headers, ...resto } = opciones
  const res = await fetch(`${url}${ruta}`, { ...resto, headers: cabeceras(key, headers) } as RequestInit)
  if (!res.ok) {
    let mensaje = `Supabase respondió ${res.status}`
    try {
      const d = await res.json()
      mensaje = d.message ?? d.error ?? mensaje
    } catch {}
    throw new Error(mensaje)
  }
  return res
}

const JSON_H = { "Content-Type": "application/json" }

// ── Tabla `fotos` ───────────────────────────────────────────────────────────

export async function listarFotos(
  opts: { categoria?: CategoriaFoto; soloVisibles?: boolean; revalidate?: number } = {},
): Promise<FotoDB[]> {
  const q = new URLSearchParams({ select: "*", order: "orden.asc,created_at.desc" })
  if (opts.categoria) q.set("categoria", `eq.${opts.categoria}`)
  if (opts.soloVisibles) q.set("visible", "eq.true")
  const res = await pedir(
    `/rest/v1/fotos?${q}`,
    opts.revalidate ? { next: { revalidate: opts.revalidate } } : { cache: "no-store" },
  )
  return (await res.json()) as FotoDB[]
}

export async function obtenerFoto(id: string): Promise<FotoDB | null> {
  if (!esUuid(id)) return null
  const res = await pedir(`/rest/v1/fotos?select=*&id=eq.${id}&limit=1`, { cache: "no-store" })
  return ((await res.json()) as FotoDB[])[0] ?? null
}

/** Menor `orden` de la categoría (para poner la foto nueva primero). null si no hay fotos. */
export async function menorOrden(categoria: CategoriaFoto): Promise<number | null> {
  const q = new URLSearchParams({ select: "orden", categoria: `eq.${categoria}`, order: "orden.asc", limit: "1" })
  const res = await pedir(`/rest/v1/fotos?${q}`, { cache: "no-store" })
  const filas = (await res.json()) as { orden: number }[]
  return filas[0]?.orden ?? null
}

export async function insertarFoto(fila: Omit<FotoDB, "created_at">): Promise<FotoDB> {
  const res = await pedir("/rest/v1/fotos", {
    method: "POST",
    headers: { ...JSON_H, Prefer: "return=representation" },
    body: JSON.stringify(fila),
    cache: "no-store",
  })
  return ((await res.json()) as FotoDB[])[0]
}

export type CambiosFoto = Partial<Pick<FotoDB, "alt" | "visible" | "categoria" | "autorizado" | "orden">>

export async function actualizarFoto(id: string, cambios: CambiosFoto): Promise<FotoDB | null> {
  if (!esUuid(id)) return null
  const res = await pedir(`/rest/v1/fotos?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...JSON_H, Prefer: "return=representation" },
    body: JSON.stringify(cambios),
    cache: "no-store",
  })
  return ((await res.json()) as FotoDB[])[0] ?? null
}

export async function borrarFoto(id: string): Promise<void> {
  if (!esUuid(id)) return
  await pedir(`/rest/v1/fotos?id=eq.${id}`, { method: "DELETE", cache: "no-store" })
}

// ── Tabla `videos` ──────────────────────────────────────────────────────────

export async function listarVideos(
  opts: { soloVisibles?: boolean; revalidate?: number } = {},
): Promise<VideoDB[]> {
  const q = new URLSearchParams({ select: "*", order: "orden.asc,created_at.asc" })
  if (opts.soloVisibles) q.set("visible", "eq.true")
  const res = await pedir(
    `/rest/v1/videos?${q}`,
    opts.revalidate ? { next: { revalidate: opts.revalidate } } : { cache: "no-store" },
  )
  return (await res.json()) as VideoDB[]
}

export async function insertarVideo(fila: Omit<VideoDB, "created_at">): Promise<VideoDB> {
  const res = await pedir("/rest/v1/videos", {
    method: "POST",
    headers: { ...JSON_H, Prefer: "return=representation" },
    body: JSON.stringify(fila),
    cache: "no-store",
  })
  return ((await res.json()) as VideoDB[])[0]
}

export type CambiosVideo = Partial<Pick<VideoDB, "titulo" | "youtube_id" | "visible" | "orden">>

export async function actualizarVideo(id: string, cambios: CambiosVideo): Promise<VideoDB | null> {
  if (!esUuid(id)) return null
  const res = await pedir(`/rest/v1/videos?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...JSON_H, Prefer: "return=representation" },
    body: JSON.stringify(cambios),
    cache: "no-store",
  })
  return ((await res.json()) as VideoDB[])[0] ?? null
}

export async function borrarVideo(id: string): Promise<void> {
  if (!esUuid(id)) return
  await pedir(`/rest/v1/videos?id=eq.${id}`, { method: "DELETE", cache: "no-store" })
}

// ── Storage ─────────────────────────────────────────────────────────────────

export function urlPublica(path: string): string {
  const { url } = config()
  return `${url}/storage/v1/object/public/${BUCKET}/${path}`
}

export async function subirObjeto(path: string, contenido: Uint8Array, tipo: string): Promise<void> {
  await pedir(`/storage/v1/object/${BUCKET}/${path}`, {
    method: "POST",
    headers: { "Content-Type": tipo, "cache-control": "max-age=31536000", "x-upsert": "false" },
    body: contenido as unknown as BodyInit,
    cache: "no-store",
  })
}

export async function borrarObjeto(path: string): Promise<void> {
  await pedir(`/storage/v1/object/${BUCKET}/${path}`, { method: "DELETE", cache: "no-store" })
}
