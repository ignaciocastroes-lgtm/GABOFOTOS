import { NextResponse } from "next/server"
import { exigirAdmin } from "@/lib/admin-auth"
import { leerImagen } from "@/lib/image-size"
import { esPlanId } from "@/lib/planes"
import {
  borrarObjeto,
  borrarPlanImagen,
  guardarPlanImagen,
  obtenerPlanImagen,
  subirObjeto,
  urlPublica,
} from "@/lib/supabase-rest"

export const runtime = "nodejs"

// El navegador ya reduce la imagen. Esto es solo un tope de seguridad, bajo el límite de 4,5 MB de Vercel.
const MAX_BYTES = 3 * 1024 * 1024

type Contexto = { params: Promise<{ clave: string }> }

/** Cambia la imagen de un servicio: la revisa, la guarda en Storage y reemplaza a la anterior. */
export async function POST(request: Request, { params }: Contexto) {
  const no = await exigirAdmin(request)
  if (no) return no

  const { clave } = await params
  if (!esPlanId(clave)) return NextResponse.json({ error: "Servicio inválido." }, { status: 400 })

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ error: "Formulario inválido." }, { status: 400 })
  }

  const archivo = form.get("file")
  if (!(archivo instanceof File) || archivo.size === 0) {
    return NextResponse.json({ error: "Falta la imagen." }, { status: 422 })
  }
  if (archivo.size > MAX_BYTES) {
    return NextResponse.json({ error: "La imagen pesa demasiado (máx. 3 MB)." }, { status: 413 })
  }

  const bytes = new Uint8Array(await archivo.arrayBuffer())
  const info = leerImagen(bytes)
  if (!info) return NextResponse.json({ error: "El archivo no es una imagen JPG, PNG o WebP válida." }, { status: 415 })

  // El nombre lo pone el servidor y cambia en cada subida, así el navegador nunca muestra una versión vieja.
  const path = `planes/${clave}-${crypto.randomUUID()}.${info.ext}`

  try {
    const anterior = await obtenerPlanImagen(clave)
    await subirObjeto(path, bytes, info.tipo)
    try {
      const fila = await guardarPlanImagen({ clave, path, ancho: info.ancho, alto: info.alto })
      if (anterior && anterior.path !== path) {
        await borrarObjeto(anterior.path).catch((e) => console.error("[planes: objeto anterior]", e))
      }
      return NextResponse.json({ imagen: { clave, url: urlPublica(fila.path), ancho: fila.ancho, alto: fila.alto } }, { status: 201 })
    } catch (e) {
      await borrarObjeto(path).catch(() => {}) // no dejar archivos huérfanos
      throw e
    }
  } catch (e) {
    console.error("[POST /api/admin/planes/[clave]]", e)
    return NextResponse.json({ error: e instanceof Error ? e.message : "No se pudo guardar la imagen." }, { status: 500 })
  }
}

/** Vuelve a la imagen original del servicio: borra la que subió Gabo. */
export async function DELETE(request: Request, { params }: Contexto) {
  const no = await exigirAdmin(request)
  if (no) return no

  const { clave } = await params
  if (!esPlanId(clave)) return NextResponse.json({ error: "Servicio inválido." }, { status: 400 })

  try {
    const actual = await obtenerPlanImagen(clave)
    if (actual) {
      await borrarPlanImagen(clave)
      await borrarObjeto(actual.path).catch((e) => console.error("[planes: DELETE objeto]", e))
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("[DELETE /api/admin/planes/[clave]]", e)
    return NextResponse.json({ error: e instanceof Error ? e.message : "No se pudo restaurar." }, { status: 500 })
  }
}
