# Club Deportivo Social y Cultural Hockey Internacional Lo Espejo

Sitio institucional. Next.js 16 + Tailwind 4, estático salvo las rutas de pago.

```bash
pnpm install
cp .env.example .env.local   # rellena las variables
pnpm dev
```

El proyecto usa **pnpm**. No mezcles gestores: si corres `npm install` se genera
un `package-lock.json` que convive mal con `pnpm-lock.yaml` y confunde a Vercel.

---

## Estructura

Sitio institucional con rutas reales (no una landing con anclas), para poder
enlazar cada sección por separado y que Google las indexe:

| Ruta | Para quién |
|---|---|
| `/` | Portada institucional |
| `/el-club` | Historia, pilares y directiva |
| `/profesores` | Cuerpo técnico. Lo primero que mira un apoderado. |
| `/escuela` | Apoderados de la comuna. La página que capta. |
| `/apoyanos` | Campaña del Mundialito: stickers, donaciones, presupuesto |
| `/auspiciadores` | Empresas. Paquetes y equivalencias. |
| `/transparencia` | Evaluadores de fondos y donantes. Antecedentes legales. |
| `/contacto` | Mapa y datos |
| `/hockey-patin` | Qué es el deporte, contado por el club. Capta búsquedas orgánicas. |
| `/pases` | Jugadoras y jugadores federados de otro club que quieran sumarse |
| `/series` | Índice de las ocho series, con la explicación escuelita → serie y el peso federativo |
| `/profesores/[id]` | Página propia de cada profesor: relato, clínicas, videos |
| `/series/[id]` | Página propia de cada serie: horarios, profesores, años de referencia, galería |
| `/privacidad` | Política de datos |

La campaña del Mundialito vive en `/apoyanos`, no en la portada. Cuando termine
en diciembre, se archiva esa página y el resto del sitio sigue en pie.

## El nombre del club

Es **«Internacional Lo Espejo»**, sin «de». No existe «Internacional DE Lo
Espejo». Hay cuatro formas válidas y todas viven en `CLUB` (`lib/club.ts`):

| Constante | Valor | Dónde se usa |
|---|---|---|
| `razonSocial` | Club Deportivo Social y Cultural Hockey Internacional Lo Espejo | Documentos legales, pie, transparencia |
| `nombreLargo` | Club Hockey Patín Internacional Lo Espejo | `alt` de imágenes, metadatos |
| `nombreCorto` | Internacional Lo Espejo | Titulares y texto corrido |
| `nombreLogo` | Hockey Patín / Internacional Lo Espejo | Logotipo de cabecera y pie |

**Nunca escribas el nombre a mano en un componente.** Importa `CLUB` y usa la
constante que corresponda: así no vuelve a divergir.

`pnpm auditar` recorre el proyecto y falla si aparece cualquier variante
incorrecta. Corre automáticamente antes de cada `pnpm build`, así que un error
de nombre detiene el deploy en Vercel en vez de llegar a producción.

También detecta **componentes huérfanos**: archivos en `components/site/` que
nadie importa. Un componente que se quitó del proyecto pero sigue en Git es
código muerto que el auditor de nombres igual revisa, así que puede romper un
deploy sin que nadie entienda por qué. Si el auditor lista uno, bórralo con
`git rm`.

El auditor revisa también el tratamiento del municipio: siempre lleva
**«Ilustre»** delante.

Nota: «comuna de Lo Espejo», «niñas de Lo Espejo», «Gimnasio Municipal de Lo
Espejo» o «el único club de hockey patín de Lo Espejo» son español correcto y no
tienen nada que ver con los nombres propios. El auditor no los toca.

## Dónde se edita el contenido

Todo el contenido vive en `lib/`. No hay panel de administración: se edita el
archivo y se hace commit.

| Qué | Archivo |
|---|---|
| Datos del club, cuenta bancaria, directiva, cuerpo técnico, series | `lib/club.ts` |
| Stickers, packs y montos de donación | `lib/apoyo.ts` |
| Fotos de la galería | `lib/galeria.ts` |
| Historia, pilares y cifras | `lib/historia.ts` |
| Horarios, profesores y años por serie | `lib/series-detalle.ts` |
| Escuelita municipal (días, horario, profesores) | `lib/club.ts` → `ESCUELITA` |
| Profesores: resumen y bio corta | `lib/club.ts` → `CUERPO_TECNICO` |
| Profesores: relato completo, clínicas, videos | `lib/profesores-extendido.ts` → `PROFESORES_EXTENDIDO` |
| Paquetes de auspicio y valor por posición en camiseta | `lib/auspicios.ts` |
| Valores formativos y cita del cuerpo técnico | `lib/valores.ts` |
| Presupuesto del viaje | `lib/presupuesto.ts` |

### Nunca pongas R.U.N. en el código

`lib/club.ts` se compila al bundle del navegador y queda en el historial de Git
para siempre, incluso si después lo borras. Los R.U.N. de la directiva viven en
el acta ante el Registro Civil, no acá.

El **RUT del club** (65.221.641-2) sí va: es de la organización, es público y
hace falta para las transferencias y para postular a fondos.

---

## Fotos de los profesores

Sin foto se muestra un monograma con las iniciales sobre negro, que se ve
intencional y no como un placeholder roto. Para poner las reales:

1. Guarda cada foto en `public/images/profesores/` en formato vertical (4:5)
2. Agrega `foto: '/images/profesores/rodolfo-oyola.webp'` a esa persona en
   `CUERPO_TECNICO` (`lib/club.ts`)

Pide autorización de imagen a cada profesor antes de publicarlas. Son adultos,
así que basta con que estén de acuerdo, pero conviene tenerlo por escrito.

## Agregar fotos a la galería

```bash
pnpm add -D sharp        # temporal, solo para correr el script
mkdir fotos-originales   # pon acá las fotos del celular
pnpm fotos               # genera los .webp optimizados
pnpm remove sharp        # IMPORTANTE: déjalo fuera antes de hacer commit
```

**`sharp` no debe quedar en `package.json`.** El sitio no la necesita para
compilar, y cualquier dependencia agregada sin regenerar `pnpm-lock.yaml` rompe
el deploy: Vercel corre `pnpm install --frozen-lockfile` y aborta si el lockfile
no calza con `package.json`.

Si alguna vez necesitas agregar una dependencia de verdad, hazlo con
`pnpm add <paquete>` (nunca `npm install`) y **commitea el `pnpm-lock.yaml`
actualizado junto al `package.json`**.

El script imprime las líneas listas para pegar en `lib/galeria.ts`. Una foto de
celular pesa 4 MB; después del script pesa ~120 KB. La carpeta
`fotos-originales/` está en `.gitignore`.

**Regla de contenido:** fotos grupales y de acción. Nada de retratos
individuales de menores identificables, y nunca nombre + foto + horario de
entrenamiento juntos.

---

## Pagos

### Transferencia

No requiere configuración. El modal muestra los datos de la Cuenta Vista y abre
el correo con el detalle del pedido prellenado.

### Mercado Pago (Checkout Pro)

1. Crea una aplicación en <https://www.mercadopago.cl/developers/panel/app>
2. Copia el **Access Token de producción** (empieza con `APP_USR-`)
3. En Vercel → Settings → Environment Variables:

| Variable | Valor | Entornos |
|---|---|---|
| `MP_ACCESS_TOKEN` | `APP_USR-…` | Production |
| `MP_WEBHOOK_SECRET` | firma del webhook | Production |
| `NEXT_PUBLIC_SITE_URL` | `https://internacionalloespejo.cl` | Production |
| `NEXT_PUBLIC_WHATSAPP` | `569XXXXXXXX` | todos |

4. En el panel de Mercado Pago, configura la notificación de **Pagos** apuntando
   a `https://TU-DOMINIO/api/mercadopago/webhook` y copia el secreto que genera.

Si `MP_ACCESS_TOKEN` no está definido, la pestaña de tarjeta devuelve un aviso y
el usuario sigue pudiendo transferir. El sitio no se rompe.

**El token va sin `NEXT_PUBLIC_`.** Con ese prefijo quedaría expuesto en el
navegador y cualquiera podría emitir cobros contra la cuenta del club.

Los precios se validan en el servidor contra `lib/apoyo.ts`: del navegador solo
viajan ids y cantidades. Sin esto, cualquiera compra el pack de $10.000 por $1
editando el request.

### Probar sin cobrar de verdad

Usa el Access Token de **prueba** y las tarjetas de test de Mercado Pago.
Nombre del titular `APRO` aprueba el pago, `OTHE` lo rechaza.

---

## WhatsApp

Hay dos componentes y se comportan distinto:

- `WhatsappButton` — **no se pinta** si falta el número. Se usa donde ya hay otra
  vía de contacto al lado (escuela, modal de apoyo, redes del pie).
- `ContactoCTA` — **siempre pinta algo**: WhatsApp si está configurado, correo si
  no. Se usa donde el llamado a la acción no puede faltar, como cada posición de
  la camiseta y cada paquete de auspicio.

Configura `NEXT_PUBLIC_WHATSAPP` con el número en formato `569XXXXXXXX`, sin
`+`, sin espacios ni guiones. Ejemplo: `56912345678`.

**Mientras la variable esté vacía, los botones no se muestran.** Un `wa.me` con
número vacío lleva a una página de error de WhatsApp, así que es preferible
ocultarlos y dejar el correo como vía de contacto. En cuanto pongas el número en
Vercel y redespliegues, aparecen solos.

Lleva `NEXT_PUBLIC_` a propósito: un teléfono de contacto no es un secreto y los
botones lo necesitan en el navegador. No confundir con `MP_ACCESS_TOKEN`, que
jamás lleva ese prefijo.

---

## Campaña del Mundialito

Datos confirmados por la organización (anuncio de agosto 2026), en `lib/apoyo.ts`:

- **13 al 19 de diciembre de 2026**, Estadio Aldo Cantoni, San Juan
- El club compite en **Sub 13 Femenina**: jugadoras de hasta 12 años, **nacidas en 2014**
- Consultas del comité organizador: **+54 264 457-6805**

La cuenta regresiva se calcula en el navegador, no en build: si se calculara al
compilar, el número quedaría congelado en la fecha del deploy.

### Presupuesto

`lib/presupuesto.ts` calcula el costo del viaje a partir de supuestos editables.
La sección "En qué se gasta cada peso" del sitio se genera desde ahí: si cambias
un supuesto, la tabla se actualiza sola.

Hay dos tipos de costo y no escalan igual: **por viajero** (pasaje, viáticos,
seguro) y **por deportista** (indumentaria: 10 jugadoras × 3 equipos completos).
Sumar apoderados encarece el primero pero no el segundo.

`TIPO_CAMBIO` está en 925 (dólar observado, 31-08-2026). **Revísalo cada mes:**
los costos se pagan en dólares y se recauda en pesos, así que una subida del
dólar encarece el viaje sin que nadie gaste de más.

La planilla `presupuesto-mundialito-2026.xlsx` es la versión para tesorería, con
los dos escenarios, el seguimiento de recaudación por fuente y el checklist de
plazos.

### Barra de recaudación

Está implementada pero **oculta**, porque `CAMPANA.meta` es `0`. Para activarla,
pon la meta y lo recaudado en `lib/apoyo.ts`:

```ts
export const CAMPANA = { meta: 7_010_575, recaudado: 320_000 } as const
```

Solo con cifras reales de tesorería. Una barra inventada que no calce con lo que
diga el tesorero hace más daño que no tener barra.

---

## Protocolo de contenido: de las redes de un profesor al sitio

El profesor Quintanilla (y cualquier otro profesor) usa sus propias redes para
difundir hockey. La pregunta que resuelve esto: ¿cómo pasa ese contenido de su
Instagram o su cámara al sitio del club, sin que alguien tenga que editar
código?

**El flujo, en cuatro pasos:**

1. **El profesor genera el contenido** — un video de un entrenamiento, fotos de
   un partido, lo que sea — en su propio teléfono o sus propias redes.
2. **Alguien de la directiva decide qué vale la pena traer al sitio.** No todo
   lo que se postea en Instagram necesita estar en la web del club; acá se
   curan los momentos que representan al club, no se replica el feed entero.
3. **Se sube a donde corresponde según el formato:**
   - **Video → YouTube.** Nunca se aloja un archivo de video en el repo (son
     pesados y no hay dónde ponerlos). Se sube a YouTube —al canal del club si
     existe, o al del profesor si el video es sobre hockey— y solo se copia el
     link.
   - **Fotos → se comprimen y se suben a `public/images/noticias/`.** Mientras
     el volumen sea el de un club chico (algunas fotos por semana), esto basta
     y no pesa nada: cada foto que hemos subido hasta ahora pesa entre 80 y
     200&nbsp;KB.
4. **Se ingesta en `/admin`** — se pega el link de YouTube o se listan las
   fotos ya subidas, se arma el bloque de código, se pega en
   `lib/noticias.ts`. Desde ahí aparece solo en la portada, en la página de la
   serie y en la página del profesor que corresponda.

### Ingesta de partidos ARDI: detalles que importan

- **Escudos**: si `local.escudo` o `visita.escudo` vienen vacíos, la tarjeta
  muestra las iniciales del equipo en vez de romperse — es el comportamiento
  esperado, no un error. Si vienen con una URL de ImgBB (`i.ibb.co`), ese
  dominio ya está autorizado en `next.config.mjs`; si ARDI empieza a alojar
  escudos en otro servicio, hay que agregar ese dominio ahí también o la
  imagen sale rechazada en silencio.
- **Tarjetas** (`blue`/`yellow`/`red`): se pintan con estilo inline, no con
  clases de Tailwind generadas dinámicamente — así no dependen de que el
  valor calce en mayúsculas exactas con la clave del mapa de colores.
- **Gol anulado**: el matchLog de ARDI trae dos líneas para el mismo hecho —
  "Gol" y luego "GOL ANULADO...". `fusionarCronologia()` en `lib/noticias.ts`
  las une en una sola entrada tachada con la razón como nota, en vez de
  mostrar dos eventos donde hay uno. Se aplica solo al mostrar, nunca hace
  falta editar el JSON que entrega ARDI antes de pegarlo.

### Si el volumen de fotos crece mucho

Si en algún momento se sube tanto que el repositorio empieza a pesar demasiado
(cientos de fotos, no decenas), hay dos caminos, sin necesidad de rediseñar
nada:

- **Seguir con Instagram como el álbum completo.** El sitio muestra 3 a 5 fotos
  curadas por noticia y un link «Ver más fotos en Instagram» (el campo
  `masFotosUrl` en `lib/noticias.ts` ya existe para esto). Costo: cero. Es la
  opción por defecto mientras el volumen sea manejable.
- **Cloudinary** (plan gratuito: 25 GB de almacenamiento y tráfico al mes) como
  bodega de fotos fuera del repo. Se sube la foto ahí, se copia la URL
  (`https://res.cloudinary.com/...`), y se pega esa URL directo en el campo
  `src` de una foto — el tipo de dato ya acepta cualquier URL, no solo rutas
  locales. Ese dominio ya está autorizado en `next.config.mjs` para que
  funcione el día que se necesite, sin otro despliegue de por medio.

No hay que decidir esto ahora. Se cruza ese puente cuando el peso del repo
empiece a molestar de verdad.

## Noticias

Partidos, notas, videos y publicaciones de Instagram viven en **Supabase**
(tabla `noticias`), no en un archivo del repo. Se pasó de un arreglo estático
a una base de datos real porque la fricción de "cada publicación necesita que
alguien pegue código y despliegue" no calzaba con querer publicar sin
depender de un desarrollador cada vez — ver `PROMPT-HILO-WEB.md` para la
decisión original, y esta sección para por qué se abandonó después.

### Poner en marcha el proyecto de Supabase (una sola vez)

1. Crear un proyecto nuevo en [supabase.com](https://supabase.com) — gratis,
   **propio del club**. No reutilizar el proyecto de Dondestanemo ni el de
   ningún otro sitio: son aplicaciones distintas, con datos que no deben
   mezclarse.
2. En el SQL Editor del proyecto, correr `supabase/schema.sql` (crea la tabla
   y sus índices) y después `supabase/seed.sql` (carga las noticias que ya
   estaban publicadas antes de este cambio).
3. En Vercel, agregar dos variables de entorno (ver `.env.example`):
   - `SUPABASE_URL` — Settings → API → Project URL
   - `SUPABASE_SERVICE_ROLE_KEY` — Settings → API → Project API keys →
     `service_role`. Es una llave con permisos totales: nunca con el prefijo
     `NEXT_PUBLIC_`, nunca en un commit.
4. Volver a desplegar. Sin estas dos variables, el sitio sigue funcionando
   — las páginas que muestran noticias simplemente no muestran ninguna, en
   vez de romperse (`obtenerNoticias()` en `lib/noticias.ts` captura el error
   y devuelve una lista vacía).

### Cuatro tipos, una misma tabla

- **`partido`** — el JSON tal como lo exporta ARDI (`formato: "ardi:partido"`).
  El `id` es estable (fecha + equipos): publicar el mismo id dos veces
  reemplaza, no duplica. Los goles `anulado: true` ya están descontados del
  marcador — nunca sumarlos de nuevo, solo se muestran tachados en la
  cronología.
- **`nota`** — título, resumen, cuerpo en párrafos, fotos. Para novedades del
  club, agradecimientos a auspiciadores, etc.
- **`video`** — un ID de YouTube (los 11 caracteres, no la URL completa).
- **`instagram`** — el link completo a una publicación o reel. Se empotra con
  el script oficial de Meta (`embed.js`) — no es una API con garantía de
  estabilidad, así que la página de detalle siempre deja además el link
  «Ábrela directo en Instagram» como respaldo.

Cada noticia se puede etiquetar con `series: [...]` (ids de `SERIES` en
`lib/club.ts`) y `profesores: [...]` (ids de `CUERPO_TECNICO`) para que
aparezca también en esas páginas, y `escuelita: true` para la escuelita.
`destacada: true` la pone en la portada.

El filtro por serie de `/noticias` se construye solo, leyendo qué series de
partido existen en los datos (`seriesDePartidosEnDatos()`) — no hay que tocar
código cuando la Liga Central agregue una serie nueva.

`NoticiasFeed` (usado en `/noticias`, en cada serie, cada profesor y la
escuelita) carga de a 3: siempre entran tres al abrir, y el botón «Cargar
más» revela tres más cada vez.

### El admin (`/admin`)

Cuatro pestañas para publicar — partido (JSON de ARDI), video de YouTube,
Instagram, o nota con fotos — cada una con un botón **"Publicar noticia"**
que hace `POST /api/admin/noticias`. Al tocarlo, la noticia queda en
Supabase; el sitio la muestra dentro de un minuto (las páginas que muestran
noticias revalidan cada 60 segundos — `export const revalidate = 60` en cada
`page.tsx` correspondiente).

La quinta pestaña, **Editar / Eliminar**, trae la lista real desde
`GET /api/noticias`:

- **Editar** abre el JSON completo en un cuadro de texto — se toca cualquier
  campo — y "Guardar cambios" hace `PATCH /api/admin/noticias/[id]`.
- **Eliminar** pide confirmación y hace `DELETE /api/admin/noticias/[id]`.

Protegido por contraseña: la variable `ADMIN_PASSWORD` en Vercel. La cookie de
sesión es un hash de esa contraseña — cambiarla en Vercel cierra todas las
sesiones abiertas al instante, sin tocar código. El middleware (`proxy.ts`)
protege tanto las páginas (`/admin/*`) como las rutas de escritura
(`/api/admin/*`), y cada ruta además revalida la cookie por su cuenta
(`lib/admin-auth.ts`) — nunca depende solo del middleware.

**Cuidado si se vuelve a tocar `proxy.ts`**: `/api/admin/login` y
`/api/admin/logout` tienen que quedar siempre exceptuados de la protección.
Si no, nadie puede loguearse nunca — pasó exactamente eso una vez durante el
desarrollo, y la única forma de notarlo fue probando el flujo completo con
`curl`, no con el build. Si el día de mañana se agrega una ruta nueva bajo
`/api/admin/`, revisar si necesita la misma excepción.

### Ingesta de partidos ARDI: detalles que importan

- **Escudos**: si `local.escudo` o `visita.escudo` vienen vacíos, la tarjeta
  muestra las iniciales del equipo en vez de romperse — es el comportamiento
  esperado, no un error. Si vienen con una URL de ImgBB (`i.ibb.co`), ese
  dominio ya está autorizado en `next.config.mjs`; si ARDI empieza a alojar
  escudos en otro servicio, hay que agregar ese dominio ahí también o la
  imagen sale rechazada en silencio.
- **Tarjetas** (`blue`/`yellow`/`red`): se pintan con estilo inline, no con
  clases de Tailwind generadas dinámicamente — así no dependen de que el
  valor calce en mayúsculas exactas con la clave del mapa de colores.
- **Gol anulado**: el matchLog de ARDI trae dos líneas para el mismo hecho —
  "Gol" y luego "GOL ANULADO...". `fusionarCronologia()` en `lib/noticias.ts`
  las une en una sola entrada tachada con la razón como nota, en vez de
  mostrar dos eventos donde hay uno. Se aplica solo al mostrar, nunca hace
  falta editar el JSON que entrega ARDI antes de publicarlo.

## Páginas propias de cada profesor

Cada profesor tiene su página en `/profesores/[id]` con el relato completo
(`lib/profesores-extendido.ts`), más dos secciones que empiezan vacías a
propósito: **clínicas** y **videos**. No es un error que estén vacías, es el
espacio que cada profesor puede pedirte llenar cuando quiera publicar algo.

Para agregar una clínica o un video, edita `PROFESORES_EXTENDIDO` en
`lib/profesores-extendido.ts`:

```ts
'antonio-espinoza': {
  clinicas: [
    { titulo: '...', fecha: '2026-03', descripcion: '...', enlace: 'https://...' },
  ],
  videos: [
    { titulo: '...', url: 'https://...' },
  ],
  ...
}
```

## Pendientes antes de publicar

- [ ] `NEXT_PUBLIC_WHATSAPP` en Vercel
- [ ] `recaudado` real en `CAMPANA` (`lib/apoyo.ts`) para encender la barra
- [ ] Confirmar el cierre de inscripción con el comité (en 2025 fue el 15 de octubre)
- [ ] **Confirmar la asignación de profesores por serie** en `lib/series-detalle.ts` — interpreté "17 y 23 masculina" como probable error de tipeo por "19 y 23" (no existe Sub 17 masculina en el club); si es otra cosa, corrígeme
- [ ] Confirmar con la Liga Central el artículo exacto de la regla "hasta 2 series superiores" (`SERIES_DETALLE` en `lib/series-detalle.ts`) — ya está con la lógica de años correcta (confirmada por la directiva), falta el respaldo del reglamento escrito
- [ ] **Verificar que cada retrato corresponde al profesor correcto** (`CUERPO_TECNICO` en `lib/club.ts`)
- [ ] Validar con la directiva los precios por posición en la camiseta (`CAMISETA` en `lib/auspicios.ts`) — hoy son una propuesta
- [ ] Confirmar con Rodrigo Quintanilla su título en el Mundial B de Macao 1998 como arquero
- [ ] Los formularios de escuela y contacto **no envían nada** todavía
