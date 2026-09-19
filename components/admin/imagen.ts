/**
 * Prepara la foto antes de subirla: la endereza según el celular, la achica a 1600 px como máximo (o al tamaño que se pida)
 * y la guarda como WebP (o JPG si el navegador no puede). Una foto de celular de 4 MB queda en
 * ~250 KB, y al volver a dibujarla se borran los datos ocultos (ubicación GPS, modelo del celular).
 */
export async function comprimir(archivo: File, maxLado = 1600): Promise<Blob> {
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(archivo, { imageOrientation: "from-image" })
  } catch {
    throw new Error("No se pudo leer la foto. Usa JPG, PNG o WebP.")
  }
  const escala = Math.min(1, maxLado / Math.max(bitmap.width, bitmap.height))
  const ancho = Math.round(bitmap.width * escala)
  const alto = Math.round(bitmap.height * escala)

  const canvas = document.createElement("canvas")
  canvas.width = ancho
  canvas.height = alto
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Este navegador no puede procesar fotos.")
  ctx.drawImage(bitmap, 0, 0, ancho, alto)
  bitmap.close?.()

  const aBlob = (tipo: string, calidad: number) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, tipo, calidad))

  let blob = await aBlob("image/webp", 0.82)
  if (!blob || blob.type !== "image/webp") blob = await aBlob("image/jpeg", 0.86)
  if (!blob) throw new Error("No se pudo preparar la foto.")
  return blob
}
