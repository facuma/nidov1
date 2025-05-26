'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { X, Search, CalendarDays, Clock } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

// Genera array de horas cada 30 minutos
const generateTimes = () => {
  const times = []
  for (let h = 0; h < 24; h++) {
    for (let m of [0, 30]) {
      const hh = String(h).padStart(2, '0')
      const mm = String(m).padStart(2, '0')
      times.push(`${hh}:${mm}`)
    }
  }
  return times
}

export default function SearchBarMobile() {
  const router = useRouter()
  const params = useSearchParams()

  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('lugar')

  const [lugar, setLugar] = useState('')
  const [fecha, setFecha] = useState('')
  const [calendarDate, setCalendarDate] = useState()
  const [hora, setHora] = useState('')
  const times = generateTimes()

  // Carga inicial desde URL
  useEffect(() => {
    setLugar(params.get('lugar') || '')
    setFecha(params.get('fecha') || '')
    setHora(params.get('hora') || '')
    if (params.get('fecha')) {
      const d = new Date(params.get('fecha'))
      setCalendarDate(d)
    }
  }, [params.toString()])

  const handleSearch = () => {
    const q = new URLSearchParams()
    if (lugar) q.set('lugar', lugar)
    if (fecha) q.set('fecha', fecha)
    if (hora) q.set('hora', hora)
    router.push(`/?${q.toString()}`)
    setOpen(false)
  }

  const clearSearch = () => {
    setLugar('')
    setFecha('')
    setCalendarDate(undefined)
    setHora('')
    router.push('/')
  }

  const handleDaySelect = (day) => {
    if (!day) return
    setCalendarDate(day)
    setFecha(day.toISOString().split('T')[0])
  }

  // Formatea fecha para mostrar
  const formatFecha = () =>
    calendarDate
      ? calendarDate.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
      : ''

  // Renderiza resumen cuando no está abierto y hay filtros
  const hasSearch = lugar || fecha || hora

  return (
    <div className="md:hidden">
      {!open && hasSearch ? (
        <div className='flex'>
        <button onClick={() => { setOpen(true); setActiveTab('lugar') }} className="flex items-center justify-between w-full px-4 py-3  bg-white border border-gray-300 rounded-full">
          <div className="flex space-x-2 overflow-x-auto">
            {lugar && (
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
                {lugar}
              </span>
            )}
            {fecha && (
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
                {formatFecha()}
              </span>
            )}
            {hora && (
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
                {hora}
              </span>
            )}
          </div>
          
        </button>
        <button onClick={clearSearch} className="p-5 rounded-full border border-gray-300 mx-2N">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => { setOpen(true); setActiveTab('lugar') }}
          className="flex items-center justify-between w-full px-4 py-3 bg-white border border-gray-300 rounded-full"
        >
          <span className="text-sm font-medium text-gray-700">Buscar</span>
          <Search className="w-5 h-5 text-gray-500" />
        </button>
      )}

      {open && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Header con cerrar */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <button onClick={() => setOpen(false)}>
              <X className="w-6 h-6 text-gray-600" />
            </button>
            <h2 className="text-lg font-semibold">Buscar</h2>
            <div className="w-6" />
          </div>

          {/* Tabs */}
          <div className="flex justify-around mt-4">
            {['lugar', 'fecha', 'hora'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 text-center py-2 font-medium ${
                  activeTab === tab
                    ? 'text-[#ff385c] border-b-2 border-[#ff385c]'
                    : 'text-gray-500'
                }`}
              >
                {tab === 'lugar' && 'Lugar'}
                {tab === 'fecha' && 'Fecha'}
                {tab === 'hora' && 'Hora'}
              </button>
            ))}
          </div>

          {/* Contenido dinámico */}
          <div className="flex-1 overflow-auto p-4">
            {activeTab === 'lugar' && (
              <div className="space-y-4">
                <input
                  autoFocus
                  type="text"
                  placeholder="¿Dónde vas?"
                  value={lugar}
                  onChange={e => setLugar(e.target.value)}
                  className="w-full border border-gray-300 rounded-full px-3 py-2 focus:outline-none"
                />
              </div>
            )}

            {activeTab === 'fecha' && (
              <DayPicker
                mode="single"
                selected={calendarDate}
                onSelect={handleDaySelect}
                fromDate={new Date()}
                className="mx-auto"
              />
            )}

            {activeTab === 'hora' && (
              <div className="grid grid-cols-3 gap-2">
                {times.map(t => (
                  <button
                    key={t}
                    onClick={() => setHora(t)}
                    className={`px-2 py-2 rounded-full text-sm ${
                      hora === t
                        ? 'bg-[#ff385c] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Botón de buscar */}
          <button
            onClick={handleSearch}
            className="mx-4 mb-20 mt-auto bg-[#ff385c] text-white py-3 rounded-full font-medium hover:bg-[#e31c5f] transition"
          >
            Buscar
          </button>
        </div>
      )}
    </div>
  )
}
