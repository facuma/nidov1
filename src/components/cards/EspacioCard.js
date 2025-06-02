'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

export default function EspacioCard({ space, onRemove }) {
  const [user, setUser] = useState(null)
  const [favorito, setFavorito] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data } = await supabase
          .from('favorites')
          .select('id')
          .eq('space_id', space.id)
          .eq('user_id', user.id)
          .single()
        setFavorito(!!data)
      }
    }

    init()
  }, [space.id])

  const toggleFavorito = async (e) => {
    e.preventDefault()
    if (!user) return alert('Iniciá sesión para guardar favoritos')

    if (favorito) {
      await supabase
        .from('favorites')
        .delete()
        .eq('space_id', space.id)
        .eq('user_id', user.id)

      setFavorito(false)
      if (onRemove) {
        setVisible(false)
        setTimeout(() => onRemove(space.id), 300) // espera la animación de salida
      }
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: user.id, space_id: space.id })
      setFavorito(true)
    }
  }

  const imageUrl = space.image || space.images?.[0]?.url || '/placeholder.jpg'

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.25 }}
        >
          <Link
            href={`/space/${space.id}`}
            className="min-w-[250px] max-w-[250px] bg-white rounded-xl overflow-hidden relative"
          >
            <div className="relative">
              <img
                src={imageUrl}
                alt={space.title}
                loading="lazy"
                decoding="async"
                width={250}
                height={192}
                className="w-full h-48 object-cover rounded-xl hover:shadow-md transition"
                onError={(e) => {
                  e.target.src = '/placeholder.jpg'
                }}
              />
              <div 
                className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
                aria-hidden="true"
              />
              <button
                onClick={toggleFavorito}
                className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-md hover:bg-white transition-colors"
                aria-label={favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              >
                <Heart
                  size={16}
                  className={favorito ? 'text-red-500 fill-red-500' : 'text-gray-600'}
                />
              </button>
            </div>

            <div className="mt-2 px-2 pb-4">
              <p className="text-sm font-semibold text-gray-900 line-clamp-1">{space.title}</p>
              <p className="text-sm text-gray-600 line-clamp-1">{space.address}</p>
              <p className="text-sm text-gray-800 mt-1">
                ${space.price} por 1 hora · <span className="font-medium">★ {space.rating || '4.8'}</span>
              </p>
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
