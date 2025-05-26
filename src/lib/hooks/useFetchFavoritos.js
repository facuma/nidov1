// lib/hooks/useFetchFavoritos.js
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useFetchFavoritos(userId) {
  const [favoritos, setFavoritos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const fetch = async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select('spaces(*, images(url))')
        .eq('user_id', userId)

      if (!error) setFavoritos(data.map(f => f.spaces))
      setLoading(false)
    }

    fetch()
  }, [userId])

  return { favoritos, loading }

 

}
