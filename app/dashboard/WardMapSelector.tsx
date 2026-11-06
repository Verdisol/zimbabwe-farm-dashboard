'use client'

import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'

export default function WardMapSelector({
  height = '500px',
  showLegend = true,
}: {
  height?: string
  showLegend?: boolean
}) {
  const [districtGeo, setDistrictGeo] = useState<any>(null)
  const [droughtLookup, setDroughtLookup] = useState<Record<string, any>>({})

  useEffect(() => {
    fetch('/data/districts.json')
      .then((r) => r.json())
      .then((data) => setDistrictGeo(data))
      .catch((err) => console.log('❌ districts.json failed:', err.message))

    fetch('/data/ZIM_Drought_Master_Final.geojson')
      .then((r) => r.json())
      .then((data) => {
        const lookup: Record<string, any> = {}
        ;(data.features || []).forEach((f: any) => {
          const name = f.properties.admin2Name || f.properties.ADM2_NAME || f.properties.DISTNAME
          if (name) lookup[name] = f.properties
        })
        setDroughtLookup(lookup)
      })
      .catch(() => console.log('⚠️ GEE drought file not found'))
  }, [])

  const getColor = (score: number) => {
    if (score >= 71) return '#ef4444'
    if (score >= 51) return '#f97316'
    if (score >= 31) return '#eab308'
    return '#22c55e'
  }

  if (!districtGeo) {
    return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.4)', borderRadius: '16px', color: '#334155' }}>Loading map...</div>
  }

  return (
    <div style={{ position: 'relative', height, width: '100%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 0 15px rgba(0,255,136,0.25)', border: '1px solid rgba(0,255,136,0.30)', zIndex: 1 }}>
      <MapContainer center={[-19.015, 29.155]} zoom={6} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <GeoJSON
          data={districtGeo}
          style={(f: any) => {
            const name = f.properties.admin2Name || f.properties.ADM2_NAME || f.properties.DISTNAME
            const props = droughtLookup[name]
            const score = props?.Drought_Score || 0
            return {
              fillColor: props ? getColor(score) : '#94a3b8',
              fillOpacity: 0.65,
              color: '#fff',
              weight: 1,
            }
          }}
          onEachFeature={(feature: any, layer: any) => {
            const name = feature.properties.admin2Name || feature.properties.ADM2_NAME || feature.properties.DISTNAME || 'District'
            const props = droughtLookup[name]
            const score = props?.Drought_Score || 0
            layer.bindTooltip(props ? `${name} (Score: ${score.toFixed(0)})` : `${name}`, { sticky: true })
          }}
        />
      </MapContainer>

      {showLegend && (
        <div style={{ position: 'absolute', bottom: '16px', right: '16px', background: 'rgba(255,255,255,0.95)', padding: '12px', borderRadius: '10px', zIndex: 1000, fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
          <div style={{ fontWeight: 700, marginBottom: '6px' }}>Drought Score</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#22c55e' }} /> 0–30 Normal</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#eab308' }} /> 31–50 Watch</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#f97316' }} /> 51–70 Alert</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#ef4444' }} /> 71–100 Severe</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#94a3b8' }} /> No data</div>
        </div>
      )}
    </div>
  )
}
