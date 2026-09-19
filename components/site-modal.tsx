"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

type SiteModalProps = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  /** Barra fija al pie de la ventana (siempre visible, también en el celular). */
  footer?: ReactNode
}

/** Ventana grande del sitio: fondo oscuro, cabecera con título y X, y contenido con scroll propio. */
export function SiteModal({ open, onClose, title, children, footer }: SiteModalProps) {
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
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/95 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative flex h-[92dvh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-zinc-950 ring-1 ring-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-4 border-b border-zinc-800 px-5 py-4 sm:px-6">
          <div>
            <p className="text-[0.65rem] tracking-[0.3em] text-yellow-400">GABOFOTOS</p>
            <h2 className="text-lg font-light tracking-wide text-zinc-100">{title}</h2>
          </div>
          <button
            ref={cerrar}
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-zinc-300 ring-1 ring-zinc-700 transition-colors hover:bg-white hover:text-zinc-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">{children}</div>

        {footer && <div className="border-t border-zinc-800 bg-zinc-950 px-5 py-3 sm:px-6">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
