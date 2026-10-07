'use client'

import { useEffect, useState } from 'react'
import { getSavedLocation, District, districts } from './locationData'

const API_URL = 'https://zimbabwe-farm-ml-api.onrender.com/predict'

export default function PredictionCard() {
  const [location, setLocation] = useState<District>(districts[0])
  const [rainfall, setRainfall] = useState('700')
  const [temperature, setTemperature] = useState('24')
  const [fertilizer, setFertilizer] = useState('60')
  const [autoFilled, setAutoFilled] = useState(false)
  const [loadingWeather, setLoadingWeather] = useState(false)

  const [result, setResult] = useState<null | {
    predicted_yield_t_ha: number
    confidence_range: { low: number; high: number }
  }>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Track location changes
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

  // Auto-fill rainfall and temperature from weather API
  useEffect(() => {
    setLoadingWeather(true)
    setAutoFilled(false)

    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lng}` +
      '&current=temperature_2m' +
      '&daily=precipitation_sum' +
      '&past_days=30&forecast_days=7' +
      '&timezone=Africa/Harare'

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        // Temperature: use current
        const currentTemp = data.current?.temperature_2m
        if (currentTemp != null) {
          setTemperature(Math.round(currentTemp).toString())
        }

        // Rainfall: estimate seasonal from past 30 days × 5
        const arr: number[] = data.daily?.precipitation_sum ?? []
        const past30 = arr.slice(0, 30)
        const total30 = past30.reduce((s, v) => s + (v || 0), 0)
        const seasonal = Math.round(total30 * 5)
        if (seasonal > 0) {
          setRainfall(seasonal.toString())
        }

        setAutoFilled(true)
      })
      .catch(() => {
        /* silent */
      })
      .finally(() => setLoadingWeather(false))
  }, [location])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop: 'maize',
          rainfall: parseFloat(rainfall),
          temperature: parseFloat(temperature),
          fertilizer: parseFloat(fertilizer),
        }),
      })

      const data = await res.json()

      if (data.success) {
        setResult({
          predicted_yield_t_ha: data.predicted_yield_t_ha,
          confidence_range: data.confidence_range,
        })
        localStorage.setItem(
          'latestPrediction',
          data.predicted_yield_t_ha.toString()
        )
        window.dispatchEvent(new Event('predictionUpdated'))
      } else {
        setError(data.error || 'Prediction failed')
      }
    } catch (err) {
      setError(
        'Could not reach prediction API. Try again in 30 seconds (the API sleeps when idle).'
      )
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    height: '44px',
    padding: '0 12px',
    border: '1px solid #d1d5db',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#1f2937',
    outline: 'none',
    boxSizing: 'border-box' as const,
    background: 'rgba(255,255,255,0.92)',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: '#1f2937',
    marginBottom: '4px',
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
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.3)',
        }}
      >
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
          🤖 Maize Yield Prediction
        </h2>
        <p style={{ fontSize: '12px', color: '#334155', margin: '2px 0 0 0' }}>
          Auto-filled from {location.name} weather · Random Forest model
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <div>
          <label style={labelStyle}>
            Growing-season rainfall (mm)
            {loadingWeather && (
              <span style={{ color: '#16803c', marginLeft: '6px', fontSize: '11px' }}>
                (loading...)
              </span>
            )}
            {autoFilled && !loadingWeather && (
              <span style={{ color: '#16803c', marginLeft: '6px', fontSize: '11px' }}>
                ✓ auto-filled
              </span>
            )}
          </label>
          <input
            type="number"
            value={rainfall}
            onChange={(e) => setRainfall(e.target.value)}
            style={inputStyle}
            min="100"
            max="1500"
            required
          />
        </div>

        <div>
          <label style={labelStyle}>
            Mean temperature (°C)
            {autoFilled && !loadingWeather && (
              <span style={{ color: '#16803c', marginLeft: '6px', fontSize: '11px' }}>
                ✓ auto-filled
              </span>
            )}
          </label>
          <input
            type="number"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            style={inputStyle}
            min="10"
            max="40"
            step="0.1"
            required
          />
        </div>

        <div>
          <label style={labelStyle}>Fertilizer (kg/ha)</label>
          <input
            type="number"
            value={fertilizer}
            onChange={(e) => setFertilizer(e.target.value)}
            style={inputStyle}
            min="0"
            max="300"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            height: '46px',
            background: loading ? '#94a3b8' : '#16803c',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 0 15px rgba(0,255,136,0.35)',
          }}
        >
          {loading ? 'Predicting...' : 'Predict Yield'}
        </button>
      </form>

      {error && (
        <div
          style={{
            padding: '0 20px 20px',
            color: '#dc2626',
            fontSize: '13px',
            textAlign: 'center',
          }}
        >
          ❌ {error}
        </div>
      )}

      {result && (
        <div
          style={{
            margin: '0 20px 20px',
            padding: '20px',
            background: 'linear-gradient(135deg, #16803c, #0d5a29)',
            color: 'white',
            borderRadius: '12px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '12px', opacity: 0.85, marginBottom: '4px' }}>
            PREDICTED YIELD
          </div>
          <div style={{ fontSize: '36px', fontWeight: 700, lineHeight: 1 }}>
            {result.predicted_yield_t_ha.toFixed(2)} t/ha
          </div>
          <div style={{ fontSize: '12px', opacity: 0.85, marginTop: '8px' }}>
            Confidence range: {result.confidence_range.low.toFixed(2)} –{' '}
            {result.confidence_range.high.toFixed(2)} t/ha
          </div>
        </div>
      )}
    </div>
  )
}
