import { EscudoFondo } from './escudo-fondo'

/** Cabecera estándar de las páginas internas. */
export function PageHeader({ titulo, bajada }: { titulo: string; bajada?: string }) {
  return (
    <header className="relative overflow-hidden bg-[#0a0a0a] pb-14 pt-32 md:pb-20 md:pt-40">
      <EscudoFondo
        variante="blanco"
        opacidad={0.07}
        className="pointer-events-none absolute -right-20 top-1/2 w-[min(80vw,520px)] -translate-y-1/2 select-none"
      />
      <div className="relative z-10 mx-auto max-w-5xl px-4 md:px-6">
        <h1 className="font-heading text-4xl font-bold uppercase leading-[1.02] tracking-tight text-white text-balance md:text-6xl">
          {titulo}
        </h1>
        {bajada && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80 text-pretty">
            {bajada}
          </p>
        )}
      </div>
    </header>
  )
}
