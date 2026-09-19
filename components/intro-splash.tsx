"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export function IntroSplash() {
  const [phase, setPhase] = useState<"idle" | "flash" | "fade" | "done">("idle")
  const [lit, setLit] = useState(false)

  function handleEnter() {
    if (phase !== "idle") return
    setPhase("flash")
  }

  useEffect(() => {
    if (phase !== "flash") return
    // Snap to full white on the next frame, then start the slow fade-out.
    const raf = requestAnimationFrame(() => setLit(true))
    const timer = setTimeout(() => setPhase("fade"), 120)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [phase])

  if (phase === "done") return null

  const showBlack = phase === "idle" || phase === "flash"
  const showWhite = phase === "flash" || phase === "fade"

  return (
    <div className="fixed inset-0 z-50" aria-hidden={phase !== "idle"}>
      {/* Black splash with the camera logo button */}
      {showBlack && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <button
            type="button"
            onClick={handleEnter}
            className="group relative flex h-full w-full items-center justify-center outline-none"
            aria-label="Entrar al sitio de GABOFOTOS"
          >
            <span className="animate-pulse-soft relative block w-[min(80vw,80vh,640px)] aspect-square transition-transform duration-500 group-hover:scale-105 group-focus-visible:scale-105">
              <Image
                src="/images/gabofotos-logo.jpg"
                alt="Logo de GABOFOTOS, una cámara fotográfica en blanco y negro"
                fill
                priority
                sizes="(max-width: 768px) 80vw, 640px"
                className="object-contain select-none"
              />
            </span>
            <span className="sr-only">Haz clic en el logo para continuar</span>
          </button>
        </div>
      )}

      {/* Photographic flash: snaps to pure white, then fades out to reveal the page */}
      {showWhite && (
        <div
          className={`absolute inset-0 bg-white ease-out ${
            phase === "flash"
              ? `transition-opacity duration-75 ${lit ? "opacity-100" : "opacity-0"}`
              : "transition-opacity duration-700 opacity-0"
          }`}
          onTransitionEnd={() => {
            if (phase === "fade") setPhase("done")
          }}
        />
      )}
    </div>
  )
}
