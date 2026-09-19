/**
 * Auditoría del proyecto.
 *
 *   pnpm auditar
 *
 * Revisa dos cosas y falla el build si encuentra alguna:
 *
 *  1. El nombre del club. Es «Internacional Lo Espejo», SIN «de».
 *  2. Componentes huérfanos: archivos en components/site/ que nadie importa.
 *     Un componente borrado del proyecto pero no de Git sigue en el repositorio
 *     y el auditor de nombres lo revisa igual, así que un archivo muerto puede
 *     romper un deploy. Mejor detectarlo acá.
 *
 * Corre antes de compilar: `pnpm build` lo ejecuta primero.
 */
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const PROHIBIDO = [
  { patron: /Internacional de Lo Espejo/g, correcto: 'Internacional Lo Espejo' },
  { patron: /Internacional de Hockey Pat[ií]n/g, correcto: 'Hockey Patín Internacional' },
  { patron: /Club Internacional de/g, correcto: 'Club Hockey Patín Internacional Lo Espejo' },
  { patron: /Club de Hockey Internacional/g, correcto: 'Club Hockey Patín Internacional Lo Espejo' },
  // El tratamiento oficial del municipio lleva «Ilustre» delante.
  {
    patron: /(?<!Ilustre )Municipalidad de Lo Espejo/g,
    correcto: 'Ilustre Municipalidad de Lo Espejo',
  },
]

const EXTENSIONES = new Set(['.ts', '.tsx', '.md', '.json'])
const IGNORAR = new Set(['node_modules', '.next', '.git', 'public', 'fotos-originales'])

async function* archivos(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (IGNORAR.has(e.name)) continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) yield* archivos(p)
    else if (EXTENSIONES.has(path.extname(e.name))) yield p
  }
}

let errores = 0
for await (const archivo of archivos('.')) {
  const texto = await readFile(archivo, 'utf8')
  texto.split('\n').forEach((linea, i) => {
    for (const { patron, correcto } of PROHIBIDO) {
      patron.lastIndex = 0
      const m = patron.exec(linea)
      if (m) {
        console.error(`${archivo}:${i + 1}  «${m[0]}»  →  debe decir «${correcto}»`)
        errores++
      }
    }
  })
}

if (errores > 0) {
  console.error(
    `\n${errores} error(es) de nomenclatura. El club es «Internacional Lo Espejo», sin «de», ` +
      'y el municipio es la «Ilustre Municipalidad de Lo Espejo».',
  )
  process.exit(1)
}

// ── Componentes huérfanos ──
const fuentes = []
for await (const f of archivos('.')) {
  if (f.endsWith('.ts') || f.endsWith('.tsx')) fuentes.push(f)
}
const todoElCodigo = (
  await Promise.all(fuentes.map((f) => readFile(f, 'utf8')))
).join('\n')

const huerfanos = []
for (const f of fuentes) {
  if (!f.includes(path.join('components', 'site'))) continue
  const nombre = path.basename(f, path.extname(f))
  // Se puede importar como '@/components/site/x' o, entre vecinos, como './x'
  const importado =
    todoElCodigo.includes(`components/site/${nombre}'`) ||
    todoElCodigo.includes(`from './${nombre}'`)
  if (!importado) huerfanos.push(f)
}

if (huerfanos.length > 0) {
  console.error('\nComponentes que nadie importa. Bórralos del repositorio:')
  for (const h of huerfanos) console.error(`  git rm ${h}`)
  console.error('\nUn archivo muerto en Git puede romper el deploy aunque no se use.')
  process.exit(1)
}

console.log('Nombres correctos. Sin componentes huérfanos.')
