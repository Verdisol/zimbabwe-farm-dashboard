'use client'

import { useEffect, useState } from 'react'
import { getSavedLocation, District, districts } from './locationData'
import {
  crops,
  getCropAdvice,
  getZoneFromLocation,
  getNaturalRegion,
  matchVarietyToSeason,
  irrigationAdvice,
  CropRequirement,
  CropVariety,
} from './cropData'

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.20)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  borderRadius: '16px',
  padding: '20px',
  border: '1px solid rgba(0,255,136,0.20)',
  boxShadow: '0 0 15px rgba(0,255,136,0.18)',
}

type MonthlyForecast = {
  month: string
  rainMm: number
}

type SeasonalOutlook = {
  status: 'below-normal' | 'normal' | 'above-normal'
  label: string
  color: string
  icon: string
  anomaly: number
  monthly: MonthlyForecast[]
  source: string
  onsetMonth: string | null
  daysAvailable: number
}

type TerrainInfo = {
  elevation: number
  reliefZone: string
  slopeClass: string
  slopeAdvice: string
}

type PlantingStrategy = {
  headline: string
  plantingWindow: string
  irrigationBridging: string
  varietyAdvice: string
  irrigationNeeded: boolean
  irrigationFrequency: string
}

async function fetchSeasonalOutlook(
  lat: number,
  lng: number
): Promise<SeasonalOutlook | null> {
  try {
    const url =
      `https://seasonal-api.open-meteo.com/v1/seasonal?latitude=${lat}&longitude=${lng}` +
      `&daily=precipitation_sum` +
      `&forecast_days=183` +
      `&timezone=Africa/Harare`

    const res = await fetch(url)
    const data = await res.json()

    const times: string[] = data.daily?.time ?? []
    const rains: number[] = data.daily?.precipitation_sum ?? []

    if (times.length === 0) return null

    const monthTotals = new Map<string, number>()
    times.forEach((t, i) => {
      const key = t.slice(0, 7)
      monthTotals.set(key, (monthTotals.get(key) || 0) + (rains[i] || 0))
    })

    const monthly: MonthlyForecast[] = Array.from(monthTotals.entries()).map(
      ([month, rainMm]) => ({ month, rainMm })
    )

    const avgMonthly =
      monthly.reduce((s, m) => s + m.rainMm, 0) / (monthly.length || 1)

    let status: 'below-normal' | 'normal' | 'above-normal' = 'normal'
    let label = 'Normal'
    let color = '#16803c'
    let icon = '✅'

    if (avgMonthly < 30) {
      status = 'below-normal'
      label = 'Below Normal'
      color = '#dc2626'
      icon = '⚠️'
    } else if (avgMonthly > 90) {
      status = 'above-normal'
      label = 'Above Normal'
      color = '#22c55e'
      icon = '🌧️'
    }

    const rainyMonths = ['11', '12', '01', '02', '03']
    let onsetMonth: string | null = null

    for (const m of monthly) {
      const monthNumber = m.month.slice(5, 7)
      if (!rainyMonths.includes(monthNumber)) continue
      if (m.rainMm >= 40) {
        onsetMonth = m.month
        break
      }
    }

    let daysAvailable = 0
    if (onsetMonth) {
      const onsetDate = new Date(onsetMonth + '-01')
      const year = onsetDate.getFullYear()
      const nextYear = onsetDate.getMonth() >= 10 ? year + 1 : year
      const seasonEnd = new Date(`${nextYear}-04-30`)
      daysAvailable = Math.round(
        (seasonEnd.getTime() - onsetDate.getTime()) / (1000 * 60 * 60 * 24)
      )
    } else {
      daysAvailable = 90
    }

    return {
      status,
      label,
      color,
      icon,
      anomaly: avgMonthly,
      monthly,
      source: 'ECMWF SEAS5 via Open-Meteo Seasonal API',
      onsetMonth,
      daysAvailable,
    }
  } catch {
    return null
  }
}

async function fetchTerrain(
  lat: number,
  lng: number
): Promise<TerrainInfo | null> {
  try {
    const url = `https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lng}`
    const res = await fetch(url)
    const data = await res.json()
    const elevation = data.elevation?.[0] ?? null

    if (elevation === null) return null

    let reliefZone = 'Unknown'
    if (elevation < 900) reliefZone = 'Lowveld'
    else if (elevation < 1200) reliefZone = 'Middleveld'
    else if (elevation < 2000) reliefZone = 'Highveld'
    else reliefZone = 'Eastern Highlands'

    let slopeClass = 'Gentle (0–2%)'
    let slopeAdvice =
      'Terrain is very flat. Excellent for mechanised farming, irrigation, and all crop types.'

    if (reliefZone === 'Middleveld') {
      slopeClass = 'Flat to Moderate (2–5%)'
      slopeAdvice =
        'Gentle slopes. Suitable for most crops. Consider contour ploughing on sloping portions.'
    } else if (reliefZone === 'Highveld') {
      slopeClass = 'Moderate (5–10%)'
      slopeAdvice =
        'Moderate slopes. Contour ploughing and conservation agriculture recommended.'
    } else if (reliefZone === 'Eastern Highlands') {
      slopeClass = 'Steep (>10%)'
      slopeAdvice =
        'Steep terrain. Best for forestry, tea, and orchards. Row cropping is risky.'
    }

    return { elevation, reliefZone, slopeClass, slopeAdvice }
  } catch {
    return null
  }
}

function computePlantingStrategy(
  outlook: SeasonalOutlook | null,
  locationName: string
): PlantingStrategy {
  if (!outlook) {
    return {
      headline: 'Await seasonal forecast',
      plantingWindow: 'Await forecast data to plan planting.',
      irrigationBridging: 'Await forecast data.',
      varietyAdvice: 'Await forecast data.',
      irrigationNeeded: false,
      irrigationFrequency: '',
    }
  }

  const onsetLabel = outlook.onsetMonth
    ? new Date(outlook.onsetMonth + '-01').toLocaleDateString('en', {
        month: 'long',
        year: 'numeric',
      })
    : 'uncertain'

  const isDry = outlook.status === 'below-normal'
  const isWet = outlook.status === 'above-normal'
  const days = outlook.daysAvailable

  let headline = 'Plan for a normal season'
  if (isDry) headline = 'Drought year — plant with irrigation backup'
  if (isWet) headline = 'Good rainfall year — full season available'

  let plantingWindow = ''
  if (outlook.onsetMonth) {
    plantingWindow = `Plant with the first effective rains in ${onsetLabel}. If the onset is delayed, prepare planting basins (15cm × 15cm × 15cm) and pot-hole to capture the first rain.`
  } else {
    plantingWindow = `Onset is uncertain. Prepare planting basins now (15cm × 15cm × 15cm) and plant immediately after any 30mm+ rainfall event.`
  }

  let irrigationBridging = ''
  let irrigationNeeded = false
  let irrigationFrequency = ''

  if (isDry) {
    irrigationNeeded = true
    irrigationFrequency = 'Every 5–7 days'
    irrigationBridging = `Rains are below normal. If you plant and a dry spell exceeds 7 days, irrigate 20–25mm every 5–7 days to keep plants alive. For severe wilting, pot-hole between plants and apply 1–2 litres per plant. Avoid top-dressing nitrogen during drought — it can burn plants.`
  } else if (isWet) {
    irrigationBridging = `Good rainfall expected. No bridging irrigation needed unless a dry spell exceeds 14 days. Focus on drainage in low-lying fields.`
  } else {
    irrigationBridging = `Normal rainfall expected. Monitor 10-day forecasts. If a dry spell exceeds 10 days during flowering, apply supplementary irrigation.`
  }

  let varietyAdvice = ''
  if (isDry) {
    varietyAdvice = `Choose ultra-early or early varieties that flower before the driest months. For maize: SC 449 (90 days) or SC 419 (120 days). For sorghum: Macia (115 days) or SV 2 (110 days).`
  } else if (isWet && days >= 140) {
    varietyAdvice = `Full season available (~${days} days). You can plant late-maturing, high-yielding varieties. For maize: SC 727 (158 days) or SC 719 (150 days).`
  } else {
    varietyAdvice = `Growing window ~${days} days. Choose medium-maturing varieties: SC 633 (140 days) or SC 419 (120 days).`
  }

  return {
    headline,
    plantingWindow,
    irrigationBridging,
    varietyAdvice,
    irrigationNeeded,
    irrigationFrequency,
  }
}

export default function CropAdvisor() {
  const [location, setLocation] = useState<District>(districts[0])
  const [rainfall30d, setRainfall30d] = useState<number | null>(null)
  const [seasonalRainfall, setSeasonalRainfall] = useState<number | null>(null)
  const [droughtStatus, setDroughtStatus] = useState<string>('normal')
  const [outlook, setOutlook] = useState<SeasonalOutlook | null>(null)
  const [terrain, setTerrain] = useState<TerrainInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [openCrop, setOpenCrop] = useState<string | null>(null)
  const [simulator, setSimulator] = useState<number | null>(null)

  useEffect(() => {
    const saved = getSavedLocation()
    if (saved) setLocation(saved)

    const onLocationChange = () => {
      const updated = getSavedLocation()
      if (updated) setLocation(updated)
    }
    window.addEventListener('locationChanged', onLocationChange)
    window.addEventListener('storage', onLocationChange)
    return () => {
      window.removeEventListener('locationChanged', onLocationChange)
      window.removeEventListener('storage', onLocationChange)
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    setSimulator(null)
    setOutlook(null)
    setTerrain(null)

    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lng}` +
        '&daily=precipitation_sum' +
        '&past_days=30&forecast_days=7' +
        '&timezone=Africa/Harare'
    )
      .then((r) => r.json())
      .then((data) => {
        const arr: number[] = data.daily?.precipitation_sum ?? []
        const past30 = arr.slice(0, 30)
        const total30 = past30.reduce((s, v) => s + (v || 0), 0)
        setRainfall30d(total30)
        setSeasonalRainfall(Math.round(total30 * 5))

        if (total30 < 10) setDroughtStatus('drought')
        else setDroughtStatus('normal')
      })
      .catch(() => {
        /* silent */
      })

    fetchSeasonalOutlook(location.lat, location.lng).then((result) => {
      setOutlook(result)
      setLoading(false)
    })

    fetchTerrain(location.lat, location.lng).then(setTerrain)
  }, [location])

  const zone = getZoneFromLocation(location.name)
  const region = getNaturalRegion(zone)
  const effectiveRainfall = simulator ?? seasonalRainfall ?? 0

  const effectiveDroughtStatus =
    effectiveRainfall < 250 ? 'drought' : droughtStatus

  const recommended = getCropAdvice(
    effectiveRainfall,
    effectiveDroughtStatus,
    zone
  )

  const fallbackCrops: CropRequirement[] =
    recommended.length === 0
      ? crops.filter(
          (c) =>
            c.droughtTolerance === 'very-high' || c.droughtTolerance === 'high'
        ).slice(0, 2)
      : []

  const displayedRecommended = recommended.length > 0 ? recommended : fallbackCrops
  const usingFallback = recommended.length === 0 && fallbackCrops.length > 0

  const notRecommended = crops.filter(
    (c) => !displayedRecommended.find((r) => r.name === c.name)
  )

  const strategy = computePlantingStrategy(outlook, location.name)

  if (loading) {
    return (
      <div style={cardStyle}>
        <p style={{ color: '#334155', margin: 0 }}>
          Analysing weather patterns and seasonal outlook for {location.name}...
        </p>
      </div>
    )
  }

  const isDrought = effectiveDroughtStatus === 'drought'
  const daysAvailable = outlook?.daysAvailable ?? 90
  const monthlyRain = outlook?.monthly.map((m) => m.rainMm) ?? []

  const needsIrrigation = displayedRecommended.some(
    (crop) => irrigationAdvice(crop, monthlyRain, zone).needed
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <style>{`
        @keyframes footnoteBlink {
          0%, 100% {
            opacity: 1;
            text-shadow:
              0 0 1px #ffffff,
              0 0 3px #ffffff,
              0 0 6px rgba(255,255,255,0.9),
              0 1px 0 rgba(0,0,0,0.9);
          }
          40% {
            opacity: 0.95;
            text-shadow:
              0 0 6px #ffffff,
              0 0 14px #ffffff,
              0 0 26px rgba(255,255,255,0.85),
              0 1px 0 rgba(0,0,0,0.9);
          }
          55% {
            opacity: 0.55;
            text-shadow:
              0 0 10px #ffffff,
              0 0 22px #ffffff,
              0 0 40px rgba(255,255,255,0.95),
              0 0 60px rgba(255,255,255,0.6),
              0 1px 0 rgba(0,0,0,0.9);
          }
        }
        .blinking-footnote {
          animation: footnoteBlink 1.6s ease-in-out infinite;
        }
      `}</style>

      {/* Terrain */}
      {terrain && (
        <div
          style={{
            ...cardStyle,
            borderLeft: '6px solid #8b5cf6',
            background: 'rgba(139,92,246,0.08)',
          }}
        >
          <h3
            style={{
              fontSize: '15px',
              color: '#4c1d95',
              margin: 0,
              fontWeight: 700,
              textShadow: '0 1px 3px rgba(255,255,255,0.6)',
            }}
          >
            ⛰️ Terrain & Elevation for {location.name}
          </h3>
          <p style={{ fontSize: '12px', color: '#334155', marginTop: '4px' }}>
            Copernicus DEM GLO-90 via Open-Meteo
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '10px',
              marginTop: '14px',
            }}
          >
            <div
              style={{
                background: 'rgba(255,255,255,0.35)',
                padding: '12px',
                borderRadius: '10px',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontSize: '11px',
                  color: '#4c1d95',
                  margin: 0,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                Elevation
              </p>
              <p
                style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  color: '#0f172a',
                  margin: '4px 0 0 0',
                }}
              >
                {terrain.elevation.toFixed(0)} m
              </p>
            </div>

            <div
              style={{
                background: 'rgba(255,255,255,0.35)',
                padding: '12px',
                borderRadius: '10px',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontSize: '11px',
                  color: '#4c1d95',
                  margin: 0,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                Relief Zone
              </p>
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#0f172a',
                  margin: '4px 0 0 0',
                }}
              >
                {terrain.reliefZone}
              </p>
            </div>

            <div
              style={{
                background: 'rgba(255,255,255,0.35)',
                padding: '12px',
                borderRadius: '10px',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontSize: '11px',
                  color: '#4c1d95',
                  margin: 0,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                Slope Class
              </p>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: 800,
                  color: '#0f172a',
                  margin: '4px 0 0 0',
                }}
              >
                {terrain.slopeClass}
              </p>
            </div>
          </div>

          <div
            style={{
              marginTop: '12px',
              background: 'rgba(139,92,246,0.10)',
              border: '1px solid rgba(139,92,246,0.30)',
              padding: '12px',
              borderRadius: '10px',
            }}
          >
            <p
              style={{
                fontSize: '12px',
                color: '#1f2937',
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              <strong>Terrain advice:</strong> {terrain.slopeAdvice}
            </p>
          </div>
        </div>
      )}

      {/* Seasonal Outlook */}
      {outlook && (
        <div
          style={{
            ...cardStyle,
            borderLeft: `6px solid ${outlook.color}`,
            background:
              outlook.status === 'below-normal'
                ? 'rgba(220,38,38,0.10)'
                : outlook.status === 'above-normal'
                ? 'rgba(34,197,94,0.10)'
                : 'rgba(255,255,255,0.20)',
          }}
        >
          <h3
            style={{
              fontSize: '15px',
              color: '#0f3d20',
              margin: 0,
              fontWeight: 700,
              textShadow: '0 1px 3px rgba(255,255,255,0.6)',
            }}
          >
            📅 Seasonal Climate Outlook — Next 6 Months
          </h3>
          <p style={{ fontSize: '12px', color: '#334155', marginTop: '4px' }}>
            {outlook.source}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginTop: '14px',
              padding: '14px',
              background: 'rgba(255,255,255,0.35)',
              borderRadius: '12px',
            }}
          >
            <span style={{ fontSize: '36px' }}>{outlook.icon}</span>
            <div>
              <p
                style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  color: outlook.color,
                  margin: 0,
                }}
              >
                {outlook.label}
              </p>
              <p style={{ fontSize: '12px', color: '#334155', margin: '4px 0 0 0' }}>
                Seasonal rainfall outlook for {location.name}
              </p>
            </div>
          </div>

          <div
            style={{
              marginTop: '12px',
              background: 'rgba(255,248,225,0.75)',
              padding: '12px',
              borderRadius: '10px',
            }}
          >
            <p
              style={{
                fontSize: '11px',
                color: '#7a4a1f',
                margin: 0,
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              Forecast precipitation average
            </p>
            <p
              style={{
                fontSize: '18px',
                fontWeight: 800,
                color: '#0f172a',
                margin: '4px 0 0 0',
              }}
            >
              {outlook.anomaly.toFixed(1)} mm/month
            </p>
          </div>

          {outlook.monthly.length > 0 && (
            <div style={{ marginTop: '14px' }}>
              <p
                style={{
                  fontSize: '11px',
                  color: '#0f3d20',
                  margin: '0 0 8px 0',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Month-by-month projection
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
                  gap: '8px',
                }}
              >
                {outlook.monthly.slice(0, 6).map((m) => {
                  const monthName = new Date(m.month + '-01').toLocaleDateString(
                    'en',
                    { month: 'short', year: '2-digit' }
                  )
                  const isOnset = m.month === outlook.onsetMonth
                  const isDry = m.rainMm < 40
                  return (
                    <div
                      key={m.month}
                      style={{
                        background: isOnset
                          ? 'rgba(0,255,136,0.25)'
                          : isDry
                          ? 'rgba(220,38,38,0.10)'
                          : 'rgba(255,255,255,0.35)',
                        padding: '10px',
                        borderRadius: '10px',
                        textAlign: 'center',
                        border: isOnset
                          ? '2px solid rgba(0,255,136,0.65)'
                          : isDry
                          ? '1px solid rgba(220,38,38,0.35)'
                          : '1px solid rgba(0,255,136,0.20)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '11px',
                          color: '#334155',
                          fontWeight: 600,
                        }}
                      >
                        {monthName}
                        {isOnset && ' 🌱'}
                      </div>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: 800,
                          color: isDry ? '#dc2626' : '#0f172a',
                          marginTop: '4px',
                        }}
                      >
                        {m.rainMm.toFixed(0)}
                      </div>
                      <div style={{ fontSize: '10px', color: '#475569' }}>mm</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Planting Strategy */}
      <div
        style={{
          ...cardStyle,
          borderLeft: '6px solid #f59e0b',
          background: 'rgba(245,158,11,0.08)',
        }}
      >
        <h3
          style={{
            fontSize: '15px',
            color: '#78350f',
            margin: 0,
            fontWeight: 700,
            textShadow: '0 1px 3px rgba(255,255,255,0.6)',
          }}
        >
          🌱 Planting Strategy for {location.name}
        </h3>
        <p style={{ fontSize: '12px', color: '#334155', marginTop: '4px' }}>
          Based on the seasonal forecast — what to do now, and what to do if rains are delayed
        </p>

        <div
          style={{
            marginTop: '14px',
            background: 'rgba(255,255,255,0.45)',
            border: '1px solid rgba(245,158,11,0.35)',
            padding: '14px',
            borderRadius: '12px',
          }}
        >
          <p
            style={{
              fontSize: '14px',
              fontWeight: 800,
              color: '#78350f',
              margin: 0,
            }}
          >
            {strategy.headline}
          </p>
        </div>

        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div
            style={{
              background: 'rgba(255,248,225,0.75)',
              padding: '12px',
              borderRadius: '10px',
            }}
          >
            <p
              style={{
                fontSize: '11px',
                color: '#7a4a1f',
                margin: 0,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              📅 Planting window
            </p>
            <p
              style={{
                fontSize: '13px',
                color: '#1f2937',
                margin: '6px 0 0 0',
                lineHeight: 1.6,
              }}
            >
              {strategy.plantingWindow}
            </p>
          </div>

          <div
            style={{
              background: strategy.irrigationNeeded
                ? 'rgba(14,165,233,0.12)'
                : 'rgba(0,255,136,0.08)',
              border: strategy.irrigationNeeded
                ? '1px solid rgba(14,165,233,0.40)'
                : '1px solid rgba(0,255,136,0.30)',
              padding: '12px',
              borderRadius: '10px',
            }}
          >
            <p
              style={{
                fontSize: '11px',
                color: strategy.irrigationNeeded ? '#0c4a6e' : '#0f3d20',
                margin: 0,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              💧 Bridging irrigation
            </p>
            <p
              style={{
                fontSize: '13px',
                color: '#1f2937',
                margin: '6px 0 0 0',
                lineHeight: 1.6,
              }}
            >
              {strategy.irrigationBridging}
            </p>
            {strategy.irrigationFrequency && (
              <p
                style={{
                  fontSize: '12px',
                  color: '#0c4a6e',
                  margin: '6px 0 0 0',
                  fontWeight: 700,
                }}
              >
                Frequency: {strategy.irrigationFrequency}
              </p>
            )}
          </div>

          <div
            style={{
              background: 'rgba(0,255,136,0.08)',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid rgba(0,255,136,0.30)',
            }}
          >
            <p
              style={{
                fontSize: '11px',
                color: '#0f3d20',
                margin: 0,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              🌾 Variety advice
            </p>
            <p
              style={{
                fontSize: '13px',
                color: '#1f2937',
                margin: '6px 0 0 0',
                lineHeight: 1.6,
              }}
            >
              {strategy.varietyAdvice}
            </p>
          </div>
        </div>
      </div>

      {/* Irrigation Advisory */}
      {needsIrrigation && (
        <div
          style={{
            ...cardStyle,
            borderLeft: '6px solid #0ea5e9',
            background: 'rgba(14,165,233,0.10)',
          }}
        >
          <h3
            style={{
              fontSize: '15px',
              color: '#0c4a6e',
              margin: 0,
              fontWeight: 700,
              textShadow: '0 1px 3px rgba(255,255,255,0.6)',
            }}
          >
            💧 Irrigation Advisory
          </h3>
          <p
            style={{
              fontSize: '13px',
              color: '#1f2937',
              margin: '8px 0 0 0',
              lineHeight: 1.6,
            }}
          >
            Dry spells or low-rainfall conditions are expected during the season.
            Supplementary irrigation is recommended for the crops below.
          </p>
        </div>
      )}

      {/* Header + summary */}
      <div style={cardStyle}>
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#0f3d20',
            margin: 0,
            textShadow: '0 1px 3px rgba(255,255,255,0.6)',
          }}
        >
          🌾 Crop Advisory for {location.name}
        </h2>
        <p style={{ fontSize: '13px', color: '#334155', marginTop: '6px' }}>
          Based on recent rainfall patterns, seasonal outlook, and agro-ecological zone{' '}
          {zone}
        </p>

        <div
          style={{
            marginTop: '14px',
            background: 'rgba(0,255,136,0.10)',
            border: '1px solid rgba(0,255,136,0.35)',
            padding: '14px',
            borderRadius: '12px',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              color: '#0f3d20',
              margin: 0,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {region.name} · Zimbabwe Agro-Ecological Zone
          </p>
          <p
            style={{
              fontSize: '13px',
              color: '#1f2937',
              margin: '6px 0 0 0',
              fontWeight: 600,
            }}
          >
            Annual rainfall: {region.rainfall}
          </p>
          <p
            style={{
              fontSize: '12px',
              color: '#334155',
              margin: '4px 0 0 0',
              lineHeight: 1.6,
            }}
          >
            <strong>Soils:</strong> {region.soils}
          </p>
          <p
            style={{
              fontSize: '12px',
              color: '#334155',
              margin: '2px 0 0 0',
              lineHeight: 1.6,
            }}
          >
            <strong>Main crops:</strong> {region.mainCrops}
          </p>
          <p
            style={{
              fontSize: '12px',
              color: '#334155',
              margin: '2px 0 0 0',
              lineHeight: 1.6,
            }}
          >
            <strong>Climate resilience:</strong>{' '}
            <span
              style={{
                color:
                  region.resilience === 'High'
                    ? '#16803c'
                    : region.resilience === 'Medium'
                    ? '#f59e0b'
                    : '#dc2626',
                fontWeight: 700,
              }}
            >
              {region.resilience}
            </span>
          </p>
          <p
            style={{
              fontSize: '12px',
              color: '#475569',
              margin: '8px 0 0 0',
              lineHeight: 1.6,
              fontStyle: 'italic',
            }}
          >
            {region.description}
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '10px',
            marginTop: '14px',
          }}
        >
          <div
            style={{
              background: 'rgba(255,248,225,0.75)',
              padding: '12px',
              borderRadius: '10px',
            }}
          >
            <p
              style={{
                fontSize: '11px',
                color: '#7a4a1f',
                margin: 0,
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              Rainfall (past 30 days)
            </p>
            <p
              style={{
                fontSize: '20px',
                fontWeight: 800,
                color: '#0f172a',
                margin: '4px 0 0 0',
              }}
            >
              {rainfall30d?.toFixed(1)} mm
            </p>
          </div>

          <div
            style={{
              background: 'rgba(255,248,225,0.75)',
              padding: '12px',
              borderRadius: '10px',
            }}
          >
            <p
              style={{
                fontSize: '11px',
                color: '#7a4a1f',
                margin: 0,
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              Est. seasonal rainfall
            </p>
            <p
              style={{
                fontSize: '20px',
                fontWeight: 800,
                color: '#0f172a',
                margin: '4px 0 0 0',
              }}
            >
              {effectiveRainfall} mm
            </p>
          </div>

          <div
            style={{
              background: 'rgba(255,248,225,0.75)',
              padding: '12px',
              borderRadius: '10px',
            }}
          >
            <p
              style={{
                fontSize: '11px',
                color: '#7a4a1f',
                margin: 0,
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              Growing window
            </p>
            <p
              style={{
                fontSize: '20px',
                fontWeight: 800,
                color: '#0f172a',
                margin: '4px 0 0 0',
              }}
            >
              ~{daysAvailable} days
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: '16px',
            background: 'rgba(255,255,255,0.35)',
            padding: '14px',
            borderRadius: '10px',
          }}
        >
          <label
            style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 700,
              color: '#0f3d20',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            🔧 Simulate seasonal rainfall (for demonstration)
          </label>
          <input
            type="range"
            min="0"
            max="1200"
            step="10"
            value={effectiveRainfall}
            onChange={(e) => setSimulator(parseInt(e.target.value, 10))}
            style={{ width: '100%', accentColor: '#16803c' }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: '#334155',
              marginTop: '4px',
              fontWeight: 600,
            }}
          >
            <span>0 mm</span>
            <span style={{ color: '#16803c', fontSize: '14px' }}>
              {effectiveRainfall} mm season
            </span>
            <span>1200 mm</span>
          </div>
          {simulator !== null && (
            <button
              onClick={() => setSimulator(null)}
              style={{
                marginTop: '8px',
                padding: '6px 12px',
                background: 'transparent',
                color: '#16803c',
                border: '1px solid #16803c',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Reset to live data
            </button>
          )}
        </div>

        {isDrought && (
          <div
            style={{
              marginTop: '14px',
              background: 'rgba(220,38,38,0.12)',
              border: '1px solid rgba(220,38,38,0.35)',
              padding: '12px',
              borderRadius: '10px',
              color: '#7f1d1d',
              fontSize: '13px',
              lineHeight: 1.6,
            }}
          >
            ⚠️ <strong>Drought conditions detected.</strong> See the Planting Strategy
            above for bridging irrigation advice. Only drought-tolerant crops are
            shown below.
          </div>
        )}
      </div>

      {/* Recommended */}
      <div style={cardStyle}>
        <h3
          style={{
            fontSize: '16px',
            color: '#0f3d20',
            margin: 0,
            fontWeight: 700,
            textShadow: '0 1px 3px rgba(255,255,255,0.6)',
          }}
        >
          {usingFallback ? '💡 Best Alternative Crops' : '✅ Recommended Crops'} (
          {displayedRecommended.length})
        </h3>
        <p style={{ fontSize: '12px', color: '#334155', marginTop: '4px' }}>
          Click any crop to see matching varieties, irrigation advice, and step-by-step
          guidance
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '12px',
            marginTop: '14px',
          }}
        >
          {displayedRecommended.map((crop) => (
            <CropCard
              key={crop.name}
              crop={crop}
              daysAvailable={daysAvailable}
              monthlyRain={monthlyRain}
              zone={zone}
              isOpen={openCrop === crop.name}
              onToggle={() =>
                setOpenCrop(openCrop === crop.name ? null : crop.name)
              }
            />
          ))}
        </div>
      </div>

      {/* Not recommended */}
      {notRecommended.length > 0 && (
        <div style={cardStyle}>
          <h3
            style={{
              fontSize: '16px',
              color: '#7f1d1d',
              margin: 0,
              fontWeight: 700,
              textShadow: '0 1px 3px rgba(255,255,255,0.6)',
            }}
          >
            ⚠️ Not Recommended For This Location ({notRecommended.length})
          </h3>
          <p style={{ fontSize: '12px', color: '#334155', marginTop: '4px' }}>
            These crops require more rainfall than the current scenario allows
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginTop: '12px',
            }}
          >
            {notRecommended.map((c) => (
              <span
                key={c.name}
                style={{
                  background: 'rgba(220,38,38,0.15)',
                  border: '1px solid rgba(220,38,38,0.35)',
                  color: '#7f1d1d',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                {c.name} — needs {c.minRainfall}+ mm
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Blinking footnote */}
      <p
        className="blinking-footnote"
        style={{
          fontSize: '12px',
          color: '#0f172a',
          textAlign: 'center',
          fontStyle: 'italic',
          margin: 0,
          fontWeight: 600,
          letterSpacing: '0.3px',
        }}
      >
        Advisory based on Zimbabwe Natural Regions (NR I–V), FAO crop water
        requirements, ECMWF SEAS5 seasonal forecasts, Copernicus DEM terrain data, and
        variety maturity data from Seed Co, DR&SS and ICRISAT. Sources: Farmonaut
        (2026), AGRITEX Zimbabwe, MSD Zimbabwe.
      </p>
    </div>
  )
}

function CropCard({
  crop,
  daysAvailable,
  monthlyRain,
  zone,
  isOpen,
  onToggle,
}: {
  crop: CropRequirement
  daysAvailable: number
  monthlyRain: number[]
  zone: 'I' | 'II' | 'III' | 'IV' | 'V'
  isOpen: boolean
  onToggle: () => void
}) {
  const toleranceColor: Record<string, string> = {
    low: '#dc2626',
    medium: '#f59e0b',
    high: '#22c55e',
    'very-high': '#16803c',
  }

  const matchingVarieties: CropVariety[] = matchVarietyToSeason(crop, daysAvailable)
  const irrigation = irrigationAdvice(crop, monthlyRain, zone)

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.25)',
        borderRadius: '12px',
        border: '1px solid rgba(0,255,136,0.25)',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '14px',
          background: 'transparent',
          border: 'none',
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '15px',
              fontWeight: 700,
              color: '#0f3d20',
            }}
          >
            {crop.name}
          </div>
          <div
            style={{
              fontSize: '11px',
              color: '#334155',
              marginTop: '4px',
            }}
          >
            Needs {crop.minRainfall}–{crop.maxRainfall} mm ·{' '}
            {matchingVarieties.length} matching varieties
          </div>
          <div
            style={{
              fontSize: '10px',
              marginTop: '6px',
              color: toleranceColor[crop.droughtTolerance],
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            Drought tolerance: {crop.droughtTolerance}
          </div>
        </div>
        <span style={{ fontSize: '18px', color: '#16803c' }}>
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {isOpen && (
        <div
          style={{
            padding: '0 14px 14px 14px',
            borderTop: '1px solid rgba(0,255,136,0.15)',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              color: '#334155',
              lineHeight: 1.6,
              marginTop: '10px',
              fontStyle: 'italic',
            }}
          >
            {crop.description}
          </p>

          <div
            style={{
              marginTop: '12px',
              background: irrigation.needed
                ? 'rgba(14,165,233,0.12)'
                : 'rgba(0,255,136,0.08)',
              border: irrigation.needed
                ? '1px solid rgba(14,165,233,0.40)'
                : '1px solid rgba(0,255,136,0.30)',
              padding: '10px 12px',
              borderRadius: '10px',
            }}
          >
            <p
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: irrigation.needed ? '#0c4a6e' : '#0f3d20',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              💧 Water requirement
            </p>
            <p
              style={{
                fontSize: '12px',
                color: '#1f2937',
                margin: '6px 0 0 0',
                lineHeight: 1.6,
              }}
            >
              {irrigation.message}
            </p>
          </div>

          {matchingVarieties.length > 0 && (
            <>
              <h4
                style={{
                  fontSize: '12px',
                  color: '#0f3d20',
                  margin: '14px 0 8px 0',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                🌱 Varieties that fit your {daysAvailable}-day window
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {matchingVarieties.map((v) => (
                  <div
                    key={v.name}
                    style={{
                      background: 'rgba(0,255,136,0.10)',
                      border: '1px solid rgba(0,255,136,0.35)',
                      padding: '10px 12px',
                      borderRadius: '10px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#0f3d20',
                      }}
                    >
                      {v.name}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: '#334155',
                        marginTop: '2px',
                        fontWeight: 600,
                      }}
                    >
                      {v.maturityDays} days · {v.maturityClass} · drought tolerance:{' '}
                      {v.droughtTolerance}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: '#1f2937',
                        marginTop: '6px',
                        lineHeight: 1.5,
                      }}
                    >
                      {v.note}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: '#16803c',
                        marginTop: '4px',
                        fontWeight: 600,
                      }}
                    >
                      Yield potential: {v.yieldPotential}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {matchingVarieties.length === 0 && crop.varieties.length > 0 && (
            <div
              style={{
                marginTop: '12px',
                background: 'rgba(220,38,38,0.10)',
                border: '1px solid rgba(220,38,38,0.35)',
                padding: '10px 12px',
                borderRadius: '10px',
                fontSize: '12px',
                color: '#7f1d1d',
                lineHeight: 1.6,
              }}
            >
              ⚠️ None of the listed varieties fit in a {daysAvailable}-day growing
              window.
            </div>
          )}

          {crop.varieties.length === 0 && (
            <div
              style={{
                marginTop: '12px',
                background: 'rgba(255,248,225,0.75)',
                padding: '10px 12px',
                borderRadius: '10px',
                fontSize: '12px',
                color: '#7a4a1f',
                lineHeight: 1.6,
              }}
            >
              ℹ️ Variety data not yet available for this crop.
            </div>
          )}

          <h4
            style={{
              fontSize: '12px',
              color: '#0f3d20',
              margin: '14px 0 8px 0',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Step-by-step growing guide
          </h4>

          <ol
            style={{
              fontSize: '12px',
              color: '#1f2937',
              lineHeight: 1.8,
              paddingLeft: '20px',
              margin: 0,
            }}
          >
            {crop.plantingSteps.map((step, i) => (
              <li key={i} style={{ marginBottom: '4px' }}>
                {step}
              </li>
            ))}
          </ol>

          <div
            style={{
              marginTop: '12px',
              fontSize: '11px',
              color: '#16803c',
              fontWeight: 600,
            }}
          >
            Best regions: {crop.bestRegions.join(', ')}
          </div>
        </div>
      )}
    </div>
  )
}
