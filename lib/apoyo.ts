/**
 * Aportes para el viaje de la Sub 13 femenina al Mundialito Bancaria de San Juan.
 *
 * Los cinco diseños son propiedad del club: usan solo el escudo, los colores y
 * el cántico propios. No incluyen la marca del Mundialito Bancaria, que es del
 * Club Unión Deportiva Bancaria y no puede usarse en mercadería sin su permiso.
 * Los .webp están en /public y los fuentes editables en /disenos.
 */

export type Aporte = {
  id: string
  nombre: string
  precio: number
  /** Cuántos stickers físicos incluye. */
  unidades: number
  img: string
  desc: string
  destacado?: boolean
}

/** Los cinco diseños, para la vitrina. */
export const DISENOS = [
  { id: 'escudo', nombre: 'Escudo', img: '/sticker-escudo.webp' },
  { id: 'vamos', nombre: 'Vamos Inter', img: '/sticker-vamos-inter.webp' },
  { id: 'quelindo', nombre: 'Qué lindo es ser del Inter', img: '/sticker-que-lindo.webp' },
  { id: 'sanjuan', nombre: 'San Juan 2026', img: '/sticker-san-juan.webp' },
  { id: 'sub13', nombre: 'Sub 13 Femenina', img: '/sticker-sub13.webp' },
] as const

export const APORTES: Aporte[] = [
  {
    id: 'escudo',
    nombre: 'Escudo',
    precio: 1000,
    unidades: 1,
    img: '/sticker-escudo.webp',
    desc: 'El escudo troquelado en vinilo resistente.',
  },
  {
    id: 'vamos',
    nombre: 'Vamos Inter',
    precio: 2000,
    unidades: 1,
    img: '/sticker-vamos-inter.webp',
    desc: 'Para el casco, el bolso o la botella.',
  },
  {
    id: 'quelindo',
    nombre: 'Qué lindo es ser del Inter',
    precio: 3000,
    unidades: 1,
    img: '/sticker-que-lindo.webp',
    desc: 'Nuestro cántico, en formato grande.',
  },
  {
    id: 'pack7',
    nombre: 'Pack 7 stickers',
    precio: 7000,
    unidades: 7,
    img: '/sticker-san-juan.webp',
    desc: 'Los cinco diseños, con el de San Juan 2026 repetido. Para repartir en el curso o el trabajo.',
    destacado: true,
  },
  {
    id: 'pack10',
    nombre: 'Pack 10 stickers',
    precio: 10000,
    unidades: 10,
    img: '/sticker-sub13.webp',
    desc: 'Los cinco diseños por duplicado. El aporte que más rinde.',
  },
]

/** Aportes libres, para quien solo quiere donar. */
export const DONACIONES = [
  { id: 'don-5000', monto: 5000, etiqueta: 'Comida de un día en San Juan' },
  { id: 'don-15000', monto: 15000, etiqueta: 'Una noche de alojamiento' },
  { id: 'don-30000', monto: 30000, etiqueta: 'Parte de un pasaje' },
]

/**
 * Mundialito Bancaria 2026.
 * Fechas y categorías confirmadas por la organización (anuncio oficial, agosto 2026).
 */
export const MUNDIALITO = {
  nombre: 'Mundialito Bancaria',
  nombreOficial: 'Encuentro Internacional de Hockey sobre Patines',
  copa: 'Copa Francisco Montes',
  organiza: 'Club Unión Deportiva Bancaria',
  fiscaliza: 'Federación Sanjuanina de Patín, con aval de la Confederación Argentina de Patinaje',
  ciudad: 'San Juan, Argentina',
  estadio: 'Estadio Aldo Cantoni',
  /** Cifras de la edición 2025, la referencia más reciente. */
  equipos: 72,
  deportistas: 700,
  paises: ['Argentina', 'Chile', 'Colombia'],
  paisesHistoricos: ['España', 'Italia', 'China'],
  sedes: 5,
  prensa: 'Diario de Cuyo',
  sitio: 'https://mundialitobancaria.com.ar/',
  instagram: 'https://www.instagram.com/mundialitobancaria',
  /** Contacto del comité organizador para consultas de inscripción. */
  telefono: '+54 264 457-6805',
  inicio: '2026-12-13',
  fin: '2026-12-19',
  fechasTexto: 'del 13 al 19 de diciembre de 2026',
  /** Categoría en la que participa el club. */
  categoria: 'Sub 13 Femenina',
  /** Jugadoras de hasta 12 años: nacidas en 2014 o después. */
  anioNacimiento: 2014,
} as const

/**
 * Meta de recaudación del viaje, en pesos.
 *
 * Pon `meta: 0` para ocultar la barra de avance: es preferible no mostrarla a
 * mostrar cifras inventadas. `recaudado` se actualiza a mano por ahora; cuando
 * conectemos Supabase saldrá de los aportes confirmados.
 */
export const CAMPANA = {
  /** Costo del viaje para la delegación deportiva. Ver lib/presupuesto.ts. */
  meta: 7_010_575,
  /** TODO: actualizar con la cifra real de tesorería antes de publicar. */
  recaudado: 0,
} as const

/** Días que faltan para el inicio del torneo. */
export function diasParaElTorneo(desde: Date = new Date()): number {
  const inicio = new Date(`${MUNDIALITO.inicio}T00:00:00-03:00`)
  return Math.max(0, Math.ceil((inicio.getTime() - desde.getTime()) / 86_400_000))
}

export function aportePorId(id: string) {
  return APORTES.find((a) => a.id === id)
}
