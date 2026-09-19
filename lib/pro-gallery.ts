// Fotos de la galería del modal "Gabo & Planes" (Gabo trabajando y algunos de sus matrimonios).
// Para agregar una foto: subir el archivo a public/images/gabo/ y sumarla a esta lista.

export type ProPhoto = {
  id: string
  src: string
  width: number
  height: number
  alt: string
  caption: string
}

export const proPhotos: ProPhoto[] = [
  {
    id: "novios-piscina",
    src: "/images/gabo/novios-piscina-atardecer.jpg",
    width: 934,
    height: 1400,
    alt: "Novios frente a la ciudad al atardecer, reflejados en una piscina",
    caption: "Atardecer sobre Santiago",
  },
  {
    id: "matrimonio-jardin",
    src: "/images/gabo/gabo-matrimonio-jardin.jpg",
    width: 1280,
    height: 853,
    alt: "Gabo fotografiando un matrimonio en un jardín",
    caption: "Cobertura de matrimonio al aire libre",
  },
  {
    id: "canal-13",
    src: "/images/gabo/gabo-canal13.jpg",
    width: 1400,
    height: 1050,
    alt: "Gabo trabajando en un matrimonio que aparece en Canal 13",
    caption: "En «Contra Viento y Marea», Canal 13",
  },
  {
    id: "novios-vitral",
    src: "/images/gabo/novios-vitral.jpg",
    width: 933,
    height: 1400,
    alt: "Novios besándose bajo un vitral en el hall de un hotel",
    caption: "Un beso bajo el vitral",
  },
  {
    id: "retrato-pareja",
    src: "/images/gabo/gabo-retrato-pareja.jpg",
    width: 1280,
    height: 1131,
    alt: "Gabo retratando a una pareja de adultos mayores en un jardín",
    caption: "Retrato de pareja en el jardín",
  },
  {
    id: "evento-canon",
    src: "/images/gabo/gabo-lanzamiento-canon.jpg",
    width: 631,
    height: 1400,
    alt: "Gabo con una cámara sobre trípode en un evento de Canon",
    caption: "En un evento de Canon",
  },
  {
    id: "ceremonia-iglesia",
    src: "/images/gabo/gabo-ceremonia-iglesia.jpg",
    width: 1400,
    height: 933,
    alt: "Gabo fotografiando una ceremonia dentro de una iglesia",
    caption: "Ceremonia en la iglesia",
  },
]
