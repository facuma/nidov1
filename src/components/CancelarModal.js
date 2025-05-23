import { useState } from "react"

export default function CancelarModal({ visible, onClose, onBack, onConfirm }) {
  const [motivo, setMotivo] = useState('')

  if (!visible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative text-gray-900">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl">&times;</button>

        <h2 className="text-xl font-bold mb-4">¿Querés cancelar esta reserva?</h2>
        <p className="text-sm text-gray-600 mb-4">Por favor, contanos brevemente por qué estás cancelando.</p>

        <textarea
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder="Motivo de cancelación..."
          rows={4}
          className="w-full border rounded-lg p-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
        />

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onBack}
            className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100"
          >
            Volver
          </button>
          <button
            onClick={() => onConfirm(motivo)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
          >
            Confirmar cancelación
          </button>
        </div>
      </div>
    </div>
  )
}
