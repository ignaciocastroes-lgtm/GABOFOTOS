// Datos de contacto y redes de GABOFOTOS en un solo lugar.
// Si algo cambia (teléfono, correo, un usuario de red social), se edita aquí.

export const siteConfig = {
  name: "GABOFOTOS",
  owner: "Gabriel Cabezas Salgado",
  // Dominio público. En Vercel se puede fijar con NEXT_PUBLIC_SITE_URL (sin barra final).
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.gabofotos.cl").replace(/\/$/, ""),
  location: "Santiago, Chile",
  phone: { display: "+569 9672 9209", tel: "+56996729209" },
  email: "gabofotoss@gmail.com",
  whatsapp: {
    number: "56996729209",
    intro: "Hola Gabriel, vengo de tu sitio web y me interesa cotizar ",
  },
  social: {
    instagram: {
      handle: "@gabofotoss",
      url: "https://www.instagram.com/gabofotoss/",
      // Abre el chat directo con la cuenta (Instagram no permite precargar el texto).
      dm: "https://ig.me/m/gabofotoss",
    },
    instagramCorp: { handle: "@gabofotos_corp", url: "https://www.instagram.com/gabofotos_corp/" },
    facebook: { label: "GaboFotos", url: "https://www.facebook.com/GaboFotos-273963392727628/" },
    flickr: { label: "Flickr", url: "https://www.flickr.com/photos/gcabezasplop/" },
    youtube: { label: "YouTube", url: "https://www.youtube.com/@gabofotos" },
  },
  flickr: {
    // NSID público de la cuenta gcabezasplop (se puede sobreescribir con FLICKR_USER_ID).
    userId: "40717141@N04",
    albumsUrl: "https://www.flickr.com/photos/gcabezasplop/albums/",
  },
} as const

/** Enlace de WhatsApp con un mensaje libre ya escrito. */
export function whatsappMessageLink(message: string) {
  return `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(message)}`
}

/** Enlace de WhatsApp para cotizar algo: "Hola Gabriel, ... me interesa cotizar <tema>". */
export function whatsappLink(topic: string) {
  return whatsappMessageLink(siteConfig.whatsapp.intro + topic)
}
