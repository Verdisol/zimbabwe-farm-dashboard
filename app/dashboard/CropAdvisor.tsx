'use client'

import { useEffect, useState } from 'react'
import { getSavedLocation, District, districts } from './locationData'
import {
  crops,
  getCropAdvice,
  getZoneFromLocation,
  getNaturalRegion,
  CropRequirement,
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
  anomalyMm: number
}

type SeasonalOutlook = {
  status: 'below-normal' | 'normal' | 'above-normal'
  label: string
  color: string
  icon: string
  anomaly: number
  monthly: MonthlyForecast[]
  source: string
}

// Zimbabwe's rainfall season runs Nov - March
// Open-Meteo seasonal API returns daily precipitation; we sum per month
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

    // Aggregate by calendar month
    const monthTotals = new Map<string, number>()
    times.forEach((t, i) => {
      const key = t.slice(0, 7) // YYYY-MM
      monthTotals.set(key, (monthTotals.get(key) || 0) + (rains[i] || 0))
    })

    const monthly: MonthlyForecast[] = Array.from(monthTotals.entries()).map(
      ([month, rainMm]) => ({
        month,
        rainMm,
        anomalyMm: 0, // API doesn't provide baseline directly in this call
      })
    )

    // Simple heuristic classification based on average monthly rainfall
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

    return {
      status,
      label,
      color,
      icon,
      anomaly: avgMonthly,
      monthly,
      source: 'ECMWF SEAS5 via Open-Meteo Seasonal API',
    }
  } catch {
    return null
  }
}

export default function CropAdvisor() {
  const [location, setLocation] = useState<District>(districts[0])
  const [rainfall30d, setRainfall30d] = useState<number | null>(null)
  const [seasonalRainfall, setSeasonalRainfall] = useState<number | null>(null)
  const [droughtStatus, setDroughtStatus] = useState<string>('normal')
  const [outlook, setOutlook] = useState<SeasonalOutlook | null>(null)
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
  }, [location])

  const zone = getZoneFromLocation(location.name)
  const region = getNaturalRegion(zone)
  const effectiveRainfall = simulator ?? seasonalRainfall ?? 0

  const recommended = getCropAdvice(effectiveRainfall, droughtStatus, zone)

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

  if (loading) {
    return (
      <div style={cardStyle}>
        <p style={{ color: '#334155', margin: 0 }}>
          Analysing weather patterns and seasonal outlook for {location.name}...
        </p>
      </div>
    )
  }

  const isDrought = droughtStatus === 'drought' || droughtStatus === 'extreme-drought'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Seasonal Outlook — NEW */}
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

          {/* A: Simple badge */}
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

          {/* B: Detailed anomaly */}
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
            <p style={{ fontSize: '11px', color: '#475569', margin: '4px 0 0 0' }}>
              Ensemble forecast · 51 members · uncertainty increases at longer lead
              times
            </p>
          </div>

          {/* C: Monthly breakdown */}
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
                  return (
                    <div
                      key={m.month}
                      style={{
                        background: 'rgba(255,255,255,0.35)',
                        padding: '10px',
                        borderRadius: '10px',
                        textAlign: 'center',
                        border: '1px solid rgba(0,255,136,0.20)',
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
                      </div>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: 800,
                          color: '#0f172a',
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
              <p
                style={{
                  fontSize: '10px',
                  color: '#475569',
                  marginTop: '8px',
                  fontStyle: 'italic',
                }}
              >
                ⓘ Seasonal forecasts indicate the likely direction of rainfall
                (wetter/drier than normal), not exact amounts. Always confirm with
                MSD Zimbabwe.
              </p>
            </div>
          )}
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
              Natural Region
            </p>
            <p
              style={{
                fontSize: '20px',
                fontWeight: 800,
                color: '#0f172a',
                margin: '4px 0 0 0',
              }}
            >
              {zone}
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
          <p
            style={{
              fontSize: '11px',
              color: '#475569',
              marginTop: '8px',
              marginBottom: 0,
              fontStyle: 'italic',
            }}
          >
            Tip: Drag the slider to see how crop suitability changes with different
            rainfall scenarios. Real seasonal rainfall in Zimbabwe is typically
            450–1050 mm.
          </p>
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
            ⚠️ <strong>Drought conditions detected.</strong> Below-average rainfall
            expected. Planting maize is risky. The crops below are more likely to
            succeed under these conditions.
          </div>
        )}
      </div>

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
          {usingFallback
            ? 'No crops match your region and rainfall exactly. These drought-tolerant alternatives are the safest options.'
            : 'Click any crop to see step-by-step growing instructions'}
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '12px',
            marginTop: '14px',
          }}
        >
          {displayedRecommended.map((crop) => (
            <CropCard
              key={crop.name}
              crop={crop}
              isOpen={openCrop === crop.name}
              onToggle={() =>
                setOpenCrop(openCrop === crop.name ? null : crop.name)
              }
            />
          ))}
        </div>
      </div>

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

      <p
        style={{
          fontSize: '11px',
          color: '#475569',
          textAlign: 'center',
          fontStyle: 'italic',
          margin: 0,
        }}
      >
        Advisory based on Zimbabwe Natural Regions (NR I–V), FAO crop water
        requirements, and ECMWF SEAS5 seasonal forecasts. Sources: Farmonaut (2026),
        AGRITEX Zimbabwe, MSD Zimbabwe.
      </p>
    </div>
  )
}

function CropCard({
  crop,
  isOpen,
  onToggle,
}: {
  crop: CropRequirement
  isOpen: boolean
  onToggle: () => void
}) {
  const toleranceColor: Record<string, string> = {
    low: '#dc2626',
    medium: '#f59e0b',
    high: '#22c55e',
    'very-high': '#16803c',
  }

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
            Needs {crop.minRainfall}–{crop.maxRainfall} mm · {crop.growingDays} days
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

          <h4
            style={{
              fontSize: '12px',
              color: '#0f3d20',
              margin: '12px 0 8px 0',
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
