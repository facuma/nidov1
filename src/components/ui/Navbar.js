'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { User2, LogOut, LogIn, PlusCircle, Menu, X } from 'lucide-react'
import Image from 'next/image'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  

  useEffect(() => {
    const getSession = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      listener?.subscription?.unsubscribe()
    }
  }, [])
  // Ocultar navbar en páginas específicas
  const ocultarEn = ['/resumen-reserva', '/pago']
  if (ocultarEn.includes(pathname)) return null

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/login')
  }

  const NavLinks = () => (
    <>
      {user ? (
        <>
          <Link href="/mis-espacios" className="text-sm hover:underline">Mis espacios</Link>
          <Link href="/mis-reservas" className="text-sm hover:underline">Mis reservas</Link>
          <Link href="/favoritos" className="text-sm hover:underline">Favoritos</Link>
          <Link href="/host/new" className="flex items-center gap-2 text-sm bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition">
            <PlusCircle size={16} /> Publicar
          </Link>
          <Link href="/completar-perfil" className="rounded-full border border-gray-300 p-2 hover:bg-gray-100 transition">
            <User2 className="w-5 h-5" />
          </Link>
          <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-red-500 transition">
            <LogOut className="w-5 h-5" />
          </button>
        </>
      ) : (
        <Link href="/login" className="flex items-center gap-2 text-sm bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition">
          <LogIn size={16} /> Iniciar sesión
        </Link>
      )}
    </>
  )

  return (
    <header className="hidden md:block border-b border-gray-200 nav sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-[48px] logo-1 italic font-[900] tracking-tight font-display lowercase text-black">
          <Image
           src="/unworksm.png"         // o "/logo.png", según tu archivo
    alt="UNWORK logo"
    width={120}
    height={40}
    priority/>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4">
          <NavLinks />
        </nav>

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-md hover:bg-gray-100 transition">
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
