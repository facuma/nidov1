'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Popup from '@/components/ui/Popup'
import { useEditarAnuncio } from '@/context/EditarAnuncioContext'


export default function TituloPage() {
  const { id } = useParams()
  const router = useRouter()
  const [titulo, setTitulo] = useState('')
  const [error, setError] = useState('')
   const [popupVisible, setPopupVisible] = useState(false)
   const { triggerRefresh } = useEditarAnuncio()

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('spaces').select('title').eq('id', id).single()
      if (data?.title) setTitulo(data.title)
    }
    fetch()
  }, [id])

  const handleSave = async () => {
    if (titulo.length < 20) {
      setError('El título debe tener al menos 20 caracteres.')
      return
    }

    const { error } = await supabase
      .from('spaces')
      .update({ title: titulo })
      .eq('id', id)
    triggerRefresh()
     if (!error) {
      setPopupVisible(true)
      
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">🏷 Título</h1>
      <p className="text-sm text-gray-600">Ingresá un título atractivo para tu espacio. Ej: “Departamento moderno para 5 personas - Corrientes”.</p>
      <textarea
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        rows={2}
        className="w-full border rounded-lg p-2 text-sm"
      />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        onClick={handleSave}
        className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800"
      >
        Guardar
      </button>
       <Popup visible={popupVisible} message="Título guardado correctamente" variant="success" />
    </div>
  )
}
