import { createClient } from '@supabase/supabase-js'

/**
 * Cliente de Supabase, service role, solo para código de servidor.
 *
 * A diferencia de Dondestanemo, acá no hace falta distinguir un cliente
 * "anon" (para el navegador, sujeto a RLS) de uno "admin" (para el
 * servidor): el navegador de este sitio nunca habla con Supabase
 * directamente, siempre pasa por nuestras propias rutas /api/*. Por eso un
 * solo cliente, con la llave de service role, y nunca importado desde un
 * componente cliente ('use client') ni expuesto con el prefijo
 * NEXT_PUBLIC_.
 */
export function createServiceClient() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      'Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY. Configúralas en Vercel — ver README, sección "Noticias con base de datos".',
    )
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  })
}
