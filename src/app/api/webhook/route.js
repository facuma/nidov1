import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { MercadoPagoConfig, Payment } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
})
const payment = new Payment(client)

export async function POST(req) {
  const body = await req.json()

  try {
    console.log('📥 Webhook recibido:', JSON.stringify(body, null, 2))

    if (body.type === 'payment' && body.data?.id) {
      const result = await payment.get({ id: body.data.id })
      const info = result
      const meta = info.metadata

      try {
        await supabaseAdmin.from('webhook_logs').insert([{
          type: body.type,
          raw_payload: info,
          metadata: meta
        }])
      } catch (logError) {
        console.warn('⚠️ No se pudo guardar en webhook_logs:', logError.message)
      }

      if (info.status !== 'approved') {
        console.warn('❌ Pago no aprobado:', info.status)
        return NextResponse.json({ status: 'not-approved' })
      }

      if (!meta?.booking_id) {
        console.error('❌ Falta el booking_id en metadata:', meta)
        return NextResponse.json({ status: 'invalid-metadata' }, { status: 400 })
      }

      // 🧾 Buscar la reserva pendiente
      const { data: booking, error: bookingLookupError } = await supabaseAdmin
        .from('bookings')
        .select('*')
        .eq('id', meta.booking_id)
        .eq('status', 'pending')
        .single()

      if (bookingLookupError || !booking) {
        console.error('❌ No se encontró la reserva pendiente con ID:', meta.booking_id)
        return NextResponse.json({ status: 'booking-not-found' }, { status: 404 })
      }

      // 🧾 Guardar el pago
      const { error: paymentError } = await supabaseAdmin.from('payments').insert([{
        payment_id: info.id,
        user_id: booking.user_id,
        space_id: booking.space_id,
        amount: info.transaction_amount,
        status: info.status
      }])

      if (paymentError) {
        console.error('❌ Error guardando pago:', paymentError.message)
        return NextResponse.json({ status: 'payment-insert-failed' }, { status: 500 })
      }

      // ✅ Actualizar la reserva a confirmada
      const { error: updateError } = await supabaseAdmin.from('bookings')
        .update({
          status: 'confirmed',
          payment_id: info.id,
          total_price: info.transaction_amount
        })
        .eq('id', meta.booking_id)

      if (updateError) {
        console.error('❌ Error actualizando reserva:', updateError.message)
        await supabaseAdmin.from('webhook_logs').insert([{
          type: 'booking-update-error',
          raw_payload: info,
          metadata: meta
        }])
        return NextResponse.json({ status: 'db-error', error: updateError.message }, { status: 500 })
      }

      console.log('✅ Reserva confirmada correctamente')
      return NextResponse.json({ status: 'success' })
    }

    return NextResponse.json({ status: 'ignored' })
  } catch (err) {
    console.error('❌ Error general en webhook:', err.message)

    try {
      await supabaseAdmin.from('webhook_logs').insert([{
        type: 'exception',
        raw_payload: body,
        metadata: null
      }])
    } catch (logError) {
      console.warn('⚠️ No se pudo guardar excepción en logs:', logError.message)
    }

    return NextResponse.json({ status: 'error', error: err.message }, { status: 500 })
  }
}
