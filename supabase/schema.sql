-- ============================================================
-- GABOFOTOS — fotos administrables desde /admin
--
-- Correr esto UNA vez en el SQL Editor de un proyecto de Supabase
-- propio de GABOFOTOS (no reutilizar el de otra app).
-- ============================================================

create table if not exists fotos (
  id uuid primary key default gen_random_uuid(),
  categoria text not null check (categoria in ('social', 'colegios', 'retratos', 'deporte')),
  -- Ruta del archivo dentro del bucket "fotos", ej. social/3f2a...webp
  path text not null unique,
  ancho int not null check (ancho > 0),
  alto int not null check (alto > 0),
  alt text not null default '',
  orden int not null default 0,
  visible boolean not null default true,
  -- Colegios: quien sube confirma que tiene autorización para publicar (menores de edad).
  autorizado boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists fotos_categoria_orden_idx on fotos (categoria, orden, created_at desc);

-- RLS activado y SIN políticas: nadie puede leer ni escribir esta tabla con la llave pública.
-- Todo pasa por las rutas del servidor, que usan la llave secreta (service role).
alter table fotos enable row level security;

-- Bucket público de lectura para las imágenes (solo jpg, png y webp, máx. 5 MB).
-- Si esta línea falla en tu versión de Supabase, crea el bucket a mano:
-- Storage → New bucket → nombre "fotos" → marcar "Public bucket".
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos', 'fotos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- ============================================================
-- VIDEOS — videos de YouTube administrables desde /admin
--
-- Si el proyecto de Supabase ya existía (ya corriste lo de arriba), corre SOLO desde esta línea
-- hasta el final del archivo (incluye el bloque PLAN_IMAGENES). Es seguro correrlo más de una vez.
-- ============================================================

create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null default '',
  -- Id de 11 caracteres del video de YouTube (lo saca el servidor del enlace que se pega en /admin).
  youtube_id text not null check (youtube_id ~ '^[A-Za-z0-9_-]{11}$'),
  orden int not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists videos_orden_idx on videos (orden, created_at);

-- Igual que `fotos`: RLS activado y sin políticas; todo pasa por el servidor con la llave secreta.
alter table videos enable row level security;

-- ============================================================
-- PLAN_IMAGENES — imágenes de «Presupuestos y contacto», cambiables desde /admin
--
-- Si ya corriste lo anterior, corre solo este bloque. Es seguro correrlo más de una vez. (Las imágenes se guardan en el bucket "fotos", carpeta planes/.)
-- ============================================================

create table if not exists plan_imagenes (
  -- Servicio al que pertenece la imagen (matrimonios, colegios, cuadros, sesiones, empresas, bautizos, otros).
  clave text primary key,
  path text not null,
  ancho int not null check (ancho > 0),
  alto int not null check (alto > 0),
  updated_at timestamptz not null default now()
);

alter table plan_imagenes enable row level security;

-- ── Verificación (opcional) ─────────────────────────────────
-- Después de correr todo, estas consultas deberían devolver:
--   una fila con public = true, y un conteo de 0 fotos, 0 videos y 0 imágenes de presupuestos.
-- select id, public from storage.buckets where id = 'fotos';
-- select count(*) from fotos;
-- select count(*) from videos;
-- select count(*) from plan_imagenes;
