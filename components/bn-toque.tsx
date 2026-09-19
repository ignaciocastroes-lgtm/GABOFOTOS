"use client"

import { useEffect } from "react"

/**
 * Tablet y celular no tienen "poner el mouse encima". Para que las fotos se comporten igual que en
 * PC (blanco y negro → color), aquí el equivalente es tocarlas: la foto tocada pasa a color y se
 * queda así hasta que se toca otra cosa, igual que en PC dura mientras el mouse está encima.
 *
 * Este componente solo marca el contenedor con `data-tocado`; el color lo pone el CSS de
 * app/globals.css (`.bn-con-mouse`). En PC no hace nada: ahí manda :hover.
 */
export function BnToque() {
  useEffect(() => {
    let actual: Element | null = null

    // El contenedor (`.group`) más cercano que realmente tenga una foto con el efecto.
    function buscarGrupo(desde: Element | null): Element | null {
      let grupo = desde?.closest(".group") ?? null
      while (grupo && !grupo.querySelector(".bn-con-mouse")) {
        grupo = grupo.parentElement?.closest(".group") ?? null
      }
      return grupo
    }

    function soltar() {
      actual?.removeAttribute("data-tocado")
      actual = null
    }

    function alTocar(event: PointerEvent) {
      if (event.pointerType === "mouse") return
      const grupo = buscarGrupo(event.target instanceof Element ? event.target : null)
      if (grupo === actual) return
      soltar()
      if (grupo) {
        grupo.setAttribute("data-tocado", "")
        actual = grupo
      }
    }

    document.addEventListener("pointerdown", alTocar, true)
    return () => {
      document.removeEventListener("pointerdown", alTocar, true)
      soltar()
    }
  }, [])

  return null
}
