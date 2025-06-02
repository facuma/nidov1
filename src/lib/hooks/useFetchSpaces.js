import { useEffect, useState, useCallback, useRef } from 'react'
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
  const cache = useRef({ data: null, timestamp: 0, query: '' })

  const fetchSpaces = useCallback(async () => {
    const queryKey = JSON.stringify({ lugar, fecha, hora, activity })
    const now = Date.now()

    // Reusar caché si es reciente y mismo query
    if (
      cache.current.data &&
      now - cache.current.timestamp < 30000 &&
      cache.current.query === queryKey
    ) {
      setSpaces(cache.current.data)
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      // Traer solo campos necesarios
      let query = supabase
        .from('spaces')
        .select('id, title, price, address, status, images(url), availability(*), activity')
        .eq('status', 'published')

      if (activity && activity !== 'all') {
        query = query.eq('activity', activity)
      }

      const { data, error } = await query
      if (error) throw error

      let filtered = Array.isArray(data) ? data : []

      // Filtrar por lugar
      if (lugar.trim()) {
        const lowerLugar = lugar.trim().toLowerCase()
        filtered = filtered.filter(space =>
          space.address?.toLowerCase().includes(lowerLugar)
        )
      }

      // Filtrar por fecha
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

      // Actualizar caché
      cache.current = { data: filtered, timestamp: now, query: queryKey }
      setSpaces(filtered)
    } catch (err) {
      console.error('Error al cargar espacios:', err)
      setSpaces([])
    } finally {
      setLoading(false)
    }
  }, [lugar, fecha, hora, activity])

  useEffect(() => {
    fetchSpaces()
  }, [fetchSpaces])

  return { spaces, loading }
}
