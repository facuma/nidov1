'use client'

import { useSearchParams } from 'next/navigation'
import { useFadeSkeleton } from '@/lib/hooks/useFadeSkeleton'
import { useFetchSpaces } from '@/lib/hooks/useFetchSpaces'
import EspacioCard from '@/components/cards/EspacioCard'
import SkeletonCard from '@/components/cards/SkeletonCard'
import SearchBarDesktop from '@/components/ui/SearchBarDesktop'
import SearchBarMobile from '@/components/ui/SearchBarMobile'
import ActivityFilter from '@/components/ui/ActivityFilter'


export default function HomePage() {
  const search = useSearchParams()
  const lugar = search.get('lugar') || ''
  const fecha = search.get('fecha') || ''
  const hora = search.get('hora') || ''
  const activity = search.get('activity') || ''

  const { spaces, loading } = useFetchSpaces({ lugar, fecha, hora, activity })
  const skeletonsVisible = useFadeSkeleton(loading)

  return (
    <div className=" pb-20 min-h-screen ">
      
      {/* Desktop bar */}
      <SearchBarDesktop />

      <SearchBarMobile/>

      <ActivityFilter/>
      


      <div className=" mx-auto py-8">
        <h2 className="text-xl font-semibold mb-4">Explorá espacios cerca tuyo</h2>

        <div className="grid grid-cols-1 mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading || skeletonsVisible
            ? Array.from({ length: 12 }).map((_, i) => (
                <SkeletonCard key={i} visible={skeletonsVisible} />
              ))
            : spaces.map((space) => (
                <EspacioCard key={space.id} space={space} />
              ))}
        </div>
      </div>
    </div>
  )
}
