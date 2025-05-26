'use client'

export default function ReservaResumenCard({ reserva, onVerDetalle }) {
  const start = new Date(reserva.start_time)
  const end = new Date(reserva.end_time)
  const status = reserva.status

  const estados = {
    pending: { label: '🕓 Pendiente', classes: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: '✅ Confirmada', classes: 'bg-green-100 text-green-700' },
    cancelled: { label: '❌ Cancelada', classes: 'bg-red-100 text-red-700' }
  }

  const isCancelled = status === 'cancelled'

  return (
    <div
      className={`relative border rounded-xl shadow bg-white overflow-hidden ${
        isCancelled ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      <div className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full shadow-sm ${estados[status].classes}`}>
        {estados[status].label}
      </div>

      <img
        src={reserva.spaces?.images?.[0]?.url || '/placeholder.jpg'}
        alt="espacio"
        className="h-48 w-full object-cover"
        loading="lazy"
        decoding="async"
      />

      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900">{reserva.spaces?.title}</h2>
        <p className="text-sm text-gray-500 mb-2">{reserva.spaces?.location}</p>

        <p className="text-sm text-gray-700">
          <span className="font-medium">Fecha:</span> {start.toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-medium">Horario:</span>{' '}
          {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
          {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>

        <p className="text-sm text-gray-700 mt-2">
          <span className="font-medium">Total:</span> ${reserva.total_price}
        </p>

        {!isCancelled && (
          <button
            onClick={onVerDetalle}
            className="mt-4 px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800"
          >
            Ver detalles
          </button>
        )}
      </div>
    </div>
  )
}
