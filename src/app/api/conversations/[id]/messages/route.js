// src/app/api/conversations/[id]/messages/route.js
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request, { params }) {
  const { id: conversationId } = await params

  // 1) Autenticación
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) {
    return NextResponse.json({ error: 'Token no enviado' }, { status: 401 })
  }
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser(token)
  if (authError || !user) {
    return NextResponse.json({ error: 'Usuario no autenticado' }, { status: 401 })
  }

  // 2) Verificar pertenencia a la conversación
  const { data: conv, error: convError } = await supabaseAdmin
    .from('conversations')
    .select('host_id, guest_id, host:host_id(first_name), guest:guest_id(first_name)')
    .eq('id', conversationId)
    .single()
  if (convError || !conv) {
    return NextResponse.json({ error: 'Conversación no encontrada' }, { status: 404 })
  }
  if (conv.host_id !== user.id && conv.guest_id !== user.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  // 3) Parámetros opcionales de paginación
  const url = new URL(request.url)
  const since = url.searchParams.get('since')

  // 4) Obtener mensajes
  let query = supabaseAdmin
    .from('messages')
    .select('id, sender_id, content, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })  // DESC en la DB
    .limit(50)

  if (since) {
    // Si pasan since, filtramos solo los mensajes más recientes que esa fecha
    query = query.gt('created_at', since)
  }

  const { data: messages, error: msgError } = await query
  if (msgError) {
    return NextResponse.json({ error: msgError.message }, { status: 500 })
  }

  // Devolver en orden antiguo → nuevo
  return NextResponse.json({ messages: messages.reverse() })
}

export async function POST(request, { params }) {
  const { id: conversationId } = await params

  // 1) Autenticación
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) {
    return NextResponse.json({ error: 'Token no enviado' }, { status: 401 })
  }
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser(token)
  if (authError || !user) {
    return NextResponse.json({ error: 'Usuario no autenticado' }, { status: 401 })
  }

  // 2) Verificar pertenencia a la conversación
  const { data: conv, error: convError } = await supabaseAdmin
    .from('conversations')
    .select('host_id, guest_id')
    .eq('id', conversationId)
    .single()
  if (convError || !conv) {
    return NextResponse.json({ error: 'Conversación no encontrada' }, { status: 404 })
  }
  if (conv.host_id !== user.id && conv.guest_id !== user.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  // 3) Insertar nuevo mensaje
  const { content } = await request.json()
  if (!content) {
    return NextResponse.json({ error: 'El contenido es requerido' }, { status: 400 })
  }

  const { data: message, error: insertError } = await supabaseAdmin
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content
    })
    .select()
    .single()

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ message }, { status: 201 })
}
