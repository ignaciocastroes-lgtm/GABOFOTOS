import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { esAdminValido } from '@/lib/admin-auth'
import type { Noticia } from '@/lib/noticias'

export const runtime = 'nodejs'

/**
 * Crea una noticia. El proxy ya exige la cookie de sesión para llegar
 * hasta acá, pero se revalida igual — ver el porqué en lib/admin-auth.ts.
 */
export async function POST(request: Request) {
  if (!(await esAdminValido(request))) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  let noticia: Noticia
  try {
    noticia = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido.' }, { status: 400 })
  }

  if (!noticia?.id || !noticia?.tipo || !noticia?.fecha) {
    return NextResponse.json({ error: 'Faltan id, tipo o fecha.' }, { status: 422 })
  }

  try {
    const supabase = createServiceClient()
    const { error } = await supabase.from('noticias').insert({
      id: noticia.id,
      tipo: noticia.tipo,
      fecha: noticia.fecha,
      destacada: noticia.destacada ?? false,
      series: noticia.series ?? [],
      profesores: noticia.profesores ?? [],
      escuelita: noticia.escuelita ?? false,
      data: noticia,
    })

    if (error) {
      // Código 23505 = llave duplicada: el id ya existe.
      if (error.code === '23505') {
        return NextResponse.json(
          { error: `Ya existe una noticia con id "${noticia.id}". Usa otro id o edítala desde "Editar / Eliminar".` },
          { status: 409 },
        )
      }
      console.error('[POST /api/admin/noticias]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (e) {
    console.error('[POST /api/admin/noticias]', e)
    return NextResponse.json({ error: 'No se pudo conectar con la base de datos.' }, { status: 500 })
  }
}
