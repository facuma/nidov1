'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useEditarAnuncio } from '@/context/EditarAnuncioContext'

export default function PrecioPage() {
  const { id } = useParams()
  const router = useRouter()
  const [precio, setPrecio] = useState('')
  const [error, setError] = useState('')
  const { triggerRefresh } = useEditarAnuncio()

  const comision = 0.03

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('spaces').select('price, final_price').eq('id', id).single()
      if (data?.price) setPrecio(data.price)
    }
    fetch()
  }, [id])

  const precioFinal = precio ? (parseFloat(precio) * (1 + comision)).toFixed(2) : null

  const handleSave = async () => {
    const valor = parseFloat(precio)
    if (isNaN(valor) || valor < 5) {
      setError('Ingresá un precio válido (mínimo $5 USD).')
      return
    }

    const { error } = await supabase
      .from('spaces')
      .update({ price: valor,
        final_price: precioFinal
       })
      .eq('id', id)
       triggerRefresh()
    if (!error) router.refresh()
  }

  

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">💰 Precio por hora</h1>
      <p className="text-sm text-gray-600">Establecé cuánto cuesta una hora de uso de tu espacio.</p>
      <input
        type="number"
        min="5"
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
        className="w-full border rounded-lg p-2 text-sm"
        placeholder="$"
      />
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {precio && (
        <div className="text-sm text-gray-700 space-y-1">
          <p>💸 Comisión al cliente (3%): <strong>${(parseFloat(precio) * comision).toFixed(2)}</strong></p>
          <p>💼 Precio final que verá el cliente: <strong>${precioFinal}</strong></p>
        </div>
      )}

      <button
        onClick={handleSave}
        className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800"
      >
        Guardar
      </button>
    </div>
  )
}
