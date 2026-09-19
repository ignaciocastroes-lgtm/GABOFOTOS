'use client'

import { useState } from 'react'
import { MapPin, Mail, Send, Check, Building2 } from 'lucide-react'
import { InstagramIcon, WhatsappIcon } from './brand-icons'
import { CLUB, whatsappHref } from '@/lib/club'

const DETAILS = [
  {
    icon: MapPin,
    label: 'Dirección',
    value: `${CLUB.sede.nombre}, ${CLUB.sede.direccion}`,
  },
  { icon: Mail, label: 'Correo', value: CLUB.email },
  { icon: Building2, label: 'RUT del club', value: CLUB.rut },
]

const SOCIALS = [
  { icon: InstagramIcon, label: 'Instagram', nombre: CLUB.instagramHandle, href: CLUB.instagram },
  {
    icon: WhatsappIcon,
    label: 'WhatsApp',
    nombre: 'Escríbenos por WhatsApp',
    href: whatsappHref('Hola, quiero consultar por el club.'),
  },
].filter(
  (s): s is { icon: typeof InstagramIcon; label: string; nombre: string; href: string } =>
    Boolean(s.href),
)

export function Contact() {
  const [sent, setSent] = useState(false)

  return (
    <section id="contacto" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Contacto
          </p>
          <h2 className="font-heading text-3xl font-bold uppercase tracking-tight text-foreground text-balance md:text-5xl">
            Ubicación y Contacto
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Map + details */}
          <div className="flex flex-col gap-6">
            <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
              <iframe
                title="Mapa del Gimnasio Municipal Lo Espejo"
                src="https://www.google.com/maps?q=-33.5249755,-70.6954514&z=17&output=embed"
                className="h-72 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <ul className="flex flex-col gap-4">
              {DETAILS.map((d) => (
                <li key={d.label} className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                    <d.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {d.label}
                    </p>
                    <p className="text-foreground">{d.value}</p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-8 leading-relaxed text-muted-foreground text-pretty">
              Estamos ubicados en el {CLUB.sede.nombre}. Si tienes dudas, escríbenos: a la brevedad
              te respondemos.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <s.icon className="h-7 w-7 shrink-0" />
                  <span className="text-sm font-semibold">{s.nombre}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-primary">
                  <Check className="h-8 w-8" />
                </span>
                <h3 className="mt-6 font-heading text-2xl font-bold uppercase tracking-tight text-foreground">
                  ¡Mensaje enviado!
                </h3>
                <p className="mt-2 max-w-sm text-muted-foreground">
                  Gracias por escribirnos. Te responderemos a la brevedad.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setSent(true)
                }}
                className="flex flex-col gap-4"
              >
                <h3 className="font-heading text-2xl font-bold uppercase tracking-tight text-foreground">
                  Escríbenos
                </h3>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-foreground">Nombre</span>
                  <input
                    name="nombre"
                    required
                    placeholder="Tu nombre"
                    className="rounded-md border border-input bg-background px-4 py-2.5 text-sm outline-none ring-primary/30 transition placeholder:text-muted-foreground focus:border-primary focus:ring-2"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-foreground">Correo</span>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="tucorreo@ejemplo.cl"
                    className="rounded-md border border-input bg-background px-4 py-2.5 text-sm outline-none ring-primary/30 transition placeholder:text-muted-foreground focus:border-primary focus:ring-2"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-foreground">Mensaje</span>
                  <textarea
                    name="mensaje"
                    required
                    rows={5}
                    placeholder="Cuéntanos en qué podemos ayudarte"
                    className="resize-none rounded-md border border-input bg-background px-4 py-2.5 text-sm outline-none ring-primary/30 transition placeholder:text-muted-foreground focus:border-primary focus:ring-2"
                  />
                </label>
                <button
                  type="submit"
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                  Enviar mensaje
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
