import { NextResponse } from 'next/server'
import { createPreference } from '@/server/createPreference'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request) {
  try {
    // 🔐 Token de autorización del usuario
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Token no enviado' }, { status: 401 })
    }

    const {
      data: { user },
      error
    } = await supabase.auth.getUser(token)

    if (error || !user) {
      console.error('No se pudo autenticar al usuario con el token recibido')
      return NextResponse.json({ error: 'Usuario no autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const { title, price, space_id, date, start_time, end_time } = body

    // 🧾 Crear reserva con estado 'pending' usando supabaseAdmin
    const { data: reserva, error: insertError } = await supabaseAdmin
      .from('bookings')
      .insert([{
        user_id: user.id,
        space_id,
        date,
        start_time,
        end_time,
        total_price: price,
        status: 'pending'
      }])
      .select()
      .single()

    if (insertError) {
      console.error('❌ Error creando reserva preliminar:', insertError.message)
      return NextResponse.json({ error: 'No se pudo crear la reserva' }, { status: 500 })
    }

    // 🧠 metadata enriquecido con booking_id
    const metadata = {
      booking_id: reserva.id,
      user_id: user.id,
      space_id,
      date,
      start_time,
      end_time
    }

    // 🧾 Crear preferencia de pago
    const url = await createPreference({
      title,
      unit_price: price,
      metadata
    })

    console.log('📦 metadata enviado:', metadata)

    return NextResponse.json({ url })
  } catch (error) {
    console.error('❌ Error en checkout:', error?.message || error)
    return NextResponse.json({ error: 'No se pudo completar el checkout' }, { status: 500 })
  }
}
