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
  const [step, setStep] = useState('auth') // auth | confirm_email

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (isRegistering) {
      const result = await supabase.auth.signUp({ email, password })

      if (result.error) {
        setError(result.error.message)
        return
      }

      // Mostramos pantalla de "confirmá tu email"
      setStep('confirm_email')
    } else {
      const result = await supabase.auth.signInWithPassword({ email, password })

      if (result.error) {
        setError(result.error.message)
      } else {
        // Buscar su perfil en la tabla `users`
        const { data: userProfile } = await supabase
          .from('users')
          .select('*')
          .eq('id', result.data.user.id)
          .single()

        const profileIncomplete = !userProfile.first_name || !userProfile.last_name || !userProfile.pid

        if (profileIncomplete) {
          router.push('/completar-perfil')
        } else {
          router.push('/')
        }
      }

    }
  }
  

  

  return (
    <div className="max-w-md mx-auto p-6 text-white">
      {step === 'confirm_email' ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Confirmá tu email</h1>
          <p className="text-gray-300">
            Te enviamos un correo a <strong>{email}</strong>.  
            Por favor, hacé clic en el enlace de verificación para activar tu cuenta.
          </p>
          <p className="text-sm text-gray-400 mt-4">
            Una vez confirmado, iniciá sesión para continuar.
          </p>
          <button
            className="mt-6 underline text-sm"
            onClick={() => {
              setIsRegistering(false)
              setStep('auth')
              setEmail('')
              setPassword('')
            }}
          >
            Volver al login
          </button>
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}
