import Image from 'next/image'
import { ESCUELITA } from '@/lib/club'

/**
 * Agradecimiento institucional al municipio.
 *
 * Se mantiene en registro institucional, sin color político: se agradece la
 * función pública que permite que el club funcione, no a un signo. Un club
 * deportivo que recibe apoyo municipal debe poder decirlo sin quedar asociado a
 * una campaña.
 */
export function Agradecimientos() {
  return (
    <section id="agradecimientos" className="bg-secondary py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <figure className="overflow-hidden rounded-2xl shadow-xl">
            <Image
              src="/images/alcaldesa-quintanilla.webp"
              alt="La alcaldesa Javiera Reyes Jara junto al profesor Rodrigo Quintanilla en el club"
              width={1400}
              height={933}
              className="h-full w-full object-cover"
            />
          </figure>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Agradecimientos
            </p>
            <h2 className="mt-3 font-heading text-2xl font-bold uppercase leading-tight tracking-tight text-foreground text-balance md:text-4xl">
              Gracias a la Ilustre Municipalidad de Lo Espejo
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground text-pretty">
              A su alcaldesa, Javiera Reyes Jara, y a la {ESCUELITA.oficina}, por permitir el
              desarrollo de nuestra actividad en el Gimnasio Municipal Lo Espejo, por sostener los
              talleres formativos y por el apoyo a los proyectos que hemos levantado y a los que
              vienen.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
              Sin ese respaldo, un club de barrio no podría ofrecer hockey patín gratuito a niños,
              niñas y adolescentes.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
