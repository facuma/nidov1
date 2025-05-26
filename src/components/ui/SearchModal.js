// components/ui/SearchModal.js
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { X } from 'lucide-react'

export default function SearchModal({ open, setOpen, isMobile }) {
  const [lugar, setLugar] = useState('')
  const [fecha, setFecha] = useState('')
  const [viajeros, setViajeros] = useState('')
  const router = useRouter()

  const handleBuscar = () => {
    const params = new URLSearchParams()
    if (lugar) params.set('lugar', lugar)
    if (fecha) params.set('fecha', fecha)
    if (viajeros) params.set('viajeros', viajeros)
    router.push(`/?${params.toString()}`)
    setOpen(false)
  }

  if (!isMobile) return null

  return (
    <div className="fixed inset-0 z-50 bg-white px-4 py-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Buscar espacios</h2>
        <button onClick={() => setOpen(false)} className="text-gray-500">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Lugar</label>
          <input
            type="text"
            placeholder="Explorar destinos"
            value={lugar}
            onChange={(e) => setLugar(e.target.value)}
            className="w-full border rounded-full px-4 py-3 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Check-in</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full border rounded-full px-4 py-3 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Viajeros</label>
          <input
            type="number"
            value={viajeros}
            onChange={(e) => setViajeros(e.target.value)}
            className="w-full border rounded-full px-4 py-3 text-sm"
            placeholder="¿Cuántos?"
          />
        </div>

        <button
          onClick={handleBuscar}
          className="w-full bg-[#ff385c] text-white font-semibold py-3 px-6 rounded-full text-sm"
        >
          Buscar
        </button>
      </div>
    </div>
  )
}