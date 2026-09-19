/**
 * Auspicios al CLUB — federado, en la Liga Central, con ocho series en
 * competencia. Esto es distinto del auspicio al VIAJE de la Sub 13 al
 * Mundialito de San Juan, que vive enteramente en /apoyanos (lib/apoyo.ts y
 * components/site/camiseta-mundialito.tsx). No mezclar los dos: uno es apoyo
 * puntual a una delegación que viaja en diciembre, el otro es apoyo continuo
 * al club que compite todo el año.
 */

export type Paquete = {
  id: string
  nombre: string
  monto: number
  periodo: string
  incluye: string[]
  destacado?: boolean
}

export const PAQUETES: Paquete[] = [
  {
    id: 'colaborador',
    nombre: 'Colaborador',
    monto: 50_000,
    periodo: 'aporte anual',
    incluye: [
      'Tu logo en la página de auspiciadores del sitio',
      'Mención en nuestras redes',
      'Certificado de aporte para tu contabilidad',
    ],
  },
  {
    id: 'camiseta',
    nombre: 'Indumentaria',
    monto: 370_000,
    periodo: 'por temporada',
    incluye: [
      'Tu logo impreso en la camiseta de juego',
      'Presencia en todas las fotos de partidos y en redes',
      'Logo destacado en el sitio y en el lienzo de cancha',
      'Certificado de aporte para tu contabilidad',
    ],
    destacado: true,
  },
]

/**
 * Valor por posición en la camiseta de local y de visita del club, para
 * cualquiera de las ocho series federadas. Nada de esto tiene que ver con las
 * camisetas del viaje a San Juan.
 *
 * La de local vale un 5% más porque es la que se usa en la mayoría de los
 * partidos y la que aparece en las fotos oficiales. El precio se publica por
 * camiseta —que es la cifra que el auspiciador compara— y se ofrece el par con
 * el total a la vista.
 *
 * PENDIENTE: precios propuestos. Que la directiva los valide antes de ofrecerlos.
 */
export type PosicionCamiseta = {
  id: string
  posicion: string
  /** Precio en la camiseta de visita. La de local vale un 5% más. */
  alternativa: number
  titular: number
  nota: string
  /** Qué significa esa posición para el club, en palabras del club. */
  significado: string
  /** Solo tiene sentido cuando la camiseta es la del viaje (ver camiseta-mundialito.tsx). */
  cubre: string
  destacada?: boolean
}

export const CAMISETAS_POR_TEMPORADA = 2
export const RECARGO_TITULAR = 0.05

export const CAMISETA: PosicionCamiseta[] = [
  {
    id: 'pecho',
    cubre: 'Cubre casi íntegro el arancel de inscripción del equipo al torneo.',
    posicion: 'Pecho frontal',
    alternativa: 195_000,
    titular: 205_000,
    nota: 'La posición principal, sobre el escudo.',
    significado:
      'Es la que sale en cada foto de equipo, en cada premiación y en cada publicación. Quien está en el pecho es el auspiciador principal de la serie.',
    destacada: true,
  },
  {
    id: 'espalda',
    cubre: 'Cubre los viáticos de una jugadora durante toda la semana en San Juan.',
    posicion: 'Espalda',
    alternativa: 122_000,
    titular: 128_000,
    nota: 'Bajo el número de la jugadora.',
    significado:
      'Es lo que ve el público desde la gradería durante los sesenta minutos de partido, y lo que queda en las fotos de juego.',
  },
  {
    id: 'hombros',
    cubre: 'Cubre el pasaje de ida y vuelta de una jugadora.',
    posicion: 'Hombros',
    alternativa: 73_000,
    titular: 77_000,
    nota: 'Ambos hombros.',
    significado:
      'Aparece en los primeros planos, en las celebraciones y en los abrazos después del gol. Es la posición de las fotos que más se comparten.',
  },
  {
    id: 'mangas',
    cubre: 'Cubre los tres equipos completos de indumentaria de una jugadora.',
    posicion: 'Mangas',
    alternativa: 59_000,
    titular: 62_000,
    nota: 'Ambas mangas.',
    significado:
      'Acompaña cada pase y cada tiro. Discreta, pero presente en todo el partido y en todos los entrenamientos.',
  },
  {
    id: 'short',
    cubre: 'Cubre el seguro de viaje de dos jugadoras.',
    posicion: 'Short',
    alternativa: 49_000,
    titular: 51_000,
    nota: 'Costado del short.',
    significado:
      'La entrada más accesible para un comercio del barrio que quiere estar en la camiseta de las niñas de su propia comuna.',
  },
]

/** Las ocho series del club, todas afiliadas y en competencia federada. La escuelita no cuenta:
 * es el taller municipal, no una serie federada (ver ESCUELITA en lib/club.ts). */
export const SERIES_AUSPICIABLES = [
  'Sub 11 mixta',
  'Sub 13 femenina',
  'Sub 15 femenina',
  'Sub 17 femenina',
  'Sub 19 femenina',
  'Adulta femenina',
  'Sub 19 masculina',
  'Sub 23 masculina',
] as const

/** Costo de las 2 camisetas completas (las 5 posiciones) de una sola serie. */
export const TOTAL_CAMISETA_COMPLETA = CAMISETA.reduce(
  (s, c) => s + c.titular + c.alternativa,
  0,
)

/**
 * La indumentaria del club hay que fabricarla, serie por serie, y el Inter no
 * tiene presupuesto propio para eso. Es apoyo global al club federado —no a
 * una delegación puntual— por eso se ofrece en auspicio: es la forma en que
 * una empresa se vuelve parte sostenida del proyecto, temporada tras
 * temporada, no solo una vez.
 */
export const APOYO_CLUB = {
  titulo: 'Hay que fabricar la indumentaria del club',
  texto:
    'Competimos federados, en la Liga Central, con ocho series de local y de visita. Cada una necesita su propio juego de camisetas y el club no cuenta con presupuesto propio para eso. No es un catálogo de merchandising: es la forma en que una empresa se vuelve parte sostenida del Inter, serie tras serie y temporada tras temporada.',
} as const

/**
 * Apoyo con lienzos y colaboración abierta.
 *
 * A diferencia de la camiseta, acá no hay un precio fijo: el lienzo puede
 * costearlo una empresa grande o financiarlo entre varios comercios chicos, y
 * también cabe la colaboración en especie (materiales, transporte, impresión)
 * o la donación puntual. Por eso el llamado es abierto, no un catálogo.
 */
export const LIENZOS = {
  titulo: 'Un lienzo en la cancha',
  texto:
    'Un lienzo con tu marca en el Gimnasio Municipal Lo Espejo queda a la vista de todo el que entra a ver un partido, cada fin de semana de competencia. Es un apoyo que se queda en casa: no viaja, y puede ser tan simple como financiar la impresión de una lona con tu logo.',
  tipos: [
    {
      id: 'constante',
      nombre: 'Apoyo constante',
      detalle: 'Un lienzo permanente en la cancha, temporada tras temporada.',
    },
    {
      id: 'puntual',
      nombre: 'Apoyo puntual',
      detalle: 'Para un torneo, una fecha o una premiación específica.',
    },
    {
      id: 'colaboracion',
      nombre: 'Colaboración',
      detalle: 'Materiales, transporte, impresión o algo con lo que puedas aportar.',
    },
    {
      id: 'donacion',
      nombre: 'Donación',
      detalle: 'Un aporte puntual, sin contraprestación, para lo que el club necesite.',
    },
  ],
  googleMaps: 'https://maps.app.goo.gl/Z7KjimiErDG346N66?g_st=ac',
} as const

/**
 * Paquete premium para el viaje al Mundialito de San Juan. Es del VIAJE, no
 * del club: se usa solo en /apoyanos (camiseta-mundialito.tsx), nunca en
 * /auspiciadores.
 */
export const PAQUETE_VIAJE = {
  nombre: 'Auspiciador principal del viaje',
  monto: 1_000_000,
  periodo: 'aporte único',
  incluye: [
    'Tu logo en el pecho de ambas camisetas de la Sub 13 en el Mundialito',
    'Tu marca asociada públicamente al viaje a San Juan',
    'Reconocimiento en la despedida y el regreso de la delegación',
    'Informe con fotos y resultados al terminar el torneo',
  ],
} as const

/**
 * "Toma el marcador" — auspicio del broadcast en vivo.
 *
 * Cada partido en el Gimnasio Municipal Lo Espejo se dirige con ARDI, la
 * misma mesa de control que genera los datos de /noticias. Eso abre un
 * espacio publicitario que ningún otro club de la Liga Central puede
 * ofrecer todavía: la marca de un auspiciador en el marcador que ve, en
 * vivo, todo el gimnasio durante el partido — no una foto después, sino la
 * pantalla que el público mira mientras juega el equipo.
 *
 * PENDIENTE: precio y alcance exacto (un partido, una fecha, una temporada)
 * a definir con la directiva. Por ahora se ofrece como conversación, no
 * como paquete cerrado — es un producto nuevo y conviene calibrarlo con el
 * primer auspiciador antes de fijarle una tabla de precios.
 */
export const TOMA_EL_MARCADOR = {
  titulo: 'Toma el marcador',
  bajada: 'Tu marca, en vivo, frente a todo el gimnasio',
  texto:
    'Cada partido se transmite con ARDI, nuestra propia mesa de control de broadcast. Eso significa que el marcador que ve el público durante todo el partido no es un cartel fijo: es una pantalla, y esa pantalla puede llevar tu marca. Es la forma más directa de llegar a las familias que están ahí, en la cancha, mientras se juega.',
  incluye: [
    'Tu logo en el marcador en vivo durante el partido',
    'Presencia en el resumen que se publica después en /noticias',
    'A definir con la directiva: un partido, una fecha del campeonato, o la temporada completa',
  ],
} as const
