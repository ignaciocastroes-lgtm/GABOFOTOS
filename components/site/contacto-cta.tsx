import { WhatsappIcon } from './brand-icons'
import { Mail } from 'lucide-react'
import { whatsappHref, mailtoHref } from '@/lib/club'

/**
 * Botón de contacto que prefiere WhatsApp y cae al correo si
 * NEXT_PUBLIC_WHATSAPP todavía no está configurada en Vercel.
 *
 * A diferencia de WhatsappButton, este SIEMPRE pinta algo: se usa donde el
 * llamado a la acción no puede faltar, como cada posición de la camiseta.
 */
export function ContactoCTA({
  mensaje,
  asunto,
  children,
  className,
}: {
  mensaje: string
  asunto: string
  children: React.ReactNode
  className?: string
}) {
  const wa = whatsappHref(mensaje)
  const href = wa ?? mailtoHref(asunto, mensaje)
  const Icon = wa ? WhatsappIcon : Mail

  return (
    <a
      href={href}
      {...(wa ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={
        className ??
        'inline-flex shrink-0 items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground'
      }
    >
      <Icon className="h-4 w-4" />
      {children}
    </a>
  )
}
