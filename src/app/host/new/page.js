'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function CrearNuevoEspacio() {
  const router = useRouter()

  useEffect(() => {
    const iniciar = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')

      const { data, error } = await supabase
        .from('spaces')
        .insert([{ owner_id: user.id, status: 'draft' }])
        .select()
        .single()

      if (!error && data) {
        router.push(`/mis-espacios/${data.id}/editar-anuncio/fotos`)
      } else {
        alert(`Error al crear el espacio:${error.message}`)
      }
    }

    iniciar()
  }, [router])

  return <p className="p-6 text-gray-500 text-center">Creando espacio...</p>
}
