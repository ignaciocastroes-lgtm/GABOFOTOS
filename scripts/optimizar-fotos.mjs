/**
 * Optimiza las fotos de la galería.
 *
 *   1. Copia las fotos originales (jpg/png del celular) a  fotos-originales/
 *   2. Ejecuta:  npm run fotos
 *   3. Los .webp quedan en public/images/galeria/ listos para agregar a lib/galeria.ts
 *
 * sharp NO está en package.json a propósito: es una herramienta local, el sitio
 * no la necesita para compilar, y agregarla desincroniza el pnpm-lock.yaml y
 * rompe el deploy en Vercel. Instálala aparte cuando vayas a usar el script:
 *
 *   pnpm add -D sharp --ignore-workspace-root-check
 *   pnpm fotos
 *
 * y después sácala de nuevo con  pnpm remove sharp  para dejar el lockfile limpio.
 */
import { readdir, mkdir } from 'node:fs/promises'
import path from 'node:path'

let sharp
try {
  sharp = (await import('sharp')).default
} catch {
  console.error('Falta sharp. Instálala con:  pnpm add -D sharp')
  console.error('Cuando termines:              pnpm remove sharp')
  process.exit(1)
}

const ENTRADA = 'fotos-originales'
const SALIDA = 'public/images/galeria'
const ANCHO = 1000
const CALIDAD = 80

await mkdir(SALIDA, { recursive: true })

let archivos = []
try {
  archivos = await readdir(ENTRADA)
} catch {
  console.log(`Crea la carpeta ${ENTRADA}/ y pon ahi las fotos originales.`)
  process.exit(0)
}

const imagenes = archivos.filter((f) => /\.(jpe?g|png|webp|heic)$/i.test(f))
if (imagenes.length === 0) {
  console.log(`No hay imagenes en ${ENTRADA}/`)
  process.exit(0)
}

for (const archivo of imagenes) {
  const nombre = path.parse(archivo).name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const destino = path.join(SALIDA, `${nombre}.webp`)
  const info = await sharp(path.join(ENTRADA, archivo))
    .rotate()
    .resize({ width: ANCHO, withoutEnlargement: true })
    .webp({ quality: CALIDAD })
    .toFile(destino)
  console.log(`${archivo} -> ${destino}  (${Math.round(info.size / 1024)} KB)`)
}

console.log(`\nListo. Agrega las rutas a lib/galeria.ts:\n`)
for (const archivo of imagenes) {
  const nombre = path.parse(archivo).name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  console.log(`  { src: '/images/galeria/${nombre}.webp', alt: 'DESCRIBE LA FOTO' },`)
}
