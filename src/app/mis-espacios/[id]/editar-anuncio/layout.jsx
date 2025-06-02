'use client'

import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Popup from '@/components/ui/Popup'
import { EditarAnuncioContext } from '@/context/EditarAnuncioContext'
import AlertModal from '@/components/modals/AlertModal'
import { ArrowLeft, Plus, Pencil } from 'lucide-react'

export default function EditarAnuncioLayout({ children }) {
  const { id } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const [space, setSpace] = useState(null)
  const [imageCount, setImageCount] = useState(0)
  const [canPublish, setCanPublish] = useState(false)
  const [popupVisible, setPopupVisible] = useState(false)
  const [popupMsg, setPopupMsg] = useState('')
  const [popupVariant, setPopupVariant] = useState('success')
  const [refresh, setRefresh] = useState(0)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  const secciones = [
    {
      path: 'fotos',
      label: '📷 Recorrido fotográfico',
      preview: `${imageCount} foto${imageCount === 1 ? '' : 's'}`
    },
    {
      path: 'titulo',
      label: '🏷 Título',
      preview: space?.title || 'Sin título'
    },
    {
      path: 'precio',
      label: '💰 Precio',
      preview: space?.final_price ? `$${space.final_price}` : 'Sin precio'
    },
    {
      path: 'disponibilidad',
      label: '📅 Disponibilidad',
      preview: 'Configurá los horarios disponibles'
    },
    {
      path: 'descripcion',
      label: '📝 Descripción',
      preview: space?.description
        ? space.description.slice(0, 40) + (space.description.length > 40 ? '...' : '')
        : 'Sin descripción'
    },
    {
      path: 'ubicacion',
      label: '📍 Ubicación',
      preview: space?.address || 'Sin ubicación'
    }
  ]

  useEffect(() => {
    const fetchData = async () => {
      const { data: esp } = await supabase.from('spaces').select('*').eq('id', id).single()
      setSpace(esp)

      const { count } = await supabase
        .from('images')
        .select('*', { count: 'exact', head: true })
        .eq('space_id', id)

      setImageCount(count || 0)

      const isComplete =
        esp?.title?.length >= 20 &&
        esp?.description?.length >= 50 &&
        esp?.price > 0 &&
        esp?.latitude &&
        esp?.longitude &&
        (count || 0) > 0

      setCanPublish(isComplete)
    }

    fetchData()
  }, [id, refresh])

  const showPopup = (message, variant = 'success') => {
    setPopupMsg(message)
    setPopupVariant(variant)
    setPopupVisible(true)
    setTimeout(() => setPopupVisible(false), 3000)
  }

  const handleGuardarBorrador = async () => {
    const { error } = await supabase.from('spaces').update({ status: 'draft' }).eq('id', id)
    if (error) {
      showPopup('Error al guardar como borrador', 'error')
    } else {
      showPopup('Guardado como borrador')
      setRefresh(r => r + 1)
    }
  }

  const handlePublicar = async () => {
    if (!canPublish) return
    const { error } = await supabase.from('spaces').update({ status: 'published' }).eq('id', id)
    if (error) {
      showPopup('Error al publicar', 'error')
    } else {
      showPopup('✅ Anuncio publicado')
      setRefresh(r => r + 1)
    }
  }

  const handleDropdownChange = (e) => {
    const section = e.target.value
    router.push(`/mis-espacios/${id}/editar-anuncio/${section}`)
  }
  const handleEliminar = async () => {
  const { error } = await supabase.from('spaces').delete().eq('id', id)
  if (error) {
    showPopup('Error al eliminar', 'error')
  } else {
    router.push('/mis-espacios')
  }
  
}


  return (
    <>
    <div className="max-w-7xl mx-auto px-6 pt-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-gray-600 hover:text-gray-800 "
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver
        </button>
      </div>
    
      <div className="max-w-7xl mx-auto px-6 mt-4 grid grid-cols-1 md:grid-cols-4 gap-6 pb-32">
        {/* SIDEBAR DESKTOP */}
        <aside className="space-y-4 sticky top-20 h-fit hidden md:block">
          <h2 className="text-lg font-semibold text-gray-800">Tu anuncio</h2>
          <ul className="space-y-2 text-sm">
            {secciones.map((sec) => (
              <li key={sec.path}>
                <Link
                  href={`/mis-espacios/${id}/editar-anuncio/${sec.path}`}
                  className={cn(
                    "block px-4 py-3 rounded-xl border transition hover:shadow-sm",
                    pathname.endsWith(sec.path)
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-800 hover:bg-gray-50'
                  )}
                >
                  <div className="font-medium flex items-center gap-2">
                    {sec.label}
                  </div>
                  <div className="text-xs mt-1 text-gray-500">{sec.preview}</div>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* DROPDOWN MOBILE */}
        <div className="md:hidden items-center flex ">
          
          <select
            className="w-full border p-2 rounded-lg text-sm"
            onChange={handleDropdownChange}
            value={secciones.find(sec => pathname.endsWith(sec.path))?.path || ''}
          >
            {secciones.map(sec => (
              <option key={sec.path} value={sec.path}>
                {sec.label}
              </option>
            ))}
          </select>
        </div>

        <EditarAnuncioContext.Provider value={{ triggerRefresh: () => setRefresh(r => r + 1) }}>
          <main className="md:col-span-3 space-y-8">{children}</main>
        </EditarAnuncioContext.Provider>
      </div>

      {/* BOTONES FIJOS INFERIORES */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t z-50  pb-20 pt-4 sm:pb-4  px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600 hidden sm:block">
            Completá toda la información requerida para publicar tu anuncio.
          </p>

          <div className="flex gap-3 w-full sm:w-auto justify-end">
            <button
    onClick={() => setShowConfirmDelete(true)}
    className="text-red-500 hover:text-white bg-white border-red-500 px-5 py-2 border rounded-lg text-sm hover:bg-red-500 w-full sm:w-auto"
  >
    Eliminar
  </button>
            <button
              onClick={handleGuardarBorrador}
              className="px-5 py-2 border rounded-lg text-sm hover:bg-gray-100 w-full sm:w-auto"
            >
              Borrador
            </button>

            <button
              onClick={handlePublicar}
              disabled={!canPublish}
              className={`px-5 py-2 rounded-lg text-sm text-white font-medium w-full sm:w-auto ${
                canPublish ? 'bg-black hover:bg-gray-800' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Publicar
            </button>
            
            
  

          </div>
        </div>
      </div>
      <AlertModal
  visible={showConfirmDelete}
  title="¿Estás seguro?"
  message="Esta acción eliminará el espacio de forma permanente."
  confirmText="Eliminar"
  onClose={() => setShowConfirmDelete(false)}
  onConfirm={() => {
    setShowConfirmDelete(false)
    handleEliminar()
  }}
/>
      
      <Popup visible={popupVisible} message={popupMsg} variant={popupVariant} />
    </>
  )
}
