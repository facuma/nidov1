'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { parse } from 'date-fns'

function toMinutes(timeString) {
  const [h, m] = timeString.split(':')
  return parseInt(h, 10) * 60 + parseInt(m, 10)
}

/**
 * Hook para obtener espacios con filtros de lugar, fecha, hora y actividad.
 * @param {Object} params
 * @param {string} params.lugar - texto para filtrar dirección
 * @param {string} params.fecha - fecha en formato 'yyyy-MM-dd'
 * @param {string} params.hora - hora en formato 'HH:mm'
 * @param {string} params.activity - clave de actividad: 'study', 'work', 'events' o ''
 */
export function useFetchSpaces({ lugar = '', fecha = '', hora = '', activity = '' }) {
  const [spaces, setSpaces] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSpaces() {
      setLoading(true)

      // Query base: incluye la columna `activity`
      let query = supabase
        .from('spaces')
        .select('*, images(url), availability(*), activity')
        .eq('status', 'published')

      // Filtrar por activity si aplica
      if (activity && activity !== 'all') {
        query = query.eq('activity', activity)
      }

      const { data, error } = await query
      if (error) {
        console.error('Error al traer espacios:', error)
        setSpaces([])
        setLoading(false)
        return
      }

      let filtered = Array.isArray(data) ? data : []

      // Filtrar por lugar
      if (lugar.trim()) {
        const lowerLugar = lugar.trim().toLowerCase()
        filtered = filtered.filter(space =>
          space.address?.toLowerCase().includes(lowerLugar)
        )
      }

      // Filtrar por fecha (disponibilidad)
      if (fecha) {
        const selectedDate = parse(fecha, 'yyyy-MM-dd', new Date())
        const dayOfWeek = selectedDate.getDay()
        filtered = filtered.filter(space =>
          space.availability.some(avail => avail.day_of_week === dayOfWeek)
        )
      }

      // Filtrar por hora
      if (hora) {
        const selMin = toMinutes(hora)
        filtered = filtered.filter(space =>
          space.availability.some(avail => {
            const fromMin = toMinutes(avail.start_time)
            const toMinVal = toMinutes(avail.end_time)
            return selMin >= fromMin && selMin < toMinVal
          })
        )
      }

      setSpaces(filtered)
      setLoading(false)
    }

    fetchSpaces()
  }, [lugar, fecha, hora, activity])

  return { spaces, loading }
}
