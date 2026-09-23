import type { MetadataRoute } from "next"

// Permite "Agregar a la pantalla de inicio" en el celular y da a los buscadores el ícono de la marca.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GABOFOTOS",
    short_name: "GABOFOTOS",
    description: "Fotografía profesional de matrimonios, colegios, cumpleaños y deporte en Santiago, Chile.",
    lang: "es-CL",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
