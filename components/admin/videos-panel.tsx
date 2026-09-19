"use client"

import { useCallback, useEffect, useState } from "react"
import { AlertTriangle, ArrowLeft, ArrowRight, Check, ExternalLink, Eye, EyeOff, Loader2, Plus, Trash2 } from "lucide-react"
import { MAX_VIDEOS, miniaturaYoutube, urlYoutube, type VideoDB } from "@/lib/videos"
import { api } from "./api"

const campo =
  "mt-2 w-full rounded-lg bg-slate-50 px-4 py-3 ring-1 ring-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-zinc-950 dark:ring-zinc-800 dark:placeholder:text-zinc-600 dark:focus:ring-yellow-400"
const botones =
  "flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 ring-1 ring-slate-300 transition-colors hover:bg-yellow-400 hover:text-zinc-950 disabled:opacity-30 disabled:hover:bg-slate-100 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-700 dark:disabled:hover:bg-zinc-800"

function ordenar(videos: VideoDB[]) {
  return [...videos].sort((a, b) => a.orden - b.orden || (a.created_at < b.created_at ? -1 : 1))
}

// ─────────────────────────────────────────────────────────────────────────

function TarjetaVideo({
  video,
  primero,
  ultimo,
  onMover,
  onTitulo,
  onEnlace,
  onVisible,
  onEliminar,
}: {
  video: VideoDB
  primero: boolean
  ultimo: boolean
  onMover: (dir: -1 | 1) => void
  onTitulo: (titulo: string) => void
  onEnlace: (url: string) => Promise<boolean>
  onVisible: () => void
  onEliminar: () => void
}) {
  const [titulo, setTitulo] = useState(video.titulo)
  const enlaceActual = urlYoutube(video.youtube_id)
  const [enlace, setEnlace] = useState(enlaceActual)

  async function guardarEnlace() {
    if (enlace.trim() === enlaceActual) return
    const ok = await onEnlace(enlace)
    if (!ok) setEnlace(enlaceActual) // enlace inválido: se vuelve al que estaba
  }

  return (
    <li className="overflow-hidden rounded-xl bg-white ring-1 ring-slate-200 dark:bg-zinc-900 dark:ring-zinc-800">
      <div className="relative aspect-video bg-slate-100 dark:bg-zinc-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={miniaturaYoutube(video.youtube_id)}
          alt={video.titulo || "Video de YouTube"}
          loading="lazy"
          className={`h-full w-full object-cover ${video.visible ? "" : "opacity-40 grayscale"}`}
        />
        {!video.visible && (
          <span className="absolute left-2 top-2 rounded-full bg-zinc-950/80 px-3 py-1 text-xs text-zinc-200">Oculto</span>
        )}
      </div>

      <div className="space-y-3 p-3">
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          onBlur={() => titulo.trim() !== video.titulo && onTitulo(titulo)}
          placeholder="Título del video"
          maxLength={100}
          aria-label="Título del video"
          className="w-full rounded-lg bg-slate-50 px-3 py-2 text-sm ring-1 ring-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-zinc-950 dark:ring-zinc-800 dark:placeholder:text-zinc-600 dark:focus:ring-yellow-400"
        />
        <input
          value={enlace}
          onChange={(e) => setEnlace(e.target.value)}
          onBlur={guardarEnlace}
          placeholder="Enlace de YouTube"
          aria-label="Enlace de YouTube"
          inputMode="url"
          className="w-full rounded-lg bg-slate-50 px-3 py-2 text-xs ring-1 ring-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-zinc-950 dark:ring-zinc-800 dark:placeholder:text-zinc-600 dark:focus:ring-yellow-400"
        />

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => onMover(-1)} disabled={primero} aria-label="Mover antes" className={botones}>
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => onMover(1)} disabled={ultimo} aria-label="Mover después" className={botones}>
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onVisible}
            aria-label={video.visible ? "Ocultar del sitio" : "Mostrar en el sitio"}
            title={video.visible ? "Ocultar del sitio" : "Mostrar en el sitio"}
            className={botones}
          >
            {video.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
          <a
            href={enlaceActual}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir en YouTube"
            title="Abrir en YouTube"
            className={botones}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
          <button type="button" onClick={onEliminar} aria-label="Eliminar video" className={`${botones} ml-auto hover:!bg-red-500 hover:!text-white`}>
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </li>
  )
}

// ─────────────────────────────────────────────────────────────────────────

export function VideosPanel() {
  const [videos, setVideos] = useState<VideoDB[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)

  const [titulo, setTitulo] = useState("")
  const [url, setUrl] = useState("")
  const [agregando, setAgregando] = useState(false)

  const cargar = useCallback(async () => {
    setError(null)
    try {
      const data = await api<{ videos: VideoDB[] }>("/api/admin/videos")
      setVideos(ordenar(data.videos))
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudieron cargar los videos.")
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  const lleno = videos.length >= MAX_VIDEOS

  // Ejecuta una acción; si falla, avisa y recarga la lista real del servidor. Devuelve si salió bien.
  async function accion(fn: () => Promise<unknown>, exito?: string): Promise<boolean> {
    setAviso(null)
    setError(null)
    try {
      await fn()
      if (exito) setAviso(exito)
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : "Algo salió mal.")
      await cargar()
      return false
    }
  }

  const patch = (id: string, body: Record<string, unknown>) =>
    api(`/api/admin/videos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

  const cambiar = (id: string, cambios: Partial<VideoDB>) =>
    setVideos((vs) => vs.map((v) => (v.id === id ? { ...v, ...cambios } : v)))

  async function agregar() {
    setAgregando(true)
    const ok = await accion(async () => {
      await api("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, url }),
      })
      await cargar()
    }, "Video agregado.")
    setAgregando(false)
    if (ok) {
      setTitulo("")
      setUrl("")
    }
  }

  function mover(id: string, dir: -1 | 1) {
    const ids = videos.map((v) => v.id)
    const i = ids.indexOf(id)
    const j = i + dir
    if (i < 0 || j < 0 || j >= ids.length) return
    ;[ids[i], ids[j]] = [ids[j], ids[i]]
    setVideos((vs) => ordenar(vs.map((v) => ({ ...v, orden: ids.indexOf(v.id) }))))
    accion(() =>
      api("/api/admin/videos/orden", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      }),
    )
  }

  function eliminar(v: VideoDB) {
    if (!window.confirm("¿Quitar este video del sitio? El video de YouTube no se borra.")) return
    accion(async () => {
      await api(`/api/admin/videos/${v.id}`, { method: "DELETE" })
      setVideos((vs) => vs.filter((x) => x.id !== v.id))
    }, "Video eliminado.")
  }

  return (
    <div>
      <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 dark:bg-zinc-900 dark:ring-zinc-800">
        <h2 className="text-lg font-light tracking-wide">Agregar video</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
          Pega el enlace de YouTube (botón Compartir del video). El sitio muestra hasta {MAX_VIDEOS} videos; cada uno
          se abre en una ventana con un botón para cotizar por WhatsApp.
        </p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="block text-sm text-slate-700 dark:text-zinc-300">
            Título (opcional)
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              maxLength={100}
              placeholder="Ej.: Matrimonio en Viña del Mar"
              disabled={lleno}
              className={campo}
            />
          </label>
          <label className="block text-sm text-slate-700 dark:text-zinc-300">
            Enlace de YouTube
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              inputMode="url"
              placeholder="https://youtu.be/…"
              disabled={lleno}
              className={campo}
            />
          </label>
        </div>

        <button
          type="button"
          onClick={agregar}
          disabled={lleno || agregando || url.trim() === ""}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-6 py-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-yellow-300 disabled:opacity-50"
        >
          {agregando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          {agregando ? "Agregando…" : "Agregar video"}
        </button>
        {lleno && (
          <p className="mt-3 text-sm text-slate-500 dark:text-zinc-400">
            Ya están los {MAX_VIDEOS} videos. Para agregar otro, elimina uno.
          </p>
        )}
      </section>

      <section className="mt-8">
        <p className="text-sm text-slate-500 dark:text-zinc-400">
          Videos en el sitio ({videos.length} de {MAX_VIDEOS})
        </p>

        {aviso && (
          <p role="status" className="mt-4 flex items-center gap-1.5 text-sm text-green-500">
            <Check className="h-4 w-4" /> {aviso}
          </p>
        )}
        {error && (
          <p role="alert" className="mt-4 flex items-start gap-1.5 text-sm text-red-400">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
          </p>
        )}

        {cargando ? (
          <p className="mt-8 flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Cargando…
          </p>
        ) : videos.length === 0 ? (
          <p className="mt-8 text-sm text-slate-500 dark:text-zinc-400">
            Todavía no hay videos. Mientras no haya ninguno, la sección de videos no aparece en el sitio.
          </p>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v, i) => (
              <TarjetaVideo
                // El enlace forma parte de la key: si cambia, la tarjeta se rearma con el enlace nuevo.
                key={`${v.id}-${v.youtube_id}`}
                video={v}
                primero={i === 0}
                ultimo={i === videos.length - 1}
                onMover={(dir) => mover(v.id, dir)}
                onTitulo={(t) =>
                  accion(async () => {
                    await patch(v.id, { titulo: t })
                    cambiar(v.id, { titulo: t.trim() })
                  }, "Título guardado.")
                }
                onEnlace={(u) =>
                  accion(async () => {
                    await patch(v.id, { url: u })
                    await cargar()
                  }, "Enlace guardado.")
                }
                onVisible={() =>
                  accion(async () => {
                    await patch(v.id, { visible: !v.visible })
                    cambiar(v.id, { visible: !v.visible })
                  }, v.visible ? "Video oculto del sitio." : "Video visible en el sitio.")
                }
                onEliminar={() => eliminar(v)}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
