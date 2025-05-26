'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function BarraBusqueda() {
  const router = useRouter()
  const [lugar, setLugar] = useState('')
  const [fecha, setFecha] = useState('')
  const [horaEntrada, setHoraEntrada] = useState('')
  const [horaSalida, setHoraSalida] = useState('')

  const handleBuscar = () => {
    const params = new URLSearchParams()
    if (lugar) params.set('lugar', lugar)
    if (fecha) params.set('fecha', fecha)
    if (horaEntrada) params.set('entrada', horaEntrada)
    if (horaSalida) params.set('salida', horaSalida)

    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="sticky top-0 z-10 px-4 py-3 bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center gap-2 md:gap-4 border border-gray-200 hover:border-gray-300 rounded-full p-3 shadow-sm hover:shadow-md transition">
        <input
          type="text"
          placeholder="¿Dónde?"
          value={lugar}
          onChange={(e) => setLugar(e.target.value)}
          className="flex-1 outline-none px-4 text-sm rounded-full border border-transparent focus:border-gray-300"
        />

        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="w-full md:w-36 outline-none text-sm px-3 py-1 rounded-full border border-gray-200"
        />

        <input
          type="time"
          value={horaEntrada}
          onChange={(e) => setHoraEntrada(e.target.value)}
          className="w-full md:w-28 outline-none text-sm px-3 py-1 rounded-full border border-gray-200"
        />

        <input
          type="time"
          value={horaSalida}
          onChange={(e) => setHoraSalida(e.target.value)}
          className="w-full md:w-28 outline-none text-sm px-3 py-1 rounded-full border border-gray-200"
        />

        <button
          onClick={handleBuscar}
          className="w-full md:w-auto bg-black text-white px-4 py-2 rounded-full text-sm mt-2 md:mt-0"
        >
          Buscar
        </button>
      </div>
    </div>
  )
}
