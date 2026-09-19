import { WhatsappIcon } from './brand-icons'
import { whatsappHref } from '@/lib/club'

/**
 * Botón de WhatsApp. No se pinta si NEXT_PUBLIC_WHATSAPP todavía no está
 * configurado, para no dejar un enlace roto en producción.
 */
export function WhatsappButton({
  mensaje,
  children,
  className,
}: {
  mensaje: string
  children: React.ReactNode
  className?: string
}) {
  const href = whatsappHref(mensaje)
  if (!href) return null

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ??
        'inline-flex items-center justify-center gap-2 rounded-md border border-border px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary'
      }
    >
      <WhatsappIcon className="h-4 w-4" />
      {children}
    </a>
  )
}
