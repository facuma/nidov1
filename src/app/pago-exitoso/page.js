'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function PagoExitosoPage() {
  const [reserva, setReserva] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [estado, setEstado] = useState('pendiente')

  const router = useRouter()
  const searchParams = useSearchParams()
  const paymentId = searchParams.get('payment_id')

  useEffect(() => {
    const verificarPagoYBuscarReserva = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')
      setUser(user)

      // Verificar el pago con el endpoint manual
      if (paymentId) {
        await fetch('/api/verificar-pago', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${
              (await supabase.auth.getSession()).data.session.access_token
            }`
          },
          body: JSON.stringify({ payment_id: paymentId })
        })
      }

      // Buscar la última reserva (confirmada o pendiente)
      const { data, error } = await supabase
        .from('bookings')
        .select('id, date, start_time, end_time, total_price, status')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (!error) {
        setReserva(data)
        setEstado(data.status)
      }

      setLoading(false)
    }

    verificarPagoYBuscarReserva()
  }, [router, paymentId])

  if (loading) {
    return <p className="p-6 text-gray-600 text-sm">Cargando tu reserva...</p>
  }

  return (
    <div className="max-w-md mx-auto py-12 px-6 text-center">
      <h1 className="text-2xl font-bold text-green-700 mb-4">
        {estado === 'confirmed' ? '✅ Pago exitoso' : '⌛ Reserva pendiente'}
      </h1>
      <p className="text-gray-700 mb-6">
        {estado === 'confirmed'
          ? 'Gracias por tu reserva. ¡Todo está confirmado!'
          : 'Tu reserva fue creada pero aún no está confirmada. Estamos verificando el pago.'}
      </p>

      {reserva && (
        <div className="bg-gray-50 border rounded-xl p-4 text-left text-sm text-gray-800">
          <p><strong>Reserva ID:</strong> {reserva.id}</p>
          <p><strong>Fecha:</strong> {reserva.date}</p>
          <p><strong>Horario:</strong> {reserva.start_time.slice(11)} - {reserva.end_time.slice(11)}</p>
          <p><strong>Total:</strong> ${reserva.total_price}</p>
        </div>
      )}

      <button
        onClick={() => router.push('/mis-reservas')}
        className="mt-8 px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
      >
        Ver mis reservas
      </button>
    </div>
  )
}
