'use client'

import { useEffect, useState } from 'react'

const variantStyles = {
  success: {
    bg: 'bg-green-600 text-white',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    )
  },
  error: {
    bg: 'bg-red-600 text-white',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    )
  },
  info: {
    bg: 'bg-blue-600 text-white',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
      </svg>
    )
  },
  warning: {
    bg: 'bg-yellow-500 text-black',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M5.07 17h13.86a1 1 0 00.93-1.36l-6.93-12a1 1 0 00-1.74 0l-6.93 12A1 1 0 005.07 17z" />
      </svg>
    )
  }
}

export default function Popup({ visible, message, variant }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (visible) {
      setShow(true)
      const timer = setTimeout(() => setShow(false), 600)
      return () => clearTimeout(timer)
    }
  }, [visible, message])

  const styles = variantStyles[variant]

  return (
    <div className="fixed bottom-14 left-1/2 z-1000 transform -translate-x-1/2 pointer-events-none">
      <div
        className={`
          inline-flex items-center gap-2 px-5 py-2 rounded-full shadow-lg text-sm relative
          transition-all duration-500 ease-in-out
          ${styles.bg}
          ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}
      >
        {styles.icon}
        <span>{message}</span>
        <button
          onClick={() => setShow(false)}
          className="absolute top-0 right-0 -translate-y-1 translate-x-1 text-white text-xs hover:text-gray-300 px-2"
          title="Cerrar"
        >
          ×
        </button>
      </div>
    </div>
  )
}
