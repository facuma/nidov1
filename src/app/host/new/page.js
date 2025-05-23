'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function NewSpace() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      // Redirige si el email no está confirmado
      if (!user.email_confirmed_at) {
        router.push('/verificacion-requerida')
        return
      }

      setUser(user)
      setLoading(false)
    }

    checkAccess()
  }, [router])

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    image: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { error } = await supabase.from('spaces').insert([
      { ...form, owner_id: user.id }
    ])

    if (error) {
      alert('Error al guardar')
    } else {
      router.push('/')
    }
  }

  if (loading) return <p className="text-white p-6">Cargando...</p>

  return (
    <div className="max-w-xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Publicar nuevo espacio</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Título" onChange={handleChange} className="w-full p-2 rounded bg-gray-800" required />
        <textarea name="description" placeholder="Descripción" onChange={handleChange} className="w-full p-2 rounded bg-gray-800" required />
        <input name="location" placeholder="Ubicación" onChange={handleChange} className="w-full p-2 rounded bg-gray-800" required />
        <input name="price" type="number" placeholder="Precio por día" onChange={handleChange} className="w-full p-2 rounded bg-gray-800" required />
        <input name="image" placeholder="URL de imagen" onChange={handleChange} className="w-full p-2 rounded bg-gray-800" required />
        <button type="submit" className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200">Publicar</button>
      </form>
    </div>
  )
}
