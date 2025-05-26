'use client'

import dynamic from 'next/dynamic'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useEditarAnuncio } from '@/context/EditarAnuncioContext'
import BuscadorDireccion from '@/components/BuscadorDireccion'

const MapaInteractivo = dynamic(() => import('@/components/MapaInteractivo'), { ssr: false })

export default function UbicacionPage() {
  const { id } = useParams()
  const router = useRouter()
  const [position, setPosition] = useState(null)
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(true)
  const { triggerRefresh } = useEditarAnuncio()

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('spaces')
        .select('latitude, longitude, address')
        .eq('id', id)
        .single()

      if (data?.latitude && data?.longitude) {
        setPosition({ lat: data.latitude, lng: data.longitude })
      }
      if (data?.address) {
        setAddress(data.address)
      }

      setLoading(false)
    }

    fetch()
  }, [id])

  const handleSelect = async ({ lat, lng }) => {
    setPosition({ lat, lng })
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
    const json = await res.json()
    setAddress(json.display_name || '')
  }

  const handleAddressSearch = async () => {
    if (!address) return
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`)
    const results = await res.json()
    if (results?.[0]) {
      const { lat, lon } = results[0]
      setPosition({ lat: parseFloat(lat), lng: parseFloat(lon) })
    }
  }

  const handleSave = async () => {
    if (!position) return

    const { error } = await supabase
      .from('spaces')
      .update({
        latitude: position.lat,
        longitude: position.lng,
        address
      })
      .eq('id', id)

    if (error) {
      console.error('Error al guardar ubicación:', error.message)
      alert('❌ No se pudo guardar. Verificá si sos el dueño del espacio o revisá las políticas RLS.')
    } else {
      triggerRefresh()
      router.refresh()
    }
  }

  if (loading) return <p className="text-sm text-gray-600">Cargando mapa...</p>

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">📍 Ubicación</h1>
      <p className="text-sm text-gray-600">Buscá tu dirección o seleccioná el punto en el mapa.</p>

      {/* Campo de dirección estilo buscador */}
      <div className="flex gap-2 z-19">
        <BuscadorDireccion
  address={address}
  setAddress={setAddress}
  onSelect={({ lat, lng, full }) => {
    setPosition({ lat, lng })
    setAddress(full)
  }}
/>
        <button
          onClick={handleAddressSearch}
          className="px-4 py-2 text-sm bg-gray-800 text-white rounded hover:bg-black"
        >
          Buscar
        </button>
      </div>

      {/* Mapa */}
      <div className="h-96 rounded-xl z-0 overflow-hidden border relative">
        <MapaInteractivo position={position} onClick={handleSelect} />
      </div>

      <button
        onClick={handleSave}
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
      >
        Guardar ubicación
      </button>
    </div>
  )
}
