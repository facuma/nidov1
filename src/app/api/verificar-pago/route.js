// src/app/api/verificar-pago/route.js
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { MercadoPagoConfig, Payment } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
})
const payment = new Payment(client)

export async function POST(req) {
  try {
    const { payment_id } = await req.json()
    if (!payment_id) {
      return NextResponse.json({ error: 'payment_id requerido' }, { status: 400 })
    }

    // 🔍 Obtener detalles del pago
    const info = await payment.get({ id: payment_id })
    const meta = info.metadata

    if (info.status !== 'approved') {
      return NextResponse.json({ status: 'no-aprobado' })
    }

    if (!meta?.booking_id) {
      return NextResponse.json({ error: 'metadata incompleta' }, { status: 400 })
    }

    // 🔎 Buscar reserva pendiente
    const { data: booking, error: lookupError } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', meta.booking_id)
      .eq('status', 'pending')
      .single()

    if (lookupError || !booking) {
      return NextResponse.json({ status: 'reserva-no-encontrada' }, { status: 404 })
    }

    // 💰 Registrar pago
    const { error: paymentError } = await supabaseAdmin.from('payments').insert([{
      payment_id: info.id,
      user_id: booking.user_id,
      space_id: booking.space_id,
      amount: info.transaction_amount,
      status: info.status
    }])

    if (paymentError) {
      return NextResponse.json({ status: 'error-guardando-pago', error: paymentError.message }, { status: 500 })
    }

    // ✅ Confirmar reserva
    const { error: updateError } = await supabaseAdmin.from('bookings')
      .update({
        status: 'confirmed',
        payment_id: info.id,
        total_price: info.transaction_amount
      })
      .eq('id', meta.booking_id)

    if (updateError) {
      return NextResponse.json({ status: 'error-confirmando-reserva', error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ status: 'reserva-confirmada' })
  } catch (err) {
    return NextResponse.json({ status: 'error-general', error: err.message }, { status: 500 })
  }
}
