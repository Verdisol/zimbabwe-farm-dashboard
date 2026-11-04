'use client'

import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import { toast } from 'sonner'

type DroughtMapProps = {
  onSelect: (data: any) => void
}

export default function DroughtMap({ onSelect }: DroughtMapProps) {
  const [geoData, setGeoData] = useState<any>(null)

  useEffect(() => {
    fetch('/data/ZIM_Drought_Master_Final.geojson')
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch(() =>
        toast.error(
          'Failed to load map data. Make sure the GeoJSON file is in public/data/.'
        )
      )
  }, [])

  const getColor = (score: number) => {
    if (score >= 71) return '#ef4444'
    if (score >= 51) return '#f97316'
    if (score >= 31) return '#eab308'
    return '#22c55e'
  }

  const getStyle = (feature: any) => {
    const score = feature?.properties?.Drought_Score || 0
    return {
      fillColor: getColor(score),
      fillOpacity: 0.7,
      color: '#fff',
      weight: 1,
    }
  }

  const onEachFeature = (feature: any, layer: any) => {
    const props = feature.properties
    const score = props.Drought_Score || 0

    layer.bindTooltip(
      `${props.ADM2_NAME || 'District'} (Score: ${score.toFixed(0)})`,
      { sticky: true }
    )

    layer.on({
      click: () => {
        onSelect({
          name: props.ADM2_NAME || props.ADM1_NAME || 'Unknown',
          score: score,
          indices: props,
        })
      },
    })
  }

  if (!geoData) {
    return (
      <div
        style={{
          height: '500px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.4)',
          borderRadius: '16px',
          color: '#334155',
        }}
      >
        Loading satellite drought data...
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'relative',
        height: '500px',
        width: '100%',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 0 15px rgba(0,255,136,0.25)',
        border: '1px solid rgba(0,255,136,0.30)',
        zIndex: 0,
      }}
    >
      <MapContainer
        center={[-19.015, 29.155]}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <GeoJSON
          data={geoData}
          style={getStyle}
          onEachFeature={onEachFeature}
        />
      </MapContainer>

      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(10px)',
          padding: '12px',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          fontSize: '12px',
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: '8px', color: '#0f3d20' }}>
          Drought Score
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#22c55e' }} />
          0–30 (Normal)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#eab308' }} />
          31–50 (Watch)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#f97316' }} />
          51–70 (Alert)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#ef4444' }} />
          71–100 (Severe)
        </div>
      </div>
    </div>
  )
}
