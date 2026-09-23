"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Eye, EyeOff, Loader2, LogOut, Trash2, Upload } from "lucide-react"
import { api } from "./api"
import { comprimir } from "./imagen"
import { PlanesPanel } from "./planes-panel"
import { VideosPanel } from "./videos-panel"

type CategoriaId = "matrimonios" | "colegios" | "cumpleanos" | "deporte"

const CATEGORIAS: { id: CategoriaId; nombre: string }[] = [
  { id: "matrimonios", nombre: "Matrimonios" },
  { id: "colegios", nombre: "Colegios" },
  { id: "cumpleanos", nombre: "Cumpleaños" },
  { id: "deporte", nombre: "Deporte" },
]

type Foto = {
  id: string
  categoria: CategoriaId
  url: string
  ancho: number
  alto: number
  alt: string
  orden: number
  visible: boolean
  created_at: string
}

function ordenar(fotos: Foto[]) {
  return [...fotos].sort((a, b) => a.orden - b.orden || (a.created_at < b.created_at ? 1 : -1))
}

type Estado = "pendiente" | "comprimiendo" | "subiendo" | "ok" | "error"
type Avance = { nombre: string; estado: Estado; error?: string }

// ─────────────────────────────────────────────────────────────────────────

function SubirFotos({ onSubidas }: { onSubidas: () => void }) {
  const [categoria, setCategoria] = useState<CategoriaId>("matrimonios")
  const [archivos, setArchivos] = useState<File[]>([])
  const [alt, setAlt] = useState("")
  const [autorizado, setAutorizado] = useState(false)
  const [subiendo, setSubiendo] = useState(false)
  const [avance, setAvance] = useState<Avance[]>([])
  const [reinicio, setReinicio] = useState(0)

  const puedeSubir = archivos.length > 0 && !subiendo && (categoria !== "colegios" || autorizado)

  function marcar(i: number, estado: Estado, error?: string) {
    setAvance((lista) => lista.map((a, idx) => (idx === i ? { ...a, estado, error } : a)))
  }

  async function subir() {
    setSubiendo(true)
    const lote = archivos
    setAvance(lote.map((f) => ({ nombre: f.name, estado: "pendiente" as Estado })))
    let subidas = 0

    // Una por una: así cada foto queda bajo el límite de tamaño y se ve el progreso.
    for (let i = 0; i < lote.length; i++) {
      try {
        marcar(i, "comprimiendo")
        const blob = await comprimir(lote[i])
        marcar(i, "subiendo")
        const form = new FormData()
        form.append("file", blob, blob.type === "image/webp" ? "foto.webp" : "foto.jpg")
        form.append("categoria", categoria)
        form.append("alt", alt)
        form.append("autorizado", String(autorizado))
        await api("/api/admin/fotos", { method: "POST", body: form })
        marcar(i, "ok")
        subidas++
      } catch (e) {
        marcar(i, "error", e instanceof Error ? e.message : "No se pudo subir.")
      }
    }

    setSubiendo(false)
    setArchivos([])
    setReinicio((n) => n + 1) // limpia el selector de archivos
    if (subidas > 0) onSubidas()
  }

  return (
    <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 dark:bg-zinc-900 dark:ring-zinc-800">
      <h2 className="text-lg font-light tracking-wide">Subir fotos</h2>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <label className="block text-sm text-slate-700 dark:text-zinc-300">
          ¿En qué categoría van?
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value as CategoriaId)}
            className="mt-2 w-full rounded-lg bg-slate-50 px-4 py-3 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-zinc-950 dark:ring-zinc-800 dark:focus:ring-yellow-400"
          >
            {CATEGORIAS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm text-slate-700 dark:text-zinc-300">
          Descripción de la foto (opcional)
          <input
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            maxLength={200}
            placeholder="Ej.: Novios en la playa al atardecer"
            className="mt-2 w-full rounded-lg bg-slate-50 px-4 py-3 ring-1 ring-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-zinc-950 dark:ring-zinc-800 dark:placeholder:text-zinc-600 dark:focus:ring-yellow-400"
          />
        </label>
      </div>

      <input
        key={reinicio}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={(e) => setArchivos(Array.from(e.target.files ?? []))}
        className="mt-5 block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-yellow-400 file:px-5 file:py-2.5 file:text-sm file:font-medium file:text-zinc-950 hover:file:bg-yellow-300 dark:text-zinc-400"
      />

      {categoria === "colegios" && (
        <label className="mt-4 flex items-start gap-3 rounded-lg bg-yellow-400/10 p-3 text-sm text-slate-800 ring-1 ring-yellow-500/40 dark:text-zinc-200">
          <input type="checkbox" checked={autorizado} onChange={(e) => setAutorizado(e.target.checked)} className="mt-1" />
          <span>
            Tengo autorización del colegio o de los apoderados para publicar estas fotos (hay menores de edad).
            No subas listas con nombres completos.
          </span>
        </label>
      )}

      <button
        type="button"
        onClick={subir}
        disabled={!puedeSubir}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-6 py-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-yellow-300 disabled:opacity-50"
      >
        {subiendo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {subiendo ? "Subiendo…" : archivos.length > 1 ? `Subir ${archivos.length} fotos` : "Subir foto"}
      </button>

      {avance.length > 0 && (
        <ul className="mt-5 space-y-2 text-sm">
          {avance.map((a, i) => (
            <li key={i} className="flex items-start gap-2">
              {a.estado === "ok" && <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />}
              {a.estado === "error" && <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />}
              {(a.estado === "comprimiendo" || a.estado === "subiendo") && (
                <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-yellow-500" />
              )}
              {a.estado === "pendiente" && <span className="mt-0.5 h-4 w-4 shrink-0" />}
              <span className="text-slate-700 dark:text-zinc-300">
                {a.nombre}
                {a.estado === "comprimiendo" && " — preparando"}
                {a.estado === "subiendo" && " — subiendo"}
                {a.estado === "ok" && " — lista"}
                {a.error && <span className="text-red-400"> — {a.error}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────

function TarjetaFoto({
  foto,
  primera,
  ultima,
  onMover,
  onAlt,
  onVisible,
  onCategoria,
  onEliminar,
}: {
  foto: Foto
  primera: boolean
  ultima: boolean
  onMover: (dir: -1 | 1) => void
  onAlt: (alt: string) => void
  onVisible: () => void
  onCategoria: (c: CategoriaId) => void
  onEliminar: () => void
}) {
  const [alt, setAlt] = useState(foto.alt)
  const botones = "flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 ring-1 ring-slate-300 transition-colors hover:bg-yellow-400 hover:text-zinc-950 disabled:opacity-30 disabled:hover:bg-slate-100 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-700 dark:disabled:hover:bg-zinc-800"

  return (
    <li className="overflow-hidden rounded-xl bg-white ring-1 ring-slate-200 dark:bg-zinc-900 dark:ring-zinc-800">
      <div className="relative aspect-[4/3] bg-slate-100 dark:bg-zinc-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={foto.url}
          alt={foto.alt || "Foto subida"}
          loading="lazy"
          className={`h-full w-full object-cover ${foto.visible ? "" : "opacity-40 grayscale"}`}
        />
        {!foto.visible && (
          <span className="absolute left-2 top-2 rounded-full bg-zinc-950/80 px-3 py-1 text-xs text-zinc-200">Oculta</span>
        )}
      </div>

      <div className="space-y-3 p-3">
        <input
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          onBlur={() => alt !== foto.alt && onAlt(alt)}
          placeholder="Descripción (opcional)"
          maxLength={200}
          aria-label="Descripción de la foto"
          className="w-full rounded-lg bg-slate-50 px-3 py-2 text-sm ring-1 ring-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-zinc-950 dark:ring-zinc-800 dark:placeholder:text-zinc-600 dark:focus:ring-yellow-400"
        />

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => onMover(-1)} disabled={primera} aria-label="Mover antes" className={botones}>
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => onMover(1)} disabled={ultima} aria-label="Mover después" className={botones}>
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onVisible}
            aria-label={foto.visible ? "Ocultar del sitio" : "Mostrar en el sitio"}
            title={foto.visible ? "Ocultar del sitio" : "Mostrar en el sitio"}
            className={botones}
          >
            {foto.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
          <button type="button" onClick={onEliminar} aria-label="Eliminar foto" className={`${botones} ml-auto hover:!bg-red-500 hover:!text-white`}>
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <label className="block text-xs text-slate-500 dark:text-zinc-400">
          Mover a
          <select
            value={foto.categoria}
            onChange={(e) => onCategoria(e.target.value as CategoriaId)}
            className="ml-2 rounded-md bg-slate-50 px-2 py-1 text-sm text-slate-800 ring-1 ring-slate-300 dark:bg-zinc-950 dark:text-zinc-200 dark:ring-zinc-800"
          >
            {CATEGORIAS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </label>
      </div>
    </li>
  )
}

// ─────────────────────────────────────────────────────────────────────────

export function AdminPanel() {
  const [fotos, setFotos] = useState<Foto[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  const [vista, setVista] = useState<CategoriaId>("matrimonios")
  const [seccion, setSeccion] = useState<"fotos" | "videos" | "presupuestos">("fotos")

  const cargar = useCallback(async () => {
    setError(null)
    try {
      const data = await api<{ fotos: Foto[] }>("/api/admin/fotos")
      setFotos(data.fotos)
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudieron cargar las fotos.")
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  const lista = useMemo(() => ordenar(fotos.filter((f) => f.categoria === vista)), [fotos, vista])
  const conteo = (c: CategoriaId) => fotos.filter((f) => f.categoria === c).length

  // Ejecuta una acción; si falla, avisa y recarga la lista real del servidor.
  async function accion(fn: () => Promise<unknown>, exito?: string) {
    setAviso(null)
    setError(null)
    try {
      await fn()
      if (exito) setAviso(exito)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Algo salió mal.")
      await cargar()
    }
  }

  const cambiar = (id: string, cambios: Partial<Foto>) =>
    setFotos((fs) => fs.map((f) => (f.id === id ? { ...f, ...cambios } : f)))

  function mover(id: string, dir: -1 | 1) {
    const ids = lista.map((f) => f.id)
    const i = ids.indexOf(id)
    const j = i + dir
    if (i < 0 || j < 0 || j >= ids.length) return
    ;[ids[i], ids[j]] = [ids[j], ids[i]]
    setFotos((fs) => fs.map((f) => (ids.includes(f.id) ? { ...f, orden: ids.indexOf(f.id) } : f)))
    accion(() =>
      api("/api/admin/fotos/orden", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      }),
    )
  }

  const patch = (id: string, body: Record<string, unknown>) =>
    api(`/api/admin/fotos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

  function moverACategoria(f: Foto, categoria: CategoriaId) {
    if (categoria === f.categoria) return
    if (categoria === "colegios" && !window.confirm("¿Tienes autorización del colegio o los apoderados para publicar esta foto?")) return
    accion(async () => {
      await patch(f.id, { categoria, autorizado: categoria === "colegios" ? true : undefined })
      await cargar()
    }, `Foto movida a ${CATEGORIAS.find((c) => c.id === categoria)?.nombre}.`)
  }

  function eliminar(f: Foto) {
    if (!window.confirm("¿Eliminar esta foto? Se borra del sitio y no se puede deshacer.")) return
    accion(async () => {
      await api(`/api/admin/fotos/${f.id}`, { method: "DELETE" })
      setFotos((fs) => fs.filter((x) => x.id !== f.id))
    }, "Foto eliminada.")
  }

  async function salir() {
    await fetch("/api/admin/logout", { method: "POST" })
    window.location.assign("/admin/login")
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-light tracking-wide">Administrar el sitio</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
            Los cambios aparecen en el sitio en menos de un minuto.
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <a href="/" target="_blank" rel="noopener noreferrer" className="text-yellow-700 hover:underline dark:text-yellow-400">
            Ver el sitio
          </a>
          <button type="button" onClick={salir} className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            <LogOut className="h-4 w-4" /> Salir
          </button>
        </div>
      </header>

      <div role="tablist" aria-label="Secciones del panel" className="mt-6 flex gap-2 border-b border-slate-200 pb-4 dark:border-zinc-800">
        {(["fotos", "videos", "presupuestos"] as const).map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={seccion === id}
            onClick={() => setSeccion(id)}
            className={`rounded-full px-5 py-2 text-sm transition-colors ${
              seccion === id
                ? "bg-zinc-900 font-medium text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950"
                : "text-slate-600 ring-1 ring-slate-300 hover:ring-yellow-500 dark:text-zinc-300 dark:ring-zinc-700"
            }`}
          >
            {id === "fotos" ? "Fotos" : id === "videos" ? "Videos" : "Presupuestos"}
          </button>
        ))}
      </div>

      {seccion === "videos" ? (
        <div className="mt-6">
          <VideosPanel />
        </div>
      ) : seccion === "presupuestos" ? (
        <div className="mt-6">
          <PlanesPanel />
        </div>
      ) : (
        <>
          <div className="mt-6">
            <SubirFotos onSubidas={cargar} />
          </div>

          <section className="mt-8">
            <div role="tablist" aria-label="Categorías" className="flex flex-wrap gap-2">
              {CATEGORIAS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={vista === c.id}
                  onClick={() => setVista(c.id)}
                  className={`rounded-full px-4 py-2 text-sm transition-colors ${
                    vista === c.id
                      ? "bg-yellow-400 font-medium text-zinc-950"
                      : "bg-white text-slate-700 ring-1 ring-slate-300 hover:ring-yellow-500 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-800"
                  }`}
                >
                  {c.nombre} ({conteo(c.id)})
                </button>
              ))}
            </div>

            {aviso && (
              <p role="status" className="mt-4 flex items-center gap-1.5 text-sm text-green-500">
                <Check className="h-4 w-4" /> {aviso}
              </p>
            )}
            {error && (
              <p role="alert" className="mt-4 flex items-start gap-1.5 text-sm text-red-400">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
              </p>
            )}

            {cargando ? (
              <p className="mt-8 flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" /> Cargando…
              </p>
            ) : lista.length === 0 ? (
              <p className="mt-8 text-sm text-slate-500 dark:text-zinc-400">
                No hay fotos subidas en esta categoría. Mientras tanto, el sitio muestra las fotos de ejemplo.
              </p>
            ) : (
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {lista.map((f, i) => (
                  <TarjetaFoto
                    key={f.id}
                    foto={f}
                    primera={i === 0}
                    ultima={i === lista.length - 1}
                    onMover={(dir) => mover(f.id, dir)}
                    onAlt={(alt) => accion(async () => { await patch(f.id, { alt }); cambiar(f.id, { alt }) }, "Descripción guardada.")}
                    onVisible={() =>
                      accion(async () => {
                        await patch(f.id, { visible: !f.visible })
                        cambiar(f.id, { visible: !f.visible })
                      }, f.visible ? "Foto oculta del sitio." : "Foto visible en el sitio.")
                    }
                    onCategoria={(c) => moverACategoria(f, c)}
                    onEliminar={() => eliminar(f)}
                  />
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  )
}
