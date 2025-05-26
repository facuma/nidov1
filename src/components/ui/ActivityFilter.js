'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { BookOpen, Briefcase, MessageCircle, Grid } from 'lucide-react'

const activities = [
  { key: 'all', label: 'Todos', icon: Grid },
  { key: 'study', label: 'Estudiar', icon: BookOpen },
  { key: 'work', label: 'Trabajar', icon: Briefcase },
  { key: 'events', label: 'Charlas', icon: MessageCircle },
]

export default function ActivityFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selected, setSelected] = useState('all')

  // Actualiza la selección cuando cambian los query params
  useEffect(() => {
    const current = searchParams.get('activity') || 'all'
    setSelected(current)
  }, [searchParams.toString()])

  const handleSelect = (key) => {
    const params = new URLSearchParams(searchParams.toString())
    if (key === 'all') params.delete('activity')
    else params.set('activity', key)
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="w-full overflow-x-auto py-4 px-4 ">
      <div className="flex justify-center">
        <div className="inline-flex space-x-4">
          {activities.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              className={`flex flex-col items-center min-w-[72px] px-3 py-3 rounded-xl shadow-sm transition-colors whitespace-nowrap
                ${selected === key ? ' accent text-gray-800' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
