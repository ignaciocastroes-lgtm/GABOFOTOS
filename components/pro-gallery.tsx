"use client"

import { useState } from "react"
import Image from "next/image"
import { proPhotos, type ProPhoto } from "@/lib/pro-gallery"
import { siteConfig, whatsappMessageLink } from "@/lib/site-config"
import { InstagramIcon, WhatsAppIcon } from "./icons"

function messageFor(photo: ProPhoto) {
  return `Hola Gabriel, vi esta foto en tu sitio y me gustaría que me asesores: ${siteConfig.url}${photo.src}`
}

export function ProGallery() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  function toggle(id: string) {
    setCopied(false)
    setActiveId((current) => (current === id ? null : id))
  }

  // Instagram no permite precargar texto: se copia el mensaje para pegarlo en el chat.
  function copyMessage(photo: ProPhoto) {
    navigator.clipboard
      ?.writeText(messageFor(photo))
      .then(() => setCopied(true))
      .catch(() => {})
  }

  return (
    <section aria-labelledby="galeria-gabo">
      <p id="galeria-gabo" className="text-xs tracking-[0.3em] text-zinc-400">
        GABO EN ACCIÓN
      </p>
      <p className="mb-4 mt-2 text-sm text-zinc-400">
        Toca una foto para verla a color y consultar por WhatsApp o Instagram.
      </p>

      <div className="columns-2 gap-3 lg:columns-3">
        {proPhotos.map((photo) => {
          const active = photo.id === activeId
          return (
            <figure
              key={photo.id}
              className={`relative mb-3 break-inside-avoid overflow-hidden rounded-lg bg-zinc-900 ring-1 transition-colors duration-300 ${
                active ? "ring-yellow-400" : "ring-zinc-800"
              }`}
            >
              <button
                type="button"
                aria-pressed={active}
                onClick={() => toggle(photo.id)}
                className="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-yellow-400"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes="(min-width: 1024px) 30vw, 45vw"
                  className={`h-auto w-full object-cover transition-[filter] duration-500 ${
                    active ? "grayscale-0" : "grayscale"
                  }`}
                />
              </button>

              {active && (
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-zinc-950 via-zinc-950/85 to-transparent p-3 pt-14">
                  <p className="text-xs text-zinc-200">{photo.caption}</p>
                  <a
                    href={whatsappMessageLink(messageFor(photo))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
                  >
                    <WhatsAppIcon className="h-3.5 w-3.5" />
                    Asesórame
                  </a>
                  <a
                    href={siteConfig.social.instagram.dm}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => copyMessage(photo)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-800 px-3 py-2 text-xs font-medium text-zinc-100 ring-1 ring-zinc-700 transition-colors hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                  >
                    <InstagramIcon className="h-3.5 w-3.5 text-yellow-400" />
                    Instagram
                  </a>
                  {copied && (
                    <p role="status" className="text-[0.7rem] leading-snug text-zinc-400">
                      Copiamos el mensaje: pégalo en el chat.
                    </p>
                  )}
                </div>
              )}
            </figure>
          )
        })}
      </div>
    </section>
  )
}
