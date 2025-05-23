'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import ReservaModal from '@/components/ReservaModal'
import CancelarModal from '@/components/CancelarModal'
import ModificarModal from '@/components/ModificarModal'

export default function MisReservas() {
  const [user, setUser] = useState(null)
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)

  const [modalVisible, setModalVisible] = useState(false)
  const [reservaActiva, setReservaActiva] = useState(null)
  const [cancelarVisible, setCancelarVisible] = useState(false)
  const [modificarVisible, setModificarVisible] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)

      const { data, error } = await supabase
        .from('bookings')
        .select('*, spaces(title, image, location, description)')
        .eq('user_id', user.id)
        .order('start_time', { ascending: true })

      if (!error) setReservas(data)
      setLoading(false)
    }

    fetchData()
  }, [router])

  const handleCancelarReserva = async (motivo) => {
    setCancelarVisible(false)

    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' }) // usamos estado, no borramos
      .eq('id', reservaActiva.id)

    if (error) {
      alert('Error al cancelar la reserva')
    } else {
      alert('Reserva cancelada con éxito')
      window.location.reload()
    }
  }

  if (loading) return <p className="text-gray-600 p-4">Cargando reservas...</p>

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Mis reservas</h1>

      {reservas.length === 0 ? (
        <p className="text-gray-500">Todavía no hiciste ninguna reserva.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reservas.map((reserva) => {
            const start = new Date(reserva.start_time)
            const end = new Date(reserva.end_time)
            const status = reserva.status

            const isCancelled = status === 'cancelled'
            const isConfirmed = status === 'confirmed'
            const isPending = status === 'pending'

            return (
              <div
                key={reserva.id}
                className={`relative border rounded-xl shadow bg-white overflow-hidden ${isCancelled ? 'opacity-50 pointer-events-none' : ''
                  }`}
              >
                {/* Badge flotante */}
                {isPending && (
                  <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    🕓 Pendiente
                  </div>
                )}

                {isConfirmed && (
                  <div className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    ✅ Confirmada
                  </div>
                )}

                {isCancelled && (
                  <div className="absolute top-3 right-3 bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    ❌ Cancelada
                  </div>
                )}

                <img
                  src={reserva.spaces?.image}
                  alt="espacio"
                  className="h-48 w-full object-cover"
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
                      onClick={() => {
                        setReservaActiva(reserva)
                        setModalVisible(true)
                      }}
                      className="mt-4 px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800"
                    >
                      Ver detalles
                    </button>
                  )}
                </div>
              </div>
            )
          })}



        </div>
      )}

      {/* MODAL DE DETALLE */}
      <ReservaModal
        visible={modalVisible}
        reserva={reservaActiva}
        onClose={() => setModalVisible(false)}
        onCancelar={() => {
          setModalVisible(false)
          setCancelarVisible(true)
        }
        }
        onModificar={() => {
          setModalVisible(false)
          setModificarVisible(true)
        }}
      />

      {/* MODAL DE CANCELACIÓN */}
      <CancelarModal
        visible={cancelarVisible}
        onClose={() => setCancelarVisible(false)}
        onBack={() => {
          setCancelarVisible(false)
          setModalVisible(true)
        }}
        onConfirm={handleCancelarReserva}
      />
      <ModificarModal
        visible={modificarVisible}
        reserva={reservaActiva}
        onClose={() => setModificarVisible(false)}
        onConfirm={async ({ date, start_time, end_time }) => {
          const { error } = await supabase
            .from('bookings')
            .update({
              date,
              start_time,
              end_time,
              status: reservaActiva.status === 'confirmed' ? 'pending' : reservaActiva.status
            })
            .eq('id', reservaActiva.id)

          if (error) {
            alert('Error al modificar la reserva')
          } else {
            alert('Reserva modificada y en revisión')
            window.location.reload()
          }
        }}
      />

    </div>
  )
}
