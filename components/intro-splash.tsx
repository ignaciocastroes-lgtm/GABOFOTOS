"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

/**
 * Intro animada de entrada (misma secuencia que el video de Gabo), corre sola de una vez:
 *
 *   0,0 s  el logo aparece desde la oscuridad
 *   0,4 s  destello en el flash de la cámara + barrido de luz sobre «GABOFOTOS»
 *   1,5 s  el lente se enciende con reflejos azul/violeta (como un lente real)
 *   3,0 s  zoom lento hacia la cámara
 *   4,0 s  el lente estalla en luz blanca y se abre el sitio
 *
 * Tocar o hacer clic en cualquier parte salta directo al estallido. Se ve una vez por pestaña
 * (sessionStorage); con «reducir movimiento» activado en el teléfono, solo se desvanece.
 *
 * Las posiciones (lente, flash, texto) están medidas en % sobre public/images/gabofotos-logo.jpg
 * (1378×1378). Si se cambia el logo, hay que volver a medirlas en globals.css (sección INTRO).
 */

const CLAVE_VISTO = "gabofotos-intro-vista"
const MS_HASTA_ESTALLIDO = 4000
const MS_ESTALLIDO = 650
const MS_DESVANECER = 600

type Fase = "play" | "burst" | "fade" | "done"

export function IntroSplash() {
  const [fase, setFase] = useState<Fase>("play")

  // ¿Ya la vio en esta pestaña? ¿Pidió menos movimiento? Si no, programa el estallido.
  useEffect(() => {
    let vista = false
    try {
      vista = sessionStorage.getItem(CLAVE_VISTO) === "1"
      sessionStorage.setItem(CLAVE_VISTO, "1")
    } catch {
      // Modo privado o almacenamiento bloqueado: se muestra igual.
    }
    if (vista) {
      setFase("done")
      return
    }
    const reducir = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    const t = setTimeout(() => setFase(reducir ? "fade" : "burst"), reducir ? 900 : MS_HASTA_ESTALLIDO)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (fase === "burst") {
      const t = setTimeout(() => setFase("fade"), MS_ESTALLIDO + 120)
      return () => clearTimeout(t)
    }
    if (fase === "fade") {
      const t = setTimeout(() => setFase("done"), MS_DESVANECER)
      return () => clearTimeout(t)
    }
  }, [fase])

  // Mientras corre, la página de atrás no se desplaza.
  useEffect(() => {
    if (fase === "done") return
    const antes = document.documentElement.style.overflow
    document.documentElement.style.overflow = "hidden"
    return () => {
      document.documentElement.style.overflow = antes
    }
  }, [fase])

  if (fase === "done") return null

  function saltar() {
    if (fase === "play") setFase("burst")
  }

  return (
    <div
      className={`intro fixed inset-0 z-50 bg-black transition-opacity ease-out ${fase === "fade" ? "opacity-0" : "opacity-100"}`}
      style={{ transitionDuration: `${MS_DESVANECER}ms` }}
      data-fase={fase}
      onClick={saltar}
      role="presentation"
    >
      <div className="flex h-full w-full items-center justify-center">
        <div className="intro-escena relative aspect-square w-[min(86vw,74vh,640px)]">
          <div className="intro-logo absolute inset-0">
            <Image
              src="/images/gabofotos-logo.jpg"
              alt="GABOFOTOS"
              fill
              priority
              sizes="(max-width: 768px) 86vw, 640px"
              className="select-none object-contain"
              draggable={false}
            />
          </div>

          {/* Barrido de luz sobre el texto */}
          <div className="intro-texto" aria-hidden>
            <span className="intro-barrido" />
          </div>

          {/* Destello en el flash de la cámara */}
          <span className="intro-chispa" aria-hidden />

          {/* Lente: reflejos de color y luego el estallido blanco */}
          <div className="intro-lente" aria-hidden>
            <span className="intro-reflejo" />
            <span className="intro-mota intro-mota-1" />
            <span className="intro-mota intro-mota-2" />
            <span className="intro-mota intro-mota-3" />
          </div>
          {(fase === "burst" || fase === "fade") && <span className="intro-estallido" aria-hidden />}
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          saltar()
        }}
        className="absolute bottom-6 right-6 rounded-full px-4 py-2 text-xs tracking-[0.25em] text-white/40 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      >
        SALTAR
      </button>
    </div>
  )
}
