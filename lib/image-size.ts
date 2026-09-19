// Lee el tipo y las dimensiones de una imagen mirando sus primeros bytes (sin librerías).
// Sirve para no confiar en lo que dice el navegador: el servidor comprueba que el archivo
// es de verdad un JPG, PNG o WebP, y de qué tamaño.

export type InfoImagen = {
  tipo: "image/jpeg" | "image/png" | "image/webp"
  ext: "jpg" | "png" | "webp"
  ancho: number
  alto: number
}

const u16 = (b: Uint8Array, i: number) => (b[i] << 8) | b[i + 1]
const u16le = (b: Uint8Array, i: number) => b[i] | (b[i + 1] << 8)
const ascii = (b: Uint8Array, i: number, n: number) => String.fromCharCode(...b.slice(i, i + n))

function jpeg(b: Uint8Array): InfoImagen | null {
  let i = 2
  while (i + 9 < b.length) {
    if (b[i] !== 0xff) {
      i++
      continue
    }
    const marcador = b[i + 1]
    if (marcador === 0xff) {
      i++ // relleno
      continue
    }
    // Marcadores sin largo: SOI, EOI, RSTn, TEM
    if (marcador === 0xd8 || marcador === 0xd9 || marcador === 0x01 || (marcador >= 0xd0 && marcador <= 0xd7)) {
      i += 2
      continue
    }
    // Start Of Frame (excluye DHT 0xC4, JPG 0xC8 y DAC 0xCC)
    if (marcador >= 0xc0 && marcador <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marcador)) {
      return { tipo: "image/jpeg", ext: "jpg", alto: u16(b, i + 5), ancho: u16(b, i + 7) }
    }
    i += 2 + u16(b, i + 2)
  }
  return null
}

function png(b: Uint8Array): InfoImagen | null {
  if (b.length < 24 || ascii(b, 12, 4) !== "IHDR") return null
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength)
  return { tipo: "image/png", ext: "png", ancho: dv.getUint32(16), alto: dv.getUint32(20) }
}

function webp(b: Uint8Array): InfoImagen | null {
  if (b.length < 30) return null
  const chunk = ascii(b, 12, 4)
  if (chunk === "VP8 ") {
    if (b[23] !== 0x9d || b[24] !== 0x01 || b[25] !== 0x2a) return null
    return { tipo: "image/webp", ext: "webp", ancho: u16le(b, 26) & 0x3fff, alto: u16le(b, 28) & 0x3fff }
  }
  if (chunk === "VP8L") {
    if (b[20] !== 0x2f) return null
    const ancho = 1 + (((b[22] & 0x3f) << 8) | b[21])
    const alto = 1 + (((b[24] & 0x0f) << 10) | (b[23] << 2) | ((b[22] & 0xc0) >> 6))
    return { tipo: "image/webp", ext: "webp", ancho, alto }
  }
  if (chunk === "VP8X") {
    const ancho = 1 + (b[24] | (b[25] << 8) | (b[26] << 16))
    const alto = 1 + (b[27] | (b[28] << 8) | (b[29] << 16))
    return { tipo: "image/webp", ext: "webp", ancho, alto }
  }
  return null
}

/** Devuelve la info de la imagen, o null si no es un JPG/PNG/WebP válido. */
export function leerImagen(bytes: Uint8Array): InfoImagen | null {
  let info: InfoImagen | null = null
  if (bytes.length > 4 && bytes[0] === 0xff && bytes[1] === 0xd8) info = jpeg(bytes)
  else if (bytes.length > 8 && bytes[0] === 0x89 && ascii(bytes, 1, 3) === "PNG") info = png(bytes)
  else if (bytes.length > 12 && ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 4) === "WEBP") info = webp(bytes)

  if (!info || info.ancho < 1 || info.alto < 1 || info.ancho > 12000 || info.alto > 12000) return null
  return info
}
