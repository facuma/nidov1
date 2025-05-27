'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'
import {
  User2,
  LogOut,
  LogIn,
  PlusCircle,
  Menu,
  X,
  MessageCircle
} from 'lucide-react'
import Image from 'next/image'

export default function Navbar() {
  const { user, loading, hostMode, setHostMode } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Rutas donde ocultar por completo el navbar
  const ocultarEn = ['/resumen-reserva', '/pago']
  if (ocultarEn.includes(pathname)) return null

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Skeleton mientras carga sesión
  if (loading) {
    return (
      <header className="hidden md:block border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="w-32 h-6 bg-gray-200 rounded animate-pulse" />

          {/* Desktop nav skeleton */}
          <div className="hidden md:flex items-center gap-4">
            <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
          </div>

          {/* Mobile hamburger skeleton */}
          <div className="md:hidden">
            <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </header>
    )
  }

  const NavLinks = () => {
    if (!user) {
      return (
        <Link
          href="/login"
          className="flex items-center gap-2 text-sm bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition"
        >
          <LogIn size={16} /> Iniciar sesión
        </Link>
      )
    }

    return (
      <>
        {/* Si es owner, toggle de modo */}
        {user.is_owner && (
          <button
            onClick={() => setHostMode(!hostMode)}
            className="text-sm px-3 py-1 border rounded-full"
          >
            {hostMode ? 'Ver como huésped' : 'Ver como anfitrión'}
          </button>
        )}

        {user.is_owner && hostMode && (
          <>
            <Link href="/mis-espacios" className="text-sm hover:underline">
              Mis espacios
            </Link>
            <Link
              href="/host/new"
              className="flex items-center gap-2 text-sm bg-black text-white px-4 py-2 rounded-full"
            >
              <PlusCircle size={16} /> Publicar
            </Link>
          </>
        )}

        {/* Siempre enlaces de usuario ya autenticado */}
        {(!user.is_owner || !hostMode) && (
          <>
            <Link href="/mis-reservas" className="text-sm hover:underline">
              Mis reservas
            </Link>
            <Link href="/favoritos" className="text-sm hover:underline">
              Favoritos
            </Link>
          </>
        )}

        {/* Icono de mensajes */}
        <Link
          href="/conversations"
          className="p-2 rounded-full hover:bg-gray-100 transition"
          title="Mensajes"
        >
          <MessageCircle className="w-6 h-6 text-gray-600 hover:text-gray-800" />
        </Link>

        {/* Perfil y logout */}
        <Link
          href="/completar-perfil"
          className="rounded-full border border-gray-300 p-2 hover:bg-gray-100 transition"
          title="Perfil"
        >
          <User2 className="w-5 h-5" />
        </Link>
        <button
          onClick={handleLogout}
          className="p-2 rounded-full hover:bg-gray-100 transition"
          title="Cerrar sesión"
        >
          <LogOut className="w-5 h-5 text-gray-600 hover:text-red-500" />
        </button>
      </>
    )
  }

  return (
    <header className="hidden md:block border-b border-gray-200 nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-[48px] logo-1 italic font-[900] tracking-tight font-display lowercase text-black"
        >
          <Image
            src="/unworksm.png"
            alt="UNWORK logo"
            width={120}
            height={40}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4">
          <NavLinks />
        </nav>

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t px-6 pb-4 space-y-3 bg-white">
          <NavLinks />
        </div>
      )}
    </header>
  )
}
