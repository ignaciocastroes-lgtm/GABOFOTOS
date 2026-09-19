/**
 * Galería del sitio.
 *
 * Para agregar una foto:
 *   1. Guarda el .webp en /public/images/galeria/
 *   2. Agrega una entrada acá arriba del todo (el orden del array es el orden en pantalla)
 *
 * Optimiza antes de subir. Una foto de celular pesa 4 MB; en la web debe pesar
 * menos de 200 KB. Con el script del repo:  npm run fotos
 *
 * Regla de contenido: fotos grupales y de acción. Nada de retratos individuales
 * de menores identificables. Ver README.
 */

export type Foto = {
  src: string
  alt: string
  /** Enlace opcional a la publicación original de Instagram. */
  post?: string
}

export const GALERIA: Foto[] = [
  {
    src: '/images/galeria/escuelita-selfie-grupo-chuecas.webp',
    alt: 'El profesor junto al grupo de la escuelita, todos con sus chuecas decoradas en alto',
  },
  {
    src: '/images/galeria/camiseta-escuela-hockey-patin.webp',
    alt: 'Camiseta de la Escuela de Hockey Patín colgada en la reja de la cancha',
  },
  {
    src: '/images/galeria/sub13-campeonas-copa-plata.webp',
    alt: 'La Sub 13 femenina celebra con la Copa de Plata del Apertura 2026',
  },
  {
    src: '/images/galeria/quintanilla-copa-plata.webp',
    alt: 'El profesor Rodrigo Quintanilla con la Copa de Plata y la medalla de campeón',
  },
  {
    src: '/images/galeria/sub17-campeonas-abrazo.webp',
    alt: 'La Sub 17 femenina se abraza con el trofeo tras ganar la Copa de Plata',
  },
  {
    src: '/images/galeria/sub13-plantel-podio.webp',
    alt: 'Plantel de la Sub 13 femenina con el cuerpo técnico y la copa',
  },
  {
    src: '/images/galeria/sub13-medallas-gimnasio.webp',
    alt: 'Las jugadoras muestran sus medallas en el gimnasio junto a su entrenador',
  },
  {
    src: '/images/galeria/sub17-celebracion.webp',
    alt: 'Jugadoras de la Sub 17 celebrando con el trofeo',
  },
  {
    src: '/images/galeria/plantel-copas.webp',
    alt: 'El plantel completo junto al cuerpo técnico con las dos copas conquistadas',
  },
  {
    src: '/images/galeria/jugadoras-trofeo.webp',
    alt: 'Tres jugadoras del club posando con el trofeo y sus medallas',
  },
  {
    src: '/images/galeria/campeonas-con-profe.webp',
    alt: 'Dos campeonas con su profesor y la copa después de la premiación',
  },
  {
    src: '/images/galeria/equipo-gimnasio.webp',
    alt: 'El equipo con sus medallas en el Gimnasio Municipal',
  },
  {
    src: '/images/galeria/plantel-2026.webp',
    alt: 'El plantel completo del club junto al cuerpo técnico en el Gimnasio Municipal',
  },
]
