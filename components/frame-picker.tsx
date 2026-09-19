"use client"

import { useState } from "react"
import { frameLevels, frameSize } from "@/lib/frames"
import type { PlanImagen } from "@/lib/planes"
import { whatsappLink } from "@/lib/site-config"
import { PlanFoto } from "./plan-foto"
import { WhatsAppCta } from "./whatsapp-cta"

export function FramePicker({ imagen }: { imagen: PlanImagen }) {
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
      <p className="rounded-lg bg-zinc-800/60 px-3 py-2 text-sm leading-relaxed text-zinc-200 ring-1 ring-zinc-700">
        Además de los cuadros, Gabo también vende las fotos de graduación en formato digital.
      </p>

      <div className="flex items-start gap-4">
        <div className="w-28 shrink-0">
          <div
            className="relative aspect-[3/4] overflow-hidden border-[10px] border-zinc-800 bg-zinc-800 shadow-lg shadow-black/40"
          >
            <PlanFoto imagen={imagen} sizes="112px" />
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
      <p className="text-xs text-zinc-400">
        ¿Solo las fotos en digital?{" "}
        <a
          href={whatsappLink("las fotos de una graduación en formato digital")}
          target="_blank"
          rel="noopener noreferrer"
          className="text-yellow-400 underline underline-offset-4 hover:text-yellow-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
        >
          Consúltalas por WhatsApp
        </a>
      </p>
    </div>
  )
}
