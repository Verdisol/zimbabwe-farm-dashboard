'use client'

import { useEffect, useState } from 'react'

export default function MapView() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Load Leaflet CSS from CDN
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    // Load Leaflet JS from CDN
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.async = true
    script.onload = () => setLoaded(true)
    document.body.appendChild(script)

    return () => {
      document.head.removeChild(link)
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (!loaded) return

    const L = (window as any).L

    // Default center: Harare, Zimbabwe
    const map = L.map('farm-map').setView([-17.8252, 31.0335], 7)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    // Add marker for Harare
    L.marker([-17.8252, 31.0335])
      .addTo(map)
      .bindPopup('Harare — your default location')
      .openPopup()

    // Add a few markers for major farming districts
    const districts = [
      { name: 'Murehwa', lat: -17.6500, lng: 31.7833 },
      { name: 'Chinhoyi', lat: -17.3667, lng: 30.2000 },
      { name: 'Mutare', lat: -18.9707, lng: 32.6709 },
      { name: 'Masvingo', lat: -20.0637, lng: 30.8277 },
    ]

    districts.forEach((d) => {
      L.marker([d.lat, d.lng])
        .addTo(map)
        .bindPopup(`📍 ${d.name}`)
    })

    return () => {
      map.remove()
    }
  }, [loaded])

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1f2937', margin: 0 }}>
          🗺️ Farm Locations Map
        </h2>
        <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
          Zoom and click markers to explore districts
        </p>
      </div>
      <div id="farm-map" style={{ height: '420px', width: '100%' }} />
      {!loaded && (
        <div
          style={{
            padding: '40px',
            textAlign: 'center',
            color: '#64748b',
            fontSize: '14px',
          }}
        >
          Loading map...
        </div>
      )}
    </div>
  )
}
