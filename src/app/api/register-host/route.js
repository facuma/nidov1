// src/app/api/register-host/route.js
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request) {
  // 1) extraer token de la cabecera
  const token = request.headers
    .get('authorization')
    ?.replace('Bearer ', '')
  if (!token) {
    return NextResponse.json(
      { error: 'Token no enviado' },
      { status: 401 }
    )
  }

  // 2) validar token y obtener user
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser(token)

  if (authError || !user) {
    console.error('No se pudo autenticar al usuario con el token recibido')
    return NextResponse.json(
      { error: 'Usuario no autenticado' },
      { status: 401 }
    )
  }

  // 3) actualizar is_owner usando el cliente admin
  const { error: updateError } = await supabaseAdmin
    .from('users')
    .update({ is_owner: true })
    .eq('id', user.id)

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message },
      { status: 500 }
    )
  }

  return NextResponse.json(
    { message: 'Ahora eres anfitrión' },
    { status: 200 }
  )
}