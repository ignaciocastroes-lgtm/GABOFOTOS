'use client'

import { useMemo, useState } from 'react'
import { NoticiasFeed } from './noticias-feed'
import { ordenarPorFecha, seriesDePartidosEnDatos, type Noticia } from '@/lib/noticias'

/**
 * Recibe las noticias ya traídas por el servidor (app/noticias/page.tsx)
 * en vez de importar un arreglo estático — desde que viven en Supabase, un
 * componente 'use client' no puede leerlas directo (la llave de service
 * role nunca debe llegar al navegador).
 */
export function NoticiasIndexClient({ noticias: todasLasNoticias }: { noticias: Noticia[] }) {
  const [filtro, setFiltro] = useState<string>('todas')

  const seriesDisponibles = useMemo(() => seriesDePartidosEnDatos(todasLasNoticias), [todasLasNoticias])

  const noticias = useMemo(() => {
    const todas = ordenarPorFecha(todasLasNoticias)
    if (filtro === 'todas') return todas
    if (filtro === 'escuelita') return todas.filter((n) => n.escuelita)
    return todas.filter((n) => n.tipo === 'partido' && n.partido.serie === filtro)
  }, [filtro, todasLasNoticias])

  const boton = (id: string, label: string) => (
    <button
      key={id}
      type="button"
      onClick={() => setFiltro(id)}
      aria-pressed={filtro === id}
      className={
        filtro === id
          ? 'rounded-md bg-primary px-4 py-2 text-sm font-semibold uppercase tracking-wide text-primary-foreground'
          : 'rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground hover:border-primary hover:text-primary'
      }
    >
      {label}
    </button>
  )

  return (
    <>
      <div className="border-b border-border bg-secondary py-6">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 md:px-6">
          {boton('todas', 'Todas')}
          {boton('escuelita', 'Escuelita')}
          {seriesDisponibles.map((s) => boton(s, s))}
        </div>
      </div>

      <NoticiasFeed
        key={filtro}
        noticias={noticias}
        vacio="No hay noticias con ese filtro todavía."
      />
    </>
  )
}
