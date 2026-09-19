/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.youtube.com' },
      // Autorizado de antemano por si en algún momento se usa Cloudinary
      // para fotos (ver README, sección "Protocolo de contenido"). Sin esto,
      // next/image rechaza cualquier URL de un dominio no autorizado.
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      // ARDI aloja algunos escudos en ImgBB. Sin este dominio autorizado,
      // next/image rechaza esas URLs y la tarjeta del partido sale sin
      // escudo — no por un bug de datos, sino porque el dominio no estaba
      // en la lista blanca.
      { protocol: 'https', hostname: 'i.ibb.co' },
      { protocol: 'https', hostname: 'ibb.co' },
    ],
  },
}

export default nextConfig
