import Image from 'next/image'
import { InstagramIcon } from './brand-icons'
import { GALERIA } from '@/lib/galeria'
import { CLUB } from '@/lib/club'

export function Gallery() {
  return (
    <section id="noticias" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold uppercase tracking-tight text-foreground text-balance md:text-5xl">
            La vida del club
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Entrenamientos, partidos y encuentros de nuestra comunidad.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {GALERIA.map((foto) => {
            const destino = foto.post ?? CLUB.instagram
            return (
              <a
                key={foto.src}
                href={destino}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-lg"
              >
                <Image
                  src={foto.src}
                  alt={foto.alt}
                  width={500}
                  height={500}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-primary/0 text-primary-foreground opacity-0 transition-all duration-300 group-hover:bg-primary/70 group-hover:opacity-100">
                  <InstagramIcon className="h-9 w-9" />
                </span>
              </a>
            )
          })}
        </div>

        <div className="mt-10 text-center">
          <a
            href={CLUB.instagramCanal}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-8 py-4 text-sm font-bold uppercase tracking-wide text-background transition-all hover:-translate-y-0.5 hover:bg-foreground/90"
          >
            <InstagramIcon className="h-5 w-5" />
            Únete a nuestro canal
          </a>
          <p className="mt-3 text-sm text-muted-foreground">
            o síguenos en{' '}
            <a
              href={CLUB.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-primary"
            >
              {CLUB.instagramHandle}
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
