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

-- ── Verificación (opcional) ─────────────────────────────────
-- Después de correr todo, estas dos consultas deberían devolver:
--   una fila con public = true, y un conteo de 0 fotos.
-- select id, public from storage.buckets where id = 'fotos';
-- select count(*) from fotos;
