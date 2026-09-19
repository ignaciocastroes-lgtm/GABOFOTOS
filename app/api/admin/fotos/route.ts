import { NextResponse } from "next/server"
import { exigirAdmin } from "@/lib/admin-auth"
import { esCategoria } from "@/lib/fotos"
import { leerImagen } from "@/lib/image-size"
import { borrarObjeto, insertarFoto, listarFotos, menorOrden, subirObjeto, urlPublica } from "@/lib/supabase-rest"

export const runtime = "nodejs"

// El navegador ya comprime la foto (≈200–400 KB). Esto es solo un tope de seguridad, y queda
// bajo el límite de 4,5 MB por request de Vercel.
const MAX_BYTES = 3 * 1024 * 1024

function conUrl<T extends { path: string }>(foto: T) {
  return { ...foto, url: urlPublica(foto.path) }
}

/** Lista todas las fotos (también las ocultas) para el panel. */
export async function GET(request: Request) {
  const no = await exigirAdmin(request)
  if (no) return no
  try {
    const fotos = await listarFotos()
    return NextResponse.json({ fotos: fotos.map(conUrl) })
  } catch (e) {
    console.error("[GET /api/admin/fotos]", e)
    return NextResponse.json({ error: e instanceof Error ? e.message : "No se pudo leer la base de datos." }, { status: 500 })
  }
}

/** Sube una foto: la revisa, la guarda en Storage y la registra en la tabla. */
export async function POST(request: Request) {
  const no = await exigirAdmin(request)
  if (no) return no

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ error: "Formulario inválido." }, { status: 400 })
  }

  const archivo = form.get("file")
  const categoria = String(form.get("categoria") ?? "")
  const alt = String(form.get("alt") ?? "").trim().slice(0, 200)
  const autorizado = form.get("autorizado") === "true"

  if (!esCategoria(categoria)) return NextResponse.json({ error: "Categoría inválida." }, { status: 422 })
  if (!(archivo instanceof File) || archivo.size === 0) {
    return NextResponse.json({ error: "Falta la foto." }, { status: 422 })
  }
  if (archivo.size > MAX_BYTES) {
    return NextResponse.json({ error: "La foto pesa demasiado (máx. 3 MB)." }, { status: 413 })
  }
  if (categoria === "colegios" && !autorizado) {
    return NextResponse.json(
      { error: "En Colegios hay que confirmar que tienes autorización para publicar las fotos." },
      { status: 422 },
    )
  }

  const bytes = new Uint8Array(await archivo.arrayBuffer())
  const info = leerImagen(bytes)
  if (!info) return NextResponse.json({ error: "El archivo no es una imagen JPG, PNG o WebP válida." }, { status: 415 })

  // El nombre lo pone el servidor: nunca se usa el del archivo que manda el navegador.
  const id = crypto.randomUUID()
  const path = `${categoria}/${id}.${info.ext}`

  try {
    await subirObjeto(path, bytes, info.tipo)
    const menor = await menorOrden(categoria)
    try {
      const fila = await insertarFoto({
        id,
        categoria,
        path,
        ancho: info.ancho,
        alto: info.alto,
        alt,
        orden: menor === null ? 0 : menor - 1, // la foto nueva queda primera
        visible: true,
        autorizado,
      })
      return NextResponse.json({ foto: conUrl(fila) }, { status: 201 })
    } catch (e) {
      await borrarObjeto(path).catch(() => {}) // no dejar archivos huérfanos
      throw e
    }
  } catch (e) {
    console.error("[POST /api/admin/fotos]", e)
    return NextResponse.json({ error: e instanceof Error ? e.message : "No se pudo guardar la foto." }, { status: 500 })
  }
}
