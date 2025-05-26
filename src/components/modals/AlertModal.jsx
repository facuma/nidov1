'use client'

export default function AlertModal({ visible, title, message, onClose, onConfirm, confirmText = 'Aceptar' }) {
  if (!visible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full space-y-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-600">{message}</p>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
