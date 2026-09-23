// Tipos y validaciones de las fotos administrables (tabla `fotos` de Supabase).

export const CATEGORIAS_FOTO = ["matrimonios", "colegios", "cumpleanos", "deporte"] as const
export type CategoriaFoto = (typeof CATEGORIAS_FOTO)[number]

export type FotoDB = {
  id: string
  categoria: CategoriaFoto
  path: string
  ancho: number
  alto: number
  alt: string
  orden: number
  visible: boolean
  autorizado: boolean
  created_at: string
}

export function esCategoria(valor: unknown): valor is CategoriaFoto {
  return typeof valor === "string" && (CATEGORIAS_FOTO as readonly string[]).includes(valor)
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Los ids llegan de la URL y se usan en filtros de la base de datos: siempre se validan. */
export function esUuid(valor: unknown): valor is string {
  return typeof valor === "string" && UUID.test(valor)
}
