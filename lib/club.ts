/**
 * Fuente única de verdad con los datos institucionales del club.
 * Todo el sitio lee desde acá: no dupliques estos valores en los componentes.
 *
 * ADVERTENCIA: nunca agregues R.U.N. de personas a este archivo. Es código
 * público que se publica en el bundle del navegador y queda en el historial de Git.
 * Los R.U.N. de la directiva viven solo en el acta ante el Registro Civil.
 */

export const CLUB = {
  /**
   * OJO CON EL NOMBRE: es «Internacional Lo Espejo», sin «de».
   * No existe «Internacional DE Lo Espejo». Usa siempre estas constantes en vez
   * de escribir el nombre a mano en un componente: así no vuelve a divergir.
   *
   *   razonSocial  → documentos legales, pie de página, transparencia
   *   nombreLargo  → el nombre del escudo, para alt de imágenes y metadatos
   *   nombreCorto  → titulares y menciones en el cuerpo del texto
   *   nombreLogo   → las dos líneas del logotipo en la cabecera y el pie
   */
  razonSocial: 'Club Deportivo Social y Cultural Hockey Internacional Lo Espejo',
  nombreLargo: 'Club Hockey Patín Internacional Lo Espejo',
  nombreCorto: 'Internacional Lo Espejo',
  nombreLogo: { linea1: 'Hockey Patín', linea2: 'Internacional Lo Espejo' },
  rut: '65.221.641-2',
  fundacion: 2022,
  email: 'internacionalloespejo@gmail.com',
  instagram: 'https://www.instagram.com/internacional_lo_espejo/',
  instagramCanal: 'https://www.instagram.com/channel/AbYDSDWNYqY7VxlN/',
  instagramHandle: '@internacional_lo_espejo',

  sede: {
    nombre: 'Gimnasio Municipal Lo Espejo',
    direccion: 'Av. Américo Vespucio 3300, Lo Espejo, Región Metropolitana',
    lat: -33.5249755,
    lng: -70.6954514,
  },
} as const

/**
 * Estructura federativa del hockey patín chileno.
 *
 * Dos entidades distintas: la Federación Deportiva Chilena de Patinaje es el
 * organismo nacional que regula todas las disciplinas sobre patines (velocidad,
 * artístico, skateboarding y hockey). La Liga Central administra las
 * competencias de hockey patín federado en la Región Metropolitana.
 *
 * El Inter es socio fundador de la Liga Central, confirmado por Rodrigo
 * Quintanilla: la fundaron un grupo acotado de clubes y luego se amplió para
 * que otros pudieran sumarse. La gestión fue del ex presidente del club,
 * Alfredo Sepúlveda.
 */
export const FEDERACION = {
  nacional: 'Federación Deportiva Chilena de Patinaje',
  nacionalSitio: 'https://fdpatin.cl',
  liga: 'Liga Central de Clubes de Hockey sobre Patines',
  ligaSigla: 'LCH',
  ligaConstituida: '2023-11-29',
  formato:
    'Torneos semestrales, Apertura y Clausura, en dos niveles: Liga de Honor y Liga Regular',
  clubesFundadores: [
    'León Prado',
    'Bata',
    'Estudiantil San Miguel',
    'Llano Subercaseaux',
    'Internacional Lo Espejo',
    'Rhinos PAC',
    'Barcelona San Andrés',
  ],
  /** Gestor de la fundación por parte del Inter. */
  gestorFundacion: 'Alfredo Sepúlveda',
  gestorCargo: 'Ex presidente del club',
} as const

/**
 * Antecedentes legales, tomados del Certificado de Vigencia y del Certificado
 * de Directorio del Servicio de Registro Civil e Identificación.
 *
 * Solo datos de la persona jurídica. Los R.U.N. de los directores aparecen en
 * esos certificados y NO se publican: ver la advertencia al inicio del archivo.
 */
export const PERSONALIDAD_JURIDICA = {
  inscripcion: 'N° 342285',
  fechaConstitucion: '2022-12-22',
  fechaInscripcion: '2022-12-28',
  decreto: '286',
  naturaleza: 'Organización Funcional',
  estado: 'Vigente',
  domicilioLegal: 'Av. Américo Vespucio 3300, Lo Espejo, Región Metropolitana',
  registroColaboradores: 'https://registros19862.gob.cl/institucion/65221641/ficha',
} as const

/** Datos bancarios para transferencias y depósitos. */
export const CUENTA = {
  banco: 'BancoEstado',
  tipo: 'Cuenta Vista (Chequera Electrónica)',
  numero: '39670058534',
  titular: CLUB.razonSocial,
  rut: CLUB.rut,
  email: CLUB.email,
} as const

/**
 * Directiva electa el 02-03-2026, con mandato de 3 años (hasta marzo de 2029).
 * Sin R.U.N.: ver advertencia arriba.
 */
export const DIRECTIVA = [
  { nombre: 'Verónica Caroline Cares Espinoza', cargo: 'Presidenta', representanteLegal: true },
  { nombre: 'Juan Carlos Oyarzún Altamirano', cargo: 'Secretario' },
  { nombre: 'Gabriel Antonio Cabezas Salgado', cargo: 'Tesorero' },
] as const

export const DIRECTIVA_VIGENCIA = {
  electaEl: '2026-03-02',
  duracionAnios: 3,
  vigenteHasta: '2029-03-02',
} as const

/**
 * Cuerpo técnico.
 *
 * `bio` es lo que se muestra en /profesores. Está redactado con lo que nos
 * consta; si un profesor quiere contar más de su trayectoria, se amplía acá.
 *
 * `foto` apunta a /public/images/profesores/, en formato vertical 4:5 y con
 * encuadre de busto. Quintanilla y Rolo están fotografiados contra el telón del
 * club; lo ideal es repetir esa toma con Toño y Facundo para que las cuatro
 * fichas queden idénticas. Sin foto se muestra el monograma con las iniciales.
 */
export type Profesor = {
  id: string
  nombre: string
  cargo: string
  origen?: string
  series: string[]
  /** Una frase. Es lo único que se muestra en la grilla de /profesores. */
  resumen: string
  /** Bio de 3-5 frases. Se usa como entrada en la página propia del profesor. */
  bio: string
  foto?: string
  /** Se muestra en el bloque destacado de /profesores. */
  destacado?: boolean
}

export const CUERPO_TECNICO: Profesor[] = [
  {
    id: 'rodrigo-quintanilla',
    nombre: 'Rodrigo Quintanilla Cerpa',
    cargo: 'Entrenador y formador',
    series: ['Escuelita municipal', 'Series competitivas'],
    destacado: true,
    foto: '/images/profesores/rodrigo-quintanilla.webp',
    resumen:
      'Dirigió a Las Marcianitas al título mundial de 2006, el primer campeonato del mundo de un deporte colectivo chileno.',
    bio: 'Se enamoró del hockey en 1980, siendo niño, viendo por televisión el Mundial masculino disputado en Chile. Fue arquero de las selecciones juveniles y de la adulta hasta 2003. En 2002 asumió las selecciones femeninas y el 7 de octubre de 2006 dirigió a Las Marcianitas al título mundial en casa, tras vencer 2-1 a España con gol de oro: el primer campeonato del mundo de Chile en un deporte colectivo. Sumó el tercer lugar mundial de 2014 y el cuarto de 2017, y ese mismo 2014 el Círculo de Periodistas Deportivos lo eligió Mejor Entrenador de Chile, por delante de Jorge Sampaoli. Cerró su ciclo como head coach de las selecciones nacionales en 2023.',
  },
  {
    id: 'rodolfo-oyola',
    nombre: 'Rodolfo «Rolo» Oyola',
    cargo: 'Entrenador y formador',
    origen: 'San Juan, Argentina',
    series: ['Escuelita municipal', 'Series competitivas'],
    destacado: true,
    foto: '/images/profesores/rodolfo-oyola.webp',
    resumen:
      'El profesor de profesores: entrenador de selecciones chilenas desde 2007 y ayudante técnico de Las Marcianitas desde 2016.',
    bio: 'Sanjuanino, de una de las grandes cunas mundiales del hockey patín. Llegó a Chile hace más de dos décadas y en 2007 fue designado entrenador de la Selección Chilena Sub-20 masculina, proceso que culminó con el tercer lugar en el Mundial de Bassano del Grappa, Italia. Trabajó junto a Rodrigo Quintanilla en Las Marcianitas como ayudante técnico, integrando oficialmente el cuerpo técnico en 2016, y dirigió procesos de Sub-15, Sub-17 y adulta femenina, incluidos los mundiales de 2017 y 2022. En 2021, con la federación en crisis de financiamiento, acumuló meses sin sueldo y aun así siguió trabajando con la selección. Hoy trabaja codo a codo con su hijo Facundo, también entrenador del club.',
  },
  {
    id: 'antonio-espinoza',
    nombre: 'José Antonio «Toño» Espinoza',
    cargo: 'Preparador de arqueros',
    series: ['Todas las series'],
    destacado: true,
    foto: '/images/profesores/antonio-espinoza.webp',
    resumen: 'Hexamundialista con la Roja y uno de los mejores arqueros de la historia del hockey chileno.',
    bio: 'Llegó al hockey por casualidad: a los 13 años, jugando fútbol en las inferiores de la U, lo invitaron a reemplazar a un arquero en el equipo de sus hermanos. Terminó siendo seleccionado nacional en seis Campeonatos del Mundo —1980, 1982, 1984, 1988, 1989 y 1991— con históricos cuartos lugares en 1980, 1982 y 1989, y medalla de oro en los Juegos Cruz del Sur de 1982 en Rosario. Jugó en Italia por Giovinazzo, Prato y Vercelli, y en Chile por la U, la Católica, Manuel de Salas, UMCE y Estudiantil San Miguel. Fue de los primeros arqueros en salir del marco y jugar con las piernas, casi como un jugador más. En enero de 2025 encabezó una clínica para arqueros en el Gimnasio Municipal Lo Espejo.',
  },
  {
    id: 'facundo-oyola',
    nombre: 'Facundo «El Facu» Oyola',
    cargo: 'Entrenador',
    origen: 'San Juan, Argentina',
    series: ['Series formativas y competitivas'],
    foto: '/images/profesores/facundo-oyola.webp',
    resumen: 'Hijo de Rolo Oyola y formador de las categorías base, hoy trabaja codo a codo con su padre en el Inter.',
    bio: 'Es hijo de Rodolfo «Rolo» Oyola y, como él, formado en la escuela sanjuanina del hockey patín. Se dedicó años a las categorías formativas de Independiente La Florida, donde en 2023 dirigió a la Sub 15 femenina en el Torneo Richet Zapata de San Juan. A fines de 2025 se incorporó al Inter, donde hoy trabaja codo a codo con su padre. Para «el Facu», formar un jugador no es solo enseñarle a patinar, pasar o marcar: es enseñarle a trabajar en equipo, a superar las dificultades, a respetar al rival y a no dejar de luchar por sus sueños.',
  },
]

/** Series que el club presenta esta temporada. */
export type Rama = 'femenina' | 'masculina' | 'mixta' | 'formativa'

export type Serie = {
  id: string
  nombre: string
  rama: Rama
  detalle: string
}

export const SERIES: Serie[] = [
  { id: 'escuelita', nombre: 'Escuelita', rama: 'formativa', detalle: 'Primeros pasos sobre patines' },
  { id: 'sub11', nombre: 'Sub 11', rama: 'mixta', detalle: 'Mixta' },
  { id: 'fem-sub13', nombre: 'Sub 13', rama: 'femenina', detalle: 'Femenina' },
  { id: 'fem-sub15', nombre: 'Sub 15', rama: 'femenina', detalle: 'Femenina' },
  { id: 'fem-sub17', nombre: 'Sub 17', rama: 'femenina', detalle: 'Femenina' },
  { id: 'fem-sub19', nombre: 'Sub 19', rama: 'femenina', detalle: 'Femenina' },
  { id: 'fem-adulta', nombre: 'Adulta', rama: 'femenina', detalle: 'Femenina' },
  { id: 'mas-sub19', nombre: 'Sub 19', rama: 'masculina', detalle: 'Masculina' },
  { id: 'mas-sub23', nombre: 'Sub 23', rama: 'masculina', detalle: 'Masculina' },
]

export const RAMAS: { id: Rama; titulo: string; bajada: string }[] = [
  { id: 'formativa', titulo: 'Escuelita', bajada: 'Formación desde cero, gratuita y abierta a la comuna.' },
  { id: 'mixta', titulo: 'Serie mixta', bajada: 'Niñas y niños compiten juntos.' },
  { id: 'femenina', titulo: 'Rama femenina', bajada: 'La columna vertebral del club: cinco series en competencia.' },
  { id: 'masculina', titulo: 'Rama masculina', bajada: 'Dos series juveniles en desarrollo.' },
]

/**
 * La escuelita es un taller de la Ilustre Municipalidad de Lo Espejo, impartido por el
 * club a través de sus profesores. No es una actividad propia del club: hay que
 * decirlo así, y el municipio autorizó el uso de sus logos.
 */
export const ESCUELITA = {
  organiza: 'Ilustre Municipalidad de Lo Espejo',
  oficina: 'Oficina de Deportes y Recreación',
  profesores: ['Rodrigo Quintanilla', 'Rodolfo Oyola'],
  dias: 'Lunes y viernes',
  horario: '16:30 a 18:30 h',
  lugar: 'Gimnasio Municipal, Av. Américo Vespucio 3300',
  costo: 'Gratuita',
  logos: [
    { src: '/images/logos/muni-lo-espejo.webp', alt: 'Ilustre Municipalidad de Lo Espejo · Oficina de Deportes' },
  ],
} as const

/**
 * En el gimnasio conviven dos cosas distintas y conviene no confundirlas:
 * la escuelita municipal (semillero, abierta, gratuita) y el club federado
 * (compite en la Liga Central). Una alimenta a la otra.
 */
export const VIAS = [
  {
    id: 'escuelita',
    titulo: 'La escuelita',
    subtitulo: 'Taller municipal · El semillero',
    texto:
      'Es donde se empieza. Gratuita, con los patines prestados y sin experiencia previa. La organiza la Ilustre Municipalidad de Lo Espejo y la imparten nuestros profesores. Está abierta a la comuna, pero también recibimos a quienes vienen de otras comunas y regiones: hoy tenemos jugadores en esa condición.',
    puntos: ['Sin costo', 'Desde cero', 'Lunes y viernes', 'Abierta a todos'],
  },
  {
    id: 'club',
    titulo: 'El club',
    subtitulo: 'Federado · Liga Central de Clubes de Hockey sobre Patines',
    texto:
      'Es el paso siguiente. El club está afiliado a la Federación Deportiva Chilena de Patinaje y compite federado en la Liga Central, con ocho series: una mixta, cinco damas y dos masculina. Acá se entrena para el campeonato, se viaja y se representa a Lo Espejo dentro y fuera de Chile.',
    puntos: ['Ocho series', 'Competencia federada', 'Torneos internacionales'],
  },
] as const

/** A dónde apunta el proyecto deportivo a largo plazo. */
export const PROYECTO = {
  titulo: 'Adónde queremos que lleguen',
  texto:
    'El objetivo no termina en la cancha del gimnasio. Queremos formar deportistas para los que haber pasado por el Internacional Lo Espejo sea parte de su currículum: jugadoras y jugadores que lleguen a equipos en el extranjero o a vestir la camiseta de la selección chilena de hockey patín.',
} as const

export function formatCLP(value: number) {
  return '$' + value.toLocaleString('es-CL')
}

/**
 * Número de WhatsApp del club, en formato 569XXXXXXXX (sin +, sin espacios).
 * Se configura en Vercel como NEXT_PUBLIC_WHATSAPP.
 *
 * Va con NEXT_PUBLIC_ a propósito: un teléfono de contacto no es un secreto y
 * los botones lo necesitan en el navegador. No confundir con MP_ACCESS_TOKEN,
 * que jamás lleva ese prefijo.
 */
export const WHATSAPP = (process.env.NEXT_PUBLIC_WHATSAPP ?? '').replace(/\D/g, '')

export const HAY_WHATSAPP = WHATSAPP.length >= 11

/**
 * Devuelve el enlace de WhatsApp con el mensaje prellenado, o null si el número
 * todavía no está configurado. Los componentes usan el null para no pintar un
 * botón roto: un wa.me con número vacío lleva a una página de error.
 */
export function whatsappHref(mensaje: string): string | null {
  if (!HAY_WHATSAPP) return null
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`
}

/** Enlace mailto con asunto y cuerpo prellenados. */
export function mailtoHref(asunto: string, cuerpo: string): string {
  return `mailto:${CLUB.email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`
}
