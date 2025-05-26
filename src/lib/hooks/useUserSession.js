// lib/hooks/useUserSession.js
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export function useUserSession(redirectIfNotLogged = true) {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user && redirectIfNotLogged) router.push('/login')
      else setUser(user)
    }
    fetch()
  }, [router, redirectIfNotLogged])

  return user
}
