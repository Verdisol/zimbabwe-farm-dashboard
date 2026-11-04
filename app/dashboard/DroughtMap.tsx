'use client'

import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet'
import { useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import { toast } from 'sonner'
import L from 'leaflet'

type DroughtMapProps = {
  onSelect: (data: any) => void
}

// Helper component to zoom to a selected district
function ZoomToFeature({ bounds }: { bounds: L.LatLngBounds | null }) {
  const map = useMap()
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [20, 20] })
    }
  }, [bounds, map])
  return null
}

export default function DroughtMap({ onSelect }: DroughtMapProps) {
  const [geoData, setGeoData] = useState<any>(null)
  const [wardData, setWardData] = useState<any>(null)
  const [selectedDistrictName, setSelectedDistrictName] = useState<string | null>(null)
  const [zoomBounds, setZoomBounds] = useState<L.LatLngBounds | null>(null)

  // Load District GeoJSON
  useEffect(() => {
    fetch('/data/ZIM_Drought_Master_Final.geojson')
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch(() => toast.error('Failed to load district data.'))
  }, [])

  // Load Ward GeoJSON (optional — will not crash if missing)
  useEffect(() => {
    fetch('/data/wards.geojson')
      .then((res) => res.json())
      .then((data) => setWardData(data))
      .catch(() => {
        console.log('Wards file not found. Upload wards.geojson to public/data/ if you want ward boundaries.')
      })
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
    const districtName = props.ADM2_NAME || props.ADM1_NAME || 'Unknown'

    layer.bindTooltip(
      `${districtName} (Score: ${score.toFixed(0)})`,
      { sticky: true }
    )

    layer.on({
      click: () => {
        setSelectedDistrictName(districtName)
        setZoomBounds(layer.getBounds())
        onSelect({
          name: districtName,
          score: score,
          indices: props,
        })
      },
    })
  }

  // Filter wards that belong to the selected district
  const filteredWards: any[] = wardData?.features?.filter((f: any) => {
    return f.properties.ADM2_NAME === selectedDistrictName
  }) || []

  // Cast the ward GeoJSON into the format react-leaflet accepts
  const wardGeoJson = filteredWards.length > 0
    ? ({
        type: 'FeatureCollection',
        features: filteredWards,
      } as any)
    : null

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
        Loading satellite data...
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

        {/* District Layer */}
        <GeoJSON data={geoData} style={getStyle} onEachFeature={onEachFeature} />

        {/* Ward Layer — only when a district is selected */}
        {wardGeoJson && (
          <GeoJSON
            key={selectedDistrictName}
            data={wardGeoJson}
            style={{
              fillColor: 'transparent',
              fillOpacity: 0,
              weight: 1,
              color: '#0f172a',
              dashArray: '3',
            }}
            onEachFeature={(feature, layer) => {
              const wardName =
                feature.properties.ADM3_NAME ||
                feature.properties.WARD_NAME ||
                'Ward'
              layer.bindTooltip(wardName, { sticky: true })
            }}
          />
        )}

        <ZoomToFeature bounds={zoomBounds} />
      </MapContainer>

      {/* Legend */}
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
