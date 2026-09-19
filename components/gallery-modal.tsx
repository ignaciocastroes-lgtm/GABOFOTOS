"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ExternalLink, X } from "lucide-react"
import type { GalleryPhoto, GalleryResponse } from "@/lib/gallery"
import { siteConfig } from "@/lib/site-config"

type GalleryModalProps = {
  open: boolean
  categoria: string | null
  title: string
  subtitle?: string
  onClose: () => void
}

// Skeleton tiles with varied heights so the placeholder mosaic mirrors
// the real masonry layout while data is loading.
const SKELETON_HEIGHTS = [220, 320, 260, 380, 240, 300, 200, 340, 280]

export function GalleryModal({ open, categoria, title, subtitle, onClose }: GalleryModalProps) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [albums, setAlbums] = useState<GalleryResponse["albums"]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open || !categoria) return

    const controller = new AbortController()

    async function loadPhotos() {
      setLoading(true)
      setError(null)
      setPhotos([])

      try {
        const response = await fetch(`/api/galeria/${categoria}`, {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`La galería no está disponible (${response.status}).`)
        }
        const data = (await response.json()) as GalleryResponse
        setPhotos(data.photos)
        setAlbums(data.albums)
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return
        setError("No pudimos cargar las imágenes. Inténtalo nuevamente.")
      } finally {
        setLoading(false)
      }
    }

    loadPhotos()

    return () => controller.abort()
  }, [open, categoria])

  if (!open) return null

  const isEmpty = !loading && !error && photos.length === 0

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Galería de ${title}`}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
    >
      {/* Translucent dark backdrop */}
      <button
        type="button"
        aria-label="Cerrar galería"
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
      />

      {/* Modal panel — 90% of the screen */}
      <div className="relative flex h-[90vh] w-[90vw] flex-col overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-zinc-800 shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-zinc-800 px-6 py-5">
          <div>
            <span className="mb-2 inline-block h-0.5 w-10 bg-yellow-400" />
            <h2 className="text-2xl font-light tracking-wide text-zinc-50">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-100 ring-1 ring-zinc-700 transition-colors hover:bg-yellow-400 hover:text-zinc-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Loading: skeleton masonry */}
          {loading && (
            <div aria-hidden="true" className="columns-1 gap-4 sm:columns-2 lg:columns-3">
              {SKELETON_HEIGHTS.map((height, index) => (
                <div
                  key={index}
                  className="mb-4 animate-pulse break-inside-avoid rounded-lg bg-zinc-800"
                  style={{ height }}
                />
              ))}
            </div>
          )}

          {/* Accessible loading label */}
          {loading && (
            <p className="mt-2 text-center text-sm text-zinc-400" role="status" aria-live="polite">
              Cargando…
            </p>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="max-w-sm text-sm text-zinc-400">{error}</p>
              <span className="h-0.5 w-10 bg-yellow-400" />
            </div>
          )}

          {/* Sin fotos todavía en esta categoría */}
          {isEmpty && (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="max-w-sm text-sm text-zinc-400">
                Estamos actualizando esta galería. Mientras tanto, puedes ver todo el trabajo de
                Gabo en Flickr.
              </p>
              <span className="h-0.5 w-10 bg-yellow-400" />
            </div>
          )}

          {/* Loaded: masonry grid — 1 col mobile, 2 tablet, 3 desktop */}
          {!loading && !error && photos.length > 0 && (
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
              {photos.map((photo) => {
                const image = (
                  <Image
                    src={photo.src}
                    alt={photo.alt || `Fotografía de ${title} por GABOFOTOS`}
                    width={photo.width}
                    height={photo.height}
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                    // Las fotos remotas (Supabase, Flickr) ya vienen redimensionadas desde su CDN.
                    unoptimized={photo.remote}
                    className="h-auto w-full object-cover grayscale bn-con-mouse transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                  />
                )

                return (
                  <figure
                    key={photo.id}
                    className="group mb-4 break-inside-avoid overflow-hidden rounded-lg bg-zinc-800 ring-1 ring-zinc-800 transition-all duration-300 hover:ring-yellow-400"
                  >
                    {photo.href ? (
                      <a
                        href={photo.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Ver esta foto en Flickr"
                        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                      >
                        {image}
                      </a>
                    ) : (
                      image
                    )}
                  </figure>
                )
              })}
            </div>
          )}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-zinc-800 px-6 py-4 text-sm">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {albums.length > 0 && <span className="text-zinc-400">Álbumes en Flickr:</span>}
            {albums.map((album) => (
              <a
                key={album.url}
                href={album.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 transition-colors hover:text-yellow-400"
              >
                {album.title}
              </a>
            ))}
          </div>
          <a
            href={siteConfig.social.flickr.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-yellow-400 transition-colors hover:text-yellow-300"
          >
            Ver todo en Flickr
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </footer>
      </div>
    </div>
  )
}
