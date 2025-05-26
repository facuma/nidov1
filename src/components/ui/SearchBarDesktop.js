'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Search, CalendarDays, X } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover'
import { parseISO } from 'date-fns'

export default function SearchBarDesktop() {
  const [lugar, setLugar] = useState('')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [calendarDate, setCalendarDate] = useState(null)

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    setLugar(searchParams.get('lugar') || '')
    setFecha(searchParams.get('fecha') || '')
    setHora(searchParams.get('hora') || '')
    const f = searchParams.get('fecha')
    if (f) setCalendarDate(parseISO(f))
  }, [searchParams.toString()])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (lugar) params.set('lugar', lugar)
    if (fecha) params.set('fecha', fecha)
    if (hora) params.set('hora', hora)
    router.push(`/?${params.toString()}`)
  }

  const handleDaySelect = (selected) => {
    if (!selected) return
    const iso = selected.toISOString().split('T')[0]
    setFecha(iso)
    setCalendarDate(selected)
  }

  const clearFecha = (e) => {
    e.stopPropagation()
    setFecha('')
    setCalendarDate(null)
  }
  const clearLugar = () => setLugar('')
  const clearHora = () => setHora('')

  return (
    <div className="hidden md:flex justify-center w-full py-6 ">
      <div className="flex items-center max-w-3xl w-full border border-gray-300 rounded-full bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-6 px-5 py-2 flex-1">

          {/* Lugar */}
          <div className="flex flex-col relative flex-1">
            <label className="text-[0.65rem] font-extrabold text-gray-800  mb-1 uppercase">Lugar</label>
            <input
              type="text"
              placeholder="Explorar destinos"
              className="text-sm w-full placeholder-gray-400 focus:outline-none pr-6"
              value={lugar}
              onChange={(e) => setLugar(e.target.value)}
            />
            {lugar && (
              <X
                size={16}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                onClick={clearLugar}
              />
            )}
          </div>

          <div className="h-6 w-px " />

          {/* Fecha */}
          <div className="flex flex-col relative">
            <label className="text-[0.65rem] font-extrabold text-gray-800  mb-1 uppercase">Fecha</label>
            <Popover>
              <PopoverTrigger className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer pr-6">
                <span>
                  {fecha
                    ? calendarDate?.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
                    : 'Seleccioná una fecha'}
                </span>
                <CalendarDays size={18} className="text-gray-500" />
                {fecha && (
                  <X
                    size={16}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    onClick={clearFecha}
                  />
                )}
              </PopoverTrigger>
              <PopoverContent className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg z-50">
                <DayPicker
                  mode="single"
                  selected={calendarDate}
                  onSelect={handleDaySelect}
                  fromDate={new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="h-6 w-px bg-gray-200" />

          {/* Hora */}
          <div className="flex flex-col relative">
            <label className="text-[0.65rem] font-extrabold text-gray-800  mb-1 uppercase">Hora</label>
            <input
              type="time"
              className="text-sm w-28 placeholder-gray-400 focus:outline-none pr-6"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
            />
            {hora && (
              <X
                size={16}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                onClick={clearHora}
              />
            )}
          </div>
        </div>

        {/* Botón Buscar */}
        <button
          onClick={handleSearch}
          className="flex items-center justify-center w-10 h-10 accent text-gray-800 rounded-full mr-4 hover:bg-[#e31c5f] transition"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
