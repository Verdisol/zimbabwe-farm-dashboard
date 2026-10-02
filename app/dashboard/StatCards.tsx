'use client'

import { useEffect, useState } from 'react'
import { getSavedLocation, District, districts } from './locationData'

type Stats = {
  temperature: number | null
  rainfall30d: number | null
  predictedYield: number | null
  alertCount: number
  alertMessage: string
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.20)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  borderRadius: '16px',
  padding: '20px',
  border: '1px solid rgba(0,255,136,0.20)',
  boxShadow: '0 0 15px rgba(0,255,136,0.18)',
  transition: 'all 0.3s ease',
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string
  value: string
  icon: string
  color: string
}) {
  return (
    <div
      style={{
        ...cardStyle,
        borderLeft: `4px solid ${color}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 0 25px rgba(0,255,136,0.45)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 0 15px rgba(0,255,136,0.18)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
      <p style={{ fontSize: '13px', color: '#1f2937', margin: 0, fontWeight: 500 }}>
        {title}
      </p>
      <p
        style={{
          fontSize: '22px',
          fontWeight: 700,
          color: '#0f172a',
          margin: '4px 0 0 0',
        }}
      >
        {value}
      </p>
    </div>
  )
}

export default function StatCards() {
  const [location, setLocation] = useState<District>(districts[0])
  const [stats, setStats] = useState<Stats>({
    temperature: null,
    rainfall30d: null,
    predictedYield: null,
    alertCount: 0,
    alertMessage: '',
  })

  // Read saved location + listen for changes
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

  // Fetch weather + rainfall for chosen location
  useEffect(() => {
    let cancelled = false

    const loadWeather = () => {
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lng}` +
          '&current=temperature_2m,weather_code' +
          '&daily=precipitation_sum,weather_code' +
          '&past_days=30&forecast_days=7' +
          '&timezone=Africa/Harare'
      )
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return

          const temp = data.current?.temperature_2m ?? null
          const rainfallArray: number[] = data.daily?.precipitation_sum ?? []

          // Last 30 days (past_days=30 => first 30 entries)
          const past30 = rainfallArray.slice(0, 30)
          const total = past30.reduce((sum, v) => sum + (v || 0), 0)

          // Alert logic
          let alertCount = 0
          const messages: string[] = []

          if (total < 10) {
            alertCount += 1
            messages.push('Low rainfall — consider irrigation')
          }
          if (total > 150) {
            alertCount += 1
            messages.push('Heavy rainfall — watch for waterlogging')
          }
          const nextFewDays = rainfallArray.slice(30, 37)
          const heavyDay = nextFewDays.find((v) => v > 30)
          if (heavyDay) {
            alertCount += 1
            messages.push('Heavy rain expected this week')
          }

          setStats((prev) => ({
            ...prev,
            temperature: temp,
            rainfall30d: total,
            alertCount,
            alertMessage: messages.join(' • '),
          }))
        })
        .catch(() => {
          // keep previous values on error
        })
    }

    loadWeather()
    const interval = setInterval(loadWeather, 10 * 60 * 1000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [location])

  // Read latest prediction from localStorage
  useEffect(() => {
    const readPrediction = () => {
      const stored = localStorage.getItem('latestPrediction')
      if (stored) {
        const val = parseFloat(stored)
        if (!isNaN(val)) {
          setStats((prev) => {
            if (prev.predictedYield !== val) {
              return { ...prev, predictedYield: val }
            }
            return prev
          })
        }
      }
    }

    readPrediction()

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'latestPrediction') readPrediction()
    }
    const onPredictionUpdate = () => readPrediction()

    window.addEventListener('storage', onStorage)
    window.addEventListener('predictionUpdated', onPredictionUpdate)

    const poll = setInterval(readPrediction, 3000)

    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('predictionUpdated', onPredictionUpdate)
      clearInterval(poll)
    }
  }, [])

  const tempDisplay =
    stats.temperature !== null ? `${Math.round(stats.temperature)}°C` : '—'

  const rainfallDisplay =
    stats.rainfall30d !== null ? `${stats.rainfall30d.toFixed(1)} mm` : '— mm'

  const yieldDisplay =
    stats.predictedYield !== null
      ? `${stats.predictedYield.toFixed(2)} t/ha`
      : '— t/ha'

  const alertsDisplay =
    stats.alertCount > 0 ? `${stats.alertCount} active` : '0 active'

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}
    >
      <StatCard
        title={`Current Weather — ${location.name}`}
        value={tempDisplay}
        icon="☀️"
        color="#0ea5e9"
      />
      <StatCard
        title="Rainfall (30 days)"
        value={rainfallDisplay}
        icon="🌧️"
        color="#16803c"
      />
      <StatCard
        title="Predicted Yield"
        value={yieldDisplay}
        icon="🌽"
        color="#f59e0b"
      />
      <StatCard title="Alerts" value={alertsDisplay} icon="🔔" color="#dc2626" />

      {stats.alertMessage && (
        <div
          style={{
            gridColumn: '1 / -1',
            background: 'rgba(220,38,38,0.12)',
            border: '1px solid rgba(220,38,38,0.35)',
            color: '#7f1d1d',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          🔔 <strong>Alerts for {location.name}:</strong> {stats.alertMessage}
        </div>
      )}
    </div>
  )
}
