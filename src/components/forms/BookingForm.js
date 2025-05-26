'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { CalendarDays } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { parseISO } from 'date-fns'

// divide intervalos enteros (horas) en bloques de 1h
function splitInterval(start, end) {
  const blocks = []
  let [sh] = start.split(':').map(Number)
  const [eh] = end.split(':').map(Number)

  while (sh < eh) {
    const blockStart = `${String(sh).padStart(2, '0')}:00`
    const blockEnd   = `${String(sh + 1).padStart(2, '0')}:00`
    blocks.push({ start: blockStart, end: blockEnd })
    sh += 1
  }

  return blocks
}

export default function BookingForm({ space }) {
  const [calendarDate, setCalendarDate]   = useState(null)
  const [date, setDate]                   = useState('')
  const [user, setUser]                   = useState(null)
  const [dayAvailability, setDayAvailability] = useState([])
  const [reservedSlots, setReservedSlots] = useState(new Set())
  const [selectedRange, setSelectedRange] = useState([])
  const [reserving, setReserving]         = useState(false)
  const [error, setError]                 = useState('')
  const router                            = useRouter()

  const today = new Date()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  // ↪️ Construye YYYY-MM-DD manualmente para evitar el offset UTC de toISOString()
  const handleDaySelect = (selected) => {
    if (!selected) return
    const y = selected.getFullYear()
    const m = String(selected.getMonth() + 1).padStart(2, '0')
    const d = String(selected.getDate()).padStart(2, '0')
    const localDate = `${y}-${m}-${d}`

    setDate(localDate)
    setCalendarDate(selected)
  }

  useEffect(() => {
    if (!space?.id || !date) return

    (async () => {
      // parseISO interpreta correctamente 'YYYY-MM-DD' en local
      const dow = parseISO(date).getDay()
      const { data: avail } = await supabase
        .from('availability')
        .select('start_time, end_time')
        .eq('space_id', space.id)
        .eq('day_of_week', dow)

      const { data: bookings } = await supabase
        .from('bookings')
        .select('start_time, end_time, status')
        .eq('space_id', space.id)
        .eq('date', date)

      const reserved = new Set()
      bookings?.forEach(r => {
        if (r.status !== 'confirmed') return
        const start = r.start_time.split('T')[1].slice(0,5)
        const end   = r.end_time.split('T')[1].slice(0,5)
        splitInterval(start, end).forEach(b => reserved.add(b.start))
      })

      setDayAvailability(avail || [])
      setReservedSlots(reserved)
      setSelectedRange([])
    })()
  }, [space, date])

  const allBlocks = dayAvailability.flatMap(i => splitInterval(i.start_time, i.end_time))

  const handleSelect = (block) => {
    if (reservedSlots.has(block.start)) return
    if (selectedRange.length === 0) {
      setSelectedRange([block])
    } else {
      const times = allBlocks.map(b => b.start)
      const i1 = times.indexOf(selectedRange[0].start)
      const i2 = times.indexOf(block.start)
      const [min, max] = [Math.min(i1,i2), Math.max(i1,i2)]
      const range = times.slice(min, max+1)
      if (range.some(t => reservedSlots.has(t))) {
        setError('No se puede seleccionar un rango con bloques reservados en el medio')
        return
      }
      setSelectedRange(allBlocks.filter(b => range.includes(b.start)))
    }
  }

  const handleReserve = () => {
    setError('')
    if (!user) return router.push('/login')
    if (!date || selectedRange.length === 0) {
      setError('Seleccioná al menos un bloque horario válido')
      return
    }
    const start = selectedRange[0].start
    const end   = selectedRange[selectedRange.length-1].end
    const total = selectedRange.length * space.price
    const params = new URLSearchParams({ space_id: space.id, date, start, end, total })
    router.push(`/resumen-reserva?${params.toString()}`)
  }

  return (
    <div className="p-6 border rounded-xl bg-white shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Reservar espacio</h2>

      <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
      <Popover>
        <PopoverTrigger className="w-full px-4 py-2 border rounded-lg flex items-center justify-between">
          { date || 'Seleccioná una fecha' }
          <CalendarDays size={18} />
        </PopoverTrigger>
        <PopoverContent className="bg-white border p-3 rounded-xl shadow-xl z-50">
          <DayPicker
            mode="single"
            selected={calendarDate}
            onSelect={handleDaySelect}
            fromDate={today}
          />
        </PopoverContent>
      </Popover>

      { date && (
        <div className="mt-6 space-y-2">
          <label className="block text-sm font-medium text-gray-700">Horarios disponibles</label>
          <div className="grid grid-cols-2 gap-2">
            {allBlocks.map((block,i) => {
              const isReserved = reservedSlots.has(block.start)
              const isSelected = selectedRange.some(b => b.start === block.start)
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(block)}
                  disabled={isReserved}
                  className={`text-sm px-3 py-2 rounded-lg border text-left transition ${
                    isReserved
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : isSelected
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {block.start} - {block.end}
                </button>
              )
            })}
          </div>

          {selectedRange.length > 0 && (
            <p className="mt-4 text-gray-600">
              Vas a reservar desde <strong>{selectedRange[0].start}</strong> hasta <strong>{selectedRange[selectedRange.length - 1].end}</strong> por <strong>${selectedRange.length * space.price}</strong>
            </p>
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

      <button
        onClick={handleReserve}
        disabled={reserving || selectedRange.length === 0}
        className={`mt-6 w-full py-3 rounded-xl text-white text-sm font-semibold transition ${
          reserving || selectedRange.length === 0 ? 'bg-amber-200 cursor-not-allowed' : 'accent hover:bg-gray-800'
        }`}
      >
        {reserving ? 'Reservando...' : 'Reservar'}
      </button>
    </div>
  )
}
