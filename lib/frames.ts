// Cuadros de graduación con marco.
// REGLA: los cuadros con marco son SOLO para fotos de graduación (licenciatura y egreso).
// No se ofrecen para matrimonios, retratos, deporte ni otros trabajos.
//
// Según la llamada con Gabo (17-sep-2026):
//  - son 3 tipos de marco, uno mejor que otro, y todos del mismo tamaño;
//  - el stock cambia y hay variantes del mismo marco, así que Gabo los muestra y explica
//    al cotizar en vez de fijar modelos en el sitio.
// Regla del sitio: no se publican precios. Cada nivel termina en una cotización por WhatsApp.

export type FrameLevel = {
  id: string
  name: string
  finish: string
}

// Medida de los cuadros (confirmada).
export const frameSize = "30×40 cm"

export const frameLevels: FrameLevel[] = [
  { id: "nivel-1", name: "Nivel 1", finish: "Acabado sencillo" },
  { id: "nivel-2", name: "Nivel 2", finish: "Acabado intermedio" },
  { id: "nivel-3", name: "Nivel 3", finish: "Acabado superior" },
]
