'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check, AlertTriangle, LogOut, Pencil, Trash2, ArrowLeft, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { SERIES, CUERPO_TECNICO } from '@/lib/club'
import { ordenarPorFecha, type Noticia } from '@/lib/noticias'

type Tab = 'partido' | 'video' | 'instagram' | 'nota' | 'existentes'

function Bloque({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-border bg-card p-6 md:p-7">{children}</div>
}

function Checklist({
  opciones,
  seleccion,
  onChange,
}: {
  opciones: { id: string; label: string }[]
  seleccion: string[]
  onChange: (v: string[]) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {opciones.map((o) => {
        const activo = seleccion.includes(o.id)
        return (
          <button
            key={o.id}
            type="button"
            onClick={() =>
              onChange(activo ? seleccion.filter((x) => x !== o.id) : [...seleccion, o.id])
            }
            aria-pressed={activo}
            className={
              activo
                ? 'rounded-md bg-primary px-3 py-1.5 text-xs font-semibold uppercase text-primary-foreground'
                : 'rounded-md border border-border px-3 py-1.5 text-xs font-semibold uppercase text-muted-foreground hover:border-primary hover:text-primary'
            }
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

/**
 * Publica una noticia de verdad: POST a /api/admin/noticias, que la
 * inserta en Supabase. Ya no hay paso de "copia este código y pégalo" —
 * al tocar el botón, la noticia queda publicada. Next.js revalida las
 * páginas afectadas dentro de 60 segundos (ver `revalidate` en cada
 * page.tsx que muestra noticias).
 */
function BotonPublicar({ objeto, disabled }: { objeto: Record<string, unknown> | null; disabled?: boolean }) {
  const [estado, setEstado] = useState<'listo' | 'publicando' | 'ok' | 'error'>('listo')
  const [error, setError] = useState<string | null>(null)
  const [verJson, setVerJson] = useState(false)

  async function publicar() {
    if (!objeto) return
    setEstado('publicando')
    setError(null)
    try {
      const res = await fetch('/api/admin/noticias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(objeto),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error ?? 'No se pudo publicar.')
        setEstado('error')
        return
      }
      setEstado('ok')
    } catch {
      setError('No se pudo conectar con el servidor.')
      setEstado('error')
    }
  }

  return (
    <div className="mt-8 border-t border-border pt-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={publicar}
          disabled={!objeto || disabled || estado === 'publicando'}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {estado === 'publicando' && <Loader2 className="h-4 w-4 animate-spin" />}
          {estado === 'publicando' ? 'Publicando…' : 'Publicar noticia'}
        </button>
        <button
          type="button"
          onClick={() => setVerJson((v) => !v)}
          className="text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-primary"
        >
          {verJson ? 'Ocultar JSON' : 'Ver JSON'}
        </button>
      </div>

      {estado === 'ok' && (
        <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-green-600">
          <Check className="h-4 w-4" />
          Publicada. Va a aparecer en el sitio dentro de un minuto.
        </p>
      )}
      {estado === 'error' && (
        <p className="mt-3 flex items-start gap-1.5 text-sm text-primary">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
      {verJson && objeto && (
        <pre className="mt-3 max-h-72 overflow-auto rounded-lg bg-[#0a0a0a] p-4 text-xs leading-relaxed text-white/90">
          {JSON.stringify(objeto, null, 2)}
        </pre>
      )}
    </div>
  )
}

const SERIES_OPCIONES = SERIES.filter((s) => s.id !== 'escuelita').map((s) => ({
  id: s.id,
  label: s.nombre,
}))
const PROFESORES_OPCIONES = CUERPO_TECNICO.map((p) => ({ id: p.id, label: p.nombre }))

function TabPartido() {
  const [json, setJson] = useState('')
  const [series, setSeries] = useState<string[]>([])
  const [destacada, setDestacada] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const partido = useMemo(() => {
    if (!json.trim()) return null
    try {
      const p = JSON.parse(json)
      if (p.formato !== 'ardi:partido') {
        setError('El JSON no tiene "formato": "ardi:partido". ¿Es el archivo correcto?')
        return null
      }
      setError(null)
      return p
    } catch {
      setError('Ese texto no es un JSON válido. Revisa que esté completo.')
      return null
    }
  }, [json])

  const objeto = useMemo(() => {
    if (!partido) return null
    return {
      id: partido.id,
      tipo: 'partido',
      fecha: partido.fecha,
      destacada,
      series,
      partido,
    }
  }, [partido, series, destacada])

  return (
    <Bloque>
      <h2 className="font-heading text-lg font-bold uppercase tracking-tight text-foreground">
        Pega el JSON que exporta ARDI
      </h2>
      <textarea
        value={json}
        onChange={(e) => setJson(e.target.value)}
        placeholder='{ "formato": "ardi:partido", ... }'
        rows={8}
        className="mt-4 w-full rounded-lg border border-border bg-background p-3 font-mono text-xs text-foreground outline-none focus:border-primary"
      />
      {error && <p className="mt-2 text-sm text-primary">{error}</p>}

      {partido && (
        <>
          <div className="mt-6 rounded-lg bg-secondary p-4 text-center">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {partido.serie} · {partido.campeonato}
            </p>
            <p className="mt-1 font-heading text-2xl font-bold text-foreground">
              {partido.local?.nombre} {partido.local?.goles}–{partido.visita?.goles}{' '}
              {partido.visita?.nombre}
            </p>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold text-foreground">
              ¿A qué serie del sitio corresponde? (para que aparezca en su página)
            </p>
            <Checklist opciones={SERIES_OPCIONES} seleccion={series} onChange={setSeries} />
          </div>

          <label className="mt-4 flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={destacada}
              onChange={(e) => setDestacada(e.target.checked)}
            />
            Destacar en la portada
          </label>

          <BotonPublicar objeto={objeto} />
        </>
      )}
    </Bloque>
  )
}

function TabVideo() {
  const [titulo, setTitulo] = useState('')
  const [resumen, setResumen] = useState('')
  const [url, setUrl] = useState('')
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10))
  const [series, setSeries] = useState<string[]>([])
  const [profesores, setProfesores] = useState<string[]>([])
  const [escuelita, setEscuelita] = useState(false)
  const [destacada, setDestacada] = useState(true)

  const youtubeId = useMemo(() => {
    const m = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/)
    return m ? m[1] : url.trim().length === 11 ? url.trim() : ''
  }, [url])

  const objeto = useMemo(() => {
    if (!titulo || !youtubeId) return null
    const id = `video-${fecha}-${titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}`
    const obj: Record<string, unknown> = {
      id,
      tipo: 'video',
      fecha,
      destacada,
      titulo,
      resumen,
      youtubeId,
    }
    if (series.length) obj.series = series
    if (profesores.length) obj.profesores = profesores
    if (escuelita) obj.escuelita = true
    return obj
  }, [titulo, resumen, youtubeId, fecha, series, profesores, escuelita, destacada])

  return (
    <Bloque>
      <h2 className="font-heading text-lg font-bold uppercase tracking-tight text-foreground">
        Video de YouTube
      </h2>
      <div className="mt-4 flex flex-col gap-4">
        <label className="text-sm font-medium text-foreground">
          Título
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
          />
        </label>
        <label className="text-sm font-medium text-foreground">
          Resumen
          <textarea
            value={resumen}
            onChange={(e) => setResumen(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
          />
        </label>
        <label className="text-sm font-medium text-foreground">
          Link o ID de YouTube
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
          />
          {url && !youtubeId && (
            <span className="mt-1 block text-xs text-primary">No reconozco ese link. Pega la URL completa.</span>
          )}
        </label>
        <label className="text-sm font-medium text-foreground">
          Fecha
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
          />
        </label>

        <div>
          <p className="mb-2 text-sm font-semibold text-foreground">Series (opcional)</p>
          <Checklist opciones={SERIES_OPCIONES} seleccion={series} onChange={setSeries} />
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold text-foreground">Profesores (opcional)</p>
          <Checklist opciones={PROFESORES_OPCIONES} seleccion={profesores} onChange={setProfesores} />
        </div>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" checked={escuelita} onChange={(e) => setEscuelita(e.target.checked)} />
          Es de la escuelita
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={destacada}
            onChange={(e) => setDestacada(e.target.checked)}
          />
          Destacar en la portada
        </label>
      </div>

      {youtubeId && (
        <div className="mt-6 aspect-video overflow-hidden rounded-lg">
          <img
            src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <BotonPublicar objeto={objeto} />
    </Bloque>
  )
}

function TabInstagram() {
  const [titulo, setTitulo] = useState('')
  const [resumen, setResumen] = useState('')
  const [url, setUrl] = useState('')
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10))
  const [series, setSeries] = useState<string[]>([])
  const [profesores, setProfesores] = useState<string[]>([])
  const [escuelita, setEscuelita] = useState(false)
  const [destacada, setDestacada] = useState(true)

  const urlValida = useMemo(() => /^https:\/\/(www\.)?instagram\.com\/(p|reel)\/[\w-]+\/?/.test(url.trim()), [url])

  const objeto = useMemo(() => {
    if (!titulo || !urlValida) return null
    const id = `ig-${fecha}-${titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}`
    const obj: Record<string, unknown> = {
      id,
      tipo: 'instagram',
      fecha,
      destacada,
      titulo,
      resumen,
      url: url.trim(),
    }
    if (series.length) obj.series = series
    if (profesores.length) obj.profesores = profesores
    if (escuelita) obj.escuelita = true
    return obj
  }, [titulo, resumen, url, urlValida, fecha, series, profesores, escuelita, destacada])

  return (
    <Bloque>
      <h2 className="font-heading text-lg font-bold uppercase tracking-tight text-foreground">
        Publicación de Instagram
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Funciona con el mismo mecanismo que usa la prensa para insertar publicaciones en sus
        notas -pero no es una API con garantía de estabilidad de Meta: si algún día deja de
        cargar, el link «Ábrela directo en Instagram» sigue funcionando igual.
      </p>
      <div className="mt-4 flex flex-col gap-4">
        <label className="text-sm font-medium text-foreground">
          Título
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
          />
        </label>
        <label className="text-sm font-medium text-foreground">
          Resumen
          <textarea
            value={resumen}
            onChange={(e) => setResumen(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
          />
        </label>
        <label className="text-sm font-medium text-foreground">
          Link de la publicación
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.instagram.com/p/XXXXXXXXX/"
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
          />
          {url && !urlValida && (
            <span className="mt-1 block text-xs text-primary">
              Tiene que ser un link de una publicación o reel: .../p/... o .../reel/...
            </span>
          )}
        </label>
        <label className="text-sm font-medium text-foreground">
          Fecha
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
          />
        </label>

        <div>
          <p className="mb-2 text-sm font-semibold text-foreground">Series (opcional)</p>
          <Checklist opciones={SERIES_OPCIONES} seleccion={series} onChange={setSeries} />
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold text-foreground">Profesores (opcional)</p>
          <Checklist opciones={PROFESORES_OPCIONES} seleccion={profesores} onChange={setProfesores} />
        </div>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" checked={escuelita} onChange={(e) => setEscuelita(e.target.checked)} />
          Es de la escuelita
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={destacada}
            onChange={(e) => setDestacada(e.target.checked)}
          />
          Destacar en la portada
        </label>
      </div>

      <BotonPublicar objeto={objeto} />
    </Bloque>
  )
}

function TabNota() {
  const [titulo, setTitulo] = useState('')
  const [resumen, setResumen] = useState('')
  const [cuerpo, setCuerpo] = useState('')
  const [fotos, setFotos] = useState('')
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10))
  const [series, setSeries] = useState<string[]>([])
  const [profesores, setProfesores] = useState<string[]>([])
  const [escuelita, setEscuelita] = useState(false)
  const [destacada, setDestacada] = useState(true)

  const objeto = useMemo(() => {
    if (!titulo) return null
    const id = `nota-${fecha}-${titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}`
    const cuerpoArr = cuerpo.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    const fotosArr = fotos
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((linea) => {
        const [src, ...resto] = linea.split('|')
        return { src: src.trim(), alt: resto.join('|').trim() || titulo }
      })
    const obj: Record<string, unknown> = {
      id,
      tipo: 'nota',
      fecha,
      destacada,
      titulo,
      resumen,
      cuerpo: cuerpoArr,
      fotos: fotosArr,
    }
    if (series.length) obj.series = series
    if (profesores.length) obj.profesores = profesores
    if (escuelita) obj.escuelita = true
    return obj
  }, [titulo, resumen, cuerpo, fotos, fecha, series, profesores, escuelita, destacada])

  return (
    <Bloque>
      <h2 className="font-heading text-lg font-bold uppercase tracking-tight text-foreground">
        Nota o galería de fotos
      </h2>
      <div className="mt-4 flex flex-col gap-4">
        <label className="text-sm font-medium text-foreground">
          Título
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
          />
        </label>
        <label className="text-sm font-medium text-foreground">
          Resumen (una frase, para la tarjeta)
          <input
            value={resumen}
            onChange={(e) => setResumen(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
          />
        </label>
        <label className="text-sm font-medium text-foreground">
          Cuerpo (un párrafo por bloque, separados por una línea en blanco)
          <textarea
            value={cuerpo}
            onChange={(e) => setCuerpo(e.target.value)}
            rows={6}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
          />
        </label>
        <label className="text-sm font-medium text-foreground">
          Fotos — una por línea:{' '}
          <code className="rounded bg-secondary px-1 text-xs">/images/noticias/archivo.webp | descripción</code>
          <textarea
            value={fotos}
            onChange={(e) => setFotos(e.target.value)}
            rows={4}
            placeholder="/images/noticias/foto1.webp | Las jugadoras con el trofeo"
            className="mt-1 w-full rounded-md border border-border bg-background p-3 font-mono text-xs text-foreground outline-none focus:border-primary"
          />
          <span className="mt-1 block text-xs text-muted-foreground">
            Sube antes las fotos a <code>public/images/noticias/</code> (pídeselo a Claude) o usa
            una URL de Instagram.
          </span>
        </label>
        <label className="text-sm font-medium text-foreground">
          Fecha
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
          />
        </label>

        <div>
          <p className="mb-2 text-sm font-semibold text-foreground">Series (opcional)</p>
          <Checklist opciones={SERIES_OPCIONES} seleccion={series} onChange={setSeries} />
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold text-foreground">Profesores (opcional)</p>
          <Checklist opciones={PROFESORES_OPCIONES} seleccion={profesores} onChange={setProfesores} />
        </div>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" checked={escuelita} onChange={(e) => setEscuelita(e.target.checked)} />
          Es de la escuelita
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={destacada}
            onChange={(e) => setDestacada(e.target.checked)}
          />
          Destacar en la portada
        </label>
      </div>

      <BotonPublicar objeto={objeto} />
    </Bloque>
  )
}

function tituloDe(n: Noticia): string {
  if (n.tipo === 'partido') {
    return `${n.partido.local.nombre} ${n.partido.local.goles}-${n.partido.visita.goles} ${n.partido.visita.nombre}`
  }
  return n.titulo
}

/**
 * Editar y eliminar, sin base de datos detrás.
 *
 * En vez de reconstruir un formulario de edición por cada tipo (partido,
 * video, nota) -tres UIs distintas a mantener, y siempre un campo que el
 * formulario no contempló-, se edita el JSON completo de la noticia
 * directamente. Da más control, no menos: se puede tocar cualquier campo,
 * no solo los que un formulario anticipó.
 *
 * Eliminar tampoco borra nada por sí solo - no hay archivo que tocar desde
 * acá. Genera la instrucción exacta (el id a buscar) para que quede claro
 * qué bloque sacar de `lib/noticias.ts`.
 */
function TabExistentes() {
  const [noticias, setNoticias] = useState<Noticia[] | null>(null)
  const [cargando, setCargando] = useState(true)
  const [errorLista, setErrorLista] = useState<string | null>(null)

  const [seleccionada, setSeleccionada] = useState<Noticia | null>(null)
  const [json, setJson] = useState('')
  const [modo, setModo] = useState<'editar' | 'eliminar' | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [errorAccion, setErrorAccion] = useState<string | null>(null)
  const [ok, setOk] = useState(false)

  async function cargar() {
    setCargando(true)
    setErrorLista(null)
    try {
      const res = await fetch('/api/noticias')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'No se pudo cargar la lista.')
      setNoticias(ordenarPorFecha(data.noticias ?? []))
    } catch (e) {
      setErrorLista(e instanceof Error ? e.message : 'No se pudo cargar la lista.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  function editar(n: Noticia) {
    setSeleccionada(n)
    setJson(JSON.stringify(n, null, 2))
    setModo('editar')
    setErrorAccion(null)
    setOk(false)
  }

  function eliminar(n: Noticia) {
    setSeleccionada(n)
    setModo('eliminar')
    setErrorAccion(null)
    setOk(false)
  }

  function volver() {
    setSeleccionada(null)
    setModo(null)
    setErrorAccion(null)
    setOk(false)
  }

  async function guardarEdicion() {
    if (!seleccionada) return
    let obj: unknown
    try {
      obj = JSON.parse(json)
    } catch {
      setErrorAccion('Ese JSON no es válido todavía.')
      return
    }
    setGuardando(true)
    setErrorAccion(null)
    try {
      const res = await fetch(`/api/admin/noticias/${seleccionada.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error ?? 'No se pudo guardar.')
      setOk(true)
      await cargar()
    } catch (e) {
      setErrorAccion(e instanceof Error ? e.message : 'No se pudo guardar.')
    } finally {
      setGuardando(false)
    }
  }

  async function confirmarEliminar() {
    if (!seleccionada) return
    setGuardando(true)
    setErrorAccion(null)
    try {
      const res = await fetch(`/api/admin/noticias/${seleccionada.id}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error ?? 'No se pudo eliminar.')
      await cargar()
      volver()
    } catch (e) {
      setErrorAccion(e instanceof Error ? e.message : 'No se pudo eliminar.')
    } finally {
      setGuardando(false)
    }
  }

  if (!seleccionada) {
    return (
      <Bloque>
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold uppercase tracking-tight text-foreground">
            Noticias publicadas {noticias ? `(${noticias.length})` : ''}
          </h2>
          <button
            type="button"
            onClick={cargar}
            className="text-xs font-semibold uppercase text-muted-foreground hover:text-primary"
          >
            Actualizar
          </button>
        </div>

        {cargando && <p className="mt-4 text-sm text-muted-foreground">Cargando…</p>}
        {errorLista && (
          <p className="mt-4 flex items-start gap-1.5 text-sm text-primary">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {errorLista}
          </p>
        )}
        {!cargando && !errorLista && noticias?.length === 0 && (
          <p className="mt-4 text-sm text-muted-foreground">Todavía no hay ninguna.</p>
        )}

        {!cargando && noticias && noticias.length > 0 && (
          <ul className="mt-4 flex flex-col gap-2">
            {noticias.map((n) => (
              <li
                key={n.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{tituloDe(n)}</p>
                  <p className="text-xs text-muted-foreground">
                    {n.fecha} · {n.tipo}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => editar(n)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:border-primary hover:text-primary"
                    aria-label={`Editar ${tituloDe(n)}`}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => eliminar(n)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:border-primary hover:text-primary"
                    aria-label={`Eliminar ${tituloDe(n)}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Bloque>
    )
  }

  return (
    <Bloque>
      <button
        type="button"
        onClick={volver}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Todas las noticias
      </button>

      <h2 className="font-heading text-lg font-bold uppercase tracking-tight text-foreground">
        {tituloDe(seleccionada)}
      </h2>

      {modo === 'editar' && (
        <>
          <p className="mt-3 text-sm text-muted-foreground">
            Edita lo que necesites. El id debe quedar igual.
          </p>
          <textarea
            value={json}
            onChange={(e) => setJson(e.target.value)}
            rows={16}
            className="mt-4 w-full rounded-lg border border-border bg-background p-3 font-mono text-xs text-foreground outline-none focus:border-primary"
          />

          <button
            type="button"
            onClick={guardarEdicion}
            disabled={guardando}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {guardando && <Loader2 className="h-4 w-4 animate-spin" />}
            {guardando ? 'Guardando…' : 'Guardar cambios'}
          </button>

          {ok && (
            <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-green-600">
              <Check className="h-4 w-4" />
              Guardado. El cambio va a aparecer en el sitio dentro de un minuto.
            </p>
          )}
          {errorAccion && (
            <p className="mt-3 flex items-start gap-1.5 text-sm text-primary">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {errorAccion}
            </p>
          )}
        </>
      )}

      {modo === 'eliminar' && (
        <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-5">
          <p className="text-sm leading-relaxed text-foreground">
            ¿Eliminar «{tituloDe(seleccionada)}»? No se puede deshacer.
          </p>
          <button
            type="button"
            onClick={confirmarEliminar}
            disabled={guardando}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {guardando && <Loader2 className="h-4 w-4 animate-spin" />}
            {guardando ? 'Eliminando…' : 'Sí, eliminar'}
          </button>
          {errorAccion && (
            <p className="mt-3 flex items-start gap-1.5 text-sm text-primary">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {errorAccion}
            </p>
          )}
        </div>
      )}
    </Bloque>
  )
}

export function AdminPanel() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('partido')

  async function salir() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'partido', label: 'Partido (JSON)' },
    { id: 'video', label: 'Video' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'nota', label: 'Nota / Galería' },
    { id: 'existentes', label: 'Editar / Eliminar' },
  ]

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-tight text-foreground">
          Publicar noticia
        </h1>
        <button
          type="button"
          onClick={salir}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary"
        >
          <LogOut className="h-4 w-4" />
          Salir
        </button>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto rounded-lg bg-secondary p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={
              tab === t.id
                ? 'shrink-0 whitespace-nowrap rounded-md bg-background px-3 py-2 text-sm font-semibold text-foreground shadow-sm'
                : 'shrink-0 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground'
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'partido' && <TabPartido />}
      {tab === 'video' && <TabVideo />}
      {tab === 'instagram' && <TabInstagram />}
      {tab === 'nota' && <TabNota />}
      {tab === 'existentes' && <TabExistentes />}
    </div>
  )
}
