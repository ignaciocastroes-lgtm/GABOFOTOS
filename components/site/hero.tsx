'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { CLUB } from '@/lib/club'

export function Hero() {
  const crestRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = crestRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const y = window.scrollY
        // El escudo se desplaza a ~35% de la velocidad del scroll y se apaga al salir.
        el.style.transform = `translate3d(0, ${y * 0.35}px, 0) scale(${1 + y * 0.00012})`
        el.style.opacity = String(Math.max(0, 1 - y / 900))
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section
      id="inicio"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#0a0a0a]"
    >
      {/* Escudo gigante con parallax */}
      <div
        ref={crestRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 w-[min(115vw,900px)] -translate-x-1/2 -translate-y-1/2 will-change-transform"
      >
        <Image
          src="/escudo.webp"
          alt=""
          width={900}
          height={900}
          priority
          className="h-auto w-full opacity-90"
        />
      </div>

      {/* Viñeta: oscurece los bordes y despeja el centro para el texto */}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,rgba(10,10,10,0.86)_0%,rgba(10,10,10,0.72)_45%,rgba(10,10,10,0.95)_100%)]" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-28 text-center">
        <p className="mx-auto mb-5 max-w-md text-xs font-medium uppercase leading-relaxed tracking-[0.15em] text-white/65 text-balance sm:text-sm">
          {CLUB.razonSocial}
        </p>
        <h1 className="font-heading text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white text-balance sm:text-5xl md:text-7xl">
          {CLUB.nombreCorto}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/85 text-pretty md:text-xl">
          Te invitamos a la Escuelita de Hockey Patín Municipal, gratuita para niños, niñas y
          adolescentes, que se imparte en la comuna y está abierta a todos.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/escuela"
            className="group inline-flex items-center gap-2 rounded-md bg-primary px-8 py-4 text-base font-bold uppercase tracking-wide text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:-translate-y-1 hover:bg-primary/90 hover:shadow-xl"
          >
            Inscribe a tu hijo o hija
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="/el-club"
            className="inline-flex items-center gap-2 rounded-md border border-white/40 bg-white/5 px-8 py-4 text-base font-semibold uppercase tracking-wide text-white backdrop-blur-sm transition-colors hover:bg-white/15"
          >
            Conoce el club
          </a>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/70">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/50 p-1.5">
          <span className="h-2 w-1 animate-bounce rounded-full bg-white/80" />
        </div>
      </div>
    </section>
  )
}
