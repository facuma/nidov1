export default function ReservaCard({ reserva, tipo, onConfirmar, onCancelar }) {
  const start = new Date(reserva.start_time)
  const end = new Date(reserva.end_time)

  const huesped = reserva.users
  const getInitials = () => {
    if (!huesped) return '?'
    return `${huesped.first_name?.[0] || ''}${huesped.last_name?.[0] || ''}`.toUpperCase()
  }

  const estados = {
    pending: {
      label: 'Pendiente',
      color: 'bg-yellow-100 text-yellow-800'
    },
    confirmed: {
      label: 'Confirmada',
      color: 'bg-green-100 text-green-800'
    },
    cancelled: {
      label: 'Cancelada',
      color: 'bg-red-100 text-red-700'
    }
  }

  return (
    <div className="border border-gray-300 rounded-xl p-4 bg-white shadow-sm space-y-4 flex flex-col justify-between h-full">
      <div className="flex flex-col gap-2 text-sm text-gray-800">
        {huesped && (
          <div className="flex items-center gap-3 mt-2">
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700">
              {getInitials()}
            </div>
            <div className="text-sm leading-tight">
              <p className="font-medium">{huesped.first_name} {huesped.last_name}</p>
              <p className="text-gray-500 text-xs">{huesped.email}</p>
            </div>
          </div>
        )}
        <p className="text-sm font-medium">
          Solicitud de reserva para el{' '}
          <span className="font-bold text-black">{start.toLocaleDateString()}</span>
        </p>
        <p className="text-gray-600">
          De {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} a{' '}
          {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>

        

        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium w-fit ${estados[tipo].color}`}>
          {estados[tipo].label}
        </span>
      </div>

      {tipo === 'pending' && (
        <div className="flex gap-3 mt-4">
          <button
            onClick={onConfirmar}
            className="flex-1 px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium"
          >
            Confirmar
          </button>
          <button
            onClick={onCancelar}
            className="flex-1 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium"
          >
            Rechazar
          </button>
        </div>
      )}
    </div>
  )
}
