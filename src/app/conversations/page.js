'use client'

import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/components/AuthProvider'
import ChatSkeleton from '@/components/ui/ChatSkeleton'
import styles from '@/app/Sidebar.module.css'

export default function ConversationsPage() {
  const { session, loading } = useAuth()
  const [conversations, setConversations] = useState([])
  const [selected, setSelected] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [newMsg, setNewMsg] = useState('')
  const [error, setError] = useState(null)
  const chatEnd = useRef(null)
  const [loadingMessages, setLoadingMessages] = useState(false)

  // Fetch conversaciones
  useEffect(() => {
    if (!session) return
    ;(async () => {
      try {
        const res = await fetch('/api/conversations', {
          headers: { Authorization: `Bearer ${session.access_token}` }
        })
        if (!res.ok) throw new Error(`Error ${res.status}`)
        const { conversations } = await res.json()
        setConversations(conversations)
      } catch (err) {
        setError(err.message)
      }
    })()
  }, [session])

  // Fetch mensajes al cambiar selected
  useEffect(() => {
    setLoadingMessages(true)
    if (!selected || !session) return
    setChatMessages([])
    ;(async () => {
      try {
        const res = await fetch(
          `/api/conversations/${selected.id}/messages`,
          { headers: { Authorization: `Bearer ${session.access_token}` } }
        )
        if (!res.ok) throw new Error(`Error ${res.status}`)
       const json = await res.json()
    console.log('API messages response:', json)

    // 3) Extrae el array de mensajes, sea cual sea la key:
    const allMessages = 
      // si devolvió directamente un array
      Array.isArray(json) ? json :
      // si devolvió { data: [...] }
      Array.isArray(json.data) ? json.data :
      // si devolvió { messages: [...] }
      Array.isArray(json.messages) ? json.messages :
      // fallback a un array vacío
      []

    // 4) Ordena ascendentemente (viejo→nuevo)
    const asc = allMessages.sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    )

    // 5) Toma sólo los últimos MAX
    const MAX = 50
    const start = Math.max(asc.length - MAX, 0)
    const recent = asc.slice(start)

    // 6) Guarda en estado
    setChatMessages(recent)
        chatEnd.current?.scrollIntoView({ behavior: 'smooth' })
        setLoadingMessages(false)
      } catch (err) {
        setError(err.message)
      }
    })()
  }, [selected, session])

  const sendMessage = async () => {
    if (!newMsg.trim()) return
    try {
      const res = await fetch(
        `/api/conversations/${selected.id}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ content: newMsg })
        }
      )
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const { message } = await res.json()
      setChatMessages(prev => [...prev, message])
      setNewMsg('')
      chatEnd.current?.scrollIntoView({ behavior: 'smooth' })
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <p>Cargando…</p>
 return (
    // Contenedor ajustado debajo del navbar: altura = 100vh - 64px
    <div className="flex h-[calc(100vh-10rem)]">
      {/* Sidebar (1/3) */}
      <aside className={styles.sidebar}>
        <h2 className="p-4 text-xl font-bold">Conversaciones</h2>
        <ul>
          {conversations.map(c => (
            <li
              key={c.id}
              onClick={() => setSelected(c)}
              className={`p-4 cursor-pointer hover:bg-gray-100 ${selected?.id === c.id ? 'bg-gray-200' : ''}`}
            >
              {c.host.first_name} ⇄ {c.guest.first_name}
              <div className="text-xs text-gray-500">{new Date(c.created_at).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </aside>

      {/* Chat Area (2/3) */}
      <section className="w-2/3 flex flex-col">
         { !selected ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Selecciona una conversación
          </div>
         ):  !loadingMessages ? (
          <>
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2">
              {chatMessages.map(m => {
                const isMe = m.sender_id === session.user.id
                // determinar nombre si no es mensaje mío
                const label = !isMe
                  ? (m.sender_id === selected.host_id
                      ? selected.host.first_name
                      : selected.guest.first_name)
                  : ''
                return (
                  <div
                    key={m.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`w-1/3 pt-2 `}
                    >
                      {!isMe && (
                        <div className="text-md font-semibold mt-2 px-5">{label}</div>
                      )}
                      <div className={`py-2 px-5 flex justify-between  items-center rounded-full ${isMe ? 'bg-gray-300 text-left' : 'bg-gray-800 text-white text-left'}`}>
                      <div>{m.content}</div>
                      <div className="text-xs text-right end text-gray-500 ">{new Date(m.created_at).toLocaleTimeString()}</div>
                    </div>
                    </div>
                  </div>
                )
              })}
              <div ref={chatEnd} />
            </div>
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <input
                  className="flex-1 border rounded-full px-3 py-2"
                  value={newMsg}
                  onChange={e => setNewMsg(e.target.value)}
                  placeholder="Escribe un mensaje…"
                />
                <button onClick={sendMessage} className="bg-black text-white px-4 py-2 rounded-full">
                  Enviar
                </button>
              </div>
            </div>
          </>
        ) : (
          <ChatSkeleton/>
        )}
      </section>

      {/* Error flotante */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 text-red-700 p-3 rounded">
          {error}
        </div>
      )}
    </div>
  )
}
