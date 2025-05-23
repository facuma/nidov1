
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function VerificacionRequerida() {
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()
  }, [])

  const resendVerification = async () => {
    if (!user) return

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email
    })

    if (error) {
      setMessage('Error al reenviar el correo.')
    } else {
      setMessage('Correo de verificación reenviado. Revisá tu bandeja.')
    }
  }

  return (
    <div className="p-6 text-white max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Verificación requerida</h1>
      <p className="mb-4">Necesitás verificar tu email antes de poder publicar un espacio.</p>
      <p className="text-sm text-gray-400 mb-4">Revisá tu bandeja de entrada o spam.</p>
      <button
        onClick={resendVerification}
        className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
      >
        Reenviar correo de verificación
      </button>
      {message && <p className="text-green-400 mt-4">{message}</p>}
    </div>
  )
}
