import { Download, Mail, MapPin, Phone } from "lucide-react"
import { siteConfig, whatsappMessageLink } from "@/lib/site-config"
import { WhatsAppIcon } from "./icons"

// La ficha técnica (brochure) se publica dejando el PDF en public/GaboFotos-Brochure.pdf.
// next.config.mjs revisa si existe al compilar y deja la ruta en NEXT_PUBLIC_BROCHURE.
export const BROCHURE_URL = process.env.NEXT_PUBLIC_BROCHURE

export const COBERTURA =
  "Cobertura en la Región Metropolitana. Para viajar a regiones se suma un costo adicional de traslado, que se cotiza por WhatsApp."

const filaClass = "flex items-center gap-3 text-zinc-300 transition-colors hover:text-yellow-400"
const iconoClass =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-yellow-400 ring-1 ring-zinc-800"
const redClass =
  "rounded-full px-3.5 py-1.5 text-xs text-zinc-300 ring-1 ring-zinc-700 transition-colors hover:text-yellow-400 hover:ring-yellow-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"

/** Datos de contacto de Gabo, iguales en los dos modales: WhatsApp, teléfono, correo, cobertura, redes y brochure. */
export function ContactoBloque({ mensaje }: { mensaje?: string }) {
  const { social } = siteConfig
  const whatsapp = whatsappMessageLink(
    mensaje ?? "Hola Gabriel, vengo de tu sitio web y quisiera conversar sobre una cotización.",
  )

  return (
    <div className="space-y-6">
      <a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-green-900/30 transition-colors hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
      >
        <WhatsAppIcon className="h-4 w-4" />
        Escribir por WhatsApp
      </a>

      <ul className="space-y-3 text-sm">
        <li>
          <a href={`tel:${siteConfig.phone.tel}`} className={filaClass}>
            <span className={iconoClass}>
              <Phone className="h-4 w-4" />
            </span>
            {siteConfig.phone.display}
          </a>
        </li>
        <li>
          <a href={`mailto:${siteConfig.email}`} className={filaClass}>
            <span className={iconoClass}>
              <Mail className="h-4 w-4" />
            </span>
            {siteConfig.email}
          </a>
        </li>
        <li className="flex items-center gap-3 text-zinc-300">
          <span className={iconoClass}>
            <MapPin className="h-4 w-4" />
          </span>
          {siteConfig.location}
        </li>
      </ul>

      <p className="max-w-sm text-pretty text-sm leading-relaxed text-zinc-400">{COBERTURA}</p>

      <div className="flex flex-wrap gap-2">
        <a href={social.instagram.url} target="_blank" rel="noopener noreferrer" className={redClass}>
          Instagram {social.instagram.handle}
        </a>
        <a href={social.instagramCorp.url} target="_blank" rel="noopener noreferrer" className={redClass}>
          Instagram {social.instagramCorp.handle}
        </a>
        <a href={social.facebook.url} target="_blank" rel="noopener noreferrer" className={redClass}>
          Facebook {social.facebook.label}
        </a>
        <a href={social.flickr.url} target="_blank" rel="noopener noreferrer" className={redClass}>
          {social.flickr.label}
        </a>
        <a href={social.youtube.url} target="_blank" rel="noopener noreferrer" className={redClass}>
          {social.youtube.label}
        </a>
      </div>

      {BROCHURE_URL && (
        <a
          href={BROCHURE_URL}
          download
          className="inline-flex items-center gap-2 rounded-full border border-yellow-400 px-4 py-2 text-sm text-yellow-400 transition-colors hover:bg-yellow-400 hover:text-zinc-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Descargar brochure (PDF)
        </a>
      )}
    </div>
  )
}
