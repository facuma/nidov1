'use client'

import { motion, AnimatePresence } from 'framer-motion'

export default function SkeletonCard({ visible = true }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="min-w-[250px] max-w-[500px] bg-gray-100 rounded-xl animate-pulse"
        >
          <div className="w-full h-48 bg-gray-300 rounded-xl" />
          <div className="p-3 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
