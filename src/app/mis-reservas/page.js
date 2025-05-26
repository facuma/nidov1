'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import ReservaModal from '@/components/modals/ReservaModal'
import CancelarModal from '@/components/modals/CancelarModal'
import ModificarModal from '@/components/modals/ModificarModal'
import SkeletonReservaCard from '@/components/cards/SkeletonReservaCard'
import ReservaResumenCard from '@/components/cards/ReservaResumenCard'


export default function MisReservas() {
  const [user, setUser] = useState(null)
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)

  const [modalVisible, setModalVisible] = useState(false)
  const [reservaActiva, setReservaActiva] = useState(null)
  const [cancelarVisible, setCancelarVisible] = useState(false)
  const [modificarVisible, setModificarVisible] = useState(false)
  const [skeletonsVisible, setSkeletonsVisible] = useState(true)


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
        .select('*, spaces(title, images(url), location, description)')
        .eq('user_id', user.id)
        .order('start_time', { ascending: true })

      if (!error) setReservas(data)
      setLoading(false)
setTimeout(() => setSkeletonsVisible(false), 300)

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

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Mis reservas</h1><div className='grid grid-cols-1 md:grid-cols-3 gap-6'>{Array.from({ length: 6 }).map((_, i) => (
      <SkeletonReservaCard key={i} visible={skeletonsVisible} />
    ))}</div></div>

  return (
    <div className="max-w-5xl mx-auto px-4 pb-20">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Mis reservas</h1>

      {reservas.length === 0 ? (
        <p className="text-gray-500">Todavía no hiciste ninguna reserva.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {reservas.map((reserva) => (
    <ReservaResumenCard
      key={reserva.id}
      reserva={reserva}
      onVerDetalle={() => {
        setReservaActiva(reserva)
        setModalVisible(true)
      }}
    />
  ))}
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
