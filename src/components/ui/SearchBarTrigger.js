// components/ui/SearchBarTrigger.js
'use client'

import { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import SearchModal from './SearchModal'

export default function SearchBarTrigger() {
  const [open, setOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <div className="sticky top-0 z-20 bg-white px-4 py-3 border-b">
      <div
        onClick={() => setOpen(true)}
        className="max-w-2xl mx-auto flex items-center justify-between border border-gray-200 hover:border-gray-300 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition cursor-pointer"
      >
        <div className="text-sm text-gray-700">
          <span className="font-medium">Alojamientos en</span> <span className="text-gray-500">cualquier lugar</span>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <Search className="w-5 h-5 text-white bg-black rounded-full p-1" />
        </div>
      </div>

      {open && <SearchModal open={open} setOpen={setOpen} isMobile={isMobile} />}
    </div>
  )
}