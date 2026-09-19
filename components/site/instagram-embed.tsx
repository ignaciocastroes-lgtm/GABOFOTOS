'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } }
  }
}

/**
 * Empotra una publicación de Instagram usando el script oficial de Meta
 * (embed.js). No es una API con garantía de estabilidad a largo plazo —
 * funciona hoy porque es el mismo mecanismo que usa la prensa para insertar
 * publicaciones en sus notas, pero Meta puede cambiarlo sin aviso. Si la
 * publicación se borra o la cuenta se pone privada, el espacio queda en
 * blanco — mismo riesgo que ya asumimos con los videos de YouTube.
 */
export function InstagramEmbed({ url }: { url: string }) {
  const ref = useRef<HTMLQuoteElement>(null)

  useEffect(() => {
    window.instgrm?.Embeds.process()
  }, [url])

  return (
    <>
      <blockquote
        ref={ref}
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{ background: '#FFF', border: 0, margin: '0 auto', maxWidth: 540, width: '100%' }}
      />
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => window.instgrm?.Embeds.process()}
      />
    </>
  )
}
