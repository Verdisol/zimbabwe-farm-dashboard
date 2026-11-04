'use client'

import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet'
import { useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

type Props = {
  onDistrictSelect?: (data: any) => void
  onWardSelect?: (ward: any) => void
  height?: string
  showLegend?: boolean
}

function ZoomToFeature({ bounds }: { bounds: L.LatLngBounds | null }) {
  const map = useMap()
  useEffect(() => {
    if (bounds) map.fitBounds(bounds, { padding: [20, 20] })
  }, [bounds, map])
  return null
}

// Try multiple possible field names, return the first non-empty one
function getField(props: any, candidates: string[]): string {
  for (const key of candidates) {
    if (props[key] !== undefined && props[key] !== null && props[key] !== '') {
      return String(props[key])
    }
  }
  return ''
}

const DISTRICT_NAME_FIELDS = [
  'ADM2_NAME', 'ADM2_EN', 'ADM2', 'DISTRICT', 'district', 'DIST_NAME',
  'NAME', 'name', 'DNAME', 'District',
]

const WARD_NAME_FIELDS = [
  'ADM3_NAME', 'ADM3_EN', 'ADM3', 'WARD_NAME', 'WARD', 'ward',
  'NAME', 'name', 'WNAME', 'Ward',
]

const WARD_DISTRICT_FIELDS = [
  'ADM2_NAME', 'ADM2_EN', 'ADM2', 'DISTRICT', 'district',
  'PARENT', 'parent', 'DIST_NAME', 'District',
]

export default function WardMapSelector({
  onDistrictSelect,
  onWardSelect,
  height = '500px',
  showLegend = true,
}: Props) {
  const [districtGeo, setDistrictGeo] = useState<any>(null)
  const [wardGeo, setWardGeo] = useState<any>(null)
  const [droughtLookup, setDroughtLookup] = useState<Record<string, any>>({})
  const [districtNames, setDistrictNames] = useState<string[]>([])
  const [selectedDistrict, setSelectedDistrict] = useState<string>('')
  const [wardOptions, setWardOptions] = useState<any[]>([])
  const [selectedWard, setSelectedWard] = useState<string>('')
  const [zoomBounds, setZoomBounds] = useState<L.LatLngBounds | null>(null)

  // Load all three files
  useEffect(() => {
    // 1. Load districts.json
    fetch('/data/districts.json')
      .then((r) => r.json())
      .then((data) => {
        setDistrictGeo(data)
        const names = (data.features || [])
          .map((f: any) => getField(f.properties, DISTRICT_NAME_FIELDS))
          .filter(Boolean)
        setDistrictNames(Array.from(new Set(names)).sort())
        console.log('✅ Loaded', data.features?.length, 'districts')
      })
      .catch(() => console.log('❌ districts.json not found'))

    // 2. Load zimwards.geojson
    fetch('/data/zimwards.geojson')
      .then((r) => r.json())
      .then((data) => {
        setWardGeo(data)
        console.log('✅ Loaded', data.features?.length, 'wards')
      })
      .catch(() => console.log('❌ zimwards.geojson not found'))

    // 3. Load GEE drought data (optional — for coloring)
    fetch('/data/ZIM_Drought_Master_Final.geojson')
      .then((r) => r.json())
      .then((data) => {
        const lookup: Record<string, any> = {}
        ;(data.features || []).forEach((f: any) => {
          const name = getField(f.properties, DISTRICT_NAME_FIELDS)
          if (name) lookup[name] = f.properties
        })
        setDroughtLookup(lookup)
        console.log('✅ Loaded drought lookup for', Object.keys(lookup).length, 'districts')
      })
      .catch(() => console.log('⚠️ GEE drought file not found — will color all districts uniformly'))
  }, [])

  const getColor = (score: number) => {
    if (score >= 71) return '#ef4444'
    if (score >= 51) return '#f97316'
    if (score >= 31) return '#eab308'
    return '#22c55e'
  }

  const handleDistrictChange = (name: string) => {
    setSelectedDistrict(name)
    setSelectedWard('')

    // Filter wards belonging to this district
    const filtered = (wardGeo?.features || []).filter((f: any) => {
      const wd = getField(f.properties, WARD_DISTRICT_FIELDS)
      return wd === name
    })
    setWardOptions(filtered)

    // Notify parent
    const droughtProps = droughtLookup[name] || {}
    const score = droughtProps.Drought_Score || 0
    if (onDistrictSelect) {
      onDistrictSelect({ name, score, indices: droughtProps })
    }
  }

  const handleWardChange = (wardName: string) => {
    setSelectedWard(wardName)
    const ward = wardOptions.find(
      (f: any) => getField(f.properties, WARD_NAME_FIELDS) === wardName
    )
    if (ward && onWardSelect) onWardSelect(ward)
  }

  if (!districtGeo) {
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
        Loading district data...
      </div>
    )
  }

  const filteredWards = wardOptions.length > 0
    ? ({ type: 'FeatureCollection', features: wardOptions } as any)
    : null

  return (
    <div>
      {/* Dropdowns */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <select
          value={selectedDistrict}
          onChange={(e) => handleDistrictChange(e.target.value)}
          style={{
            flex: 1,
            minWidth: '180px',
            height: '44px',
            padding: '0 12px',
            border: '1px solid #d1d5db',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.92)',
            fontSize: '14px',
          }}
        >
          <option value="">-- Select District ({districtNames.length}) --</option>
          {districtNames.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          value={selectedWard}
          onChange={(e) => handleWardChange(e.target.value)}
          disabled={!selectedDistrict}
          style={{
            flex: 1,
            minWidth: '180px',
            height: '44px',
            padding: '0 12px',
            border: '1px solid #d1d5db',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.92)',
            fontSize: '14px',
          }}
        >
          <option value="">
            {!selectedDistrict
              ? 'Choose district first'
              : wardOptions.length === 0
              ? 'No wards found for this district'
              : `-- Select Ward (${wardOptions.length}) --`}
          </option>
          {wardOptions.map((w: any, i: number) => {
            const name = getField(w.properties, WARD_NAME_FIELDS) || `Ward ${i + 1}`
            return (
              <option key={`${name}-${i}`} value={name}>
                {name}
              </option>
            )
          })}
        </select>
      </div>

      {/* Map */}
      <div
        style={{
          position: 'relative',
          height,
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
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* District layer — colored by drought score if available */}
          <GeoJSON
            data={districtGeo}
            style={(f: any) => {
              const name = getField(f.properties, DISTRICT_NAME_FIELDS)
              const props = droughtLookup[name]
              const score = props?.Drought_Score || 0
              const isSelected = name === selectedDistrict
              return {
                fillColor: props ? getColor(score) : '#94a3b8',
                fillOpacity: isSelected ? 0.9 : 0.65,
                color: isSelected ? '#0f172a' : '#fff',
                weight: isSelected ? 3 : 1,
              }
            }}
            onEachFeature={(feature: any, layer: any) => {
              const name = getField(feature.properties, DISTRICT_NAME_FIELDS)
              const props = droughtLookup[name]
              const score = props?.Drought_Score || 0
              layer.bindTooltip(
                props
                  ? `${name} (Score: ${score.toFixed(0)})`
                  : `${name} (No drought data)`,
                { sticky: true }
              )
              layer.on({
                click: () => {
                  setSelectedDistrict(name)
                  setZoomBounds(layer.getBounds())
                  const filtered = (wardGeo?.features || []).filter((f: any) => {
                    const wd = getField(f.properties, WARD_DISTRICT_FIELDS)
                    return wd === name
                  })
                  setWardOptions(filtered)
                  setSelectedWard('')
                  if (onDistrictSelect) {
                    onDistrictSelect({ name, score, indices: props || {} })
                  }
                },
              })
            }}
          />

          {/* Ward layer — dashed outlines */}
          {filteredWards && (
            <GeoJSON
              key={selectedDistrict}
              data={filteredWards}
              style={{
                fillColor: 'transparent',
                fillOpacity: 0,
                color: '#0f172a',
                weight: 1.5,
                dashArray: '4',
              }}
              onEachFeature={(feature: any, layer: any) => {
                const wardName =
                  getField(feature.properties, WARD_NAME_FIELDS) || 'Ward'
                layer.bindTooltip(wardName, { sticky: true })
                layer.on({
                  click: (e: any) => {
                    L.DomEvent.stopPropagation(e)
                    setSelectedWard(wardName)
                    setZoomBounds(layer.getBounds())
                    if (onWardSelect) onWardSelect(feature)
                  },
                })
              }}
            />
          )}

          <ZoomToFeature bounds={zoomBounds} />
        </MapContainer>

        {showLegend && (
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              background: 'rgba(255,255,255,0.92)',
              padding: '12px',
              borderRadius: '10px',
              zIndex: 1000,
              fontSize: '12px',
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: '6px' }}>Drought Score</div>
            <div>🟢 0–30 Normal</div>
            <div>🟡 31–50 Watch</div>
            <div>🟠 51–70 Alert</div>
            <div>🔴 71–100 Severe</div>
            <div>⚪ No drought data</div>
          </div>
        )}
      </div>
    </div>
  )
}
