import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { esAdminValido } from '@/lib/admin-auth'
import type { Noticia } from '@/lib/noticias'

export const runtime = 'nodejs'

/** Reemplaza una noticia completa. El id de la URL manda; si el cuerpo trae otro id, se ignora. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await esAdminValido(request))) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  const { id } = await params

  let noticia: Noticia
  try {
    noticia = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido.' }, { status: 400 })
  }

  const actualizada = { ...noticia, id }

  try {
    const supabase = createServiceClient()
    const { error, count } = await supabase
      .from('noticias')
      .update(
        {
          tipo: actualizada.tipo,
          fecha: actualizada.fecha,
          destacada: actualizada.destacada ?? false,
          series: actualizada.series ?? [],
          profesores: actualizada.profesores ?? [],
          escuelita: actualizada.escuelita ?? false,
          data: actualizada,
        },
        { count: 'exact' },
      )
      .eq('id', id)

    if (error) {
      console.error('[PATCH /api/admin/noticias/[id]]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    if (count === 0) {
      return NextResponse.json({ error: `No existe ninguna noticia con id "${id}".` }, { status: 404 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[PATCH /api/admin/noticias/[id]]', e)
    return NextResponse.json({ error: 'No se pudo conectar con la base de datos.' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await esAdminValido(request))) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  const { id } = await params

  try {
    const supabase = createServiceClient()
    const { error, count } = await supabase.from('noticias').delete({ count: 'exact' }).eq('id', id)

    if (error) {
      console.error('[DELETE /api/admin/noticias/[id]]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    if (count === 0) {
      return NextResponse.json({ error: `No existe ninguna noticia con id "${id}".` }, { status: 404 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[DELETE /api/admin/noticias/[id]]', e)
    return NextResponse.json({ error: 'No se pudo conectar con la base de datos.' }, { status: 500 })
  }
}
