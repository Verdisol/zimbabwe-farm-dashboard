'use client'

import { useEffect, useState } from 'react'
import { getSavedLocation, District, districts } from './locationData'

type MonthRain = { month: string; rain: number }

type DroughtStatus = {
  status: 'extreme-drought' | 'drought' | 'normal' | 'good' | 'bumper'
  label: string
  color: string
  icon: string
  description: string
  percentile: number
  last12: number
  historicalAvg: number
  historicalStd: number
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.20)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  borderRadius: '16px',
  padding: '20px',
  border: '1px solid rgba(0,255,136,0.20)',
  boxShadow: '0 0 15px rgba(0,255,136,0.18)',
}

function computeStatus(
  last12: number,
  historicalAvg: number,
  historicalStd: number
): DroughtStatus {
  const z = historicalStd > 0 ? (last12 - historicalAvg) / historicalStd : 0

  const percentile = Math.round((1 - 1 / (1 + Math.exp(-z))) * 100)

  if (z < -1.5) {
    return {
      status: 'extreme-drought',
      label: 'Extreme Drought',
      color: '#7f1d1d',
      icon: '🔥',
      description:
        'Rainfall is far below the long-term average. Serious risk to crop survival. Consider irrigation, drought-tolerant varieties, and seeking relief support.',
      percentile,
      last12,
      historicalAvg,
      historicalStd,
    }
  }
  if (z < -0.8) {
    return {
      status: 'drought',
      label: 'Drought Conditions',
      color: '#dc2626',
      icon: '⚠️',
      description:
        'Rainfall is below the long-term average. Crops may be water-stressed. Monitor soil moisture closely and prepare contingency plans.',
      percentile,
      last12,
      historicalAvg,
      historicalStd,
    }
  }
  if (z < 0.5) {
    return {
      status: 'normal',
      label: 'Normal Season',
      color: '#16803c',
      icon: '✅',
      description:
        'Rainfall is within the normal range for this location. Continue standard farming practices with regular monitoring.',
      percentile,
      last12,
      historicalAvg,
      historicalStd,
    }
  }
  if (z < 1.5) {
    return {
      status: 'good',
      label: 'Good Conditions',
      color: '#22c55e',
      icon: '🌱',
      description:
        'Rainfall is above average. Conditions are favorable for most crops. Watch for waterlogging in low-lying fields.',
      percentile,
      last12,
      historicalAvg,
      historicalStd,
    }
  }
  return {
    status: 'bumper',
    label: 'Bumper Harvest Likely',
    color: '#0d5a29',
    icon: '🌾',
    description:
      'Rainfall is significantly above average. Conditions strongly favor high yields. Prepare storage and market access in advance.',
    percentile,
    last12,
    historicalAvg,
    historicalStd,
  }
}

export default function DroughtMonitor() {
  const [location, setLocation] = useState<District>(districts[0])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [status, setStatus] = useState<DroughtStatus | null>(null)
  const [monthly, setMonthly] = useState<MonthRain[]>([])

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
    setError('')
    setStatus(null)
    setMonthly([])

    const today = new Date()
    const endDate = today.toISOString().slice(0, 10)
    const startYear = today.getFullYear() - 30
    const startDate = `${startYear}-01-01`

    const url =
      `https://archive-api.open-meteo.com/v1/archive?latitude=${location.lat}&longitude=${location.lng}` +
      `&start_date=${startDate}&end_date=${endDate}` +
      `&daily=precipitation_sum&timezone=Africa/Harare`

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const times: string[] = data.daily?.time ?? []
        const rains: number[] = data.daily?.precipitation_sum ?? []

        if (times.length < 365) {
          throw new Error('Not enough historical rainfall data for this location.')
        }

        const monthMap = new Map<string, number>()
        times.forEach((t, i) => {
          const key = t.slice(0, 7)
          const val = rains[i] || 0
          monthMap.set(key, (monthMap.get(key) || 0) + val)
        })

        const monthKeys = Array.from(monthMap.keys()).sort()
        const rolling12: number[] = []
        for (let i = 11; i < monthKeys.length; i++) {
          let sum = 0
          for (let j = i - 11; j <= i; j++) {
            sum += monthMap.get(monthKeys[j]) || 0
          }
          rolling12.push(sum)
        }

        if (rolling12.length < 10) {
          throw new Error('Insufficient history for baseline calculation.')
        }

        const historical = rolling12.slice(0, -1)
        const historicalAvg =
          historical.reduce((s, v) => s + v, 0) / historical.length
        const variance =
          historical.reduce((s, v) => s + (v - historicalAvg) ** 2, 0) /
          historical.length
        const historicalStd = Math.sqrt(variance)

        const last12 = rolling12[rolling12.length - 1]

        const last12Months = monthKeys.slice(-12).map((k) => ({
          month: k,
          rain: monthMap.get(k) || 0,
        }))

        setStatus(computeStatus(last12, historicalAvg, historicalStd))
        setMonthly(last12Months)
        setLoading(false)
      })
      .catch((err) => {
        setError(
          err.message ||
            'Could not load historical rainfall. Please try again later.'
        )
        setLoading(false)
      })
  }, [location])

  if (loading) {
    return (
      <div
        style={{ ...cardStyle, width: '100%', maxWidth: '900px', margin: '0 auto' }}
      >
        <p style={{ color: '#334155', margin: 0 }}>
          Loading 30 years of rainfall history for {location.name}...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{
          ...cardStyle,
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
          color: '#dc2626',
        }}
      >
        {error}
      </div>
    )
  }

  if (!status) return null

  const maxMonthly = Math.max(...monthly.map((m) => m.rain), 1)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        maxWidth: '900px',
        margin: '0 auto',
      }}
    >
      {/* Big status banner */}
      <div
        style={{
          ...cardStyle,
          borderLeft: `6px solid ${status.color}`,
          background:
            status.status === 'extreme-drought'
              ? 'rgba(127,29,29,0.15)'
              : status.status === 'drought'
              ? 'rgba(220,38,38,0.12)'
              : status.status === 'bumper'
              ? 'rgba(13,90,41,0.18)'
              : status.status === 'good'
              ? 'rgba(34,197,94,0.14)'
              : 'rgba(255,255,255,0.20)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '56px' }}>{status.icon}</div>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: '12px',
                color: '#334155',
                margin: 0,
                fontWeight: 600,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              Drought / Harvest Status for {location.name}
            </p>
            <h2
              style={{
                fontSize: '28px',
                fontWeight: 800,
                color: status.color,
                margin: '4px 0 0 0',
                textShadow: '0 1px 3px rgba(255,255,255,0.6)',
              }}
            >
              {status.label}
            </h2>
          </div>
        </div>
        <p
          style={{
            fontSize: '14px',
            color: '#1f2937',
            lineHeight: 1.7,
            marginTop: '16px',
          }}
        >
          {status.description}
        </p>
      </div>

      {/* Numeric breakdown */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
        }}
      >
        <div style={cardStyle}>
          <p
            style={{
              fontSize: '12px',
              color: '#334155',
              margin: 0,
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            Last 12 months rainfall
          </p>
          <p
            style={{
              fontSize: '26px',
              fontWeight: 800,
              color: '#0f172a',
              margin: '6px 0 0 0',
            }}
          >
            {status.last12.toFixed(0)} mm
          </p>
        </div>

        <div style={cardStyle}>
          <p
            style={{
              fontSize: '12px',
              color: '#334155',
              margin: 0,
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            30-year average
          </p>
          <p
            style={{
              fontSize: '26px',
              fontWeight: 800,
              color: '#0f172a',
              margin: '6px 0 0 0',
            }}
          >
            {status.historicalAvg.toFixed(0)} mm
          </p>
        </div>

        <div style={cardStyle}>
          <p
            style={{
              fontSize: '12px',
              color: '#334155',
              margin: 0,
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            Deviation
          </p>
          <p
            style={{
              fontSize: '26px',
              fontWeight: 800,
              color:
                status.last12 >= status.historicalAvg ? '#16803c' : '#dc2626',
              margin: '6px 0 0 0',
            }}
          >
            {status.last12 >= status.historicalAvg ? '+' : ''}
            {(
              ((status.last12 - status.historicalAvg) / status.historicalAvg) *
              100
            ).toFixed(1)}
            %
          </p>
        </div>

        <div style={cardStyle}>
          <p
            style={{
              fontSize: '12px',
              color: '#334155',
              margin: 0,
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            Percentile Rank
          </p>
          <p
            style={{
              fontSize: '26px',
              fontWeight: 800,
              color: status.color,
              margin: '6px 0 0 0',
            }}
          >
            {status.percentile}th
          </p>
        </div>
      </div>

      {/* Monthly rainfall bar chart */}
      <div style={cardStyle}>
        <h3
          style={{
            fontSize: '14px',
            color: '#0f3d20',
            margin: '0 0 12px 0',
            fontWeight: 700,
            textShadow: '0 1px 3px rgba(255,255,255,0.6)',
          }}
        >
          📊 Monthly Rainfall — Last 12 Months ({location.name})
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
            gap: '6px',
            alignItems: 'end',
            height: '180px',
          }}
        >
          {monthly.map((m) => {
            const h = (m.rain / maxMonthly) * 150
            const monthName = new Date(m.month + '-01').toLocaleDateString('en', {
              month: 'short',
            })
            return (
              <div
                key={m.month}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    fontSize: '10px',
                    color: '#0f3d20',
                    fontWeight: 600,
                    marginBottom: '2px',
                  }}
                >
                  {m.rain.toFixed(0)}
                </div>
                <div
                  style={{
                    width: '100%',
                    height: `${Math.max(h, 2)}px`,
                    background: 'linear-gradient(180deg, #16803c, #0d5a29)',
                    borderRadius: '4px 4px 0 0',
                    boxShadow: '0 0 8px rgba(0,255,136,0.25)',
                  }}
                />
                <div
                  style={{
                    fontSize: '10px',
                    color: '#334155',
                    marginTop: '4px',
                  }}
                >
                  {monthName}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <p
        style={{
          fontSize: '11px',
          color: '#475569',
          textAlign: 'center',
          fontStyle: 'italic',
          margin: 0,
        }}
      >
        Based on 30 years of daily rainfall from Open-Meteo Archive API. Drought
        classification follows a standardized z-score approach on rolling 12-month
        totals.
      </p>
    </div>
  )
}
