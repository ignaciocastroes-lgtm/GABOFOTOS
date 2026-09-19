import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { VIAS, PROYECTO } from '@/lib/club'
import { EscudoFondo } from './escudo-fondo'

/**
 * Las dos vías del club: la escuelita municipal y el club federado.
 *
 * Es la duda más frecuente de un apoderado que llega al gimnasio y ve dos
 * grupos entrenando. Explicarlo evita que alguien se inscriba pensando que va a
 * competir de inmediato, o que se quede fuera creyendo que hay que saber jugar.
 */
export function Vias() {
  return (
    <section id="vias" className="relative overflow-hidden bg-background py-16 md:py-24">
      <EscudoFondo opacidad={0.035} />

      <div className="relative z-10 mx-auto max-w-5xl px-4 md:px-6">
        <div className="max-w-2xl">
          <h2 className="font-heading text-2xl font-bold uppercase leading-tight tracking-tight text-foreground text-balance md:text-4xl">
            Dos caminos en el mismo gimnasio
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
            En el Gimnasio Municipal Lo Espejo conviven la escuelita y el club. No son lo mismo, y
            conviene saber cuál te corresponde.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {VIAS.map((v, i) => (
            <article
              key={v.id}
              className="relative flex flex-col rounded-2xl border border-border bg-card p-6 md:p-7"
            >
              <span className="font-heading text-5xl font-bold leading-none text-primary/15">
                {i + 1}
              </span>
              <h3 className="mt-3 font-heading text-2xl font-bold uppercase tracking-tight text-foreground">
                {v.titulo}
              </h3>
              <p className="mt-1 text-sm font-medium text-primary">{v.subtitulo}</p>
              <p className="mt-4 flex-1 leading-relaxed text-muted-foreground">{v.texto}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {v.puntos.map((p) => (
                  <li
                    key={p}
                    className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    <Check className="h-3 w-3 text-primary" />
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* Flecha entre ambas: la escuelita alimenta al club */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          De la escuelita salen las jugadoras y jugadores que después visten la camiseta del club.
        </p>

        <div className="mt-12 rounded-2xl bg-[#0a0a0a] p-8 text-white md:p-10">
          <h3 className="font-heading text-xl font-bold uppercase leading-tight tracking-tight text-balance md:text-3xl">
            {PROYECTO.titulo}
          </h3>
          <p className="mt-4 max-w-2xl leading-relaxed text-white/85 text-pretty">
            {PROYECTO.texto}
          </p>
          <Link
            href="/profesores"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-white underline underline-offset-4"
          >
            Quiénes los forman
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
