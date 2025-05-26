'use client'


import EspacioCard from '@/components/cards/EspacioCard'
import SkeletonCard from '@/components/cards/SkeletonCard'

import { useUserSession } from '@/lib/hooks/useUserSession'
import { useFetchFavoritos } from '@/lib/hooks/useFetchFavoritos'
import { useFadeSkeleton } from '@/lib/hooks/useFadeSkeleton'

export default function FavoritosPage() {
  
const user = useUserSession(true)
const { favoritos, loading } = useFetchFavoritos(user?.id)
const showSkeletons = useFadeSkeleton(loading)

  

  

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Tus espacios favoritos</h1>

      {loading || showSkeletons ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} visible={showSkeletons} />
          ))}
        </div>
      ) : favoritos.length === 0 ? (
        <p className="text-gray-500">Todavía no agregaste ningún espacio a favoritos.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favoritos.map(space => (
            <EspacioCard
              key={space.id}
              space={space}
              
            />
          ))}
        </div>
      )}
    </div>
  )
}
