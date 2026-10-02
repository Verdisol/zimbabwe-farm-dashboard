'use client'

import { useEffect, useRef, useState } from 'react'
import {
  districts,
  District,
  getSavedLocation,
  saveLocation,
  findNearestDistrict,
} from './locationData'

export default function LocationPicker() {
  const [selected, setSelected] = useState<District>(districts[0])
  const [mapLoaded, setMapLoaded] = useState(false)
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  // Load saved location on mount
  useEffect(() => {
    const saved = getSavedLocation()
    if (saved) setSelected(saved)
  }, [])

  // Load Leaflet
  useEffect(() => {
    if (document.getElementById('leaflet-css-loc')) {
      setMapLoaded(true)
      return
    }

    const link = document.createElement('link')
    link.id = 'leaflet-css-loc'
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.async = true
    script.onload = () => setMapLoaded(true)
    document.body.appendChild(script)
  }, [])

  // Set up map
  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current) return
    const L = (window as any).L
    if (!L) return

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: [selected.lat, selected.lng],
        zoom: 8,
        scrollWheelZoom: false,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 18,
      }).addTo(mapRef.current)

      markerRef.current = L.marker([selected.lat, selected.lng], {
        draggable: true,
      }).addTo(mapRef.current)

      // When user drags the marker, find nearest district
      markerRef.current.on('dragend', (e: any) => {
        const { lat, lng } = e.target.getLatLng()
        const nearest = findNearestDistrict(lat, lng)
        setSelected(nearest)
        saveLocation(nearest)
      })

      // When user clicks the map, move marker there
      mapRef.current.on('click', (e: any) => {
        const { lat, lng } = e.latlng
        markerRef.current.setLatLng([lat, lng])
        const nearest = findNearestDistrict(lat, lng)
        setSelected(nearest)
        saveLocation(nearest)
      })
    } else {
      mapRef.current.setView([selected.lat, selected.lng], 8)
      markerRef.current.setLatLng([selected.lat, selected.lng])
    }
  }, [mapLoaded])

  // When dropdown changes, update map marker
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      mapRef.current.setView([selected.lat, selected.lng], 8)
      markerRef.current.setLatLng([selected.lat, selected.lng])
    }
  }, [selected])

  const handleDropdownChange = (name: string) => {
    const district = districts.find((d) => d.name === name)
    if (district) {
      setSelected(district)
      saveLocation(district)
    }
  }

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.20)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(0,255,136,0.20)',
        boxShadow: '0 0 15px rgba(0,255,136,0.18)',
        padding: '18px',
        marginBottom: '16px',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)',
        gap: '16px',
        alignItems: 'stretch',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <h3
            style={{
              fontSize: '15px',
              color: '#0f172a',
              margin: 0,
              fontWeight: 700,
              textShadow: '0 1px 3px rgba(255,255,255,0.5)',
            }}
          >
            📍 My Location
          </h3>
          <p style={{ fontSize: '12px', color: '#334155', margin: '2px 0 0 0' }}>
            Pick a district or click the map
          </p>
        </div>

        <div>
          <label
            style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 600,
              color: '#1f2937',
              marginBottom: '4px',
            }}
          >
            District
          </label>
          <select
            value={selected.name}
            onChange={(e) => handleDropdownChange(e.target.value)}
            style={{
              width: '100%',
              height: '42px',
              padding: '0 12px',
              border: '1px solid #d1d5db',
              borderRadius: '10px',
              fontSize: '14px',
              color: '#0f172a',
              background: 'rgba(255,255,255,0.92)',
              cursor: 'pointer',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          >
            {districts.map((d) => (
              <option key={`${d.name}-${d.province}`} value={d.name}>
                {d.name} — {d.province}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            background: 'rgba(255,248,225,0.75)',
            borderRadius: '10px',
            padding: '10px 12px',
            fontSize: '12px',
            color: '#334155',
            lineHeight: 1.6,
          }}
        >
          <div>
            <strong>{selected.name}</strong> · {selected.province}
          </div>
          <div>
            {selected.lat.toFixed(3)}, {selected.lng.toFixed(3)}
          </div>
        </div>

        <p style={{ fontSize: '11px', color: '#475569', margin: 0, fontStyle: 'italic' }}>
          Weather, rainfall, and drought alerts use this location.
        </p>
      </div>

      <div
        ref={mapContainerRef}
        style={{
          minHeight: '220px',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid rgba(0,255,136,0.25)',
        }}
      />
    </div>
  )
}
