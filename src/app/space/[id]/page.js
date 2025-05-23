'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'
import BookingForm from '@/components/BookingForm'



export default function SpaceDetail() {
  const { id } = useParams()
  const router = useRouter()

  const [space, setSpace] = useState(null)
  const [user, setUser] = useState(null)



  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('spaces').select('*').eq('id', id).single()
      setSpace(data)

      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    fetchData()
  }, [id])


  if (!space) return <p className="text-gray-500">Cargando espacio...</p>



  return (
    <div className="grid md:grid-cols-2 gap-10">
      {/* Detalle */}
      <div>
        <img src={space.image} className="w-full h-64 object-cover rounded mb-6" />
        <h1 className="text-3xl font-bold mb-2">{space.title}</h1>
        <p className="text-gray-500">{space.location}</p>
        <p className="mt-4">{space.description}</p>
        <p className="mt-4 text-lg font-semibold">${space.price} / hora</p>
      </div>

      {/* Formulario */}
      <BookingForm space={space} />
    </div>
  )
}
