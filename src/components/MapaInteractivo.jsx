'use client'
import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'


function MoverMapa({ position }) {
  const map = useMap()

  useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lng], map.getZoom())
    }
  }, [position])

  return null
}

export default function MapaInteractivo({ position, onClick }) {
    function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng
        onClick({ lat, lng })
      }
    })

    return position ? (
      <Marker
        position={position}
        icon={L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41]
        })}
      />
    ) : null
  }

  return (
    <MapContainer center={position || [-27.45, -58.99]} zoom={14} className="w-full h-96 rounded-lg overflow-hidden">
      <TileLayer
  attribution="© MapTiler & OpenStreetMap contributors"
  url="https://api.maptiler.com/maps/pastel/{z}/{x}/{y}.png?key=Iilf32sUvwNSRURt9eHh"
/>

      <LocationMarker />
      <MoverMapa position={position} />
    </MapContainer>
  )
}
