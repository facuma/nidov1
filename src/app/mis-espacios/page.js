'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Pencil, ArrowRight } from 'lucide-react'
import SkeletonCard from '@/components/cards/SkeletonCard'

export default function MisEspacios() {
  const [user, setUser] = useState(null)
  const [spaces, setSpaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [skeletonsVisible, setSkeletonsVisible] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        router.push('/login')
        return
      }
      setUser(user)

      const { data: fetchedSpaces, error } = await supabase
        .from('spaces')
        .select('*, images(url)')
        .eq('owner_id', user.id)

      if (!error) setSpaces(fetchedSpaces)

      setLoading(false)
      setTimeout(() => setSkeletonsVisible(false), 300)
    }
    fetchData()
  }, [router])

  // Render grid cards: add first, then existing spaces
  const renderGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Card para agregar nuevo espacio */}
      

      {/* Cards existentes */}
      {spaces.map((space) => (
        <div
          key={space.id}
          className="border border-gray-200 rounded-xl bg-white overflow-hidden hover:shadow-md transition"
        >
          <img
            src={space.images?.[0]?.url || '/placeholder.jpg'}
            alt={space.title}
            loading="lazy"
            decoding="async"
            className="w-full h-40 object-cover"
          />
          <div className="p-4 space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">{space.title}</h2>
            <p className="text-sm text-gray-500">{space.address}</p>
            <p className="text-sm text-gray-700 font-medium">${space.price} / día</p>
            <div className="flex justify-between items-center mt-4">
              <Link
                href={`/mis-espacios/${space.id}`}
                className="text-sm text-gray-600 hover:text-amber-300 flex items-center gap-1"
              >
                Ver panel <ArrowRight size={16} />
              </Link>
              <Link
                href={`/mis-espacios/${space.id}/editar-anuncio/fotos`}
                className="text-sm text-gray-600 hover:text-black flex items-center gap-1"
              >
                <Pencil size={16} /> Editar
              </Link>
            </div>
          </div>
        </div>
      ))}
      <Link
        href="/host/new"
        className="border border-gray-200 rounded-xl bg-white flex flex-col items-center justify-center p-6 hover:shadow-md transition"
      >
        <Plus size={40} className="text-gray-400" />
        <span className="mt-4 text-lg font-medium text-gray-700">Agregar espacio</span>
      </Link>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20 pt-5">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Mis espacios publicados</h1>

      {loading || skeletonsVisible ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} visible={skeletonsVisible} />
          ))}
        </div>
      ) : (
        spaces.length === 0 ? (
          <p className="text-gray-500">Todavía no publicaste ningún espacio.</p>
        ) : (
          renderGrid()
        )
      )}
    </div>
  )
}