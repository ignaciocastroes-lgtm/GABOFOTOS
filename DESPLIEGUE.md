# Guía de despliegue — GABOFOTOS

Tiempo estimado: 45 a 60 minutos, casi todo esperando que carguen las páginas.
Orden recomendado: **Supabase → Vercel → probar → dominio → ficha PDF**.

## 0. Qué necesitas

- La cuenta de **GitHub** donde vive el repositorio del sitio y la cuenta de **Vercel** conectada a él.
- Una cuenta de **Supabase** (gratis) para las fotos del panel.
- El dominio **gabofotos.cl** (ya es de Gabo) y acceso a su panel en NIC Chile o donde lo administre.
- Opcional: una clave de **Flickr** (solo si quieres sumar también sus álbumes).
- Una contraseña larga para Gabo y un texto largo al azar para firmar sesiones.

> Si el repositorio sigue vinculado a **v0**, no le pidas cambios a v0 sobre este código: puede pisar el
> panel y las galerías. Los cambios se hacen aquí o con Claude, y se suben a GitHub.

## 1. Subir el código

1. Descomprime `gabofotosMVP-final.zip`.
2. En el repositorio, crea una rama (por ejemplo `version-final`) y **reemplaza todo su contenido** por el de la
   carpeta `gabofotosMVP-main` (no toques la carpeta oculta `.git`). Reemplazar todo y no solo copiar encima
   evita que queden archivos viejos, como la ruta antigua `app/api/flickr/`.
3. **No borres ni regeneres `pnpm-lock.yaml`.** Esta versión no agrega dependencias, así que el archivo actual sirve.
4. **Recomendado si tienes Node instalado** (esta versión no se pudo compilar en el entorno donde se armó): antes del push,
   corre `pnpm install` y `pnpm build`. Si termina sin errores, sigue. Si falla, pega el error tal cual para corregirlo.
5. Haz commit y push. Vercel crea solo un despliegue de prueba (*Preview*) para la rama.

## 2. Crear el proyecto de Supabase

1. En [supabase.com](https://supabase.com) → **New project**. Nombre: `gabofotos`. Región: **South America (São Paulo)**.
   Guarda la contraseña de la base de datos donde no se pierda (no se usa en el sitio, pero la pide Supabase).
2. Cuando termine de crearse: **SQL Editor → New query**, pega el contenido de `supabase/schema.sql` y pulsa **Run**.
   Crea las tablas `fotos`, `videos` y `plan_imagenes`, y el bucket público `fotos`.
   - Si tu Supabase ya estaba creado antes, corre **solo desde el bloque «VIDEOS» hasta el final** del archivo (es seguro repetirlo).
   - Si ya habías corrido `schema.sql` antes del 23-sep-2026, corre además el bloque **«CATEGORÍAS 2026-09-23»**: pasa las fotos que estaban en Social a Matrimonios y las que estaban en Retratos a Cumpleaños.
   - Si la parte del bucket da error, créalo a mano: **Storage → New bucket** → nombre `fotos` → marca **Public bucket**.
3. Copia dos datos, los necesitas en el paso siguiente:
   - **Project URL**: Settings → API (o "Data API").
   - **Llave secreta**: Settings → API Keys → la `service_role` (o la `secret`, que empieza con `sb_secret_`).
     Sirve cualquiera de las dos. **Es una llave con todos los permisos: nunca en el código ni en un mensaje.**

## 3. Cargar las variables en Vercel

Vercel → tu proyecto → **Settings → Environment Variables**. Agrégalas para **Production** y **Preview**:

| Variable | Valor |
| --- | --- |
| `SUPABASE_URL` | El Project URL del paso 2 |
| `SUPABASE_SERVICE_ROLE_KEY` | La llave secreta del paso 2 (marca *Sensitive*) |
| `ADMIN_PASSWORD` | La contraseña de Gabo para `/admin` (larga; sin comillas ni espacios) |
| `ADMIN_SESSION_SECRET` | Texto largo al azar, por ejemplo el resultado de `openssl rand -hex 32` (marca *Sensitive*) |
| `NEXT_PUBLIC_SITE_URL` | `https://www.gabofotos.cl` (sin barra final) |

Las fotos de Flickr se traen solas, sin ninguna variable ni clave que configurar (Flickr ahora exige
cuenta Pro para dar API keys; el sitio usa en su lugar el feed público de cada álbum, que es gratis y no
tiene ese requisito — ver el README, sección «Flickr, sin API key»).

Después de guardar las variables hay que **volver a desplegar** (Deployments → los tres puntos → *Redeploy*).
Una variable nueva no afecta a un despliegue que ya existe.

## 4. Probar el despliegue de prueba (Preview)

Abre la dirección de Preview que da Vercel y revisa, en el celular y en el computador:

- [ ] El inicio carga, el logo hace su efecto y aparece el carrusel.
- [ ] Las cuatro categorías de la portada — **Matrimonios, Colegios, Cumpleaños, Deporte** — abren su galería y se cierran con la X;
      los enlaces del menú de arriba llevan a cada una.
- [ ] Formulario de contacto: elegir un trabajo, poner un nombre y pulsar **Enviar por WhatsApp** abre WhatsApp con el mensaje escrito.
- [ ] La pestaña del navegador muestra el ícono de la cámara (si ves el viejo, recarga con Ctrl+F5).
- [ ] `/admin` pide contraseña. Con una incorrecta dice "Contraseña incorrecta".
- [ ] Entrando al panel: subir **una foto de prueba desde el celular** a Matrimonios. Aparece en la lista.
- [ ] En menos de un minuto la foto aparece en el sitio (Matrimonios y carrusel).
- [ ] Probarla con **Ocultar** y con **Eliminar**: desaparece del sitio.
- [ ] En **Colegios** el panel exige marcar la autorización antes de subir.
- [ ] En el celular y en la tablet las fotos se ven en blanco y negro y **pasan a color al tocarlas**; en el PC, al pasar el mouse.
- [ ] En `/admin` → pestaña **Videos**: pegar un enlace de YouTube, ponerle título y agregarlo. En menos de un minuto aparece la sección «Videos» en el inicio; al tocar la tarjeta se abre el video y el botón verde abre WhatsApp con el mensaje escrito.
- [ ] En el menú, **Conoce a Gabriel** abre su historia, las fotos de empresas y el contacto; **Descargar brochure (PDF)** baja el archivo y la última página **no** trae fecha de nacimiento. Revisar en celular y en PC.
- [ ] En el menú, **Presupuestos** abre los servicios con su imagen; **Cuadros de graduación** dice que también vende las fotos en digital; los botones verdes abren WhatsApp con el mensaje escrito.
- [ ] En `/admin` → pestaña **Presupuestos**: cambiar la imagen de un servicio; en menos de un minuto aparece en la ventana. **Volver a la original** la restaura.

Si todo está bien: en GitHub haz *merge* de la rama a `main`. Vercel publica en producción.

## 5. Conectar el dominio

1. Vercel → **Settings → Domains → Add**. Agrega `www.gabofotos.cl` y también `gabofotos.cl`.
2. Deja **www** como principal y que el otro redirija a él (así coincide con `NEXT_PUBLIC_SITE_URL`).
3. Vercel muestra los **valores exactos** que hay que cargar en el DNS. Usa esos. Normalmente son un registro
   **A** para `gabofotos.cl` y un **CNAME** para `www` hacia `cname.vercel-dns.com`; o bien cambiar los
   servidores de nombres a los de Vercel.
4. En NIC Chile (o donde esté administrado) entra a la configuración de DNS del dominio y carga esos valores.
5. Espera a que Vercel muestre el dominio con un tilde verde. Puede tardar desde minutos hasta 24 horas.
   El certificado HTTPS lo crea Vercel solo.

## 6. Después de publicar

- [ ] Vercel → **Analytics → Enable** para ver las visitas.
- [ ] Abre `https://www.gabofotos.cl` en el celular y comparte el enlace por WhatsApp: debe mostrar el logo como imagen.
      (WhatsApp guarda en memoria las vistas previas: si ves una vieja, prueba con otro chat o espera.)
- [ ] [Google Search Console](https://search.google.com/search-console) → agregar `gabofotos.cl` → enviar el mapa del sitio
      `https://www.gabofotos.cl/sitemap.xml`.
- [ ] **Brochure (PDF):** ya viene incluido (`public/GaboFotos-Brochure.pdf`, sin la fecha de nacimiento). Si Gabo lo reexporta,
      reemplaza ese archivo (sin datos personales) y vuelve a desplegar. El botón aparece solo.
- [ ] Imprime la dirección en las tarjetas recién cuando el dominio esté funcionando.

## 7. Uso diario de Gabo

1. Entrar a `www.gabofotos.cl/admin` con su contraseña.
2. Elegir la categoría, seleccionar las fotos (se pueden elegir varias a la vez) y **Subir**.
3. Ordenar con las flechas, ocultar con el ojo, describir cada foto y eliminar con el tacho.
4. Los cambios se ven en el sitio en menos de un minuto.

Presupuestos: en `/admin` → pestaña **Presupuestos** se cambia la imagen de cada servicio (**Cambiar imagen**) o se vuelve a la
original (**Volver a la original**). Solo cambia la imagen; los textos de los servicios se editan en el código.

Videos: en `/admin` → pestaña **Videos** se pega el enlace de YouTube (botón *Compartir* del video), se le pone un título y se
agrega. Se pueden reordenar, ocultar, cambiar de enlace y eliminar (eliminar solo lo quita del sitio, no borra el video de YouTube).
El sitio muestra hasta 3 videos.

Reglas: fotos de niños y colegios solo con autorización del colegio o los apoderados; nada de listas con nombres completos.

## 8. Si algo falla

| Síntoma | Causa probable | Qué hacer |
| --- | --- | --- |
| El build falla con un error de `pnpm` o `lockfile` | Se cambió `package.json` o el lockfile | Volver a los archivos originales del zip |
| `/admin` dice "ADMIN_PASSWORD no está configurada" | Falta la variable o falta redeploy | Cargarla en Vercel y volver a desplegar |
| Al subir una foto: "Faltan SUPABASE_URL…" | Faltan las variables de Supabase | Revisar paso 3 y volver a desplegar |
| Al subir una foto: error de Storage o bucket | El bucket `fotos` no existe | Crearlo como público (paso 2) |
| La foto sube pero no se ve en el sitio | Caché de un minuto, o la foto está oculta | Esperar 1 minuto; revisar el ojo de la foto |
| Al cambiar una imagen en Presupuestos da error, o no se guarda | Falta correr el bloque «PLAN_IMAGENES» de `schema.sql` en Supabase | Correrlo (paso 2) y reintentar |
| La sección «Videos» no aparece | No hay videos cargados/visibles, o falta correr el bloque «VIDEOS» de `schema.sql` en Supabase | Revisar `/admin` → Videos; correr el SQL si el panel da error |
| «Ese enlace no parece de YouTube» al agregar un video | Se pegó otro tipo de enlace | Copiar el enlace desde el botón *Compartir* del video (`youtu.be/…` o `youtube.com/watch?v=…`) |
| Solo se ven las fotos de ejemplo | Supabase sin configurar, o no hay fotos visibles en esa categoría | Revisar variables y subir fotos |
| "Demasiados intentos" al entrar | 5 contraseñas malas seguidas | Esperar 10 minutos |
| Se cerró la sesión de todos | Se cambió `ADMIN_SESSION_SECRET` o la contraseña | Es lo esperado: volver a entrar |
| El sitio funcionaba y las fotos del panel desaparecieron | Proyecto de Supabase pausado (plan gratis, una semana sin actividad) | Reactivarlo en el panel de Supabase |

## 9. Seguridad y respaldo

- Contraseña larga y distinta a las demás. Para cerrar todas las sesiones: cambiar `ADMIN_SESSION_SECRET` y volver a desplegar.
- La llave secreta de Supabase solo vive en Vercel. Si se filtra, se regenera en Supabase y se actualiza en Vercel.
- Gabo debe **conservar los originales** de sus fotos: el panel guarda versiones reducidas (1600 px) para la web.
- El plan gratuito de Supabase tiene tope de almacenamiento y de tráfico. Si el sitio crece, se pasa al plan de pago
  o las fotos se mueven a otro almacén sin cambiar el panel.
