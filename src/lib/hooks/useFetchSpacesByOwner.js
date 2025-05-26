// lib/hooks/useFetchSpacesByOwner.js
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useFetchSpacesByOwner(userId) {
  const [spaces, setSpaces] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const fetch = async () => {
      const { data, error } = await supabase
        .from('spaces')
        .select('*, images(url)')
        .eq('owner_id', userId)

      if (!error) setSpaces(data)
      setLoading(false)
    }

    fetch()
  }, [userId])

  return { spaces, loading }
}
