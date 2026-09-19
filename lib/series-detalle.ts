/**
 * Detalle operativo de cada serie: quién entrena, cuándo y con qué año de
 * nacimiento. Complementa a SERIES (lib/club.ts), que solo tiene el nombre y
 * la rama.
 *
 * IMPORTANTE — dos programas distintos, no confundir:
 *   - Escuelita municipal (ESCUELITA en lib/club.ts): taller gratuito de la
 *     Ilustre Municipalidad, lunes y viernes 16:30 a 18:30. Es la puerta de
 *     entrada, para quien nunca ha jugado.
 *   - Entrenamiento de las series federadas del club (este archivo): lunes,
 *     miércoles y viernes, en bloques por franja etaria. Es donde entrenan
 *     quienes ya compiten en la Liga Central.
 *
 * LOS HORARIOS PUEDEN TENER CAMBIOS. Confirma siempre con el club antes de
 * planificar en torno a ellos — así lo pidió la directiva explícitamente.
 */

export type BloqueId = 'sub10-11' | 'sub13-15-17' | 'sub19-23-adulta'

export type HorarioDia = { dia: string; desde: string; hasta: string }

export const HORARIOS_BLOQUE: Record<BloqueId, HorarioDia[]> = {
  'sub10-11': [
    { dia: 'Lunes', desde: '17:00', hasta: '18:30' },
    { dia: 'Miércoles', desde: '18:30', hasta: '19:30' },
    { dia: 'Viernes', desde: '17:00', hasta: '18:30' },
  ],
  'sub13-15-17': [
    { dia: 'Lunes', desde: '18:30', hasta: '20:15' },
    { dia: 'Miércoles', desde: '19:30', hasta: '21:00' },
    { dia: 'Viernes', desde: '18:30', hasta: '20:15' },
  ],
  'sub19-23-adulta': [
    { dia: 'Lunes', desde: '20:15', hasta: '22:00' },
    { dia: 'Miércoles', desde: '21:00', hasta: '22:30' },
    { dia: 'Viernes', desde: '20:15', hasta: '22:00' },
  ],
}

export const NOMBRE_BLOQUE: Record<BloqueId, string> = {
  'sub10-11': 'Sub 10 - 11',
  'sub13-15-17': 'Sub 13 - 15 - 17',
  'sub19-23-adulta': 'Sub 19 - 23 - Adulta',
}

/** Entrenamiento de arqueros: cruza todas las series, los lunes. */
export const ENTRENAMIENTO_ARQUEROS: HorarioDia[] = [
  { dia: 'Lunes', desde: '18:00', hasta: '19:00' },
  { dia: 'Lunes', desde: '19:00', hasta: '20:00' },
]

/**
 * La temporada de referencia para calcular los años de nacimiento. Se mueve
 * un año cada temporada — actualízala cuando cambie el ciclo.
 */
export const TEMPORADA_REFERENCIA = 2026

/**
 * Regla de edad de la Liga Central, tal como la confirmó la directiva:
 * una serie "SubN" agrupa a quienes cumplen (N-2) o (N-1) años durante el
 * año — nunca a quien cumple N el mismo año, porque ese año pasa a la
 * siguiente serie. Por eso cada serie cubre dos años de nacimiento seguidos,
 * sin traslape con la de al lado.
 *
 * Aparte de esto, un jugador puede jugar también en las dos series
 * inmediatamente superiores a la suya —nunca hacia abajo, nunca más de tres
 * series a la vez—. Por ejemplo: una jugadora de Sub 13 puede jugar también
 * Sub 15 y Sub 17. Esa es la regla que permite hasta tres inscripciones
 * simultáneas por temporada (ver /mnt/user-data/outputs/sistema-id-jugadores.xlsx).
 *
 * PENDIENTE: confirmar con el reglamento vigente de la Liga Central el
 * artículo exacto y si aplica igual en las ocho series del club.
 */
export type SerieDetalle = {
  /** Debe coincidir con el id en SERIES (lib/club.ts). */
  id: string
  bloque: BloqueId
  /** Nacidos en estos dos años, calculado para TEMPORADA_REFERENCIA. */
  nacidosDesde?: number
  nacidosHasta?: number
  /** Para series sin techo de edad (adulta): una nota en vez de un rango. */
  notaEdad?: string
  /** ids en CUERPO_TECNICO (lib/club.ts). */
  profesores: string[]
}

export const SERIES_DETALLE: SerieDetalle[] = [
  {
    id: 'sub11',
    bloque: 'sub10-11',
    nacidosDesde: 2016,
    nacidosHasta: 2017,
    profesores: ['rodrigo-quintanilla', 'rodolfo-oyola'],
  },
  {
    id: 'fem-sub13',
    bloque: 'sub13-15-17',
    nacidosDesde: 2014,
    nacidosHasta: 2015,
    profesores: ['facundo-oyola', 'rodolfo-oyola', 'rodrigo-quintanilla'],
  },
  {
    id: 'fem-sub15',
    bloque: 'sub13-15-17',
    nacidosDesde: 2012,
    nacidosHasta: 2013,
    profesores: ['facundo-oyola', 'rodolfo-oyola', 'rodrigo-quintanilla'],
  },
  {
    id: 'fem-sub17',
    bloque: 'sub13-15-17',
    nacidosDesde: 2010,
    nacidosHasta: 2011,
    profesores: ['facundo-oyola', 'rodolfo-oyola', 'rodrigo-quintanilla'],
  },
  {
    id: 'fem-sub19',
    bloque: 'sub19-23-adulta',
    nacidosDesde: 2008,
    nacidosHasta: 2009,
    profesores: ['rodolfo-oyola', 'rodrigo-quintanilla'],
  },
  {
    id: 'fem-adulta',
    bloque: 'sub19-23-adulta',
    notaEdad: 'Cumple 19 años o más durante el año (nacidas en 2007 o antes)',
    profesores: ['rodolfo-oyola', 'rodrigo-quintanilla'],
  },
  {
    id: 'mas-sub19',
    bloque: 'sub19-23-adulta',
    nacidosDesde: 2008,
    nacidosHasta: 2009,
    profesores: ['rodolfo-oyola', 'rodrigo-quintanilla'],
  },
  {
    id: 'mas-sub23',
    bloque: 'sub19-23-adulta',
    nacidosDesde: 2004,
    nacidosHasta: 2007,
    profesores: ['rodolfo-oyola', 'rodrigo-quintanilla'],
  },
]

export function detalleDe(id: string) {
  return SERIES_DETALLE.find((s) => s.id === id)
}

/**
 * Galería por serie. Vacía a propósito, igual que clínicas y videos de
 * profesores: es el espacio para las fotos de cada serie cuando las tengan.
 */
export const GALERIA_SERIE: Record<string, { src: string; alt: string }[]> = {}
