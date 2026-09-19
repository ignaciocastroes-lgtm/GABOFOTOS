"use client"

import type { FormEvent } from "react"
import { whatsappMessageLink } from "@/lib/site-config"
import { WhatsAppIcon } from "./icons"

const jobTypes = [
  "Matrimonio",
  "Matrimonio civil",
  "Cumpleaños",
  "Colegio (licenciatura, gala o anuario)",
  "Bautizo",
  "Primera comunión",
  "Sesión fotográfica",
  "Deporte",
  "Cuadro de graduación con marco",
  "Fotos de graduación en digital",
  "Empresa (fotografía de productos o comercial)",
  "Otro",
]

const fieldClass =
  "mt-2 w-full rounded-lg bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-zinc-900 dark:text-zinc-100 dark:ring-zinc-800 dark:placeholder:text-zinc-600 dark:focus:ring-yellow-400 dark:[color-scheme:dark]"
const labelClass = "block text-sm text-slate-700 dark:text-zinc-300"

function formatDate(iso: string) {
  const [year, month, day] = iso.split("-")
  return year && month && day ? `${day}-${month}-${year}` : ""
}

export function ContactForm() {
  // No hay servidor de por medio: el formulario arma el mensaje y abre WhatsApp con él escrito.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const get = (key: string) => String(data.get(key) ?? "").trim()

    const lines = [`Hola Gabriel, vengo de tu sitio web. Soy ${get("nombre")} y quiero cotizar: ${get("tipo")}.`]
    if (get("fecha")) lines.push(`Fecha: ${formatDate(get("fecha"))}`)
    if (get("lugar")) lines.push(`Lugar: ${get("lugar")}`)
    if (get("mensaje")) lines.push(get("mensaje"))

    window.open(whatsappMessageLink(lines.join("\n")), "_blank", "noopener,noreferrer")
  }

  return (
    <section id="contacto" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-16 sm:py-24">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-xs tracking-[0.3em] text-yellow-700 dark:text-yellow-400">CONTACTO</p>
          <h2 className="mt-2 text-3xl font-light tracking-tight text-slate-900 transition-colors duration-300 dark:text-zinc-50 sm:text-4xl">
            Cuéntame qué vas a celebrar
          </h2>
          <p className="mt-4 max-w-md text-pretty leading-relaxed text-slate-600 dark:text-zinc-400">
            Completa estos datos y se abre WhatsApp con el mensaje ya escrito. Gabo te responde
            directamente.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <div>
            <label htmlFor="tipo" className={labelClass}>
              ¿Qué necesitas?
            </label>
            <select id="tipo" name="tipo" required defaultValue="" className={fieldClass}>
              <option value="" disabled>
                Elige una opción
              </option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="nombre" className={labelClass}>
              Tu nombre
            </label>
            <input id="nombre" name="nombre" type="text" required autoComplete="name" className={fieldClass} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="fecha" className={labelClass}>
                Fecha (si ya la tienes)
              </label>
              <input id="fecha" name="fecha" type="date" className={fieldClass} />
            </div>
            <div>
              <label htmlFor="lugar" className={labelClass}>
                Lugar o comuna
              </label>
              <input id="lugar" name="lugar" type="text" className={fieldClass} />
            </div>
          </div>

          <div>
            <label htmlFor="mensaje" className={labelClass}>
              Algo más que quieras contarme
            </label>
            <textarea id="mensaje" name="mensaje" rows={3} className={fieldClass} />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-green-900/30 transition-colors hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-zinc-950"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Enviar por WhatsApp
          </button>
        </form>
      </div>
    </section>
  )
}
