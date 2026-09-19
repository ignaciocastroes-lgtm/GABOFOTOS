import { SERIES } from '@/lib/club'

/**
 * Las tres ramas del club, con el mismo peso visual.
 *
 * La cifra "5 series femeninas" en la portada, sola, puede leerse como si el
 * club fuera solo femenino. Esta franja existe para que la rama mixta y la
 * masculina también se vean — son más chicas, pero son parte del club.
 */
export function RamasResumen() {
  const contar = (rama: string) => SERIES.filter((s) => s.rama === rama).length

  const ramas = [
    { id: 'mixta', titulo: 'Serie mixta', valor: contar('mixta') },
    { id: 'femenina', titulo: 'Series damas', valor: contar('femenina') },
    { id: 'masculina', titulo: 'Series masculina', valor: contar('masculina') },
  ]

  return (
    <div className="border-t border-border bg-background py-10">
      <div className="mx-auto grid max-w-3xl grid-cols-3 gap-6 px-4 text-center md:px-6">
        {ramas.map((r) => (
          <div key={r.id}>
            <p className="font-heading text-4xl font-bold text-primary md:text-5xl">{r.valor}</p>
            <p className="mt-1 text-sm leading-snug text-muted-foreground">{r.titulo}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
