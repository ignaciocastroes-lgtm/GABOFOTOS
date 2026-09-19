import { ArrowRight, Globe, Users, Newspaper, Check } from 'lucide-react'
import { CamisetaInteractiva } from './camiseta-interactiva'
import { ContactoCTA } from './contacto-cta'
import { MUNDIALITO } from '@/lib/apoyo'
import { PAQUETE_VIAJE } from '@/lib/auspicios'
import { formatCLP } from '@/lib/club'
import { EscudoFondo } from './escudo-fondo'

/**
 * Cruce entre la campaña del viaje y el auspicio de camiseta.
 *
 * Las dos camisetas que la Sub 13 usará en San Juan son, a la vez, el objeto
 * que hay que financiar y el espacio publicitario que se ofrece. Presentarlas
 * por separado —stickers por un lado, auspicios por otro— desaprovecha lo
 * único que este club puede ofrecer y un club grande no: que la marca de un
 * comercio de Lo Espejo viaje a un torneo internacional.
 */
export function CamisetaMundialito() {
  const datos = [
    { icon: Users, valor: `+${MUNDIALITO.deportistas}`, texto: 'niñas y niños compitiendo' },
    { icon: Globe, valor: `${MUNDIALITO.equipos}`, texto: 'equipos de tres países' },
    { icon: Newspaper, valor: `${MUNDIALITO.sedes}`, texto: 'sedes, con final en el Cantoni' },
  ]

  return (
    <section id="camiseta" className="relative overflow-hidden bg-[#0a0a0a] py-16 text-white md:py-24">
      <EscudoFondo variante="blanco" opacidad={0.05} />

      <div className="relative z-10 mx-auto max-w-5xl px-4 md:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/60">
            Para empresas
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold uppercase leading-tight tracking-tight text-balance md:text-5xl">
            Tu logo viaja a San Juan
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/85 text-pretty">
            Estamos fabricando las dos camisetas —titular y alternativa— con las que la Sub 13
            femenina competirá en el {MUNDIALITO.nombre}. Auspiciar una posición no es solo aportar
            al viaje: es que tu marca esté en la cancha, en Argentina, durante toda una semana de
            torneo internacional.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 border-y border-white/15 py-8 sm:grid-cols-3">
          {datos.map((d) => (
            <div key={d.texto} className="flex items-center gap-3">
              <d.icon className="h-5 w-5 shrink-0 text-primary" />
              <p>
                <span className="font-heading text-2xl font-bold">{d.valor}</span>{' '}
                <span className="text-sm text-white/70">{d.texto}</span>
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-2xl leading-relaxed text-white/70">
          El torneo lo organiza el {MUNDIALITO.organiza} desde 1989, pone en juego la{' '}
          {MUNDIALITO.copa} y lo cubre {MUNDIALITO.prensa}, el principal diario de San Juan. Arranca
          con un desfile de todos los equipos en el {MUNDIALITO.estadio} y termina ahí mismo con las
          finales.
        </p>

        <div className="mt-12 rounded-2xl bg-background p-6 text-foreground md:p-8">
          <CamisetaInteractiva variante="mundialito" />
        </div>

        {/* Paquete premium para quien quiere ser el auspiciador principal del viaje */}
        <div className="mt-8 rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm md:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
            Paquete premium
          </p>
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="font-heading text-xl font-bold uppercase tracking-tight text-white">
              {PAQUETE_VIAJE.nombre}
            </h3>
            <p>
              <span className="font-heading text-2xl font-bold text-white">
                {formatCLP(PAQUETE_VIAJE.monto)}
              </span>
              <span className="ml-2 text-sm text-white/60">{PAQUETE_VIAJE.periodo}</span>
            </p>
          </div>
          <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {PAQUETE_VIAJE.incluye.map((i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {i}
              </li>
            ))}
          </ul>
          <ContactoCTA
            asunto={`Quiero ser ${PAQUETE_VIAJE.nombre.toLowerCase()}`}
            mensaje={`Hola, me interesa ser el ${PAQUETE_VIAJE.nombre.toLowerCase()} de la Sub 13 al Mundialito de San Juan (${formatCLP(PAQUETE_VIAJE.monto)}). ¿Podemos conversarlo?`}
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Quiero ser el auspiciador principal
          </ContactoCTA>
        </div>

        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <ContactoCTA
            asunto="Auspicio de la camiseta del Mundialito"
            mensaje="Hola, me interesa auspiciar una posición en la camiseta con que la Sub 13 viaja al Mundialito de San Juan. ¿Podemos conversarlo?"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-8 py-4 text-base font-bold uppercase tracking-wide text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Quiero auspiciar la camiseta
          </ContactoCTA>
          <a
            href="/auspiciadores"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-white/80 underline underline-offset-4 hover:text-white"
          >
            ¿Prefieres apoyar al club en general?
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <p className="mt-6 text-sm text-white/50">
          Las camisetas se imprimen antes de viajar, así que hay plazo hasta que cerremos la
          producción.
        </p>
      </div>
    </section>
  )
}
