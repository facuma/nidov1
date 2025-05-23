'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Pencil, ArrowRight } from 'lucide-react'

export default function MisEspacios() {
  const [user, setUser] = useState(null)
  const [spaces, setSpaces] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)

      const { data: spaces, error } = await supabase
        .from('spaces')
        .select('*')
        .eq('owner_id', user.id)

      if (!error) setSpaces(spaces)
      setLoading(false)
    }

    fetchData()
  }, [router])

  if (loading) return <p className="text-gray-500">Cargando...</p>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Mis espacios publicados</h1>

      {spaces.length === 0 ? (
        <p className="text-gray-500">Todavía no publicaste ningún espacio.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space) => (
            <div
              key={space.id}
              className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow hover:shadow-md transition"
            >
              <img src={space.image} alt={space.title} className="w-full h-40 object-cover" />

              <div className="p-4 space-y-2">
                <h2 className="text-lg font-semibold text-gray-900">{space.title}</h2>
                <p className="text-sm text-gray-500">{space.location}</p>
                <p className="text-sm text-gray-700 font-medium">${space.price} / día</p>

                <div className="flex justify-between items-center mt-4">
                  <Link
                    href={`/mis-espacios/${space.id}`}
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Ver panel <ArrowRight size={16} />
                  </Link>
                  <Link
                    href={`/host/edit/${space.id}`}
                    className="text-sm text-gray-600 hover:text-black flex items-center gap-1"
                  >
                    <Pencil size={16} /> Editar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
