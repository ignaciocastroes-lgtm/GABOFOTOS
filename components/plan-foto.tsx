import Image from "next/image"
import type { PlanImagen } from "@/lib/planes"

/**
 * Imagen de un servicio de «Presupuestos y contacto». El contenedor tiene que ser `relative` y
 * traer su propio tamaño: la imagen lo llena y se recorta para encajar.
 * Va sin texto alternativo a propósito: al lado siempre está el nombre del servicio, y como Gabo
 * puede cambiar la imagen desde /admin, cualquier descripción fija podría quedar equivocada.
 */
export function PlanFoto({ imagen, sizes }: { imagen: PlanImagen; sizes: string }) {
  const contain = imagen.ajuste === "contain"
  return (
    <Image
      src={imagen.src}
      alt=""
      fill
      sizes={sizes}
      // Las imágenes que sube Gabo (Supabase) ya vienen reducidas desde su CDN.
      unoptimized={imagen.remota}
      style={{ objectPosition: imagen.posicion }}
      className={contain ? "object-contain" : "object-cover"}
    />
  )
}
