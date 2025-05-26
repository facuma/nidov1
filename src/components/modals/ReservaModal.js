export default function ReservaModal({ reserva, visible, onClose, onCancelar, onModificar }) {
  if (!visible || !reserva) return null

  const start = new Date(reserva.start_time)
  const end = new Date(reserva.end_time)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 relative text-gray-900">
        {/* Cerrar */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl">&times;</button>

        {/* Info del espacio */}
        <img src={reserva.spaces?.image} alt="espacio" className="w-full h-48 object-cover rounded-lg mb-4" />
        <h2 className="text-2xl font-bold">{reserva.spaces?.title}</h2>
        <p className="text-gray-600 mb-2">{reserva.spaces?.location}</p>
        <p className="text-sm text-gray-500 mb-4">{reserva.spaces?.description}</p>

        {/* Info de la reserva */}
        <div className="space-y-1 text-sm">
          <p><strong>Fecha:</strong> {start.toLocaleDateString()}</p>
          <p><strong>Desde:</strong> {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <p><strong>Hasta:</strong> {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <p><strong>Total:</strong> ${reserva.total_price}</p>
        </div>

        {/* Acciones */}
        <div className="mt-6 flex justify-end gap-4 flex-wrap">
          <button
            className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100"
            onClick={onClose}
          >
            Cerrar
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
            onClick={onModificar}
          >
            Solicitar modificación
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700"
            onClick={onCancelar}
          >
            Cancelar reserva
          </button>
        </div>
      </div>
    </div>
  )
}
