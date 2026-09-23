"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"
import { galleryCategories, type GalleryCategoryId } from "@/lib/gallery"
import { GalleryModal } from "./gallery-modal"

type GalleryModalContextValue = {
  /** Abre la galería de esa categoría, sin importar desde dónde se llame (menú o tarjeta). */
  openCategory: (id: GalleryCategoryId) => void
}

const GalleryModalContext = createContext<GalleryModalContextValue | null>(null)

/**
 * Punto único que sabe abrir una galería. Antes, cada componente (el menú de arriba y las
 * tarjetas de "Elige tu momento") tenía su propia idea de cómo abrir una galería: las tarjetas
 * abrían un modal, y el menú solo intentaba desplazar la página hasta la tarjeta — así que tocar
 * el menú nunca mostraba fotos por sí solo. Con este proveedor, los dos usan `useGalleryModal()`
 * y comparten la misma ventana, montada una sola vez aquí.
 */
export function GalleryModalProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<GalleryCategoryId | null>(null)
  const activeCategory = galleryCategories.find((category) => category.id === activeId) ?? null

  const openCategory = useCallback((id: GalleryCategoryId) => setActiveId(id), [])
  const close = useCallback(() => setActiveId(null), [])

  const value = useMemo(() => ({ openCategory }), [openCategory])

  return (
    <GalleryModalContext.Provider value={value}>
      {children}
      <GalleryModal
        open={activeCategory !== null}
        categoria={activeCategory?.id ?? null}
        title={activeCategory?.title ?? ""}
        subtitle={activeCategory?.items.join(" · ")}
        onClose={close}
      />
    </GalleryModalContext.Provider>
  )
}

export function useGalleryModal(): GalleryModalContextValue {
  const context = useContext(GalleryModalContext)
  if (!context) throw new Error("useGalleryModal debe usarse dentro de <GalleryModalProvider>")
  return context
}
