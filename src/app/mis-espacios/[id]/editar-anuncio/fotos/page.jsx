'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'
import { useDropzone } from 'react-dropzone'
import imageCompression from 'browser-image-compression'
import { useEditarAnuncio } from '@/context/EditarAnuncioContext'
import Popup from '@/components/ui/Popup'
import { Plus } from 'lucide-react'

export default function FotosPage() {
  const { id } = useParams()
  const [imagenes, setImagenes] = useState([])
  const [previews, setPreviews] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [popup, setPopup] = useState({ visible: false, message: '', variant: 'success' })
  const { triggerRefresh } = useEditarAnuncio()

  useEffect(() => {
    const fetchImages = async () => {
      const { data } = await supabase
        .from('images')
        .select('id, url, path')
        .eq('space_id', id)
        .order('created_at', { ascending: true })

      if (data) setImagenes(data)
    }

    fetchImages()
  }, [id])

  const showPopup = (message, variant = 'success') => {
    setPopup({ visible: true, message, variant })
    setTimeout(() => setPopup({ visible: false, message: '', variant: 'success' }), 3000)
  }

  const onDrop = useCallback((acceptedFiles) => {
    const newPreviews = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setPreviews(prev => [...prev, ...newPreviews])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true
  })

  const handleUploadAll = async () => {
    setUploading(true)

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1280,
      useWebWorker: true
    }

    for (const item of previews) {
      const file = item.file
      const compressed = await imageCompression(file, options)
      const filename = `${uuidv4()}-${file.name}`

      const { error: uploadError } = await supabase.storage
        .from('spaces')
        .upload(filename, compressed)

      if (uploadError) {
        console.error('Error uploading', uploadError)
        showPopup('Error al subir una imagen', 'error')
        continue
      }

      const publicUrl = supabase.storage.from('spaces').getPublicUrl(filename).data.publicUrl

      const { data, error: insertError } = await supabase
        .from('images')
        .insert({ space_id: id, url: publicUrl, path: filename }) // guardamos el path también
        .select()

      if (!insertError && data) {
        setImagenes(prev => [...prev, ...data])
      } else {
        showPopup('Error al guardar imagen', 'error')
      }
    }

    triggerRefresh()
    setPreviews([])
    setModalVisible(false)
    setUploading(false)
    showPopup('Imágenes subidas correctamente')
  }

  const handleDelete = async (img) => {
    const { error: storageError } = await supabase.storage.from('spaces').remove([img.path])
    if (storageError) {
      console.error('Error al borrar del storage:', storageError.message)
      showPopup('Error al borrar del storage', 'error')
      return
    }

    const { error: dbError } = await supabase.from('images').delete().eq('id', img.id)
    if (dbError) {
      console.error('Error al borrar de la base de datos:', dbError.message)
      showPopup('Error al borrar de la base de datos', 'error')
      return
    }

    setImagenes(prev => prev.filter(i => i.id !== img.id))
    triggerRefresh()
    showPopup('Imagen eliminada correctamente', 'success')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">📷 Fotos del espacio</h1>
        <button
          onClick={() => setModalVisible(true)}
          className="bg-black text-white text-sm px-4 py-2 rounded-full hover:bg-gray-800 flex items-center gap-2"
        >
          <Plus/>
        </button>
      </div>

      {/* Galería */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {imagenes.map((img) => (
          <div key={img.id} className="relative group">
            <img
              src={img.url}
              loading="lazy"
              decoding="async"
              className="w-full h-40 object-cover rounded-xl shadow-sm"
            />
            <button
              onClick={() => handleDelete(img)}
              className="absolute top-1 right-1 text-white bg-black bg-opacity-70 hover:bg-red-600 rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
              title="Eliminar"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-lg relative">
            <button
              onClick={() => { setModalVisible(false); setPreviews([]) }}
              className="absolute top-3 right-4 text-gray-500 hover:text-black text-lg"
            >
              ×
            </button>

            <h2 className="text-lg font-bold text-gray-800 mb-2">Subí fotos</h2>
            <p className="text-sm text-gray-600 mb-4">Arrastrá y soltá o buscá fotos desde tu dispositivo</p>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition ${isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
            >
              <input {...getInputProps()} />
              <p className="text-gray-600 text-sm">🖼️ Arrastrá y soltá imágenes aquí o hacé clic</p>
            </div>

            {previews.length > 0 && (
              <>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {previews.map((p, i) => (
                    <img key={i} src={p.preview} className="w-full h-24 object-cover rounded" />
                  ))}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button onClick={() => setModalVisible(false)} className="text-sm px-4 py-2 border rounded hover:bg-gray-100">Cancelar</button>
                  <button
                    onClick={handleUploadAll}
                    disabled={uploading}
                    className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800"
                  >
                    {uploading ? 'Subiendo...' : 'Cargar'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Popup visible={popup.visible} message={popup.message} variant={popup.variant} />
    </div>
  )
}
