'use client'

import { useEffect, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { MUNDIALITO, diasParaElTorneo } from '@/lib/apoyo'

/**
 * Cuenta regresiva al torneo.
 *
 * Se calcula en el cliente a propósito: la página es estática, así que un
 * cálculo en build congelaría el número en la fecha del deploy y a la semana
 * estaría mintiendo.
 */
export function Countdown() {
  const [dias, setDias] = useState<number | null>(null)

  useEffect(() => {
    setDias(diasParaElTorneo())
  }, [])

  return (
    <div className="mx-auto mt-8 flex max-w-xl flex-col items-center gap-4 rounded-xl border border-white/20 bg-white/10 px-6 py-5 backdrop-blur-sm sm:flex-row sm:justify-center sm:gap-8">
      <div className="text-center">
        {dias === null ? (
          <span className="block h-[3.25rem] w-24 animate-pulse rounded bg-white/20" />
        ) : (
          <span className="block font-heading text-5xl font-bold leading-none text-white">
            {dias}
          </span>
        )}
        <span className="mt-1 block text-xs uppercase tracking-widest text-white/70">
          {dias === 1 ? 'día' : 'días'} para el viaje
        </span>
      </div>
      <div className="hidden h-12 w-px bg-white/20 sm:block" />
      <p className="flex items-center gap-2 text-center text-sm text-white/85 sm:text-left">
        <CalendarDays className="hidden h-4 w-4 shrink-0 sm:block" />
        {MUNDIALITO.fechasTexto}
        <span className="block sm:inline"> · {MUNDIALITO.estadio}, San Juan</span>
      </p>
    </div>
  )
}
