"use client"

import { useState } from "react"
import Image from "next/image"
import { frameLevels, frameSize } from "@/lib/frames"
import { whatsappLink } from "@/lib/site-config"
import { WhatsAppCta } from "./whatsapp-cta"

export function FramePicker() {
  const [levelId, setLevelId] = useState(frameLevels[0].id)
  const level = frameLevels.find((entry) => entry.id === levelId) ?? frameLevels[0]

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-zinc-400">
        Cuadro de graduación con marco, tamaño {frameSize}, solo para fotos de licenciatura y
        egreso. Hay tres niveles: el tamaño es el mismo y lo que cambia es el acabado.
      </p>
      <p className="text-xs leading-relaxed text-zinc-400">
        Los marcos disponibles cambian según el stock. Al cotizar, Gabo te muestra las opciones
        vigentes.
      </p>

      <div className="flex items-start gap-4">
        <div className="w-28 shrink-0">
          <div
            className="relative aspect-[3/4] overflow-hidden border-[10px] border-zinc-800 bg-zinc-800 shadow-lg shadow-black/40"
          >
            <Image
              src="/images/portfolio/retratos-cuadro-licenciatura.jpg"
              alt="Vista referencial de un cuadro de graduación con marco"
              fill
              sizes="112px"
              className="object-cover"
            />
          </div>
          <p className="mt-2 text-center text-[0.65rem] text-zinc-400">Vista referencial</p>
        </div>

        <div role="radiogroup" aria-label="Nivel de marco" className="flex flex-1 flex-col gap-2">
          {frameLevels.map((entry) => {
            const selected = entry.id === levelId
            return (
              <button
                key={entry.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setLevelId(entry.id)}
                className={`rounded-lg px-3 py-2 text-left ring-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${
                  selected
                    ? "bg-zinc-800 ring-yellow-400"
                    : "bg-zinc-900 ring-zinc-800 hover:ring-zinc-600"
                }`}
              >
                <span className="block text-sm text-zinc-100">{entry.name}</span>
                <span className="block text-xs text-zinc-400">{entry.finish}</span>
              </button>
            )
          })}
        </div>
      </div>

      <WhatsAppCta
        label="Cotizar cuadro de graduación"
        href={whatsappLink(`un Cuadro de graduación con marco ${frameSize} (${level.name})`)}
      />
    </div>
  )
}
