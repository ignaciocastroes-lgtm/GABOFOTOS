/**
 * Presupuesto del viaje al Mundialito Bancaria 2026.
 *
 * Hay dos tipos de costo y no escalan igual:
 *  - Por viajero: pasaje, viáticos, seguro. Crece si viaja más gente.
 *  - Por deportista: indumentaria. Son las 10 jugadoras, viajen o no
 *    acompañadas. No cambia aunque suba el número de apoderados.
 *
 * Los montos base están en USD porque así los cobra la organización y el
 * transporte internacional. TIPO_CAMBIO hay que revisarlo cada mes: faltan
 * meses para el viaje y el dólar se mueve.
 *
 * Fuentes:
 *  - Inscripción, comisión, indumentaria y seguro: datos de la directiva.
 *  - Pasajes: bus Santiago–San Juan, USD 56–66 por tramo (Busbud/Rome2Rio,
 *    agosto 2026). Se presupuestan USD 150 ida y vuelta con holgura.
 *  - Tipo de cambio: dólar observado Banco Central, 31-08-2026.
 */

export const TIPO_CAMBIO = 925 // CLP por USD. Revisar mensualmente.

export const DELEGACION = {
  jugadoras: 10,
  cuerpoTecnico: 2,
  apoderados: 10, // uno por jugadora
} as const

export const DEPORTIVA = DELEGACION.jugadoras + DELEGACION.cuerpoTecnico // 12
export const TOTAL_VIAJEROS = DEPORTIVA + DELEGACION.apoderados // 22

/** Días con gasto de viáticos: 7 de torneo (13-19 dic) + 1 de viaje. */
export const DIAS = 8

export const COSTOS_USD = {
  inscripcion: 450,
  comisionTransferencia: 20,
  pasajePorPersona: 150, // ida y vuelta
  viaticoDiaPorPersona: 30, // traslados a partidos + alimentación
  seguroPorPersona: 45, // valor de mercado con cobertura deportiva
  indumentariaPorSet: 40,
} as const

/** Sets completos de indumentaria por jugadora (juego, alternativa, salida). */
export const SETS_INDUMENTARIA = 3

/** Margen para imprevistos: tipo de cambio, un partido extra, una urgencia. */
export const IMPREVISTOS = 0.1

export type Linea = { concepto: string; detalle: string; usd: number }

/**
 * Presupuesto para N viajeros financiados por el club.
 * La inscripción es fija (una por equipo) y la indumentaria depende solo del
 * número de jugadoras, no de cuánta gente viaje.
 */
export function presupuesto(personas: number) {
  const c = COSTOS_USD
  const lineas: Linea[] = [
    {
      concepto: 'Inscripción al torneo',
      detalle: 'Arancel por equipo, pago único',
      usd: c.inscripcion,
    },
    {
      concepto: 'Comisión de transferencia',
      detalle: 'Costo de girar el arancel a Argentina',
      usd: c.comisionTransferencia,
    },
    {
      concepto: 'Indumentaria',
      detalle: `${DELEGACION.jugadoras} jugadoras × ${SETS_INDUMENTARIA} equipos completos × USD ${c.indumentariaPorSet}`,
      usd: DELEGACION.jugadoras * SETS_INDUMENTARIA * c.indumentariaPorSet,
    },
    {
      concepto: 'Pasajes',
      detalle: `${personas} personas × USD ${c.pasajePorPersona} ida y vuelta`,
      usd: personas * c.pasajePorPersona,
    },
    {
      concepto: 'Viáticos',
      detalle: `${personas} personas × USD ${c.viaticoDiaPorPersona} × ${DIAS} días`,
      usd: personas * c.viaticoDiaPorPersona * DIAS,
    },
    {
      concepto: 'Seguro de viaje',
      detalle: `${personas} personas × USD ${c.seguroPorPersona}, con cobertura deportiva`,
      usd: personas * c.seguroPorPersona,
    },
  ]

  const subtotal = lineas.reduce((s, l) => s + l.usd, 0)
  const imprevistos = Math.round(subtotal * IMPREVISTOS)
  const totalUsd = subtotal + imprevistos

  return {
    lineas,
    subtotal,
    imprevistos,
    totalUsd,
    totalClp: totalUsd * TIPO_CAMBIO,
  }
}

/**
 * Escenario A: el club financia a la delegación deportiva y cada apoderado
 * costea su propio viaje. Es lo habitual y lo que se muestra en el sitio.
 */
export const ESCENARIO_DEPORTIVO = presupuesto(DEPORTIVA)

/** Escenario B: el club financia a las 22 personas. */
export const ESCENARIO_COMPLETO = presupuesto(TOTAL_VIAJEROS)

/** Lo que aporta un apoderado que se autofinancia (sin inscripción ni indumentaria). */
export const APORTE_APODERADO =
  COSTOS_USD.pasajePorPersona +
  COSTOS_USD.viaticoDiaPorPersona * DIAS +
  COSTOS_USD.seguroPorPersona
