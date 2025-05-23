'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [spaces, setSpaces] = useState([])

  useEffect(() => {
    const fetchSpaces = async () => {
      const { data, error } = await supabase.from('spaces').select('*').order('created_at', { ascending: false })
      if (data) setSpaces(data)
    }
    fetchSpaces()
  }, [])

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Espacios disponibles</h1>
      

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {spaces.map((space) => (
          <Link key={space.id} href={`/space/${space.id}`}>
            <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer">
              <img src={space.image} alt={space.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{space.title}</h2>
                <p className="text-gray-600">{space.description}</p>
                <p className="mt-2 text-sm text-gray-500">{space.location}</p>
                <p className="mt-2 font-bold">${space.price} / día</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
