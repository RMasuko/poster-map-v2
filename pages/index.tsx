'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import 'leaflet/dist/leaflet.css'

// Map関連を動的インポート（SSRオフ）
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false })

type Board = {
  id: string
  name: string
  address: string
  lat: number
  lng: number
}

export default function HomePage() {
  const [boards, setBoards] = useState<Board[]>([])
  const [L, setL] = useState<any>(null)

  useEffect(() => {
    const fetchBoards = async () => {
      const { data, error } = await supabase.from('boards').select('*')
      if (error) {
        console.error('❌ Supabaseエラー:', error)
      } else {
        console.log('✅ Supabaseから取得したデータ:', data)
        setBoards(data)
      }
    }

    const loadLeaflet = async () => {
      const leaflet = await import('leaflet')
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
      })
      setL(leaflet)
    }

    fetchBoards()
    loadLeaflet()
  }, [])

  if (!L) return <p>Loading map...</p>

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer center={[35.8465, 139.6200]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
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
