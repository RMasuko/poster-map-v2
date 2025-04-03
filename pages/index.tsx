'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import { supabase } from '../lib/supabaseClient'

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })

import L from 'leaflet'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
})

type Board = {
  id: string
  name: string
  address: string
  lat: number
  lng: number
}

export default function HomePage() {
  const [boards, setBoards] = useState<Board[]>([])

  useEffect(() => {
    const fetchBoards = async () => {
      const { data, error } = await supabase.from('boards').select('*')
      if (error) {
        console.error('Error fetching boards:', error)
      } else {
        setBoards(data)
      }
    }
    fetchBoards()
  }, [])

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer center={[35.8465, 139.6200]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {boards.map((board) => (
          <Marker key={board.id} position={[board.lat, board.lng]}>
            <Popup>
              <strong>{board.name}</strong><br />
              {board.address}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
