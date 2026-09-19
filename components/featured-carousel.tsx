"use client"

import { useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { GalleryPhoto } from "@/lib/gallery"

const arrowClass =
  "absolute top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-950/70 text-zinc-100 ring-1 ring-zinc-700 backdrop-blur-sm transition-colors hover:bg-yellow-400 hover:text-zinc-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 sm:flex"

export function FeaturedCarousel({ photos }: { photos: GalleryPhoto[] }) {
  const scroller = useRef<HTMLDivElement>(null)

  function scrollPage(direction: 1 | -1) {
    const element = scroller.current
    if (!element) return
    element.scrollBy({ left: direction * element.clientWidth * 0.8, behavior: "smooth" })
  }

  return (
    <div className="relative">
      <div
        ref={scroller}
        role="region"
        aria-label="Muestra de trabajos"
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((photo) => (
          <figure
            key={photo.id}
            style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
            className="group h-72 shrink-0 snap-start overflow-hidden rounded-lg bg-slate-200 ring-1 ring-slate-300 sm:h-96 dark:bg-zinc-900 dark:ring-zinc-800"
          >
            <Image
              src={photo.src}
              alt={photo.alt || "Fotografía de GABOFOTOS"}
              width={photo.width}
              height={photo.height}
              sizes="(min-width: 640px) 384px, 288px"
              // Las fotos remotas (Supabase, Flickr) ya vienen redimensionadas desde su CDN.
              unoptimized={photo.remote}
              className="h-full w-full object-cover bn-con-mouse transition-all duration-500 group-hover:scale-105"
            />
          </figure>
        ))}
      </div>

      <button type="button" aria-label="Fotos anteriores" onClick={() => scrollPage(-1)} className={`left-2 ${arrowClass}`}>
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button type="button" aria-label="Fotos siguientes" onClick={() => scrollPage(1)} className={`right-2 ${arrowClass}`}>
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}
