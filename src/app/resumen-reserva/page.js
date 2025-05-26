'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ResumenReservaPage() {
  const [space, setSpace] = useState(null)
  const [user, setUser] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [loading, setLoading] = useState(true)

  const params = useSearchParams()
  const router = useRouter()

  const spaceId = params.get('space_id')
  const date = params.get('date')
  const start = params.get('start')
  const end = params.get('end')
  const total = parseFloat(params.get('total')) || 0
  const totalConComision = (total * 1.1).toFixed(2)

  useEffect(() => {
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      const { data } = await supabase
        .from('spaces')
        .select('*, images(url)')
        .eq('id', spaceId)
        .single()

      setSpace(data)
      setLoading(false)
    }

    fetch()
  }, [spaceId])

  const handleConfirmar = async () => {
    const { error } = await supabase.from('bookings').insert([{
      user_id: user.id,
      space_id: spaceId,
      date,
      start_time: `${date}T${start}`,
      end_time: `${date}T${end}`,
      total_price: totalConComision,
      mensaje,
      status: 'pending'
    }])

    if (error) return alert('Error al confirmar reserva')
    router.push('/pago')
  }

  if (loading || !space) return <p className="p-6 text-gray-500">Cargando resumen de reserva...</p>

  return (
    <><h1 className="text-3xl font-bold text-gray-900">Revisá tu reserva antes de pagar</h1>
    <div className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
        
      {/* Columna izquierda */}
      <div className="space-y-6">
        

        <div className="border rounded-xl p-5 bg-white space-y-3">
          <p className="text-sm text-gray-600 font-medium mb-1">El pago se realiza con <strong className='text-accent'>MercadoPago</strong>.</p>
          <p className="text-base text-gray-800 font-semibold">Pagás ${totalConComision} USD ahora</p>
          <p className="text-sm text-gray-500">Incluye una comisión del 10% por el servicio.</p>
        </div>

        <div className="border rounded-xl p-5 bg-white space-y-3">
          <label className="block text-sm font-semibold text-gray-800">
            Escribile un mensaje al anfitrión
          </label>
          <p className="text-sm text-gray-500">
            Antes de continuar, contale a {space?.owner_name || 'el anfitrión'} un poco sobre tu viaje y por qué su espacio es una buena opción para vos.
          </p>
          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            rows={4}
            className="w-full mt-2 p-3 text-sm border rounded-lg"
            placeholder="Ej: Hola! Mi pareja y yo vamos al casamiento de un amigo..."
          />
        </div>

        <p className="text-sm text-gray-500">
          El anfitrión tiene 24 horas para confirmar tu reserva. No se realiza el cobro hasta que el anfitrión acepte tu solicitud.
        </p>

        <p className="text-xs text-gray-400">
          Al seleccionar el botón, aceptás los <a href="#" className="underline">términos de la reserva</a>.
        </p>
      </div>

      {/* Columna derecha: Resumen */}
      <div className="flex flex-col justify-between">
        <div className="border rounded-xl bg-white p-5 space-y-4 shadow-sm">
          <div className="flex gap-4">
            <img
              src={space.images?.[0]?.url || '/placeholder.jpg'}
              alt={space.title}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="text-sm">
              <p className="font-bold text-gray-800">{space.title}</p>
              <p className="text-gray-500">{space.location}</p>
              <p className="text-xs text-gray-500 mt-1">Cancelación gratuita</p>
            </div>
          </div>

          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>Información del viaje:</strong></p>
            <p>📅 {date}</p>
            <p>⏰ De {start} a {end}</p>
            <p>👥 1 persona (por defecto)</p>
          </div>

          <div className="border-t pt-3 text-sm text-gray-700 space-y-1">
            <p><strong>Precio:</strong></p>
            <div className="flex justify-between">
              <span>${total} USD</span>
              <span>por esta reserva</span>
            </div>
            <div className="flex justify-between">
              <span>${(totalConComision - total).toFixed(2)} USD</span>
              <span>comisión</span>
            </div>
            <div className="flex justify-between font-bold text-black pt-1 border-t mt-2">
              <span>Total:</span>
              <span>${totalConComision} USD</span>
            </div>
          </div>
        </div>

        
      </div>
      <button
          onClick={handleConfirmar}
          className="mt-6 w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-full text-sm"
        >
          Solicitar una reserva
        </button>
    </div></>
  )
}
