'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CLUB } from '@/lib/club'

/**
 * Escudo del pie con una dedicatoria escondida.
 *
 * Cinco toques sobre el escudo la revelan. Se muestra como un aviso flotante
 * sobre el resto de la página —no dentro del pie— para que no empuje ni se
 * superponga con el texto de alrededor. El texto no existe en el HTML hasta que
 * alguien hace los cinco toques.
 */
export function Dedicatoria() {
  const [toques, setToques] = useState(0)
  const visible = toques >= 5

  return (
    <>
      <button
        type="button"
        onClick={() => setToques((t) => (t >= 5 ? 0 : t + 1))}
        aria-label={`Escudo del ${CLUB.nombreLargo}`}
        className="shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Image
          src="/escudo.webp"
          alt={`Escudo del ${CLUB.nombreLargo}`}
          width={56}
          height={56}
          className="h-14 w-14"
        />
      </button>

      {visible && (
        <div
          role="status"
          onClick={() => setToques(0)}
          className="fixed inset-x-4 bottom-6 z-[120] mx-auto max-w-sm cursor-pointer rounded-xl bg-foreground/95 px-5 py-4 text-center shadow-2xl backdrop-blur-sm"
        >
          <p className="text-sm italic leading-relaxed text-background">
            Esto es un obsequio de BYN por el cariño de la familia Internacional Lo Espejo 2026.
          </p>
        </div>
      )}
    </>
  )
}
