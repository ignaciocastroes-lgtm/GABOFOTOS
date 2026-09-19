// Imágenes de los servicios del modal «Presupuestos y contacto».
// Cada servicio trae una imagen original (archivo en public/images) y Gabo puede cambiarla desde
// /admin → pestaña «Presupuestos». Si no cambia nada, se ve la original.
// Este archivo no toca el servidor: lo usan las rutas, el panel y los componentes del navegador.

/** Fila de la tabla `plan_imagenes` (una por servicio con imagen cambiada). */
export type PlanImagenDB = {
  clave: string
  path: string
  ancho: number
  alto: number
  updated_at: string
}

export const PLANES = [
  {
    id: "matrimonios",
    titulo: "Matrimonios",
    original: { src: "/images/portfolio/social-matrimonio-playa.jpg", ancho: 1040, alto: 1560, posicion: "50% 40%" },
  },
  {
    id: "colegios",
    titulo: "Colegios",
    original: { src: "/images/portfolio/colegios-foto-de-curso.jpg", ancho: 1517, alto: 870, posicion: "50% 50%" },
  },
  {
    id: "cuadros",
    titulo: "Cuadros de graduación",
    original: { src: "/images/portfolio/retratos-cuadro-licenciatura.jpg", ancho: 1125, alto: 1500, posicion: "50% 30%" },
  },
  {
    id: "sesiones",
    titulo: "Sesiones fotográficas",
    original: { src: "/images/portfolio/retratos-portada.jpg", ancho: 735, alto: 1310, posicion: "50% 25%" },
  },
  {
    id: "empresas",
    titulo: "Empresas: productos y comercial",
    original: { src: "/images/empresas/foto-producto-agua-tonica.jpg", ancho: 720, alto: 1340, posicion: "50% 75%" },
  },
  {
    id: "bautizos",
    titulo: "Bautizos",
    original: { src: "/images/gabofotos-logo.jpg", ancho: 1378, alto: 1378, posicion: "50% 50%" },
  },
  {
    id: "otros",
    titulo: "Otros eventos",
    original: { src: "/images/portfolio/social-fiesta-gala.jpg", ancho: 1599, alto: 1066, posicion: "50% 50%" },
  },
] as const

export type PlanId = (typeof PLANES)[number]["id"]

export function esPlanId(valor: unknown): valor is PlanId {
  return typeof valor === "string" && PLANES.some((p) => p.id === valor)
}

/** Lo que necesita el sitio para dibujar la imagen de un servicio. */
export type PlanImagen = {
  src: string
  ancho: number
  alto: number
  /** true si Gabo la cambió desde /admin (viene de Supabase y no pasa por el optimizador de Next). */
  personalizada: boolean
  /** Encuadre (object-position). Las imágenes que sube Gabo van centradas. */
  posicion: string
}

export type PlanImagenes = Record<PlanId, PlanImagen>

export function imagenesOriginales(): PlanImagenes {
  const salida = {} as PlanImagenes
  for (const p of PLANES) salida[p.id] = { ...p.original, personalizada: false }
  return salida
}
