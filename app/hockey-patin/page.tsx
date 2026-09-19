import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Disc3, Ruler, ShieldHalf, Users, Flag, Sparkles } from 'lucide-react'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { PageHeader } from '@/components/site/page-header'
import { EscudoFondo } from '@/components/site/escudo-fondo'
import { ESCUELITA } from '@/lib/club'

export const metadata: Metadata = {
  title: 'Qué es el hockey patín',
  description:
    'Qué es el hockey sobre patines, cómo se juega, qué equipamiento necesitas y qué dice el reglamento de World Skate 2026 — contado por el Internacional Lo Espejo.',
}

const INDICE = [
  { href: '#que-es', titulo: 'Qué es' },
  { href: '#como-se-juega', titulo: 'Cómo se juega' },
  { href: '#la-cancha-y-la-bola', titulo: 'La cancha y la bola' },
  { href: '#equipamiento', titulo: 'Equipamiento' },
  { href: '#posiciones', titulo: 'Posiciones' },
  { href: '#reglas-clave', titulo: 'Reglas clave' },
  { href: '#novedades-2026', titulo: '2026: qué cambió' },
  { href: '#historia', titulo: 'Un poco de historia' },
]

export default function HockeyPatin() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHeader
          titulo="Qué es el hockey patín"
          bajada="Lo contamos como lo entendemos en el Gimnasio Municipal Lo Espejo: con la cancha, la bola y la chueca por delante, y el reglamento de World Skate como única fuente."
        />

        {/* Índice */}
        <nav
          aria-label="Contenidos de esta página"
          className="border-b border-border bg-secondary py-6"
        >
          <div className="mx-auto flex max-w-4xl flex-wrap gap-x-6 gap-y-2 px-4 md:px-6">
            {INDICE.map((i) => (
              <a
                key={i.href}
                href={i.href}
                className="text-sm font-semibold text-muted-foreground underline underline-offset-4 hover:text-primary"
              >
                {i.titulo}
              </a>
            ))}
          </div>
        </nav>

        <article className="bg-background py-16 md:py-24">
          <div className="mx-auto flex max-w-3xl flex-col gap-16 px-4 md:px-6">
            {/* Qué es */}
            <section id="que-es" className="scroll-mt-24">
              <div className="flex items-center gap-2 text-primary">
                <Disc3 className="h-5 w-5" />
                <p className="text-xs font-semibold uppercase tracking-widest">El deporte</p>
              </div>
              <h2 className="mt-2 font-heading text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
                Cinco contra cinco, sobre cuatro ruedas
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
                El hockey patín —hockey sobre patines, para quien lo escuche por primera vez— se
                juega con un arquero y cuatro jugadoras o jugadores de cada lado, sobre patines de
                cuatro ruedas, en una cancha del tamaño de una de básquetbol. Hay una sola manera
                de anotar: golpeando la bola con la chueca. Con el pie, la mano o el patín, no vale.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
                Es rápido. Muy rápido: no hay fricción que frene a un jugador que agarra velocidad,
                y la bola —de corcho, chica y dura— casi no rebota, así que el control se hace en
                milésimas. Para quien nunca lo vio, la primera impresión suele ser la misma:
                sorpresa por lo veloz que es un deporte que se juega adentro de un gimnasio.
              </p>
            </section>

            {/* Cómo se juega */}
            <section id="como-se-juega" className="scroll-mt-24">
              <div className="flex items-center gap-2 text-primary">
                <Flag className="h-5 w-5" />
                <p className="text-xs font-semibold uppercase tracking-widest">Las reglas, claras</p>
              </div>
              <h2 className="mt-2 font-heading text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
                Cómo se juega un partido
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
                Un partido se divide en dos tiempos. Cada equipo pone un arquero bajo el arco y
                cuatro jugadores de campo que atacan y defienden todo el tiempo — acá no hay
                posiciones fijas como en el fútbol, sino roles que cambian jugada a jugada. Se
                puede sustituir con el partido corriendo, como en el básquetbol, así que los
                cambios son constantes y el ritmo casi nunca baja.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
                El reglamento castiga a quien se guarda la bola sin intención real de atacar: es lo
                que se llama juego pasivo, y existe justamente para que el equipo que va ganando no
                se dedique a hacer tiempo. El árbitro sanciona con tarjetas —azul, amarilla y roja,
                cada una con su propia consecuencia— las faltas de juego brusco o de conducta.
              </p>
            </section>

            {/* Cancha y bola */}
            <section id="la-cancha-y-la-bola" className="scroll-mt-24">
              <div className="flex items-center gap-2 text-primary">
                <Ruler className="h-5 w-5" />
                <p className="text-xs font-semibold uppercase tracking-widest">Las medidas oficiales</p>
              </div>
              <h2 className="mt-2 font-heading text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
                La cancha y la bola
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
                El reglamento de World Skate fija la cancha oficial en 40 por 20 metros, cercada
                por una valla que devuelve la bola al juego en vez de sacarla — por eso en el
                hockey patín casi no hay saques de banda. Nuestro Gimnasio Municipal Lo Espejo
                sigue esa misma lógica de cancha cerrada, aunque el recinto sea más chico que un
                estadio de liga profesional.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
                La bola es de corcho forrado, más chica que una pelota de tenis y bastante más
                dura: por eso casi no rebota y por eso duele si te llega sin protección. El
                reglamento define su peso y su diámetro con precisión de milímetros — no es casual
                que las jugadoras y jugadores más chicos usen protecciones desde el primer
                entrenamiento.
              </p>
            </section>

            {/* Equipamiento */}
            <section id="equipamiento" className="scroll-mt-24">
              <div className="flex items-center gap-2 text-primary">
                <ShieldHalf className="h-5 w-5" />
                <p className="text-xs font-semibold uppercase tracking-widest">Para empezar</p>
              </div>
              <h2 className="mt-2 font-heading text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
                Lo que necesitas para tu primer entrenamiento
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
                La chueca es la herramienta de todo el deporte: la única forma legal de tocar la
                bola. El reglamento no exige un modelo único, sino que define límites máximos de
                peso y largo — dentro de esa caja, cada marca diseña su propia curva y su propio
                grosor. Para empezar no hace falta la más cara ni la más nueva; hace falta una que
                cumpla la medida y que se sienta cómoda en la mano.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
                Lo mismo con los patines: no son los patines de patinaje artístico ni los de calle,
                sino un modelo de cuatro ruedas pensado para frenar y girar seco. Se completa con
                rodilleras, coderas y, para quien juega de arquero, un casco y protecciones de
                cuerpo completo — la bola de corcho no perdona.
              </p>
              <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-6">
                <p className="leading-relaxed text-foreground text-pretty">
                  En la {ESCUELITA.oficina.toLowerCase()} de la Ilustre Municipalidad de Lo Espejo
                  prestamos los patines y la chueca para las primeras clases. Nadie se queda fuera
                  por no tener el equipo todavía.
                </p>
                <Link
                  href="/escuela"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary underline underline-offset-4"
                >
                  Conoce la escuelita
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>

            {/* Posiciones */}
            <section id="posiciones" className="scroll-mt-24">
              <div className="flex items-center gap-2 text-primary">
                <Users className="h-5 w-5" />
                <p className="text-xs font-semibold uppercase tracking-widest">El juego</p>
              </div>
              <h2 className="mt-2 font-heading text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
                Las posiciones
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
                Cinco en cancha por equipo: un arquero y cuatro jugadores de campo. Ahí termina lo
                que dice el reglamento, y ahí empieza el juego — porque en un deporte donde todos
                atacan y todos defienden, la posición es menos un lugar fijo que una manera de leer
                la jugada.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
                El arquero es un caso aparte, y en el Inter lo sabemos bien: nuestro preparador de
                arqueros, José Antonio «Toño» Espinoza, fue de los primeros en Chile en salir del
                arco a cortar un ataque, en vez de esperarlo parado en la línea. Hoy eso ya no es
                una rareza — es una escuela.
              </p>
              <Link
                href="/profesores/antonio-espinoza"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary underline underline-offset-4"
              >
                Conoce a Toño Espinoza
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>

            {/* Reglas clave */}
            <section id="reglas-clave" className="scroll-mt-24">
              <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
                Dos reglas que sorprenden a quien recién llega
              </h2>
              <div className="mt-6 flex flex-col gap-6">
                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="font-heading text-lg font-bold uppercase tracking-tight text-foreground">
                    El juego pasivo tiene reloj
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground text-pretty">
                    En el hockey patín no existe eso de «quedarse con la bola». El reglamento
                    cronometra la posesión: si un equipo no ataca con intención real, el árbitro
                    corta la jugada y se la entrega al rival. Es una de las reglas menos conocidas
                    de afuera y más determinantes adentro de la cancha.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="font-heading text-lg font-bold uppercase tracking-tight text-foreground">
                    La tarjeta azul
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground text-pretty">
                    Casi ningún otro deporte usa una tarjeta de este color. En el hockey patín
                    marca una falta más seria que una amarilla, pero no tan grave como una roja
                    directa: el jugador sale de la cancha y su equipo juega con uno menos por un
                    rato, sin quedar expulsado el resto del partido.
                  </p>
                </div>
              </div>
            </section>

            {/* Novedades 2026 */}
            <section id="novedades-2026" className="scroll-mt-24">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="h-5 w-5" />
                <p className="text-xs font-semibold uppercase tracking-widest">Reglamento vigente</p>
              </div>
              <h2 className="mt-2 font-heading text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
                Lo que cambió en el reglamento 2026
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
                World Skate, el organismo internacional que redacta el reglamento del deporte,
                actualizó dos puntos que vale la pena conocer si estás por sumarte:
              </p>
              <ul className="mt-5 flex flex-col gap-4">
                <li className="rounded-xl border border-border bg-card p-5">
                  <p className="font-heading font-bold uppercase tracking-tight text-foreground">
                    Patines en línea, permitidos
                  </p>
                  <p className="mt-1 leading-relaxed text-muted-foreground text-pretty">
                    Hasta 2025 la regla era tajante: hockey patín se jugaba con las cuatro ruedas de
                    siempre, y el patín en línea quedaba para el inline hockey. Desde enero de 2026
                    esa exigencia cambió a nivel mundial: se permite jugar con patines en línea,
                    siempre que cubran todo el pie y sean seguros. En nuestras series seguimos
                    formando con patín de cuatro ruedas, que es el estándar de la Liga Central.
                  </p>
                </li>
                <li className="rounded-xl border border-border bg-card p-5">
                  <p className="font-heading font-bold uppercase tracking-tight text-foreground">
                    Revisión en video, a partir de 2027
                  </p>
                  <p className="mt-1 leading-relaxed text-muted-foreground text-pretty">
                    Durante más de un siglo, si la bola entró o no entró lo decidió solo el ojo del
                    árbitro. Eso cambia con el reglamento 2027 de World Skate, que suma un sistema
                    de revisión en video para las jugadas dudosas de gol.
                  </p>
                </li>
              </ul>
            </section>

            {/* Historia */}
            <section id="historia" className="scroll-mt-24">
              <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
                Un poco de historia
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
                El hockey sobre patines nació en Europa a comienzos del siglo XX, cuando alguien
                miró el hockey sobre hielo y pensó lo obvio: si no hay hielo, hay pistas de
                patinaje. De ahí saltó rápido a Sudamérica, y Argentina se transformó en una de sus
                grandes potencias mundiales — no es casualidad que dos de nuestros propios
                entrenadores, Rodolfo y Facundo Oyola, vengan de San Juan, una de las provincias
                donde este deporte se vive como cultura, no solo como actividad.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
                En Chile, el hockey patín tiene su propio capítulo grande: en 1980 se jugó en
                Santiago un Mundial masculino, y un niño que lo vio por televisión terminó dedicando
                su vida al deporte. Ese niño era Rodrigo Quintanilla, hoy uno de nuestros
                entrenadores, y en 2006 dirigió a la selección femenina chilena —Las Marcianitas— al
                título mundial: el primer campeonato del mundo que ganó Chile en un deporte
                colectivo.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
                Esa es la historia grande. La chica —la nuestra— empieza cada lunes y viernes a las
                16:30, en el Gimnasio Municipal Lo Espejo, con niñas y niños que recién se están
                poniendo los patines por primera vez.
              </p>
              <Link
                href="/el-club"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary underline underline-offset-4"
              >
                Conoce nuestra historia completa
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          </div>
        </article>

        {/* CTA final */}
        <section className="relative overflow-hidden bg-[#0a0a0a] py-16 text-white md:py-24">
          <EscudoFondo variante="blanco" opacidad={0.06} />
          <div className="relative z-10 mx-auto max-w-2xl px-4 text-center md:px-6">
            <h2 className="font-heading text-2xl font-bold uppercase leading-tight tracking-tight text-balance md:text-4xl">
              ¿Quieres probarlo?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/85 text-pretty">
              No necesitas saber nada de esto de memoria. Ven a la escuelita, te prestamos el
              equipo, y el resto lo aprendes patinando.
            </p>
            <Link
              href="/escuela"
              className="mt-7 inline-flex items-center gap-2 rounded-md bg-primary px-8 py-4 text-base font-bold uppercase tracking-wide text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Inscribe a tu hijo o hija
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
