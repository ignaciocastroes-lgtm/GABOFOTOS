"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
import { galleryCategories } from "@/lib/gallery"
import { GalleryModal } from "./gallery-modal"

export function CategoryGrid() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const activeCategory = galleryCategories.find((category) => category.id === activeId) ?? null
  const handleClose = useCallback(() => setActiveId(null), [])

  return (
    <section className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <div className="mb-14 flex items-end justify-between">
        <div>
          <p className="text-xs tracking-[0.3em] text-yellow-700 dark:text-yellow-400">CATEGORÍAS</p>
          <h2 className="mt-2 text-3xl font-light tracking-tight text-slate-900 transition-colors duration-300 dark:text-zinc-50 sm:text-4xl">
            Elige tu momento
          </h2>
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {galleryCategories.map((category) => (
          <button
            key={category.id}
            id={category.id}
            type="button"
            onClick={() => setActiveId(category.id)}
            className="group relative flex min-h-[26rem] scroll-mt-24 flex-col justify-end overflow-hidden rounded-lg bg-slate-200 text-left ring-1 ring-slate-300 transition-all duration-300 hover:ring-yellow-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 dark:bg-zinc-900 dark:ring-zinc-800"
          >
            <div className="absolute inset-0">
              {category.cover ? (
                <Image
                  src={category.cover}
                  alt={`Portada de ${category.title}`}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  style={{ objectPosition: category.coverPosition }}
                  className="object-cover opacity-70 grayscale bn-con-mouse transition-all duration-500 ease-out group-hover:scale-105 group-hover:opacity-90 group-hover:grayscale-0"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
            </div>

            <div className="relative z-10 p-6">
              <span className="mb-3 inline-block h-0.5 w-10 bg-yellow-400 transition-all duration-300 group-hover:w-16" />
              <h3 className="text-2xl font-light tracking-wide text-zinc-50">{category.title}</h3>
              <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-zinc-300">
                {category.items.map((item, index) => (
                  <li key={item} className="flex items-center gap-3">
                    {index > 0 && <span className="text-yellow-400">·</span>}
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </button>
        ))}
      </div>

      <GalleryModal
        open={activeCategory !== null}
        categoria={activeCategory?.id ?? null}
        title={activeCategory?.title ?? ""}
        subtitle={activeCategory?.items.join(" · ")}
        onClose={handleClose}
      />
    </section>
  )
}
