import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

/**
 * Lista todas las noticias, ordenadas por fecha descendente.
 *
 * Pública a propósito: la usan las páginas del sitio al renderizar, y
 * también el panel de admin para mostrar la lista en "Editar / Eliminar".
 * No hay nada sensible acá — la llave de service role nunca sale de este
 * archivo, el navegador solo recibe el JSON ya armado.
 */
export async function GET() {
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('noticias')
      .select('data')
      .order('fecha', { ascending: false })

    if (error) {
      console.error('[GET /api/noticias]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const noticias = (data ?? []).map((fila) => fila.data)
    return NextResponse.json({ noticias })
  } catch (e) {
    console.error('[GET /api/noticias]', e)
    return NextResponse.json({ error: 'No se pudo conectar con la base de datos.' }, { status: 500 })
  }
}
