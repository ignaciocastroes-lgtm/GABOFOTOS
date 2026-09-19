"use client"

import { useCallback, useEffect, useState } from "react"
import { AlertTriangle, Check, ImagePlus, Loader2, Undo2 } from "lucide-react"
import { PLANES } from "@/lib/planes"
import { api } from "./api"
import { comprimir } from "./imagen"

type ImagenPropia = { clave: string; url: string; ancho: number; alto: number }

const boton =
  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"

/** Pestaña «Presupuestos»: cambia la imagen de cada servicio del modal «Presupuestos y contacto». */
export function PlanesPanel() {
  const [propias, setPropias] = useState<Record<string, ImagenPropia>>({})
  const [cargando, setCargando] = useState(true)
  const [ocupado, setOcupado] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)

  const cargar = useCallback(async () => {
    setError(null)
    try {
      const data = await api<{ imagenes: ImagenPropia[] }>("/api/admin/planes")
      setPropias(Object.fromEntries(data.imagenes.map((i) => [i.clave, i])))
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudieron cargar las imágenes.")
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  async function cambiar(clave: string, archivo: File | undefined) {
    if (!archivo) return
    setOcupado(clave)
    setAviso(null)
    setError(null)
    try {
      const blob = await comprimir(archivo, 1400)
      const form = new FormData()
      form.append("file", blob, blob.type === "image/webp" ? "imagen.webp" : "imagen.jpg")
      await api(`/api/admin/planes/${clave}`, { method: "POST", body: form })
      await cargar()
      setAviso("Imagen cambiada. Se ve en el sitio en menos de un minuto.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cambiar la imagen.")
    } finally {
      setOcupado(null)
    }
  }

  async function restaurar(clave: string) {
    if (!window.confirm("¿Volver a la imagen original de este servicio?")) return
    setOcupado(clave)
    setAviso(null)
    setError(null)
    try {
      await api(`/api/admin/planes/${clave}`, { method: "DELETE" })
      await cargar()
      setAviso("Se volvió a la imagen original.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo restaurar.")
    } finally {
      setOcupado(null)
    }
  }

  return (
    <div>
      <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 dark:bg-zinc-900 dark:ring-zinc-800">
        <h2 className="text-lg font-light tracking-wide">Imágenes de presupuestos</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
          Cada servicio de la ventana «Presupuestos y contacto» lleva una imagen. Cámbiala subiendo otra foto; si no
          te gusta, vuelves a la original cuando quieras.
        </p>
      </section>

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
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PLANES.map((plan) => {
            const propia = propias[plan.id]
            const trabajando = ocupado === plan.id
            return (
              <li
                key={plan.id}
                className="overflow-hidden rounded-xl bg-white ring-1 ring-slate-200 dark:bg-zinc-900 dark:ring-zinc-800"
              >
                <div className="relative aspect-[4/3] bg-slate-100 dark:bg-zinc-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={propia?.url ?? plan.original.src}
                    alt={`Imagen actual de ${plan.titulo}`}
                    loading="lazy"
                    style={{ objectPosition: propia ? "50% 50%" : plan.original.posicion }}
                    className="h-full w-full object-cover"
                  />
                  {trabajando && (
                    <span className="absolute inset-0 flex items-center justify-center bg-zinc-950/60">
                      <Loader2 className="h-6 w-6 animate-spin text-yellow-400" />
                    </span>
                  )}
                </div>

                <div className="space-y-3 p-3">
                  <div>
                    <p className="text-sm font-medium">{plan.titulo}</p>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      {propia ? "Imagen cambiada por Gabo" : "Imagen original"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <label
                      className={`${boton} cursor-pointer bg-yellow-400 font-medium text-zinc-950 hover:bg-yellow-300 ${
                        trabajando ? "pointer-events-none opacity-50" : ""
                      }`}
                    >
                      <ImagePlus className="h-4 w-4" />
                      Cambiar imagen
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="sr-only"
                        disabled={trabajando}
                        onChange={(e) => {
                          cambiar(plan.id, e.target.files?.[0])
                          e.target.value = "" // permite elegir el mismo archivo otra vez
                        }}
                      />
                    </label>
                    {propia && (
                      <button
                        type="button"
                        onClick={() => restaurar(plan.id)}
                        disabled={trabajando}
                        className={`${boton} text-slate-700 ring-1 ring-slate-300 hover:ring-yellow-500 disabled:opacity-50 dark:text-zinc-300 dark:ring-zinc-700`}
                      >
                        <Undo2 className="h-4 w-4" />
                        Volver a la original
                      </button>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
