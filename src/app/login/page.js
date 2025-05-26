'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from '@/components/ui/use-toast'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState('auth')
  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setError('')
  }

  const handleAuthSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (isRegistering) {
      const { error: signUpError } = await supabase.auth.signUp({ email, password })
      if (signUpError) {
        setError(signUpError.message)
      } else {
        setStep('confirm_email')
      }
    } else {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) {
        setError(signInError.message)
      } else {
        const { data: profile } = await supabase
          .from('users')
          .select('first_name, last_name, pid')
          .eq('id', data.user.id)
          .single()
        const needsCompletion = !profile.first_name || !profile.last_name || !profile.pid
        router.push(needsCompletion ? '/completar-perfil' : '/')
      }
    }

    setLoading(false)
  }

  const handleReset = async () => {
    if (!email) {
      toast('Por favor ingresa tu email antes')
      return
    }
    setLoading(true)
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email)
    if (resetError) toast(resetError.message)
    else toast('Revisa tu correo para restablecer tu contraseña')
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto my-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {step === 'confirm_email' && 'Confirmá tu email'}
            {step === 'auth' && (isRegistering ? 'Registrarse' : 'Iniciar sesión')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 'confirm_email' ? (
            <div className="space-y-4">
              <p>
                Te enviamos un correo a <strong>{email}</strong>. Sigue el enlace para activar tu cuenta.
              </p>
              <Button variant="link" onClick={() => { setStep('auth'); resetForm() }}>
                Volver al login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleAuthSubmit} className="space-y-6 ">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Tu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="flex justify-between items-center mt-2">
                  <button
                    type="button"
                    className="text-sm text-black underline"
                    onClick={handleReset}
                    disabled={loading}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                  {!isRegistering && (
                    <p className="text-sm text-gray-500">
                      ¿No tienes cuenta?{' '}
                      <button
                        type="button"
                        className="text-black text-bold underline"
                        onClick={() => setIsRegistering(true)}
                      >
                        Regístrate
                      </button>
                    </p>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-black mx-auto text-white rounded-full hover:bg-gray-800 transition"
              >
                {loading ? 'Procesando...' : (isRegistering ? 'Crear cuenta' : 'Ingresar')}
              </Button>
              {error && <p className="text-red-500 text-center mt-2">{error}</p>}
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
