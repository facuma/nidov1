'use client'
import { createContext, useContext } from 'react'

export const EditarAnuncioContext = createContext({
  triggerRefresh: () => {}
})

export const useEditarAnuncio = () => useContext(EditarAnuncioContext)
