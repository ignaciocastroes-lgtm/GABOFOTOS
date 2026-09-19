import { VALORES, CITA_TECNICA } from '@/lib/valores'
import { EscudoFondo } from './escudo-fondo'

export function Valores() {
  return (
    <section id="valores" className="relative overflow-hidden bg-secondary py-16 md:py-24">
      <EscudoFondo opacidad={0.035} />
      <div className="relative z-10 mx-auto max-w-5xl px-4 md:px-6">
        <div className="max-w-2xl">
          <h2 className="font-heading text-2xl font-bold uppercase leading-tight tracking-tight text-foreground text-balance md:text-4xl">
            Lo que se llevan además del hockey
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
            Las niñas y niños vienen a jugar. Lo que se llevan a la casa es otra cosa.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {VALORES.map((v) => (
            <div key={v.titulo}>
              <h3 className="font-heading text-lg font-semibold uppercase tracking-tight text-foreground">
                <span className="mr-2 inline-block h-1.5 w-6 -translate-y-1 bg-primary align-middle" />
                {v.titulo}
              </h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{v.texto}</p>
            </div>
          ))}
        </div>

        <figure className="mt-14 border-l-4 border-primary pl-6">
          <blockquote className="text-lg leading-relaxed text-foreground text-pretty md:text-xl">
            «{CITA_TECNICA.texto}»
          </blockquote>
          <figcaption className="mt-4 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{CITA_TECNICA.autor}</span>
            <span className="mx-2">·</span>
            {CITA_TECNICA.cargo}
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
