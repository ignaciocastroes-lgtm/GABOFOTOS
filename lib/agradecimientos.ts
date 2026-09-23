// Sección «Agradecimientos» del inicio: unos pocos videos elegidos a mano (no pasan por /admin ni
// por Supabase), con un enlace al canal de YouTube completo. Se editan aquí mismo, a mano:
//  - para cambiar uno, reemplaza su `youtubeId` (los 11 caracteres del enlace) y su `titulo`.
//  - para sacar uno, borra su bloque de la lista.
//  - para agregar uno, copia un bloque y pon un `id` que no se repita.
// Si en algún momento Gabo prefiere administrar los videos desde /admin (Supabase) en vez de este
// archivo, esta sección se reemplaza sola: video-section.tsx usa primero lo que haya en Supabase, y
// solo cae a esta lista mientras Supabase no tenga ningún video cargado.
import type { VideoPublico } from "./videos"

export const agradecimientos: VideoPublico[] = [
  {
    id: "canal13-saludo-novia",
    titulo: "Saludo de novia · \"Contra Viento y Marea\", Canal 13",
    youtubeId: "86De52hXPFI",
  },
  {
    id: "gabofotos-short-2",
    titulo: "",
    youtubeId: "PwmR6wHrTyk",
  },
  {
    id: "gabofotos-short-3",
    titulo: "",
    youtubeId: "0Ue-YrlDhsY",
  },
]
