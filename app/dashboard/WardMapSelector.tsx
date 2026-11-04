'use client'

import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet'
import { useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import { toast } from 'sonner'
import L from 'leaflet'

type WardMapSelectorProps = {
  onDistrictSelect?: (data: any) => void
  onWardSelect?: (ward: any) => void
  height?: string
  showLegend?: boolean
}

// Auto-zoom helper
function ZoomToFeature({ bounds }: { bounds: L.LatLngBounds | null }) {
  const map = useMap()
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [20, 20] })
    }
  }, [bounds, map])
  return null
}

export default function WardMapSelector({
  onDistrictSelect,
  onWardSelect,
  height = '500px',
  showLegend = true,
}: WardMapSelectorProps) {
  const [geoData, setGeoData] = useState<any>(null)
  const [wardData, setWardData] = useState<any>(null)
  const [selectedDistrictName, setSelectedDistrictName] = useState<string | null>(null)
  const [selectedWardName, setSelectedWardName] = useState<string | null>(null)
  const [zoomBounds, setZoomBounds] = useState<L.LatLngBounds | null>(null)

  // Load districts
  useEffect(() => {
    fetch('/data/ZIM_Drought_Master_Final.geojson')
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch(() => toast.error('Failed to load district data. Check public/data/ZIM_Drought_Master_Final.geojson'))
  }, [])

  // Load wards (optional)
  useEffect(() => {
    fetch('/data/wards.geojson')
      .then((res) => res.json())
      .then((data) => {
        setWardData(data)
        console.log('✅ Wards loaded:', data.features?.length || 0, 'features')
        if (data.features?.length > 0) {
          console.log('Ward properties sample:', Object.keys(data.features[0].properties))
        }
      })
      .catch(() => {
        console.log('ℹ️ Ward file not found at /data/wards.geojson — will show districts only.')
      })
  }, [])

  const getColor = (score: number) => {
    if (score >= 71) return '#ef4444'
    if (score >= 51) return '#f97316'
    if (score >= 31) return '#eab308'
    return '#22c55e'
  }

  // Helper: get district name from properties (try multiple field names)
  const getDistrictName = (props: any) =>
    props.ADM2_NAME || props.DISTRICT || props.district || 'Unknown'

  // Helper: get ward name from properties
  const getWardName = (props: any) =>
    props.ADM3_NAME || props.WARD_NAME || props.NAME || props.name || 'Ward'

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
    const districtName = getDistrictName(props)

    layer.bindTooltip(`${districtName} (Score: ${score.toFixed(0)})`, { sticky: true })

    layer.on({
      click: () => {
        setSelectedDistrictName(districtName)
        setSelectedWardName(null)
        setZoomBounds(layer.getBounds())
        if (onDistrictSelect) {
          onDistrictSelect({
            name: districtName,
            score: score,
            indices: props,
          })
        }
      },
    })
  }

  // Filter wards of the selected district
  const filteredWards: any[] = wardData?.features?.filter((f: any) => {
    const wardDistrict = f.properties.ADM2_NAME || f.properties.DISTRICT || f.properties.district
    return wardDistrict === selectedDistrictName
  }) || []

  const wardGeoJson = filteredWards.length > 0
    ? ({ type: 'FeatureCollection', features: filteredWards } as any)
    : null

  if (!geoData) {
    return (
      <div
        style={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.4)',
          borderRadius: '16px',
          color: '#334155',
        }}
      >
        Loading map data...
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', height, width: '100%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 0 15px rgba(0,255,136,0.25)', border: '1px solid rgba(0,255,136,0.30)', zIndex: 0 }}>
      <MapContainer center={[-19.015, 29.155]} zoom={6} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        <GeoJSON data={geoData} style={getStyle} onEachFeature={onEachFeature} />

        {wardGeoJson && (
          <GeoJSON
            key={selectedDistrictName}
            data={wardGeoJson}
            style={{
              fillColor: 'transparent',
              fillOpacity: 0,
              weight: 2,
              color: '#0f172a',
              dashArray: '4',
            }}
            onEachFeature={(feature: any, layer: any) => {
              const wardName = getWardName(feature.properties)
              layer.bindTooltip(wardName, { sticky: true })
              layer.on({
                click: (e: any) => {
                  L.DomEvent.stopPropagation(e)
                  setSelectedWardName(wardName)
                  setZoomBounds(layer.getBounds())
                  if (onWardSelect) onWardSelect({ ...feature.properties, name: wardName })
                },
              })
            }}
          />
        )}

        <ZoomToFeature bounds={zoomBounds} />
      </MapContainer>

      {/* Legend */}
      {showLegend && (
        <div style={{ position: 'absolute', bottom: '16px', right: '16px', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)', padding: '12px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 1000, fontSize: '12px' }}>
          <div style={{ fontWeight: 700, marginBottom: '8px', color: '#0f3d20' }}>Drought Score</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#22c55e' }} />0–30 (Normal)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#eab308' }} />31–50 (Watch)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#f97316' }} />51–70 (Alert)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#ef4444' }} />71–100 (Severe)</div>
        </div>
      )}

      {/* Selection badge */}
      {selectedDistrictName && (
        <div style={{ position: 'absolute', top: '16px', left: '16px', background: '#16803c', color: 'white', padding: '8px 14px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}>
          📍 {selectedDistrictName}
          {selectedWardName && ` → ${selectedWardName}`}
        </div>
      )}
    </div>
  )
}
