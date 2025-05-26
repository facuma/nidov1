// components/SkeletonDetail.js
'use client'

import { motion } from 'framer-motion'

export default function SkeletonDetail() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid md:grid-cols-2 gap-10 animate-pulse"
    >
      {/* Columna de detalle */}
      <div>
        <div className="w-full h-64 bg-gray-300 rounded mb-6" />
        <div className="h-6 bg-gray-300 rounded w-2/3 mb-3" />
        <div className="h-4 bg-gray-300 rounded w-1/3 mb-4" />
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gray-300 rounded w-full" />
          <div className="h-3 bg-gray-300 rounded w-5/6" />
          <div className="h-3 bg-gray-300 rounded w-3/4" />
        </div>
        <div className="h-5 bg-gray-300 rounded w-1/4" />
      </div>

      {/* Columna formulario */}
      <div className="space-y-4">
        <div className="h-6 bg-gray-300 rounded w-2/3" />
        <div className="h-10 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-300 rounded w-1/2" />
        <div className="grid grid-cols-2 gap-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-300 rounded" />
          ))}
        </div>
        <div className="h-12 bg-gray-400 rounded w-full" />
      </div>
    </motion.div>
  )
}
