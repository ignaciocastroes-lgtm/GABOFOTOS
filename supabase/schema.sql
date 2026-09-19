-- ============================================================
-- Internacional Lo Espejo — esquema de noticias
--
-- Correr esto una vez en el SQL Editor del proyecto de Supabase
-- del CLUB (no reutilizar el proyecto de Dondestanemo — son
-- aplicaciones distintas, con datos que no deben mezclarse).
-- ============================================================

create table if not exists noticias (
  id text primary key,
  tipo text not null check (tipo in ('partido', 'nota', 'video', 'instagram')),
  fecha date not null,
  destacada boolean not null default false,

  -- Para filtrar rápido sin tener que abrir "data" cada vez.
  series text[] not null default '{}',
  profesores text[] not null default '{}',
  escuelita boolean not null default false,

  -- El objeto Noticia completo (título, cuerpo, fotos, el JSON del
  -- partido, lo que corresponda según el tipo). Es la fuente de verdad
  -- para renderizar — las columnas de arriba son solo para poder filtrar
  -- y ordenar con SQL en vez de traer todo y filtrar en JavaScript.
  data jsonb not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists noticias_fecha_idx on noticias (fecha desc);
create index if not exists noticias_series_idx on noticias using gin (series);
create index if not exists noticias_profesores_idx on noticias using gin (profesores);

-- RLS activado, pero SIN políticas: nadie puede leer ni escribir esta
-- tabla usando la llave anon (que este proyecto ni siquiera usa). Todo el
-- acceso pasa por la llave de service role, que ignora RLS por diseño y
-- solo vive en el servidor (rutas /api/*), nunca en el navegador.
alter table noticias enable row level security;

-- Mantiene updated_at al día en cada UPDATE, sin tener que acordarse de
-- setearlo a mano en cada ruta.
create or replace function noticias_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists noticias_updated_at on noticias;
create trigger noticias_updated_at
  before update on noticias
  for each row
  execute function noticias_set_updated_at();
