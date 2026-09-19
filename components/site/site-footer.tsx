import Image from 'next/image'
import { InstagramIcon, WhatsappIcon } from './brand-icons'
import { CLUB, whatsappHref } from '@/lib/club'
import { Dedicatoria } from './dedicatoria'

const NAV = [
  { label: 'El Club', href: '/el-club' },
  { label: 'Profesores', href: '/profesores' },
  { label: 'Escuela', href: '/escuela' },
  { label: 'Nuestras series', href: '/series' },
  { label: 'Noticias', href: '/noticias' },
  { label: 'Qué es el hockey patín', href: '/hockey-patin' },
  { label: 'Apóyanos', href: '/apoyanos' },
  { label: 'Auspiciadores', href: '/auspiciadores' },
  { label: 'Pases entre clubes', href: '/pases' },
  { label: 'Transparencia', href: '/transparencia' },
  { label: 'Contacto', href: '/contacto' },
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

export function SiteFooter() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <Dedicatoria />
              <span className="font-heading text-lg font-bold uppercase leading-tight tracking-tight">
                {CLUB.nombreLogo.linea1}
                <span className="block text-primary">{CLUB.nombreLogo.linea2}</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-background/70">
              Estamos ubicados en el {CLUB.sede.nombre}. Si tienes dudas, escríbenos: a la
              brevedad te respondemos.
            </p>
            <p className="mt-3 text-xs text-background/50">
              {CLUB.razonSocial}
              <br />
              RUT {CLUB.rut}
            </p>
          </div>

          <div className="md:justify-self-center">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-background/60">
              Navegación
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-background/80 transition-colors hover:text-primary"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:justify-self-end">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-background/60">
              Síguenos
            </h3>
            <div className="mt-4 flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-background/20 px-4 py-3 text-background transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <s.icon className="h-7 w-7 shrink-0" />
                  <span className="text-sm font-semibold">{s.nombre}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-background/15 pt-6 text-sm text-background/60 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {CLUB.razonSocial}.
          </p>
          <div className="flex items-center gap-4">
            <a href="/privacidad" className="transition-colors hover:text-primary">
              Política de privacidad
            </a>
            <a href="/transparencia" className="transition-colors hover:text-primary">
              Transparencia
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
