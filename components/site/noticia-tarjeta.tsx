import Link from 'next/link'
import Image from 'next/image'
import { PlayCircle } from 'lucide-react'
import type { Noticia } from '@/lib/noticias'
import { InstagramIcon } from './brand-icons'

function fechaCorta(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
  })
}

function Escudo({ src, nombre }: { src: string; nombre: string }) {
  if (src) {
    return (
      <Image src={src} alt={nombre} width={44} height={44} className="h-11 w-11 object-contain" />
    )
  }
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-xs font-bold text-muted-foreground">
      {nombre
        .split(' ')
        .slice(0, 2)
        .map((p) => p[0])
        .join('')}
    </div>
  )
}

export function NoticiaTarjeta({ n }: { n: Noticia }) {
  if (n.tipo === 'partido') {
    const { local, visita, serie, campeonato } = n.partido
    return (
      <Link
        href={`/noticias/${n.id}`}
        className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary"
      >
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-semibold uppercase tracking-wide text-primary">{serie}</span>
          <span>{fechaCorta(n.fecha)}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-1 flex-col items-center gap-1.5 text-center">
            <Escudo src={local.escudo} nombre={local.nombre} />
            <span className="text-xs font-medium leading-tight text-foreground">
              {local.nombre}
            </span>
          </div>
          <div className="font-heading text-3xl font-bold text-foreground">
            {local.goles}&nbsp;–&nbsp;{visita.goles}
          </div>
          <div className="flex flex-1 flex-col items-center gap-1.5 text-center">
            <Escudo src={visita.escudo} nombre={visita.nombre} />
            <span className="text-xs font-medium leading-tight text-foreground">
              {visita.nombre}
            </span>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground">{campeonato}</p>
      </Link>
    )
  }

  if (n.tipo === 'nota') {
    return (
      <Link
        href={`/noticias/${n.id}`}
        className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary"
      >
        {n.fotos[0] && (
          <div className="aspect-[4/3] w-full overflow-hidden">
            <Image
              src={n.fotos[0].src}
              alt={n.fotos[0].alt}
              width={500}
              height={375}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col p-5">
          <span className="text-xs text-muted-foreground">{fechaCorta(n.fecha)}</span>
          <h3 className="mt-1 font-heading text-lg font-bold uppercase leading-tight tracking-tight text-foreground">
            {n.titulo}
          </h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{n.resumen}</p>
        </div>
      </Link>
    )
  }

  if (n.tipo === 'video') {
    return (
      <Link
        href={`/noticias/${n.id}`}
        className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary"
      >
        <div className="relative aspect-video w-full overflow-hidden bg-[#0a0a0a]">
          <Image
            src={`https://img.youtube.com/vi/${n.youtubeId}/hqdefault.jpg`}
            alt={n.titulo}
            width={480}
            height={270}
            className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <PlayCircle className="h-12 w-12 text-white drop-shadow" />
          </span>
        </div>
        <div className="p-5">
          <span className="text-xs text-muted-foreground">{fechaCorta(n.fecha)}</span>
          <h3 className="mt-1 font-heading text-lg font-bold uppercase leading-tight tracking-tight text-foreground">
            {n.titulo}
          </h3>
        </div>
      </Link>
    )
  }

  // instagram
  return (
    <Link
      href={`/noticias/${n.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary"
    >
      <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-gradient-to-br from-primary/90 to-[#8a1216]">
        <InstagramIcon className="h-12 w-12 text-white/90" />
      </div>
      <div className="p-5">
        <span className="text-xs text-muted-foreground">{fechaCorta(n.fecha)}</span>
        <h3 className="mt-1 font-heading text-lg font-bold uppercase leading-tight tracking-tight text-foreground">
          {n.titulo}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{n.resumen}</p>
      </div>
    </Link>
  )
}
