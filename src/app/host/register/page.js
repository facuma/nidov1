'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

export default function RegisterHostPage() {
  const router = useRouter()
  const { user, session, loading } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (loading) return <p>Cargando...</p>
  
  if (!user) {
    router.push('/login')
    return null
  }

  const handleRegister = async () => {
  setSubmitting(true)
  setError('')

  try {
    const res = await fetch('/api/register-host', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
    })

    // → 1) Estado y tipo de respuesta
    console.log('register-host status:', res.status)
    console.log('content-type:', res.headers.get('content-type'))

    // → 2) Texto crudo de la respuesta
    const text = await res.text()
    console.log('register-host body:', text)

    // → 3) Intentamos parsear JSON solo si viene JSON
    let data
    try {
      data = JSON.parse(text)
    } catch (parseErr) {
      console.error('Error parseando JSON:', parseErr)
      throw new Error('La respuesta no es JSON válido')
    }

    if (!res.ok) {
      throw new Error(data.error || 'Error desconocido')
    }

    // una vez registrado, recargamos la página para actualizar user.is_owner
    
    router.refresh()
    router.push('/')
    window.location.href = '/'
  } catch (err) {
    setError(err.message)
  } finally {
    setSubmitting(false)
  }
}


  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Hazte anfitrión en Unwork</h1>
      <p className="mb-6">Para poder publicar tus espacios, necesitamos activar tu cuenta como anfitrión.</p>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        disabled={submitting}
        onClick={handleRegister}
        className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
      >
        {submitting ? 'Registrando…' : 'Registrarme como anfitrión'}
      </button>
    </div>
  )
}
