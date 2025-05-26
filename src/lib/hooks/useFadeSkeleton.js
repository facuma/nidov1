// lib/hooks/useFadeSkeleton.js
import { useEffect, useState } from 'react'

export function useFadeSkeleton(loading) {
  const [skeletonsVisible, setSkeletonsVisible] = useState(true)

  useEffect(() => {
    if (!loading) {
      const timeout = setTimeout(() => setSkeletonsVisible(false), 300)
      return () => clearTimeout(timeout)
    } else {
      setSkeletonsVisible(true)
    }
  }, [loading])

  return skeletonsVisible
}
