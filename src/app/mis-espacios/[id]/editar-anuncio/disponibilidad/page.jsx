'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import AlertModal from '@/components/modals/AlertModal'
import Popup from '@/components/ui/Popup'
import { useEditarAnuncio } from '@/context/EditarAnuncioContext'


const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export default function DisponibilidadPage() {
  const { id } = useParams()
  const [horarios, setHorarios] = useState({})
  const [modal, setModal] = useState({ visible: false, title: '', message: '', onConfirm: null })
const [popupVisible, setPopupVisible] = useState(false)
const { triggerRefresh } = useEditarAnuncio()


  useEffect(() => {
  const cargarDisponibilidad = async () => {
    const { data, error } = await supabase
      .from('availability')
      .select('*')
      .eq('space_id', id)

    const resultado = {}
    for (let i = 0; i < 7; i++) {
      resultado[i] = { enabled: false, intervals: [] }
    }

    if (!error && data) {
      data.forEach(item => {
        const d = item.day_of_week
        if (!resultado[d].enabled) resultado[d].enabled = true
        resultado[d].intervals.push({
          start: item.start_time,
          end: item.end_time
        })
      })
    }

    setHorarios(resultado)
  }

  cargarDisponibilidad()
}, [id])


  const toggleDia = (day) => {
    setHorarios({
      ...horarios,
      [day]: {
        ...horarios[day],
        enabled: !horarios[day].enabled
      }
    })
  }

  const handleTimeChange = (day, index, field, value) => {
    const copia = [...horarios[day].intervals]
    copia[index][field] = value
    setHorarios({
      ...horarios,
      [day]: {
        ...horarios[day],
        intervals: copia
      }
    })
  }

  const agregarIntervalo = (day) => {
    const nuevos = [...horarios[day].intervals, { start: '', end: '' }]
    setHorarios({
      ...horarios,
      [day]: {
        ...horarios[day],
        intervals: nuevos
      }
    })
  }
  const eliminarIntervalo = (day, index) => {
  const nuevaLista = horarios[day].intervals.filter((_, i) => i !== index)
  setHorarios({
    ...horarios,
    [day]: {
      ...horarios[day],
      intervals: nuevaLista.length > 0 ? nuevaLista : [{ start: '', end: '' }]
    }
  })
}
const handleGuardar = async () => {
  const registros = []

  for (const [day, val] of Object.entries(horarios)) {
    if (!val.enabled) continue

    const intervals = val.intervals
      .filter(i => i.start && i.end)
      .sort((a, b) => a.start.localeCompare(b.start))

    for (let i = 0; i < intervals.length; i++) {
      const { start, end } = intervals[i]

      if (start >= end) {
        setModal({
          visible: true,
          title: 'Error en horarios',
          message: `En ${dias[day]} el horario de inicio debe ser menor al de fin.`,
          onConfirm: () => setModal({ ...modal, visible: false })
        })
        return
      }

      if (i < intervals.length - 1 && end > intervals[i + 1].start) {
        setModal({
          visible: true,
          title: 'Intervalos solapados',
          message: `En ${dias[day]} los intervalos se solapan.`,
          onConfirm: () => setModal({ ...modal, visible: false })
        })
        triggerRefresh()
        return
      }

      registros.push({
        space_id: id,
        day_of_week: parseInt(day),
        start_time: start,
        end_time: end
      })
    }
  }

  await supabase.from('availability').delete().eq('space_id', id)

  if (registros.length > 0) {
    const { error } = await supabase.from('availability').insert(registros)
    if (error) {
      setModal({
        visible: true,
        title: 'Error al guardar',
        message: 'Hubo un problema al guardar la disponibilidad.',
        onConfirm: () => setModal({ ...modal, visible: false })
      })
    } else {
      setPopupVisible(false) // Reinicia primero
setTimeout(() => setPopupVisible(true), 10) 
    }
  } else {
    setModal({
      visible: true,
      title: 'Sin horarios válidos',
      message: 'No se ingresó ningún intervalo válido para guardar.',
      onConfirm: () => setModal({ ...modal, visible: false })
    })
  }
}


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Disponibilidad</h1>
      <p className="text-sm text-gray-600">
        Activá los días y definí los intervalos disponibles. Podés agregar más de uno por día.
      </p>

      <div className="space-y-4">
        {dias.map((nombre, i) => {
          const dia = horarios[i]
          if (!dia) return null

          return (
            <div key={i} className="bg-white border rounded-lg p-4 space-y-2 shadow-sm">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={dia.enabled}
                  onChange={() => toggleDia(i)}
                />
                <span className="font-medium text-gray-800">{nombre}</span>
              </div>

              {dia.enabled && (
                <>
                  {dia.intervals.map((int, idx) => (
                    <div key={idx} className="flex gap-3 items-center">
                      <input
                        type="time"
                        value={int.start}
                        onChange={(e) => handleTimeChange(i, idx, 'start', e.target.value)}
                        className="border rounded px-2 py-1"
                      />
                      <span>-</span>
                      <input
                        type="time"
                        value={int.end}
                        onChange={(e) => handleTimeChange(i, idx, 'end', e.target.value)}
                        className="border rounded px-2 py-1"
                      />
                      {dia.intervals.length > 1 && (
                        <button
                          onClick={() => eliminarIntervalo(i, idx)}
                          className="text-red-500 hover:text-red-700 ml-2 text-sm"
                          title="Eliminar intervalo"
                        >
                          ❌
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={() => agregarIntervalo(i)}
                    className="mt-2 text-sm text-blue-600 hover:underline"
                  >
                    + Agregar intervalo
                  </button>
                </>
              )}
            </div>
          )
        })}
      </div>

      <button
        onClick={() => handleGuardar()}
        className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800"
      >
        Guardar disponibilidad
      </button>
      <AlertModal {...modal} onClose={() => setModal({ ...modal, visible: false })} />
      <Popup visible={popupVisible} message="Disponibilidad actualizada correctamente" variant="success" />

    </div>
  )
}
