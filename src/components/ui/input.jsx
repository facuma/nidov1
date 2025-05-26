import React from 'react'

export const Input = React.forwardRef(({ className = '', ...props }, ref) => (
  <input
    ref={ref}
    className={`w-full px-3 py-2 border border-gray-300 rounded ${className}`}
    {...props}
  />
))
Input.displayName = 'Input'