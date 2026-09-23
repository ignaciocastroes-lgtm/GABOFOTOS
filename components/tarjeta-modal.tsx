"use client"

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import Image from "next/image"

type TarjetaModalProps = {
  open: boolean
  onClose: () => void
}

/** Tarjeta de contacto de Gabo, en grande. Se abre tocando 3 veces el logo (ver logo-secreto.tsx). */
export function TarjetaModal({ open, onClose }: TarjetaModalProps) {
  const cerrar = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    cerrar.current?.focus()
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  if (!open || typeof document === "undefined") return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Tarjeta de contacto de GABOFOTOS"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-zinc-950/95 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div className="relative w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="overflow-hidden rounded-xl ring-1 ring-zinc-800 shadow-2xl">
          <Image
            src="/images/gabofotos-tarjeta.jpg"
            alt="Tarjeta de contacto de GABOFOTOS: Gabriel Cabezas Salgado, fotógrafo profesional. Teléfono +569 9672 9209, correos gabofotoss@gmail.com y gabofotosss@gmail.com, Santiago, Chile, www.gabofotos.cl, Instagram @gabofotoss y @gabofotos_corp, Flickr flickr.com/gcabezasplop"
            width={1050}
            height={600}
            sizes="(min-width: 640px) 32rem, 90vw"
            className="h-auto w-full"
          />
        </div>
        <button
          ref={cerrar}
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute -top-3 -right-3 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-zinc-950 shadow-lg transition-colors hover:bg-yellow-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>,
    document.body,
  )
}
