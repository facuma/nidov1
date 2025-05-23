'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function CompletarPerfil() {
  const router = useRouter()
  const [userId, setUserId] = useState(null)
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    pid: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      setUserId(user.id)

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        setForm({
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          bio: profile.bio || '',
          pid: profile.pid || ''
        })
      }

      setLoading(false)
    }

    fetchUser()
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { error } = await supabase
      .from('users')
      .update(form)
      .eq('id', userId)

    if (error) {
      alert('Error al guardar perfil')
    } else {
      router.push('/')
    }
  }

  if (loading) return <p className="text-white p-6">Cargando...</p>

  return (
    <div className="max-w-md mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Completá tu perfil</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="first_name" value={form.first_name} placeholder="Nombre" onChange={handleChange} className="w-full p-2 rounded bg-gray-800" required />
        <input name="last_name" value={form.last_name} placeholder="Apellido" onChange={handleChange} className="w-full p-2 rounded bg-gray-800" required />
        <textarea name="bio" value={form.bio} placeholder="Bio" onChange={handleChange} className="w-full p-2 rounded bg-gray-800" />
        <input name="pid" value={form.pid} placeholder="DNI o Pasaporte" onChange={handleChange} className="w-full p-2 rounded bg-gray-800" required />
        <button className="w-full bg-white text-black py-2 rounded hover:bg-gray-200" type="submit">
          Guardar
        </button>
      </form>
    </div>
  )
}
