'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { Noticia } from '@/lib/noticias'
import { NoticiaTarjeta } from './noticia-tarjeta'

const LOTE = 3

/**
 * Grilla de noticias con carga por lotes.
 *
 * Siempre entran tres en la primera fila; "Cargar más" revela tres más cada
 * vez, en el mismo orden en que vienen (más nuevas primero, ya ordenadas por
 * quien llama a este componente). No es scroll infinito a propósito: con el
 * volumen de un club chico, un botón explícito es más simple que un
 * observer, no depende de JavaScript de terceros, y el usuario sabe
 * exactamente cuántas noticias más está por ver.
 */
export function NoticiasFeed({
  titulo,
  noticias,
  vacio = 'Todavía no hay noticias acá.',
}: {
  titulo?: string
  noticias: Noticia[]
  vacio?: string
}) {
  const [visibles, setVisibles] = useState(LOTE)

  if (noticias.length === 0) {
    return (
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          {titulo && (
            <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
              {titulo}
            </h2>
          )}
          <div className="mt-8 rounded-xl border border-dashed border-border bg-secondary p-8">
            <p className="text-muted-foreground">{vacio}</p>
          </div>
        </div>
      </section>
    )
  }

  const mostrar = noticias.slice(0, visibles)
  const quedan = noticias.length - mostrar.length

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {titulo && (
          <h2 className="mb-8 font-heading text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
            {titulo}
          </h2>
        )}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mostrar.map((n) => (
            <NoticiaTarjeta key={n.id} n={n} />
          ))}
        </div>

        {quedan > 0 && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setVisibles((v) => v + LOTE)}
              className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-semibold uppercase tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Cargar {Math.min(LOTE, quedan)} más
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
