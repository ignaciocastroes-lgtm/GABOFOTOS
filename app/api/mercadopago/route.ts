import { NextResponse } from 'next/server'
import { APORTES } from '@/lib/apoyo'
import { CLUB } from '@/lib/club'

export const runtime = 'nodejs'

type ItemPedido = { id: string; cantidad: number }

/**
 * Crea una preferencia de Checkout Pro y devuelve la URL de pago.
 *
 * Los precios NUNCA vienen del navegador: llegan solo los ids y las cantidades,
 * y el monto se arma acá contra el catálogo. Si el precio viniera del cliente,
 * cualquiera podría comprar el pack de $10.000 por $1 editando el request.
 */
export async function POST(request: Request) {
  const token = process.env.MP_ACCESS_TOKEN
  if (!token) {
    return NextResponse.json(
      { error: 'Los pagos con tarjeta no están configurados. Usa transferencia.' },
      { status: 503 },
    )
  }

  let body: { items?: ItemPedido[]; donacion?: number; email?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 })
  }

  const items: {
    id: string
    title: string
    quantity: number
    unit_price: number
    currency_id: 'CLP'
  }[] = []

  for (const pedido of body.items ?? []) {
    const aporte = APORTES.find((a) => a.id === pedido.id)
    const cantidad = Math.floor(Number(pedido.cantidad))
    if (!aporte || !Number.isFinite(cantidad) || cantidad < 1 || cantidad > 50) continue
    items.push({
      id: aporte.id,
      title: aporte.nombre,
      quantity: cantidad,
      unit_price: aporte.precio, // CLP no admite decimales
      currency_id: 'CLP',
    })
  }

  // Donación de monto libre
  const donacion = Math.floor(Number(body.donacion ?? 0))
  if (Number.isFinite(donacion) && donacion >= 1000 && donacion <= 2_000_000) {
    items.push({
      id: 'donacion',
      title: 'Aporte al viaje de la Sub 13 a San Juan',
      quantity: 1,
      unit_price: donacion,
      currency_id: 'CLP',
    })
  }

  if (items.length === 0) {
    return NextResponse.json({ error: 'No hay nada que pagar.' }, { status: 400 })
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000')

  const preferencia = {
    items,
    statement_descriptor: 'INTER LO ESPEJO',
    external_reference: `inter-${Date.now()}`,
    payer: body.email ? { email: String(body.email).slice(0, 120) } : undefined,
    back_urls: {
      success: `${baseUrl}/apoyo/gracias?estado=exito`,
      pending: `${baseUrl}/apoyo/gracias?estado=pendiente`,
      failure: `${baseUrl}/apoyo/gracias?estado=error`,
    },
    auto_return: 'approved',
    notification_url: `${baseUrl}/api/mercadopago/webhook`,
    metadata: { club: CLUB.razonSocial, campana: 'mundialito-san-juan' },
  }

  try {
    const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        // Evita cobros duplicados si el usuario hace doble clic
        'X-Idempotency-Key': crypto.randomUUID(),
      },
      body: JSON.stringify(preferencia),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('Mercado Pago rechazó la preferencia:', data)
      return NextResponse.json(
        { error: 'No pudimos iniciar el pago. Intenta con transferencia.' },
        { status: 502 },
      )
    }

    return NextResponse.json({ url: data.init_point, id: data.id })
  } catch (err) {
    console.error('Error al contactar Mercado Pago:', err)
    return NextResponse.json(
      { error: 'No pudimos conectar con Mercado Pago. Intenta con transferencia.' },
      { status: 502 },
    )
  }
}
