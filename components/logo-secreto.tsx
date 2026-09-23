"use client"

import { useCallback, useRef, useState, type ReactNode } from "react"
import { TarjetaModal } from "./tarjeta-modal"

// 3 toques al logo, en menos de 1.2s entre uno y el siguiente, abren la tarjeta de contacto.
const TOQUES = 3
const VENTANA_MS = 1200

type LogoSecretoProps = {
  children: ReactNode
  className?: string
}

/**
 * Envuelve cualquier logo de GABOFOTOS del sitio (navbar, «Conoce a Gabriel»…): tocarlo 3 veces
 * seguidas abre la tarjeta de contacto en grande, sin cambiar lo que el logo ya hace (ej. ir al
 * inicio). No es un <button> a propósito: si el logo ya es un enlace o un botón, este solo
 * escucha el click sin agregar otro elemento interactivo anidado.
 */
export function LogoSecreto({ children, className }: LogoSecretoProps) {
  const [open, setOpen] = useState(false)
  const toques = useRef(0)
  const ultimo = useRef(0)

  const onClickCapture = useCallback(() => {
    const ahora = Date.now()
    toques.current = ahora - ultimo.current > VENTANA_MS ? 1 : toques.current + 1
    ultimo.current = ahora
    if (toques.current >= TOQUES) {
      toques.current = 0
      setOpen(true)
    }
  }, [])

  return (
    <>
      <span onClickCapture={onClickCapture} className={className}>
        {children}
      </span>
      <TarjetaModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
