'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { User2, LogOut, LogIn, PlusCircle } from 'lucide-react'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const router = useRouter()

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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/login')
  }

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-semibold tracking-tight hover:opacity-80 transition">
          CoworkX
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/mis-espacios" className="text-sm hover:underline">Mis espacios</Link>
              <Link href="/mis-reservas" className="text-sm hover:underline">Mis reservas</Link>
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
        </div>
      </div>
    </header>
  )
}
