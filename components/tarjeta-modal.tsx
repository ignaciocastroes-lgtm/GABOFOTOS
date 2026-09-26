"use client"

import { useCallback, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { Download, X } from "lucide-react"
import Image from "next/image"
import { siteConfig, whatsappMessageLink } from "@/lib/site-config"
import { WhatsAppIcon } from "./icons"

type TarjetaModalProps = {
  open: boolean
  onClose: () => void
}

// vCard con los datos de contacto de Gabo: el botón «Guardar contacto» descarga este archivo, y el
// celular (Android o iPhone) lo reconoce y ofrece agregarlo directo a la agenda.
function tarjetaVcf() {
  const lineas = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${siteConfig.owner.split(" ").reverse().join(";")};;;`,
    `FN:${siteConfig.owner}`,
    "ORG:GABOFOTOS",
    "TITLE:Fotógrafo profesional",
    `TEL;TYPE=CELL,VOICE:${siteConfig.phone.tel}`,
    `EMAIL:${siteConfig.email}`,
    `URL:${siteConfig.url}`,
    `ADR;TYPE=WORK:;;${siteConfig.location};;;;`,
    "END:VCARD",
  ]
  return lineas.join("\r\n")
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

  const guardarContacto = useCallback(() => {
    const blob = new Blob([tarjetaVcf()], { type: "text/vcard;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "gabofotos.vcf"
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }, [])

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

        {/* En el celular, descarga el .vcf y el sistema ofrece agregarlo a los Contactos.
            En cualquier equipo, wa.me abre WhatsApp (la app si está instalada, o WhatsApp Web). */}
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={guardarContacto}
            className="inline-flex items-center gap-2 rounded-full bg-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            <Download className="h-4 w-4" />
            Guardar contacto
          </button>
          <a
            href={whatsappMessageLink("Hola Gabriel, vengo de tu tarjeta de contacto y quisiera conversar.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Escribir por WhatsApp
          </a>
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
