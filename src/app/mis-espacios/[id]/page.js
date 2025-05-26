'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ReservaCard from '@/components/cards/ReservaCard'
import Link from 'next/link'

export default function PanelEspacio() {
  const { id } = useParams()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [espacio, setEspacio] = useState(null)
  const [reservas, setReservas] = useState([])
  const [tab, setTab] = useState('pending') // pestaña activa

  useEffect(() => {
    const fetchUserAndData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')

      setUser(user)

      const { data: espacioData, error } = await supabase
  .from('spaces')
  .select('*, images(url)')
  .eq('id', id)
  .eq('owner_id', user.id)
  .single()


      if (!espacioData || error) {
        alert('No tenés acceso a este espacio')
        return router.push('/mis-espacios')
      }

      setEspacio(espacioData)

      const { data: reservasData } = await supabase
        .from('bookings')
        .select('*, users(first_name, last_name, email)')
        .eq('space_id', id)
        .order('start_time', { ascending: true })


      setReservas(reservasData || [])


    }

    fetchUserAndData()
  }, [id, router])


  if (!espacio) return <p className="p-6 text-gray-600">Cargando...</p>

  const filtros = {
    all: '🗂 Todas',
    pending: '🕓 Pendientes',
    confirmed: '✅ Confirmadas',
    cancelled: '❌ Canceladas'
  }

  const contarPorEstado = (estado) => {
    if (estado === 'all') return reservas.length
    return reservas.filter(r => r.status === estado).length
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Panel: {espacio.title}</h1>

      {/* PESTAÑAS */}
      <div className="flex gap-4 mb-6">
        {Object.entries(filtros).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 text-sm rounded-full ${tab === key ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
          >
            {label} ({contarPorEstado(key)})
          </button>
        ))}
      </div>

      {/* CONTENIDO */}
      <div className="bg-white border rounded-xl p-4 shadow">
        <h2 className="text-lg font-bold text-gray-800 mb-3">{filtros[tab]}</h2>

        {reservas.filter(r => tab === 'all' || r.status === tab).length === 0 ? (
          <p className="text-sm text-gray-500">No hay reservas {tab !== 'all' ? filtros[tab].toLowerCase() : 'registradas'}.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reservas
              .filter(r => tab === 'all' || r.status === tab)
              .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
              .map(r => (
                <ReservaCard
                  key={r.id}
                  reserva={r}
                  tipo={r.status}
                  onConfirmar={async () => {
                    await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', r.id)
                    window.location.reload()
                  }}
                  onCancelar={async () => {
                    await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', r.id)
                    window.location.reload()
                  }}
                />
              ))}
          </div>
        )}
      </div>
      {/* SECCIÓN EXTRA: Edición del anuncio */}
<div className="mt-10 bg-white border rounded-xl p-6 shadow space-y-4">
  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">🛠 Editar anuncio</h2>
  <p className="text-sm text-gray-600">Configurá los distintos aspectos de tu espacio:</p>

  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">

    {/* FOTOS */}
    <Link href={`/mis-espacios/${id}/editar-anuncio/fotos`} className="group p-4 rounded-xl border hover:bg-gray-50 transition shadow-sm hover:shadow-md text-center flex flex-col items-center gap-1 relative">
      <span className="text-2xl">📷</span>
      <span className="text-sm font-medium text-gray-800 group-hover:text-black">Fotos</span>
      {espacio?.images?.length > 0 && (
  <span className="absolute top-2 right-2 text-green-600 text-sm">✅</span>
)}
    </Link>

    {/* TITULO */}
    <Link href={`/mis-espacios/${id}/editar-anuncio/titulo`} className="group p-4 rounded-xl border hover:bg-gray-50 transition shadow-sm hover:shadow-md text-center flex flex-col items-center gap-1 relative">
      <span className="text-2xl">🏷</span>
      <span className="text-sm font-medium text-gray-800 group-hover:text-black">Título</span>
      {espacio?.title && (
        <span className="absolute top-2 right-2 text-green-600 text-sm">✅</span>
      )}
    </Link>

    {/* PRECIO */}
    <Link href={`/mis-espacios/${id}/editar-anuncio/precio`} className="group p-4 rounded-xl border hover:bg-gray-50 transition shadow-sm hover:shadow-md text-center flex flex-col items-center gap-1 relative">
      <span className="text-2xl">💰</span>
      <span className="text-sm font-medium text-gray-800 group-hover:text-black">Precio</span>
      {espacio?.price > 0 && (
        <span className="absolute top-2 right-2 text-green-600 text-sm">✅</span>
      )}
    </Link>

    {/* DISPONIBILIDAD */}
    <Link href={`/mis-espacios/${id}/editar-anuncio/disponibilidad`} className="group p-4 rounded-xl border hover:bg-gray-50 transition shadow-sm hover:shadow-md text-center flex flex-col items-center gap-1 relative">
      <span className="text-2xl">📅</span>
      <span className="text-sm font-medium text-gray-800 group-hover:text-black">Disponibilidad</span>
      {/* este será calculado luego, ahora mostramos siempre sin check */}
    </Link>

    {/* DESCRIPCIÓN */}
    <Link href={`/mis-espacios/${id}/editar-anuncio/descripcion`} className="group p-4 rounded-xl border hover:bg-gray-50 transition shadow-sm hover:shadow-md text-center flex flex-col items-center gap-1 relative">
      <span className="text-2xl">📝</span>
      <span className="text-sm font-medium text-gray-800 group-hover:text-black">Descripción</span>
      {espacio?.description && (
        <span className="absolute top-2 right-2 text-green-600 text-sm">✅</span>
      )}
    </Link>
  </div>
</div>



    </div>
  )
}
