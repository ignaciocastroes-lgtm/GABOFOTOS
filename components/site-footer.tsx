import Image from "next/image"
import { Download, Mail, MapPin, Phone } from "lucide-react"
import { siteConfig } from "@/lib/site-config"

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function FlickrIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <circle cx="7" cy="12" r="4" />
      <circle cx="17" cy="12" r="4" />
    </svg>
  )
}

function SocialPill({
  href,
  label,
  ariaLabel,
  icon,
}: {
  href: string
  label: string
  ariaLabel: string
  icon: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="group flex items-center gap-2 rounded-full bg-white px-4 py-2 ring-1 ring-slate-300 transition-colors hover:ring-yellow-400 dark:bg-zinc-900 dark:ring-zinc-800"
    >
      {icon}
      <span className="text-sm text-slate-700 transition-colors group-hover:text-slate-950 dark:text-zinc-300 dark:group-hover:text-zinc-50">
        {label}
      </span>
    </a>
  )
}

const contactRowClass =
  "group flex items-center gap-3 text-slate-700 transition-colors hover:text-slate-950 dark:text-zinc-300 dark:hover:text-zinc-50"
const contactIconClass =
  "flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-slate-300 transition-colors group-hover:ring-yellow-400 dark:bg-zinc-900 dark:ring-zinc-800"
const socialIconClass = "h-4 w-4 text-yellow-500 dark:text-yellow-400"

// La ficha técnica (brochure) se publica dejando el PDF en public/GaboFotos-Brochure.pdf.
// next.config.mjs revisa si existe al compilar y deja la ruta en NEXT_PUBLIC_BROCHURE.
// (No se busca el archivo en tiempo de ejecución: en Vercel la carpeta public no está en el servidor.)
const BROCHURE_URL = process.env.NEXT_PUBLIC_BROCHURE

export function SiteFooter() {
  const { social } = siteConfig

  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-100 transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-16 lg:grid-cols-2">
        {/* Columna izquierda: perfil + biografía */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-sm ring-1 ring-slate-300 dark:ring-zinc-800">
            <Image
              src="/images/gabo-perfil.jpg"
              alt="Retrato del fotógrafo de GABOFOTOS"
              fill
              sizes="128px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-light tracking-[0.2em] text-slate-900 transition-colors duration-300 dark:text-zinc-100">GABO</h2>
            <p className="max-w-md text-pretty text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
              Fotógrafo dedicado a capturar la emoción de cada instante. Cada imagen
              es una búsqueda de la verdad detrás del gesto, la luz y el silencio.
            </p>
            <blockquote className="border-l-2 border-yellow-500 pl-4 text-pretty text-sm italic leading-relaxed text-slate-700 dark:border-yellow-400 dark:text-zinc-300">
              &ldquo;La técnica se aprende, pero la sensibilidad se cultiva.&rdquo;
            </blockquote>
          </div>
        </div>

        {/* Columna derecha: contacto */}
        <div className="flex flex-col gap-6 lg:items-end">
          <h2 className="text-sm tracking-[0.3em] text-slate-500 dark:text-zinc-400">CONTACTO</h2>
          <div className="flex flex-col gap-4">
            <a href={`tel:${siteConfig.phone.tel}`} className={contactRowClass}>
              <span className={contactIconClass}>
                <Phone className="h-4 w-4 text-yellow-400" />
              </span>
              <span className="text-sm">{siteConfig.phone.display}</span>
            </a>
            <a href={`mailto:${siteConfig.email}`} className={contactRowClass}>
              <span className={contactIconClass}>
                <Mail className="h-4 w-4 text-yellow-400" />
              </span>
              <span className="text-sm">{siteConfig.email}</span>
            </a>
            <div className="flex items-center gap-3 text-slate-700 dark:text-zinc-300">
              <span className={contactIconClass}>
                <MapPin className="h-4 w-4 text-yellow-400" />
              </span>
              <span className="text-sm">{siteConfig.location}</span>
            </div>
          </div>

          {BROCHURE_URL && (
            <a
              href={BROCHURE_URL}
              download
              className="inline-flex items-center gap-2 rounded-full border border-yellow-500 px-4 py-2 text-sm text-yellow-700 transition-colors hover:bg-yellow-500 hover:text-white dark:border-yellow-400 dark:text-yellow-400 dark:hover:bg-yellow-400 dark:hover:text-zinc-950"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Descargar brochure (PDF)
            </a>
          )}

          <div className="mt-2 flex flex-wrap gap-3 lg:justify-end">
            <SocialPill
              href={social.instagram.url}
              label={social.instagram.handle}
              ariaLabel={`Instagram ${social.instagram.handle}`}
              icon={<InstagramIcon className={socialIconClass} />}
            />
            <SocialPill
              href={social.instagramCorp.url}
              label={social.instagramCorp.handle}
              ariaLabel={`Instagram ${social.instagramCorp.handle}`}
              icon={<InstagramIcon className={socialIconClass} />}
            />
            <SocialPill
              href={social.facebook.url}
              label={social.facebook.label}
              ariaLabel="Facebook de GaboFotos"
              icon={<FacebookIcon className={socialIconClass} />}
            />
            <SocialPill
              href={social.flickr.url}
              label={social.flickr.label}
              ariaLabel="Flickr de Gabriel Cabezas Salgado"
              icon={<FlickrIcon className={socialIconClass} />}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-zinc-900">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <p className="text-xs tracking-wider text-slate-500 dark:text-zinc-400">
            © {new Date().getFullYear()} GABOFOTOS · Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  )
}
