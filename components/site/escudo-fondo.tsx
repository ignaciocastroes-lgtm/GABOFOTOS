import Image from 'next/image'

/**
 * Escudo como marca de agua de fondo. Decorativo: aria-hidden y sin alt.
 * `variante` elige el escudo a color (sobre fondos claros) o la silueta
 * blanca (sobre fondos oscuros).
 */
export function EscudoFondo({
  variante = 'color',
  className,
  opacidad = 0.04,
}: {
  variante?: 'color' | 'blanco'
  className?: string
  opacidad?: number
}) {
  return (
    <div
      aria-hidden="true"
      className={
        className ??
        'pointer-events-none absolute -right-24 top-1/2 -z-0 w-[min(70vw,560px)] -translate-y-1/2 select-none'
      }
      style={{ opacity: opacidad }}
    >
      <Image
        src={variante === 'blanco' ? '/escudo-blanco.webp' : '/escudo.webp'}
        alt=""
        width={800}
        height={800}
        className="h-auto w-full"
      />
    </div>
  )
}
