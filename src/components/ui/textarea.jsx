import React from 'react'

export const Textarea = React.forwardRef(({ className = '', ...props }, ref) => (
  <textarea
    ref={ref}
    className={`w-full px-3 py-2 border border-gray-300 rounded ${className}`}
    {...props}
  />
))
Textarea.displayName = 'Textarea'