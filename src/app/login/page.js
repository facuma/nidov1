'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    let result
    if (isRegistering) {
      result = await supabase.auth.signUp({ email, password })
    } else {
      result = await supabase.auth.signInWithPassword({ email, password })
    }

    if (result.error) {
      setError(result.error.message)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">{isRegistering ? 'Registrarse' : 'Iniciar sesión'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" className="w-full p-2 rounded bg-gray-800" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" className="w-full p-2 rounded bg-gray-800" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="w-full bg-white text-black py-2 rounded hover:bg-gray-200" type="submit">
          {isRegistering ? 'Crear cuenta' : 'Ingresar'}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-400">
        {isRegistering ? '¿Ya tenés cuenta?' : '¿No tenés cuenta?'}{' '}
        <button className="underline" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Iniciar sesión' : 'Registrarse'}
        </button>
      </p>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  )
}
