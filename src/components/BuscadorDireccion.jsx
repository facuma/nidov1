import { useRef, useEffect, useState } from 'react'

export default function BuscadorDireccion({ address, setAddress, onSelect }) {
  const [results, setResults] = useState([])
  const [typingTimeout, setTypingTimeout] = useState(null)
  const inputRef = useRef(null)
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 })

  useEffect(() => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect()
      setCoords({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width })
    }
  }, [results.length])

  const handleChange = (e) => {
    const value = e.target.value
    setAddress(value)

    if (typingTimeout) clearTimeout(typingTimeout)
    setTypingTimeout(
      setTimeout(() => {
        fetchSuggestions(value)
      }, 400)
    )
  }

  const fetchSuggestions = async (query) => {
    if (!query) return setResults([])
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`
    )
    const data = await res.json()
    setResults(data)
  }

  const handleSelect = (item) => {
    setAddress(item.display_name)
    setResults([])
    if (onSelect) {
      onSelect({
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        full: item.display_name
      })
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="text"
        placeholder="Escribí una dirección"
        value={address}
        onChange={handleChange}
        className="w-full border rounded-lg p-2 text-sm"
      />
      {results.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: coords.top,
            left: coords.left,
            width: coords.width,
            zIndex: 1000
          }}
        >
          <ul className="bg-white border rounded shadow-md max-h-60 overflow-auto text-sm">
            {results.map((item, i) => (
              <li
                key={i}
                onClick={() => handleSelect(item)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {item.display_name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
