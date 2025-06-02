'use client'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ModalGracias({ show, onClose }) {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [show])
  

  if (!show) return null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center space-y-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <h2 className="text-2xl font-bold text-gray-900">¡Gracias por anotarte! 🎉</h2>
            <p className="text-gray-600">Te avisaremos apenas abramos la plataforma.</p>
            <button
              onClick={onClose}
              className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold"
            >
              Cerrar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
