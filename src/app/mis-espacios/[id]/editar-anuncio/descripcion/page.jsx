'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useEditarAnuncio } from '@/context/EditarAnuncioContext'

export default function DescripcionPage() {
  const { id } = useParams()
  const router = useRouter()
  const [descripcion, setDescripcion] = useState('')
  const [error, setError] = useState('')
  const { triggerRefresh } = useEditarAnuncio()

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('spaces').select('description').eq('id', id).single()
      if (data?.description) setDescripcion(data.description)
    }
    fetch()
  }, [id])

  const handleSave = async () => {
    if (descripcion.length < 50) {
      setError('La descripción debe tener al menos 50 caracteres.')
      return
    }

    const { error } = await supabase
      .from('spaces')
      .update({ description: descripcion })
      .eq('id', id)
    triggerRefresh()
    if (!error) router.refresh()
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">📝 Descripción</h1>
      <p className="text-sm text-gray-600">Contá lo que hace especial a tu espacio, lo que incluye y por qué es ideal.</p>
      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        rows={6}
        className="w-full border rounded-lg p-2 text-sm"
      />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        onClick={handleSave}
        className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800"
      >
        Guardar
      </button>
    </div>
  )
}
