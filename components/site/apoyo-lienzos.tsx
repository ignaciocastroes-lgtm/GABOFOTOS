import { MapPin, HeartHandshake } from 'lucide-react'
import { LIENZOS } from '@/lib/auspicios'
import { ContactoCTA } from './contacto-cta'

/**
 * Apoyo con lienzos y colaboración abierta.
 *
 * A propósito no tiene precios fijos como la camiseta: un lienzo lo puede
 * costear una empresa grande o financiarlo entre varios comercios chicos, y
 * también cabe la colaboración en especie o la donación puntual. Forzar una
 * tabla de precios acá cerraría puertas que conviene dejar abiertas.
 */
export function ApoyoLienzos() {
  return (
    <section id="lienzos" className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              ¿Prefieres apoyar de otra forma?
            </p>
            <h2 className="mt-3 font-heading text-2xl font-bold uppercase leading-tight tracking-tight text-foreground text-balance md:text-4xl">
              {LIENZOS.titulo}
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
              {LIENZOS.texto}
            </p>

            <a
              href={LIENZOS.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary underline underline-offset-4"
            >
              <MapPin className="h-4 w-4" />
              Ver el gimnasio en Google Maps
            </a>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 md:p-7">
            <div className="flex items-start gap-3">
              <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm font-semibold uppercase tracking-wide text-foreground">
                No es un catálogo, es una invitación abierta
              </p>
            </div>

            <ul className="mt-5 flex flex-col gap-4">
              {LIENZOS.tipos.map((t) => (
                <li key={t.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <p className="font-heading text-base font-bold uppercase tracking-tight text-foreground">
                    {t.nombre}
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                    {t.detalle}
                  </p>
                </li>
              ))}
            </ul>

            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Si tienes algo con lo que puedas apoyar, donar o colaborar, contáctanos.
            </p>

            <ContactoCTA
              asunto="Quiero apoyar con un lienzo o colaborar"
              mensaje="Hola, quiero conversar sobre apoyar al Internacional Lo Espejo con un lienzo en la cancha o de alguna otra forma. Cuéntenme cómo puedo colaborar."
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Quiero colaborar
            </ContactoCTA>
          </div>
        </div>
      </div>
    </section>
  )
}
