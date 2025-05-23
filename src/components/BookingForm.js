'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { CalendarDays } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import { format } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

export default function BookingForm({ space }) {
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [date, setDate] = useState('')
  const [calendarDate, setCalendarDate] = useState(null)
  const [startHour, setStartHour] = useState('')
  const [startMin, setStartMin] = useState('00')
  const [endHour, setEndHour] = useState('')
  const [endMin, setEndMin] = useState('00')
  const [total, setTotal] = useState(0)
  const [user, setUser] = useState(null)
  const [reserving, setReserving] = useState(false)
  const [dateError, setDateError] = useState('')
  const [timeError, setTimeError] = useState('')
  const [reservedSlots, setReservedSlots] = useState([])

  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const fetchReservedHours = async () => {
      if (!space?.id || !year || !month || !day) return
      const fullDate = `${year}-${month}-${day}`
      const { data, error } = await supabase
        .from('bookings')
        .select('start_time, end_time')
        .eq('space_id', space.id)
        .eq('date', fullDate)

      if (!error && data) {
        const slots = []
        for (let booking of data) {
          const start = new Date(booking.start_time)
          const end = new Date(booking.end_time)
          for (let h = start.getHours(); h < end.getHours(); h++) {
            slots.push(h.toString().padStart(2, '0'))
          }
        }
        setReservedSlots(slots)
      }
    }
    fetchReservedHours()
  }, [space, year, month, day])

  useEffect(() => {
    if (year && month && day && startHour && endHour) {
      const formattedDate = `${year}-${month}-${day}`
      const today = new Date()
      const selected = new Date(`${formattedDate}T00:00`)
      const start = new Date(`${formattedDate}T${startHour.padStart(2, '0')}:${startMin}`)
      const end = new Date(`${formattedDate}T${endHour.padStart(2, '0')}:${endMin}`)

      if (selected <= today) {
        setDateError('Seleccioná una fecha posterior a hoy')
        setTotal(0)
        return
      } else {
        setDateError('')
      }

      if (end <= start) {
        setTimeError('La hora de salida debe ser mayor a la de entrada')
        setTotal(0)
        return
      } else {
        setTimeError('')
      }

      setDate(formattedDate)
      const hours = (end - start) / (1000 * 60 * 60)
      const totalPrice = hours > 0 ? hours * space.price : 0
      setTotal(totalPrice)
    }
  }, [day, month, year, startHour, startMin, endHour, endMin, space.price])

  const handleReserve = async () => {
    if (!user) return router.push('/login')
    if (dateError || timeError) return

    const start_time = `${date}T${startHour.padStart(2, '0')}:${startMin}`
    const end_time = `${date}T${endHour.padStart(2, '0')}:${endMin}`

    setReserving(true)

    const { error } = await supabase.from('bookings').insert([{
      user_id: user.id,
      space_id: space.id,
      date,
      start_time,
      end_time,
      total_price: total
    }])

    setReserving(false)

    if (error) {
      alert('Error al reservar')
    } else {
      alert('Reserva confirmada!')
      router.push('/mis-reservas')
    }
  }

  const allHours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
  const availableHours = allHours.filter(h => !reservedSlots.includes(h))
  const minutes = ['00', '30']

  const handleDaySelect = (selected) => {
    if (!selected) return
    const y = selected.getFullYear().toString()
    const m = (selected.getMonth() + 1).toString().padStart(2, '0')
    const d = selected.getDate().toString().padStart(2, '0')
    setYear(y)
    setMonth(m)
    setDay(d)
    setCalendarDate(selected)
  }

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  return (
    <div className="p-6 border rounded-xl bg-white shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Reservar espacio</h2>

      <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
      <div className="flex items-center gap-3 mb-2">
        <input
          type="text"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          placeholder="DD"
          className="w-14 text-center bg-gray-50 border border-gray-300 rounded-lg py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
        />
        <span className="text-gray-500">/</span>
        <input
          type="text"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          placeholder="MM"
          className="w-14 text-center bg-gray-50 border border-gray-300 rounded-lg py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
        />
        <span className="text-gray-500">/</span>
        <input
          type="text"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="AAAA"
          className="w-20 text-center bg-gray-50 border border-gray-300 rounded-lg py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
        />
        <Popover>
          <PopoverTrigger className="p-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200">
            <CalendarDays size={20} className="text-gray-700" />
          </PopoverTrigger>
          <PopoverContent className="bg-white border p-3 rounded-xl shadow-xl z-50">
            <DayPicker
              mode="single"
              selected={calendarDate}
              onSelect={handleDaySelect}
              fromDate={tomorrow}
            />
          </PopoverContent>
        </Popover>
      </div>
      {dateError && <p className="text-sm text-red-600 mb-4">{dateError}</p>}

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hora inicio</label>
          <div className="flex gap-2">
            <select value={startHour} onChange={(e) => setStartHour(e.target.value)} className="w-1/2 p-2 rounded-lg border bg-gray-50 text-gray-800">
              <option value="">--</option>
              {availableHours.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
            <select value={startMin} onChange={(e) => setStartMin(e.target.value)} className="w-1/2 p-2 rounded-lg border bg-gray-50 text-gray-800">
              {minutes.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hora fin</label>
          <div className="flex gap-2">
            <select value={endHour} onChange={(e) => setEndHour(e.target.value)} className="w-1/2 p-2 rounded-lg border bg-gray-50 text-gray-800">
              <option value="">--</option>
              {availableHours.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
            <select value={endMin} onChange={(e) => setEndMin(e.target.value)} className="w-1/2 p-2 rounded-lg border bg-gray-50 text-gray-800">
              {minutes.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
      </div>
      {timeError && <p className="text-sm text-red-600 mt-2">{timeError}</p>}

      <p className="mt-6 text-gray-600">Total estimado: <span className="font-bold">${total}</span></p>

      <button
        onClick={handleReserve}
        disabled={reserving || !!dateError || !!timeError}
        className={`mt-6 w-full py-3 rounded-xl text-white text-sm font-semibold transition ${reserving || dateError || timeError ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}`}
      >
        {reserving ? 'Reservando...' : 'Reservar'}
      </button>
      <p className="text-xs text-center mt-3 text-gray-400">No se te cobrará todavía.</p>
    </div>
  )
}
