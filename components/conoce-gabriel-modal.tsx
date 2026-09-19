"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import { Award, Camera, Clock, GraduationCap, Lightbulb, Package, Store, Users, type LucideIcon } from "lucide-react"
import { empresaPhotos } from "@/lib/pro-gallery"
import { whatsappMessageLink } from "@/lib/site-config"
import { COBERTURA, ContactoBloque } from "./contacto-bloque"
import { WhatsAppIcon } from "./icons"
import { ProGallery } from "./pro-gallery"
import { SiteModal } from "./site-modal"

const trayectoria: { icon: LucideIcon; label: string }[] = [
  { icon: Clock, label: "Más de 16 años haciendo fotografía" },
  { icon: GraduationCap, label: "Escuela de Foto Arte de Chile" },
  { icon: Award, label: "Curso Canon Chile: Fotografía en Alta Velocidad (2022)" },
  { icon: Award, label: "Curso Canon Chile: Fotografía Paisaje Diurno (2022)" },
]

const equipamiento: { icon: LucideIcon; label: string }[] = [
  { icon: Camera, label: "Equipos Canon profesionales" },
  { icon: Lightbulb, label: "Kit de iluminación LED / Flash" },
  { icon: Users, label: "Asistencia fotográfica en terreno" },
]

const paraEmpresas: { icon: LucideIcon; label: string }[] = [
  { icon: Package, label: "Foto de productos" },
  { icon: Camera, label: "Fotografía profesional" },
  { icon: Store, label: "Fotografía comercial" },
  { icon: Lightbulb, label: "Iluminación pensada para cada trabajo" },
]

function Seccion({ id, titulo, children }: { id: string; titulo: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id}>
      <span className="mb-3 block h-0.5 w-10 bg-yellow-400" />
      <h3 id={id} className="text-2xl font-light tracking-wide text-zinc-50">
        {titulo}
      </h3>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function ListaConIconos({ items }: { items: { icon: LucideIcon; label: string }[] }) {
  return (
    <ul className="space-y-3">
      {items.map(({ icon: Icon, label }) => (
        <li key={label} className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 ring-1 ring-zinc-800">
            <Icon className="h-4 w-4 text-yellow-400" aria-hidden="true" />
          </span>
          <span className="text-sm text-zinc-300">{label}</span>
        </li>
      ))}
    </ul>
  )
}

const parrafo = "text-pretty leading-relaxed text-zinc-300"

type Props = {
  open: boolean
  onClose: () => void
  /** Cierra esta ventana y abre «Presupuestos y contacto». */
  onPresupuestos: () => void
}

/** «Conoce a Gabriel»: su historia, su trabajo con empresas y cómo contactarlo. */
export function ConoceGabrielModal({ open, onClose, onPresupuestos }: Props) {
  return (
    <SiteModal
      open={open}
      onClose={onClose}
      title="Conoce a Gabriel"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="hidden text-sm text-zinc-400 sm:block">¿Tienes un evento o un proyecto en mente?</p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onPresupuestos}
              className="rounded-full border border-yellow-400 px-5 py-2.5 text-sm text-yellow-400 transition-colors hover:bg-yellow-400 hover:text-zinc-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            >
              Ver presupuestos
            </button>
            <a
              href={whatsappMessageLink("Hola Gabriel, vengo de tu sitio web y quisiera conversar sobre una cotización.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Escribir por WhatsApp
            </a>
          </div>
        </div>
      }
    >
      <div className="space-y-16 p-5 sm:p-8 md:p-10">
        {/* Presentación */}
        <section className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-12">
          <div className="relative aspect-[2/3] w-full max-w-sm overflow-hidden rounded-2xl ring-1 ring-zinc-800 md:max-w-none">
            <Image
              src="/images/gabo-perfil.jpg"
              alt="Retrato de Gabriel Cabezas Salgado con su cámara"
              fill
              sizes="(min-width: 768px) 40vw, 90vw"
              className="object-cover"
            />
          </div>

          <div>
            <h3 className="text-3xl font-light tracking-tight text-zinc-50 sm:text-4xl">Gabriel Cabezas Salgado</h3>
            <p className="mt-2 text-sm text-yellow-400">Fotógrafo profesional en Santiago, Chile</p>

            <blockquote className="mt-6 border-l-2 border-yellow-400 pl-4 text-lg font-light italic text-zinc-100">
              &ldquo;La técnica se aprende, pero la sensibilidad se cultiva.&rdquo;
            </blockquote>

            <div className="mt-6 max-w-prose space-y-4">
              <p className={parrafo}>
                Soy fotógrafo profesional egresado de la Escuela de Foto Arte de Chile. Mi trayectoria se ha
                forjado entre la emoción de las bodas y la responsabilidad de los grandes eventos escolares e
                institucionales.
              </p>
              <p className={parrafo}>
                He tenido el honor de colaborar en producciones de gran alcance como en &ldquo;Contra Viento y
                Marea&rdquo; (Canal 13), una experiencia que reforzó mi capacidad de trabajar bajo presión
                manteniendo siempre la calidez humana.
              </p>
              <p className={parrafo}>
                Mi sello es la adaptabilidad; desde la energía de un jardín infantil hasta la solemnidad de una
                gala de IV medio, mi prioridad es generar un ambiente de respeto y confianza. Trabajo en estrecha
                coordinación con directivas y apoderados para asegurar que el resultado final supere lo esperado.
              </p>
            </div>

            <p className="mt-8 max-w-prose text-pretty text-xl font-light leading-snug text-zinc-100">
              &ldquo;Sé que esperas fotos, pero mi intención es darte una sorpresa que te haga sonreír cada vez que
              las vuelvas a ver.&rdquo;
            </p>
          </div>
        </section>

        {/* La marca */}
        <Seccion id="la-marca" titulo="GaboFotos, la marca">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] md:gap-12">
            <div className="relative aspect-square w-40 overflow-hidden rounded-xl ring-1 ring-zinc-800 md:w-full md:max-w-[14rem]">
              <Image
                src="/images/gabofotos-logo.jpg"
                alt="Logo de GABOFOTOS"
                fill
                sizes="(min-width: 768px) 14rem, 10rem"
                className="object-cover"
              />
            </div>
            <div className="max-w-prose space-y-4">
              <p className={parrafo}>
                GaboFotos nace desde la necesidad de sentar las bases de lo que quería construir. La fotografía me
                acompaña desde niño, de cuando tomaba cámaras prestadas de mis cercanos, colgándolas en mi cuello,
                mirando por ese pequeño visor y click. La emoción de poder congelar la realidad y hacerla eterna.
              </p>
              <p className={parrafo}>
                El nombre es casi una humorada: es solo la unión de mi apodo y lo que me gusta hacer, crear fotos.
              </p>
              <p className={parrafo}>
                Este sueño ya tiene más de 16 años, los cuales han sido de constante aprendizaje y crecimiento,
                logrando cosas que nunca pensé cumplir, estando en sitios increíbles, compartiendo con personas
                únicas, abrazando paisajes y lugares impresionantes, y dejándome llevar por las emociones mientras
                disparo cada foto. Hacer fotos no es solo parte de mi trabajo, es donde más vivo me siento.
              </p>
              <p className="text-pretty text-lg font-light italic leading-snug text-zinc-100">
                &ldquo;Mi compromiso con la imagen es para siempre. No es solo un trabajo, es mi manera de celebrar
                la vida y de asegurarme de que tus mejores momentos no se pierdan en el tiempo.&rdquo;
              </p>
            </div>
          </div>
        </Seccion>

        {/* Formación y equipo */}
        <div className="grid gap-12 md:grid-cols-2">
          <Seccion id="formacion" titulo="Trayectoria y formación">
            <ListaConIconos items={trayectoria} />
          </Seccion>
          <Seccion id="equipamiento" titulo="Equipamiento técnico">
            <ListaConIconos items={equipamiento} />
          </Seccion>
        </div>

        {/* Empresas */}
        <Seccion id="empresas" titulo="Fotografía para empresas">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-12">
            <div className="space-y-6">
              <p className={`${parrafo} max-w-prose`}>
                Además de matrimonios y colegios, trabajo con empresas: foto de productos, fotografía profesional
                y fotografía comercial, con la iluminación pensada para cada trabajo.
              </p>
              <ListaConIconos items={paraEmpresas} />
              <p className="max-w-prose text-pretty text-sm leading-relaxed text-zinc-400">{COBERTURA}</p>
            </div>

            {/* Estas fotos van siempre a color: en un trabajo comercial el color es parte del resultado. */}
            <ul className="columns-2 gap-4 sm:columns-3">
              {empresaPhotos.map((foto) => (
                <li key={foto.id} className="mb-4 break-inside-avoid">
                  <figure>
                    <div className="overflow-hidden rounded-lg ring-1 ring-zinc-800">
                      <Image
                        src={foto.src}
                        alt={foto.alt}
                        width={foto.width}
                        height={foto.height}
                        sizes="(min-width: 1024px) 20vw, (min-width: 640px) 28vw, 44vw"
                        className="h-auto w-full"
                      />
                    </div>
                    <figcaption className="mt-2 text-xs text-zinc-400">{foto.caption}</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </Seccion>

        {/* Galería */}
        <ProGallery />

        {/* Contacto */}
        <Seccion id="contacto-gabriel" titulo="Contacto">
          <ContactoBloque />
        </Seccion>
      </div>
    </SiteModal>
  )
}
