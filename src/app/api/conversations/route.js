// 1) API Route: src/app/api/conversations/route.js
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request) {
  // Auth: token en header
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Token no enviado' }, { status: 401 })

  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) return NextResponse.json({ error: 'Usuario no autenticado' }, { status: 401 })

  // Obtiene conversaciones donde eres host o guest
  const { data: conversations, error } = await supabaseAdmin
    .from('conversations')
    .select('id, space_id, host_id, guest_id, host:host_id(first_name), guest:guest_id(first_name), created_at')
    .or(`host_id.eq.${user.id},guest_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ conversations })
}

// Puedes agregar POST aquí para crear una nueva conversación si lo necesitas

