'use client'

import { Toaster, toast as hotToast } from 'react-hot-toast'
import React from 'react'

// Re-exporta el toast para usar en la app
export const toast = hotToast

// Proveedor de toasts, colócalo en tu layout raíz
export function ToastProvider() {
  return <Toaster position="top-right" reverseOrder={false} />
}
