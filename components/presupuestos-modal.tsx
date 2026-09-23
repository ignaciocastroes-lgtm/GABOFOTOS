"use client"

import { useState, type ReactNode } from "react"
import { ChevronDown } from "lucide-react"
import { PLANES, type PlanId, type PlanImagen, type PlanImagenes } from "@/lib/planes"
import { whatsappLink } from "@/lib/site-config"
import { ContactoBloque } from "./contacto-bloque"
import { FramePicker } from "./frame-picker"
import { PlanFoto } from "./plan-foto"
import { SiteModal } from "./site-modal"
import { WhatsAppCta } from "./whatsapp-cta"

// Regla del sitio: no se publican precios. Cada servicio termina en una cotización por WhatsApp.
const parrafo = "text-sm leading-relaxed text-zinc-400"

type Servicio = { texto: string; items?: string[]; tema: string }

// El texto de cada servicio (el de «Cuadros de graduación» vive en components/frame-picker.tsx).
const servicios: Record<Exclude<PlanId, "cuadros">, Servicio> = {
  matrimonios: {
    texto:
      "Cobertura pensada para acompañar tu día completo, con opciones desde 4 hasta 9 horas según lo que necesites: Plan Simple, Económico, Básico, Intermedio, Full y Súper Full.",
    tema: "un Plan de Matrimonio",
  },
  colegios: {
    texto:
      "Licenciaturas, galas de octavo básico y IV medio, registro para el anuario y cuadros de graduación. Coordinación con directivos, docentes y apoderados, y entrega puntual a las familias.",
    tema: "una cobertura de Colegio (licenciatura, gala o anuario)",
  },
  cumpleanos: {
    texto: "Cumpleaños infantiles, familiares y aniversarios. Cobertura por horas, con edición profesional incluida.",
    tema: "un Cumpleaños",
  },
  deporte: {
    texto: "Fútbol, hockey, golf y otras disciplinas. Cobertura de partidos, torneos y entrenamientos.",
    tema: "una cobertura Deportiva",
  },
  sesiones: {
    texto: "Elige el tipo de sesión y te contamos cómo la armamos:",
    items: ["Sesión Interior", "Sesión Exterior", "Fotografía Deportiva"],
    tema: "una Sesión Fotográfica",
  },
  empresas: {
    texto:
      "Foto de productos, fotografía profesional y fotografía comercial, con la iluminación pensada para cada trabajo. Cuéntanos qué necesitas fotografiar y te respondemos por WhatsApp.",
    tema: "un trabajo de fotografía para mi empresa (productos o comercial)",
  },
  bautizos: {
    texto:
      "Cobertura por horas de la ceremonia y celebración, con edición profesional y opción a impresiones para conservar el recuerdo.",
    tema: "un Bautizo",
  },
  otros: {
    texto: "Matrimonio civil, primera comunión y otras celebraciones privadas. Cuéntanos la fecha y el lugar y te respondemos por WhatsApp.",
    tema: "un evento (matrimonio civil o primera comunión)",
  },
}

function DetalleServicio({ servicio }: { servicio: Servicio }) {
  return (
    <div className="space-y-4">
      <p className={parrafo}>{servicio.texto}</p>
      {servicio.items && (
        <ul className="space-y-2 text-sm text-zinc-300">
          {servicio.items.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-yellow-400" />
              {item}
            </li>
          ))}
        </ul>
      )}
      <WhatsAppCta label="Cotizar por WhatsApp" href={whatsappLink(servicio.tema)} />
    </div>
  )
}

function Acordeon({
  titulo,
  imagen,
  abierto,
  onToggle,
  conBanner,
  children,
}: {
  titulo: string
  imagen: PlanImagen
  abierto: boolean
  onToggle: () => void
  /** false cuando el contenido ya muestra la imagen por su cuenta (cuadros de graduación). */
  conBanner: boolean
  children: ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-lg bg-zinc-900 ring-1 ring-zinc-800">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={abierto}
        className="flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-zinc-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-yellow-400"
      >
        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-zinc-800">
          <PlanFoto imagen={imagen} sizes="56px" />
        </span>
        <span className="flex-1 text-sm font-light tracking-wide text-zinc-100">{titulo}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-yellow-400 transition-transform duration-300 ${abierto ? "rotate-180" : ""}`}
        />
      </button>
      <div
        // inert: cerrado, nada de adentro se puede enfocar con el teclado.
        inert={!abierto}
        className={`grid transition-all duration-300 ease-out ${
          abierto ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="grid gap-5 border-t border-zinc-800 p-5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            {conBanner && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-zinc-800 sm:aspect-auto sm:min-h-40">
                <PlanFoto imagen={imagen} sizes="(min-width: 640px) 30vw, 90vw" />
              </div>
            )}
            <div className={conBanner ? "" : "sm:col-span-2"}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

type Props = {
  open: boolean
  onClose: () => void
  imagenes: PlanImagenes
  /** Cierra esta ventana y abre «Conoce a Gabriel». */
  onConocer: () => void
}

/** «Presupuestos y contacto»: los servicios, cada uno con su imagen y su botón de cotizar, y los datos de contacto. */
export function PresupuestosModal({ open, onClose, imagenes, onConocer }: Props) {
  const [abierto, setAbierto] = useState<PlanId | "">("matrimonios")

  return (
    <SiteModal open={open} onClose={onClose} title="Presupuestos y contacto">
      <div className="grid gap-10 p-5 sm:p-8 md:p-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-14">
        <div>
          <p className="max-w-prose text-pretty leading-relaxed text-zinc-300">
            Elige lo que necesitas y cotiza por WhatsApp. Cada trabajo se presupuesta a medida y Gabo te responde
            directamente.
          </p>

          <div className="mt-6 space-y-3">
            {PLANES.map((plan) => (
              <Acordeon
                key={plan.id}
                titulo={plan.titulo}
                imagen={imagenes[plan.id]}
                abierto={abierto === plan.id}
                onToggle={() => setAbierto(abierto === plan.id ? "" : plan.id)}
                conBanner={plan.id !== "cuadros"}
              >
                {plan.id === "cuadros" ? (
                  <FramePicker imagen={imagenes.cuadros} />
                ) : (
                  <DetalleServicio servicio={servicios[plan.id]} />
                )}
              </Acordeon>
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <span className="mb-3 block h-0.5 w-10 bg-yellow-400" />
          <h3 className="text-2xl font-light tracking-wide text-zinc-50">Contacto</h3>
          <div className="mt-5">
            <ContactoBloque />
          </div>
          <button
            type="button"
            onClick={onConocer}
            className="mt-8 text-sm text-zinc-300 underline decoration-yellow-400 underline-offset-4 transition-colors hover:text-yellow-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            Conoce a Gabriel
          </button>
        </aside>
      </div>
    </SiteModal>
  )
}
