"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { X, ChevronDown, Camera, Lightbulb, Users, GraduationCap, Award, Clock } from "lucide-react"
import { whatsappLink } from "@/lib/site-config"
import { WhatsAppCta } from "./whatsapp-cta"
import { FramePicker } from "./frame-picker"
import { ProGallery } from "./pro-gallery"

type Plan = {
  id: string
  title: string
  content: React.ReactNode
}

const plans: Plan[] = [
  {
    id: "matrimonios",
    title: "Matrimonios",
    content: (
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-zinc-400">
          Cobertura pensada para acompañar tu día completo, con opciones desde
          4 hasta 9 horas según lo que necesites: Plan Simple, Económico, Básico,
          Intermedio, Full y Súper Full.
        </p>
        <WhatsAppCta
          label="Cotizar por WhatsApp"
          href={whatsappLink("un Plan de Matrimonio")}
        />
      </div>
    ),
  },
  {
    id: "colegios",
    title: "Colegios",
    content: (
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-zinc-400">
          Licenciaturas, galas de octavo básico y IV medio, registro para el anuario y cuadros de
          graduación. Coordinación con directivos, docentes y apoderados, y entrega puntual a las
          familias.
        </p>
        <WhatsAppCta
          label="Cotizar por WhatsApp"
          href={whatsappLink("una cobertura de Colegio (licenciatura, gala o anuario)")}
        />
      </div>
    ),
  },
  {
    id: "cuadros",
    title: "Cuadros de graduación",
    content: <FramePicker />,
  },
  {
    id: "sesiones",
    title: "Sesiones Fotográficas",
    content: (
      <div className="space-y-4">
        <ul className="space-y-2 text-sm text-zinc-300">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-yellow-400" />
            Sesión Interior
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-yellow-400" />
            Sesión Exterior
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-yellow-400" />
            Fotografía Deportiva
          </li>
        </ul>
        <WhatsAppCta
          label="Cotizar por WhatsApp"
          href={whatsappLink("una Sesión Fotográfica")}
        />
      </div>
    ),
  },
  {
    id: "bautizos",
    title: "Bautizos",
    content: (
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-zinc-400">
          Cobertura por horas de la ceremonia y celebración, con edición
          profesional y opción a impresiones para conservar el recuerdo.
        </p>
        <WhatsAppCta
          label="Cotizar por WhatsApp"
          href={whatsappLink("un Bautizo")}
        />
      </div>
    ),
  },
  {
    id: "otros",
    title: "Otros eventos",
    content: (
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-zinc-400">
          Matrimonio civil, primera comunión, cumpleaños y celebraciones privadas. Cuéntanos la
          fecha y el lugar y te respondemos por WhatsApp.
        </p>
        <WhatsAppCta
          label="Cotizar por WhatsApp"
          href={whatsappLink("un evento (matrimonio civil, primera comunión o cumpleaños)")}
        />
      </div>
    ),
  },
]

const trajectory = [
  { icon: Clock, label: "Más de 16 años haciendo fotografía" },
  { icon: GraduationCap, label: "Escuela de Foto Arte de Chile" },
  { icon: Award, label: "Curso Canon Chile: Fotografía en Alta Velocidad (2022)" },
  { icon: Award, label: "Curso Canon Chile: Fotografía Paisaje Diurno (2022)" },
]

const equipment = [
  { icon: Camera, label: "Equipos Canon profesionales" },
  { icon: Lightbulb, label: "Kit de iluminación LED / Flash" },
  { icon: Users, label: "Asistencia fotográfica en terreno" },
]

function AccordionItem({
  plan,
  isOpen,
  onToggle,
}: {
  plan: Plan
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="overflow-hidden rounded-lg bg-zinc-900 ring-1 ring-zinc-800 transition-colors">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-zinc-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
      >
        <span className="text-sm font-light tracking-wide text-zinc-100">{plan.title}</span>
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 text-yellow-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-zinc-800 px-5 py-5">{plan.content}</div>
        </div>
      </div>
    </div>
  )
}

type AboutPlansModalProps = {
  open: boolean
  onClose: () => void
}

export function AboutPlansModal({ open, onClose }: AboutPlansModalProps) {
  const [openPlan, setOpenPlan] = useState<string>("matrimonios")

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  return (
    <>
      {open && typeof document !== "undefined" && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Conoce a Gabo & Planes"
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/95 p-4 backdrop-blur-sm sm:p-6"
          onClick={onClose}
        >
          <div
            className="relative flex h-[90vh] w-[90vw] max-w-6xl flex-col overflow-hidden rounded-xl bg-zinc-950 ring-1 ring-zinc-800"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
              <div>
                <p className="text-[0.65rem] tracking-[0.3em] text-yellow-400">GABOFOTOS</p>
                <h2 className="text-lg font-light tracking-wide text-zinc-100">
                  Conoce a Gabo &amp; Planes
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-zinc-300 ring-1 ring-zinc-700 transition-colors hover:bg-white hover:text-zinc-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="grid flex-1 grid-cols-1 gap-8 overflow-y-auto p-6 md:grid-cols-2 md:p-8">
              {/* Columna izquierda: biografía */}
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-2xl ring-1 ring-zinc-800">
                  <Image
                    src="/images/gabo-perfil.jpg"
                    alt="Retrato de Gabriel Cabezas Salgado"
                    fill
                    sizes="(max-width: 768px) 80vw, 320px"
                    className="object-cover grayscale"
                  />
                </div>
                <h3 className="mt-6 text-xl font-light tracking-[0.15em] text-zinc-100">
                  GABRIEL CABEZAS SALGADO
                </h3>
                <p className="mt-1 text-sm tracking-[0.2em] text-yellow-400">
                  Fotógrafo Profesional
                </p>
                <blockquote className="mt-5 border-l-2 border-yellow-400 pl-4 text-pretty text-sm italic leading-relaxed text-zinc-300">
                  &ldquo;La técnica se aprende, pero la sensibilidad se cultiva.&rdquo;
                </blockquote>
                <p className="mt-5 max-w-md text-pretty text-sm leading-relaxed text-zinc-400">
                  Soy fotógrafo profesional egresado de la Escuela de Foto Arte de
                  Chile. Mi trayectoria se ha forjado entre la emoción de las bodas
                  y la responsabilidad de los grandes eventos escolares e
                  institucionales.
                </p>
                <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-zinc-400">
                  He colaborado en producciones de gran alcance como &ldquo;Contra
                  Viento y Marea&rdquo; (Canal 13), una experiencia que reforzó mi
                  capacidad de trabajar bajo presión manteniendo siempre la calidez
                  humana.
                </p>

                {/* Trayectoria y formación */}
                <div className="mt-8 w-full max-w-md">
                  <p className="mb-3 text-xs tracking-[0.3em] text-zinc-400">
                    TRAYECTORIA Y FORMACIÓN
                  </p>
                  <ul className="space-y-3">
                    {trajectory.map(({ icon: Icon, label }) => (
                      <li key={label} className="flex items-center gap-3">
                        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-zinc-900 ring-1 ring-zinc-800">
                          <Icon className="h-4 w-4 text-yellow-400" />
                        </span>
                        <span className="text-sm text-zinc-300">{label}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Equipamiento técnico */}
                <div className="mt-8 w-full max-w-md">
                  <p className="mb-3 text-xs tracking-[0.3em] text-zinc-400">
                    EQUIPAMIENTO TÉCNICO
                  </p>
                  <ul className="space-y-3">
                    {equipment.map(({ icon: Icon, label }) => (
                      <li key={label} className="flex items-center gap-3">
                        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-zinc-900 ring-1 ring-zinc-800">
                          <Icon className="h-4 w-4 text-yellow-400" />
                        </span>
                        <span className="text-sm text-zinc-300">{label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Columna derecha: planes */}
              <div className="flex flex-col">
                <p className="mb-4 text-xs tracking-[0.3em] text-zinc-400">
                  NUESTROS SERVICIOS
                </p>
                <div className="space-y-3">
                  {plans.map((plan) => (
                    <AccordionItem
                      key={plan.id}
                      plan={plan}
                      isOpen={openPlan === plan.id}
                      onToggle={() => setOpenPlan(openPlan === plan.id ? "" : plan.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Galería a todo el ancho */}
              <div className="md:col-span-2">
                <ProGallery />
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
