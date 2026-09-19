"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ExternalLink, Play, X } from "lucide-react"
import { whatsappMessageLink } from "@/lib/site-config"
import { miniaturaYoutube, urlYoutube, type VideoPublico } from "@/lib/videos"
import { WhatsAppIcon } from "./icons"

function mensajeWhatsapp(video: VideoPublico) {
  const titulo = video.titulo.trim()
  return titulo
    ? `Hola Gabriel, vi el video "${titulo}" en tu sitio web y me gustaría cotizar algo así.`
    : "Hola Gabriel, vi uno de los videos de tu sitio web y me gustaría cotizar algo así."
}

function VideoModal({ video, onClose }: { video: VideoPublico; onClose: () => void }) {
  const cerrar = useRef<HTMLButtonElement>(null)
  const titulo = video.titulo.trim() || "Video"

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKeyDown)
    document.body.style.overflow = "hidden"
    cerrar.current?.focus()

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Video: ${titulo}`}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
    >
      <button
        type="button"
        aria-label="Cerrar video"
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950/85 backdrop-blur-sm"
      />

      <div className="relative flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-y-auto rounded-xl bg-zinc-900 shadow-2xl ring-1 ring-zinc-800">
        <header className="flex items-start justify-between gap-4 border-b border-zinc-800 px-5 py-4">
          <div>
            <span className="mb-2 inline-block h-0.5 w-10 bg-yellow-400" />
            <h2 className="text-xl font-light tracking-wide text-zinc-50">{titulo}</h2>
          </div>
          <button
            ref={cerrar}
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-100 ring-1 ring-zinc-700 transition-colors hover:bg-yellow-400 hover:text-zinc-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* El video empieza solo (el toque que abrió la ventana cuenta como permiso) y se detiene al cerrar. */}
        <div className="aspect-video w-full shrink-0 bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&playsinline=1`}
            title={titulo}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="h-full w-full border-0"
          />
        </div>

        <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-400">¿Quieres algo así para tu evento? Cuéntale a Gabo por WhatsApp.</p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={whatsappMessageLink(mensajeWhatsapp(video))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-green-900/30 transition-colors hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Cotizar por WhatsApp
            </a>
            <a
              href={urlYoutube(video.youtubeId)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-zinc-300 transition-colors hover:text-yellow-400"
            >
              Ver en YouTube
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Sección «Videos» del inicio: una tarjeta por video; cada una abre su ventana con el video y el botón a WhatsApp. */
export function VideoTunnel({ videos }: { videos: VideoPublico[] }) {
  const [activoId, setActivoId] = useState<string | null>(null)
  const activo = videos.find((v) => v.id === activoId) ?? null
  const cerrar = useCallback(() => setActivoId(null), [])

  return (
    <section id="videos" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-16 sm:py-24">
      <p className="text-xs tracking-[0.3em] text-yellow-700 dark:text-yellow-400">VIDEOS</p>
      <h2 className="mt-2 text-3xl font-light tracking-tight text-slate-900 transition-colors duration-300 dark:text-zinc-50 sm:text-4xl">
        Míralo en movimiento
      </h2>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video, index) => {
          const titulo = video.titulo.trim() || `Video ${index + 1}`
          return (
            <li key={video.id}>
              <button
                type="button"
                onClick={() => setActivoId(video.id)}
                aria-label={`Ver video: ${titulo}`}
                className="group relative block aspect-video w-full overflow-hidden rounded-lg bg-slate-200 text-left ring-1 ring-slate-300 transition-all duration-300 hover:ring-yellow-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 dark:bg-zinc-900 dark:ring-zinc-800"
              >
                {/* <img> a propósito: la portada la sirve YouTube (i.ytimg.com), sin pasar por el optimizador de Vercel. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={miniaturaYoutube(video.youtubeId)}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover bn-con-mouse transition-all duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/30 to-transparent" />
                <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-yellow-400 text-zinc-950 shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <Play className="ml-0.5 h-6 w-6 fill-current" aria-hidden="true" />
                </span>
                <span className="absolute inset-x-0 bottom-0 p-4 text-base font-light tracking-wide text-zinc-50">
                  {titulo}
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      {activo && <VideoModal video={activo} onClose={cerrar} />}
    </section>
  )
}
