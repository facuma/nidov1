import { NextResponse } from 'next/server'
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareSupabaseClient({ req, res })

  // rutas que deben ser accesibles solo por anfitriones
  const PROTECTED = ['/host', '/mis-espacios']
  const path = req.nextUrl.pathname

  if (PROTECTED.some(route => path.startsWith(route))) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      // no está logueado → login
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // comprobamos is_owner en tabla users
    const { data: profile, error } = await supabase
      .from('users')
      .select('is_owner')
      .eq('id', session.user.id)
      .single()

    if (error || !profile?.is_owner) {
      // no es anfitrión → a formulario de registro
      return NextResponse.redirect(new URL('/host/register', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/host/:path*', '/mis-espacios/:path*'],
}
