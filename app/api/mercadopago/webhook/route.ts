import { NextResponse } from 'next/server'
import crypto from 'node:crypto'

export const runtime = 'nodejs'

/**
 * Mercado Pago avisa acá cuando cambia el estado de un pago.
 *
 * Sin esto, el club no se entera de las compras: la pantalla de "gracias"
 * la ve el comprador, pero si cierra la pestaña antes, nadie registra nada.
 *
 * Hoy solo deja el pago en los logs de Vercel. Cuando conectemos Supabase,
 * acá se inserta la fila y se dispara el correo al club.
 */
export async function POST(request: Request) {
  const secret = process.env.MP_WEBHOOK_SECRET

  // Validación de firma (x-signature). Si no hay secreto configurado,
  // se acepta igual pero se registra la advertencia.
  if (secret) {
    const signature = request.headers.get('x-signature') ?? ''
    const requestId = request.headers.get('x-request-id') ?? ''
    const url = new URL(request.url)
    const dataId = url.searchParams.get('data.id') ?? ''

    const parts = Object.fromEntries(
      signature.split(',').map((p) => p.split('=').map((s) => s.trim()) as [string, string]),
    )
    const manifest = `id:${dataId};request-id:${requestId};ts:${parts.ts};`
    const esperado = crypto.createHmac('sha256', secret).update(manifest).digest('hex')

    const ok =
      parts.v1 !== undefined &&
      parts.v1.length === esperado.length &&
      crypto.timingSafeEqual(Buffer.from(parts.v1), Buffer.from(esperado))

    if (!ok) {
      console.warn('Webhook con firma inválida, descartado.')
      return new NextResponse(null, { status: 401 })
    }
  } else {
    console.warn('MP_WEBHOOK_SECRET no configurado: el webhook no valida firma.')
  }

  try {
    const evento = await request.json()

    if (evento?.type === 'payment' && evento?.data?.id) {
      const token = process.env.MP_ACCESS_TOKEN
      const res = await fetch(`https://api.mercadopago.com/v1/payments/${evento.data.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const pago = await res.json()

      console.log('[APORTE]', {
        id: pago.id,
        estado: pago.status,
        monto: pago.transaction_amount,
        email: pago.payer?.email,
        referencia: pago.external_reference,
      })

      // TODO: guardar en Supabase y enviar correo a internacionalloespejo@gmail.com
    }
  } catch (err) {
    console.error('Webhook ilegible:', err)
  }

  // Siempre 200: si respondes error, Mercado Pago reintenta y satura los logs.
  return new NextResponse(null, { status: 200 })
}
