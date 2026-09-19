import Image from 'next/image'
import { CalendarDays, Clock, MapPin, CircleDollarSign } from 'lucide-react'
import { ESCUELITA, CLUB } from '@/lib/club'
import { ContactoCTA } from './contacto-cta'

/**
 * La escuelita NO es una actividad propia del club: es un taller de la
 * Ilustre Municipalidad de Lo Espejo que imparten dos profesores del Inter. Decirlo con
 * claridad es una exigencia de la directiva y le da respaldo institucional al
 * sitio. El municipio autorizó el uso de sus logos.
 */
export function EscuelitaMunicipal() {
  const datos = [
    { icon: CalendarDays, etiqueta: 'Días', valor: ESCUELITA.dias },
    { icon: Clock, etiqueta: 'Horario', valor: ESCUELITA.horario },
    { icon: MapPin, etiqueta: 'Lugar', valor: ESCUELITA.lugar },
    { icon: CircleDollarSign, etiqueta: 'Costo', valor: ESCUELITA.costo },
  ]

  return (
    <section id="escuelita" className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="overflow-hidden rounded-2xl border border-border">
          <div className="border-b border-border bg-secondary px-6 py-5 md:px-8">
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Taller municipal
                </p>
                <h2 className="mt-1 font-heading text-2xl font-bold uppercase leading-tight tracking-tight text-foreground md:text-3xl">
                  Escuelita de Hockey Patín Municipal
                </h2>
              </div>
              {ESCUELITA.logos.map((l) => (
                <Image
                  key={l.src}
                  src={l.src}
                  alt={l.alt}
                  width={280}
                  height={84}
                  className="h-12 w-auto md:h-14"
                />
              ))}
            </div>
          </div>

          <div className="grid gap-8 px-6 py-8 md:grid-cols-2 md:px-8 md:py-10">
            <div>
              <p className="leading-relaxed text-muted-foreground text-pretty">
                La escuelita es un taller de la{' '}
                <span className="font-medium text-foreground">{ESCUELITA.organiza}</span>, a través
                de su {ESCUELITA.oficina}, y la imparten dos profesores del club:{' '}
                <span className="font-medium text-foreground">
                  {ESCUELITA.profesores.join(' y ')}
                </span>
                .
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
                Es gratuita y está abierta a todos los niños, niñas y adolescentes de la comuna. No hace
                falta experiencia ni equipamiento propio: prestamos los patines y la chueca para
                empezar.
              </p>
              <p className="mt-4 rounded-lg bg-secondary px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                Este año la escuelita participa en el <span className="font-medium text-foreground">Campeonato Escolar Desafío Formativo</span>,
                que reúne a 17 colegios, talleres y clubes de todo Chile en las canchas de León
                Prado y el Gimnasio Municipal de Huechuraba, hasta noviembre.
              </p>

              <ContactoCTA
                asunto="Inscripción a la escuela de hockey"
                mensaje="Hola, quiero inscribir a mi hijo/a en la escuela de hockey del taller municipal. ¿Qué necesito?"
                className="mt-7 inline-flex items-center gap-2 rounded-md bg-primary px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Quiero inscribir a mi hijo/a
              </ContactoCTA>
            </div>

            <div>
              <dl className="divide-y divide-border rounded-xl border border-border">
                {datos.map((d) => (
                  <div key={d.etiqueta} className="flex items-start gap-3 px-4 py-3.5">
                    <d.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                        {d.etiqueta}
                      </dt>
                      <dd className="font-medium leading-snug text-foreground">{d.valor}</dd>
                    </div>
                  </div>
                ))}
              </dl>
              <p className="mt-2 text-xs text-muted-foreground">
                El horario puede tener cambios. Confírmalo con el club antes de venir.
              </p>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Logos de la Ilustre Municipalidad de Lo Espejo usados con su autorización. Consultas del
                club en{' '}
                <a href={`mailto:${CLUB.email}`} className="underline underline-offset-2">
                  {CLUB.email}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
