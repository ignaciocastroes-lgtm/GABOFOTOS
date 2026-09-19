import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { CLUB, CUENTA } from '@/lib/club'

export const metadata: Metadata = {
  title: 'Gracias por tu aporte | Internacional Lo Espejo',
  robots: { index: false },
}

const MENSAJES = {
  exito: {
    titulo: '¡Gracias por tu aporte!',
    texto:
      'Tu pago quedó aprobado. Te escribiremos al correo para coordinar la entrega de los stickers. Cada aporte acerca a las niñas a San Juan.',
  },
  pendiente: {
    titulo: 'Tu pago está en proceso',
    texto:
      'Mercado Pago aún no confirma la operación. Puede tardar unas horas. Te avisaremos por correo apenas se acredite.',
  },
  error: {
    titulo: 'El pago no se completó',
    texto:
      'No se realizó ningún cobro. Puedes intentar de nuevo o aportar por transferencia bancaria.',
  },
} as const

export default async function Gracias({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>
}) {
  const { estado } = await searchParams
  const clave = (estado === 'pendiente' || estado === 'error' ? estado : 'exito') as keyof typeof MENSAJES
  const { titulo, texto } = MENSAJES[clave]

  return (
    <main className="flex min-h-[100svh] items-center justify-center bg-secondary px-4 py-20">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-8 text-center shadow-lg">
        <Image
          src="/escudo.webp"
          alt=""
          width={96}
          height={96}
          className="mx-auto h-20 w-20"
        />
        <h1 className="mt-6 font-heading text-3xl font-bold uppercase leading-tight tracking-tight text-foreground">
          {titulo}
        </h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">{texto}</p>

        {clave === 'error' && (
          <div className="mt-6 rounded-lg border border-border bg-secondary p-4 text-left text-sm">
            <p className="font-medium text-foreground">{CUENTA.banco}</p>
            <p className="mt-1 text-muted-foreground">{CUENTA.tipo}</p>
            <p className="mt-1 font-medium text-foreground">N° {CUENTA.numero}</p>
            <p className="mt-1 text-muted-foreground">{CUENTA.titular}</p>
            <p className="mt-2 text-muted-foreground">
              Comprobante a{' '}
              <a href={`mailto:${CUENTA.email}`} className="underline underline-offset-2">
                {CUENTA.email}
              </a>
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/#apoyanos"
            className="rounded-md bg-primary px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {clave === 'error' ? 'Intentar de nuevo' : 'Volver al inicio'}
          </Link>
          <a
            href={CLUB.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-primary"
          >
            Sigue a las niñas en {CLUB.instagramHandle}
          </a>
        </div>
      </div>
    </main>
  )
}
