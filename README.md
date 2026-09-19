# GABOFOTOS

Sitio de **Gabriel Cabezas Salgado**, fotógrafo profesional en Santiago de Chile (Next.js 16, React 19, Tailwind 4).
Se despliega en Vercel; las fotos que sube Gabo viven en Supabase.

| Documento | Para qué sirve |
| --- | --- |
| [`DESPLIEGUE.md`](DESPLIEGUE.md) | Guía paso a paso para publicar el sitio |
| [`supabase/schema.sql`](supabase/schema.sql) | SQL que se corre una vez en Supabase (tabla `fotos` y bucket `fotos`) |
| [`.env.example`](.env.example) | Variables de entorno, comentadas |

## Qué incluye

- **Portada** con logo de entrada, botón «Cotiza tu evento», carrusel de trabajos y cuatro categorías (Social, Colegios, Retratos, Deporte), cada una con su galería.
- **Formulario de contacto** que no envía datos a ningún servidor: arma el mensaje y abre WhatsApp con él escrito.
- **Perfil profesional «Gabo & Planes»**: trayectoria, servicios, cuadros de graduación con marco y galería «Gabo en acción» (blanco y negro; al tocar una foto pasa a color y ofrece consultar por WhatsApp o Instagram).
- **Panel `/admin`** para subir, ordenar, ocultar, describir y eliminar fotos, sin tocar código.
- **Buscadores y redes:** metadatos, imagen para compartir (`public/og.jpg`), datos estructurados JSON-LD, `sitemap.xml`, `robots.txt` y `manifest`.
- **Íconos:** `favicon.ico`, `icon.svg`, `apple-icon.png` e íconos de 192 y 512 px (uno «maskable»), dibujados desde el logo (`public/images/gabofotos-logo.jpg`).
- **Ficha técnica en PDF** opcional (ver más abajo).

## Correr en local

```bash
pnpm install
cp .env.example .env.local   # y completa las variables (ver DESPLIEGUE.md)
pnpm dev
```

Sin variables el sitio igual funciona: las galerías muestran las fotos de ejemplo y `/admin` avisa que falta configurar.

## Estructura

```
app/                  páginas y rutas (portada, /admin, /api, sitemap, robots, manifest)
components/           interfaz del sitio; components/admin/ es el panel
lib/                  configuración y lógica (contacto, galerías, Flickr, Supabase, sesión)
supabase/schema.sql   base de datos y almacenamiento
public/               logos, íconos y fotos (images/portfolio y images/gabo son las de ejemplo)
proxy.ts              primera barrera de /admin y /api/admin
```

## Dónde se edita cada cosa

| Qué | Archivo |
| --- | --- |
| Teléfono, correo, Instagram, Facebook, Flickr, WhatsApp | `lib/site-config.ts` |
| Categorías, portadas, álbumes de Flickr y fotos de respaldo | `lib/gallery.ts` |
| Fotos de la galería «Gabo en acción» | `lib/pro-gallery.ts` y `public/images/gabo/` |
| Niveles y medida de los cuadros de graduación | `lib/frames.ts` |
| Textos de «Gabo & Planes» (biografía, trayectoria, servicios) | `components/about-plans-modal.tsx` |
| Opciones del formulario de contacto | `components/contact-form.tsx` |
| Panel de fotos | `components/admin/admin-panel.tsx`, `app/api/admin/`, `lib/admin-auth.ts` |
| Metadatos, título y datos para buscadores | `app/layout.tsx` |

## Galerías: de dónde salen las fotos

Cada categoría muestra, en este orden:

1. **Las fotos que Gabo sube desde `/admin`** (Supabase), en el orden que él les dé.
2. **Las de sus álbumes de Flickr**, solo si hay `FLICKR_API_KEY` (opcional).
3. **Las fotos de ejemplo** de `public/images/portfolio/`, únicamente si no hay ninguna de las anteriores.

La ruta pública es `app/api/galeria/[categoria]/route.ts` y la lógica está en `lib/gallery-data.ts`.
Los cambios del panel se ven en el sitio en menos de un minuto. Si solo se usa el panel, no hace falta definir `FLICKR_API_KEY`.

**Color:** las fotos se muestran en blanco y negro y pasan a color al poner el mouse encima. En pantallas táctiles no existe
el mouse, así que ahí se ven a color desde el principio (regla `.bn-con-mouse` en `app/globals.css`).

## Panel de fotos (`/admin`)

Gabo entra con su contraseña y puede **subir varias fotos a la vez** (desde el celular o el computador),
**ordenarlas, ocultarlas, cambiarlas de categoría, describirlas y eliminarlas**.

- El navegador **achica cada foto a 1600 px, la convierte a WebP y le borra los datos ocultos** (ubicación GPS,
  modelo del celular) antes de subirla. Una foto de 4 MB queda en ~250 KB.
- El servidor **no confía en el navegador**: comprueba que el archivo sea realmente JPG, PNG o WebP, lee sus medidas
  y le pone su propio nombre.
- En **Colegios** hay que confirmar que se tiene autorización del colegio o de los apoderados (hay menores de edad).
- **Sesión:** cookie firmada (HMAC) que caduca a los 7 días, comparación en tiempo constante, límite de 5 intentos
  fallidos por IP cada 10 minutos, verificación del origen en cada cambio y cookie `sameSite=strict`. Cambiar
  `ADMIN_SESSION_SECRET` cierra todas las sesiones.
- **Sin dependencias nuevas:** habla con Supabase por `fetch` (`lib/supabase-rest.ts`), así `pnpm-lock.yaml` no cambia
  y Vercel no falla con `--frozen-lockfile`.
- La llave secreta de Supabase solo se usa en el servidor. La tabla `fotos` tiene RLS activado y sin políticas.

### Puesta en marcha (una sola vez)

1. Crear un proyecto en [supabase.com](https://supabase.com), **propio de GABOFOTOS**.
2. En su SQL Editor, correr `supabase/schema.sql` (crea la tabla `fotos` y el bucket público `fotos`).
3. Cargar las variables de entorno en Vercel y volver a desplegar.
4. Entrar a `/admin`, subir una foto de prueba y confirmar que aparece en el sitio.

Los proyectos gratuitos de Supabase se pausan tras una semana sin actividad (las visitas al sitio cuentan) y tienen
un tope de tráfico mensual. Si el sitio crece mucho, las fotos se pueden mover a otro almacén sin cambiar el panel.

## Variables de entorno

Se cargan en Vercel (Settings → Environment Variables, en Production y Preview). Después de cambiar una hay que volver a desplegar.

| Variable | Obligatoria | Qué es |
| --- | --- | --- |
| `SUPABASE_URL` | Sí, para el panel | Project URL de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Sí, para el panel | Llave secreta de Supabase (`service_role` o `sb_secret_…`). Nunca con `NEXT_PUBLIC_` |
| `ADMIN_PASSWORD` | Sí, para el panel | Contraseña de Gabo para `/admin` |
| `ADMIN_SESSION_SECRET` | Recomendada | Texto largo y al azar para firmar sesiones |
| `NEXT_PUBLIC_SITE_URL` | Recomendada | Dominio final, `https://www.gabofotos.cl` (sin barra final) |
| `FLICKR_API_KEY` | Opcional | Suma las fotos de sus álbumes de Flickr |
| `FLICKR_USER_ID` | No | Solo si cambia la cuenta (por defecto `40717141@N04`) |

## Reglas del sitio

- **Sin precios.** El sitio no publica valores: todo lleva a cotizar por WhatsApp (incluidos los cuadros de graduación).
  Los presupuestos se envían por WhatsApp.
- **Cuadros con marco: solo para fotos de graduación** (licenciatura y egreso), en tres niveles del mismo tamaño (30×40 cm).
  No se ofrecen para otros trabajos, y los marcos disponibles los muestra Gabo al cotizar.
- **Menores de edad:** sus rostros se publican solo con autorización del colegio o los apoderados. Nada de listas con nombres
  completos: los afiches de licenciatura y egreso usan nombres de ejemplo.

## Álbumes de Flickr por título (opcional)

En `lib/gallery.ts`, un álbum puede indicarse solo con su `title`. Para que aparezca en el sitio, crea en Flickr un álbum
público con ese nombre exacto: **Colegios** (el más importante), **Hockey**, **Eventos**, **Nacimientos** y **Cuadros**
(de graduación); opcionales: **Licenciaturas** y **Galas**. Se actualizan solos (caché de una hora).

## Ficha técnica (PDF)

El pie de página muestra «Descargar ficha técnica» si existe `public/GaboFotos-Brochure.pdf` **al compilar**
(`next.config.mjs` lo revisa y deja el resultado en `NEXT_PUBLIC_BROCHURE`). Después de agregarlo hay que volver a desplegar.
Antes de subirla: quitar la fecha de nacimiento de la última página y corregir `flick.com` por `flickr.com`.

## Estado de verificación y mantenimiento

- Lo que se probó por partes: lector de imágenes, sesión firmada, rutas del panel (subir, editar, ordenar, borrar), login,
  proxy y armado de galerías, con Supabase simulado. Revisión de imports, archivos públicos, rutas y anclas: sin enlaces rotos.
- **Lo que no se pudo probar en el entorno donde se armó:** compilar (`pnpm build`) ni usar un Supabase real ni la compresión de fotos
  en un navegador. En el primer despliegue: compilar, subir una foto de prueba desde el celular y confirmar que se ve.
- `next.config.mjs` tiene `typescript.ignoreBuildErrors: true` (viene de v0). Cuando el primer build salga limpio, conviene quitarlo.
- **No cambiar `package.json` ni `pnpm-lock.yaml`** sin `pnpm add` y commit del lockfile: Vercel aborta si no calzan.
- En `proxy.ts`, `/admin/login`, `/api/admin/login` y `/api/admin/logout` deben quedar siempre exceptuados; si no, nadie puede entrar.
- Si el repositorio sigue vinculado a **v0**, no le pidas cambios sobre este código: puede pisar el panel y las galerías.
