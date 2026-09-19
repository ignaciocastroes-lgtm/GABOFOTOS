import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { CUERPO_TECNICO, type Profesor } from '@/lib/club'

/** Monograma con las iniciales, para cuando aún no hay foto. */
function Monograma({ nombre }: { nombre: string }) {
  const iniciales = nombre
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')

  return (
    <div className="flex aspect-[4/5] w-full items-center justify-center bg-[#0a0a0a]">
      <span className="font-heading text-6xl font-bold tracking-tight text-white/25">
        {iniciales}
      </span>
    </div>
  )
}

function Ficha({ p }: { p: Profesor }) {
  return (
    <Link
      href={`/profesores/${p.id}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg"
    >
      <div className="relative">
        {p.foto ? (
          <Image
            src={p.foto}
            alt={`${p.nombre}, ${p.cargo}`}
            width={600}
            height={750}
            className="aspect-[4/5] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <Monograma nombre={p.nombre} />
        )}
        <span className="absolute inset-x-0 bottom-0 h-1.5 bg-primary" />
      </div>

      <div className="p-6">
        <h3 className="font-heading text-2xl font-bold uppercase leading-tight tracking-tight text-foreground">
          {p.nombre}
        </h3>
        <p className="mt-1 font-medium text-primary">{p.cargo}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {p.origen && (
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
              {p.origen}
            </span>
          )}
          {p.series.map((s) => (
            <span
              key={s}
              className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              {s}
            </span>
          ))}
        </div>

        <p className="mt-4 leading-relaxed text-muted-foreground">{p.resumen}</p>

        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-primary">
          Ver perfil completo
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}

export function Profesores({ titulo = 'Quiénes entrenan' }: { titulo?: string }) {
  return (
    <section id="profesores" className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
          {titulo}
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CUERPO_TECNICO.map((p) => (
            <Ficha key={p.id} p={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
