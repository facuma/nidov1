'use client'

import { motion } from 'framer-motion'

export default function SkeletonReservaResumenCard({ visible = true }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className=" rounded-xl bg-white overflow-hidden animate-pulse"
    >
      <div className="w-full h-48 bg-gray-300 rounded-xl" />

      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
        <div className="h-9 bg-gray-400 rounded w-1/2 mt-4" />
      </div>
    </motion.div>
  )
}
