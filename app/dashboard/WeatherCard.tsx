'use client'

import { useEffect, useState } from 'react'

type Weather = {
  current_weather: {
    temperature: number
    windspeed: number
    weathercode: number
  }
  daily: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_sum: number[]
  }
}

const weatherIcons: Record<number, string> = {
  0: '☀️',
  1: '🌤️',
  2: '⛅',
  3: '☁️',
  45: '🌫️',
  48: '🌫️',
  51: '🌦️',
  53: '🌦️',
  55: '🌦️',
  61: '🌧️',
  63: '🌧️',
  65: '🌧️',
  71: '🌨️',
  80: '🌦️',
  81: '🌧️',
  82: '⛈️',
  95: '⛈️',
  96: '⛈️',
  99: '⛈️',
}

export default function WeatherCard() {
  const [weather, setWeather] = useState<Weather | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=-17.8252&longitude=31.0335&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Africa/Harare'
    )
      .then((res) => res.json())
      .then((data) => setWeather(data))
      .catch(() => setError('Could not load weather'))
  }, [])

  if (error) {
    return (
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          color: '#dc2626',
        }}
      >
        {error}
      </div>
    )
  }

  if (!weather) {
    return (
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          color: '#64748b',
        }}
      >
        Loading weather...
      </div>
    )
  }

  const code = weather.current_weather.weathercode
  const icon = weatherIcons[code] || '🌤️'

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1f2937', margin: 0 }}>
          ☀️ Live Weather — Harare
        </h2>
        <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
          Updated in real time from Open-Meteo
        </p>
      </div>

      <div
        style={{
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #16803c, #0d5a29)',
          color: 'white',
        }}
      >
        <div>
          <div style={{ fontSize: '48px', fontWeight: 700, lineHeight: 1 }}>
            {Math.round(weather.current_weather.temperature)}°C
          </div>
          <div style={{ fontSize: '13px', opacity: 0.9, marginTop: '6px' }}>
            Wind: {weather.current_weather.windspeed} km/h
          </div>
        </div>
        <div style={{ fontSize: '64px' }}>{icon}</div>
      </div>

      <div style={{ padding: '16px 20px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', margin: '0 0 12px 0' }}>
          5-DAY FORECAST
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {weather.daily.time.slice(0, 5).map((day, i) => (
            <div
              key={day}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '14px',
                color: '#1f2937',
              }}
            >
              <span style={{ width: '60px', color: '#64748b', fontWeight: 500 }}>
                {new Date(day).toLocaleDateString('en', { weekday: 'short' })}
              </span>
              <span style={{ fontSize: '20px' }}>
                {weatherIcons[0] && '🌤️'}
              </span>
              <span style={{ color: '#16803c', fontWeight: 600 }}>
                {Math.round(weather.daily.temperature_2m_min[i])}°
              </span>
              <span style={{ color: '#dc2626', fontWeight: 600 }}>
                {Math.round(weather.daily.temperature_2m_max[i])}°
              </span>
              <span style={{ color: '#0ea5e9', width: '55px', textAlign: 'right' }}>
                {weather.daily.precipitation_sum[i].toFixed(1)} mm
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
