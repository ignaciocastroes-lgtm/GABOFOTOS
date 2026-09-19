// Fotos de la galería «Gabo en acción» del modal «Conoce a Gabriel» (Gabo trabajando y algunos de sus matrimonios).
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
  {
    id: "con-su-camara",
    src: "/images/gabo/gabo-con-su-camara.jpg",
    width: 864,
    height: 1296,
    alt: "Fotógrafo con una cámara Canon EOS 6D Mark II colgada del cuello y polera azul de GABOFOTOS",
    caption: "Con la cámara lista",
  },
  {
    id: "boda-alfombra-roja",
    src: "/images/gabo/boda-alfombra-roja.jpg",
    width: 1200,
    height: 1600,
    alt: "Novios sobre una alfombra roja junto a un presentador con micrófono, rodeados de invitados",
    caption: "Un matrimonio sobre alfombra roja",
  },
  {
    id: "cobertura-licenciatura",
    src: "/images/gabo/cobertura-licenciatura.jpg",
    width: 1440,
    height: 1440,
    alt: "Dos fotógrafos con sus cámaras frente al estandarte de un colegio, antes de una licenciatura",
    caption: "Cobertura de una licenciatura",
  },
]

// Trabajos para empresas (foto de productos y fotografía comercial), en la sección «Fotografía para empresas».
export type EmpresaPhoto = {
  id: string
  src: string
  width: number
  height: number
  alt: string
  caption: string
}

export const empresaPhotos: EmpresaPhoto[] = [
  {
    id: "producto-agua-tonica",
    src: "/images/empresas/foto-producto-agua-tonica.jpg",
    width: 720,
    height: 1340,
    alt: "Botella de vidrio de agua tónica Canada Dry fotografiada sobre fondo blanco",
    caption: "Foto de producto",
  },
  {
    id: "comercial-ziemax",
    src: "/images/empresas/foto-comercial-ziemax.jpg",
    width: 1600,
    height: 1066,
    alt: "Dos mujeres posando junto a un roll-up de Ziemax en una tienda de juguetes educativos",
    caption: "Fotografía comercial",
  },
  {
    id: "producto-empanadas",
    src: "/images/empresas/foto-producto-empanadas.jpg",
    width: 1200,
    height: 1600,
    alt: "Tres empanadas horneadas sobre una tabla de madera con perejil, en una gráfica de Empanadas Roy Roy",
    caption: "Foto de producto para publicidad",
  },
]
