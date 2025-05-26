'use client'

import { useState, useEffect } from 'react'

export default function ModificarModal({ visible, reserva, onClose, onConfirm }) {
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [startHour, setStartHour] = useState('')
  const [startMin, setStartMin] = useState('00')
  const [endHour, setEndHour] = useState('')
  const [endMin, setEndMin] = useState('00')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!reserva) return
    const start = new Date(reserva.start_time)
    const end = new Date(reserva.end_time)

    setDay(String(start.getDate()).padStart(2, '0'))
    setMonth(String(start.getMonth() + 1).padStart(2, '0'))
    setYear(start.getFullYear().toString())

    setStartHour(String(start.getHours()).padStart(2, '0'))
    setStartMin(String(start.getMinutes()).padStart(2, '0'))

    setEndHour(String(end.getHours()).padStart(2, '0'))
    setEndMin(String(end.getMinutes()).padStart(2, '0'))
  }, [reserva])

  if (!visible || !reserva) return null

  const handleSubmit = () => {
    setError('')
    if (!day || !month || !year || !startHour || !endHour) {
      setError('Completá todos los campos')
      return
    }

    const date = `${year}-${month}-${day}`
    const start = new Date(`${date}T${startHour}:${startMin}`)
    const end = new Date(`${date}T${endHour}:${endMin}`)
    const now = new Date()

    if (start <= now) {
      setError('La fecha de inicio debe ser futura')
      return
    }

    if (end <= start) {
      setError('La hora de salida debe ser posterior a la de entrada')
      return
    }

    onConfirm({
      date,
      start_time: `${date}T${startHour}:${startMin}`,
      end_time: `${date}T${endHour}:${endMin}`
    })
  }

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
  const minutes = ['00', '30']

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md relative text-black">
        <button onClick={onClose} className="absolute top-3 right-4 text-xl text-gray-500 hover:text-black">&times;</button>

        <h2 className="text-xl font-bold mb-4">Modificar reserva</h2>

        <div className="flex items-center gap-3 mb-4">
          <input value={day} onChange={(e) => setDay(e.target.value)} placeholder="DD" className="w-14 p-2 rounded border text-center" />
          /
          <input value={month} onChange={(e) => setMonth(e.target.value)} placeholder="MM" className="w-14 p-2 rounded border text-center" />
          /
          <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="AAAA" className="w-20 p-2 rounded border text-center" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium">Hora inicio</label>
            <div className="flex gap-2 mt-1">
              <select value={startHour} onChange={(e) => setStartHour(e.target.value)} className="w-1/2 p-2 rounded border">
                <option value="">--</option>
                {hours.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
              <select value={startMin} onChange={(e) => setStartMin(e.target.value)} className="w-1/2 p-2 rounded border">
                {minutes.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Hora fin</label>
            <div className="flex gap-2 mt-1">
              <select value={endHour} onChange={(e) => setEndHour(e.target.value)} className="w-1/2 p-2 rounded border">
                <option value="">--</option>
                {hours.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
              <select value={endMin} onChange={(e) => setEndMin(e.target.value)} className="w-1/2 p-2 rounded border">
                {minutes.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Enviar modificación
        </button>
      </div>
    </div>
  )
}
