'use client'

import { useEffect, useState } from 'react'
import { getSavedLocation, District, districts } from './locationData'

type Weather = {
  current: {
    temperature_2m: number
    apparent_temperature: number
    relative_humidity_2m: number
    wind_speed_10m: number
    wind_direction_10m: number
    surface_pressure: number
    weather_code: number
    visibility: number
  }
  daily: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_sum: number[]
    weather_code: number[]
    sunrise: string[]
    sunset: string[]
    uv_index_max: number[]
    wind_speed_10m_max: number[]
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    precipitation_probability: number[]
    weather_code: number[]
  }
}

type AirQuality = {
  current: {
    european_aqi: number
  }
}

const weatherIcons: Record<number, string> = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
  45: '🌫️', 48: '🌫️',
  51: '🌦️', 53: '🌦️', 55: '🌦️',
  61: '🌧️', 63: '🌧️', 65: '🌧️',
  71: '🌨️', 73: '🌨️', 75: '🌨️',
  80: '🌦️', 81: '🌧️', 82: '⛈️',
  95: '⛈️', 96: '⛈️', 99: '⛈️',
}

function getWeatherLabel(code: number): string {
  if (code === 0) return 'Clear'
  if (code <= 3) return 'Partly cloudy'
  if (code <= 48) return 'Foggy'
  if (code <= 55) return 'Drizzle'
  if (code <= 65) return 'Rain'
  if (code <= 75) return 'Snow'
  if (code <= 82) return 'Showers'
  return 'Thunderstorm'
}

function getAQILabel(aqi: number): { label: string; color: string } {
  if (aqi <= 20) return { label: 'Good', color: '#22c55e' }
  if (aqi <= 40) return { label: 'Fair', color: '#84cc16' }
  if (aqi <= 60) return { label: 'Moderate', color: '#f59e0b' }
  if (aqi <= 80) return { label: 'Poor', color: '#ef4444' }
  return { label: 'Very poor', color: '#7c3aed' }
}

function getUVLabel(uv: number): { label: string; color: string } {
  if (uv <= 2) return { label: 'Low', color: '#22c55e' }
  if (uv <= 5) return { label: 'Moderate', color: '#f59e0b' }
  if (uv <= 7) return { label: 'High', color: '#ef4444' }
  if (uv <= 10) return { label: 'Very high', color: '#dc2626' }
  return { label: 'Extreme', color: '#7c3aed' }
}

function getWindDirection(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(deg / 45) % 8]
}

function getVisibilityLabel(km: number): { label: string; color: string } {
  if (km >= 20) return { label: 'Excellent', color: '#22c55e' }
  if (km >= 10) return { label: 'Good', color: '#84cc16' }
  if (km >= 5) return { label: 'Moderate', color: '#f59e0b' }
  return { label: 'Poor', color: '#ef4444' }
}

export default function WeatherCard() {
  const [location, setLocation] = useState<District>(districts[0])
  const [weather, setWeather] = useState<Weather | null>(null)
  const [air, setAir] = useState<AirQuality | null>(null)
  const [error, setError] = useState('')

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
    setWeather(null)
    setAir(null)
    setError('')

    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lng}` +
      '&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_direction_10m,surface_pressure,weather_code,visibility' +
      '&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code,sunrise,sunset,uv_index_max,wind_speed_10m_max' +
      '&hourly=temperature_2m,precipitation_probability,weather_code' +
      '&timezone=Africa/Harare&forecast_days=7'

    const airUrl =
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${location.lat}&longitude=${location.lng}` +
      '&current=european_aqi&timezone=Africa/Harare'

    Promise.all([
      fetch(weatherUrl).then((r) => r.json()),
      fetch(airUrl).then((r) => r.json()).catch(() => null),
    ])
      .then(([w, a]) => {
        setWeather(w)
        setAir(a)
      })
      .catch(() => setError('Could not load weather'))
  }, [location])

  if (error) {
    return (
      <div
        style={{
          background: 'rgba(255,255,255,0.20)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          color: '#dc2626',
          border: '1px solid rgba(0,255,136,0.20)',
          width: '100%',
          maxWidth: '820px',
          margin: '0 auto',
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
          background: 'rgba(255,255,255,0.20)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          color: '#334155',
          border: '1px solid rgba(0,255,136,0.20)',
          width: '100%',
          maxWidth: '820px',
          margin: '0 auto',
        }}
      >
        Loading weather for {location.name}...
      </div>
    )
  }

  const code = weather.current.weather_code
  const icon = weatherIcons[code] || '🌤️'
  const label = getWeatherLabel(code)
  const todayMax = Math.round(weather.daily.temperature_2m_max[0])
  const todayMin = Math.round(weather.daily.temperature_2m_min[0])
  const aqiInfo = air ? getAQILabel(air.current.european_aqi) : null
  const uvInfo = getUVLabel(weather.daily.uv_index_max[0])
  const visInfo = getVisibilityLabel(weather.current.visibility / 1000)

  const now = new Date()
  const hourlyStart = weather.hourly.time.findIndex((t) => new Date(t) >= now)
  const hourlyWindow = weather.hourly.time
    .slice(hourlyStart, hourlyStart + 24)
    .map((t, i) => ({
      time: t,
      temp: weather.hourly.temperature_2m[hourlyStart + i],
      precip: weather.hourly.precipitation_probability[hourlyStart + i],
      code: weather.hourly.weather_code[hourlyStart + i],
    }))

  const cellStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.25)',
    borderRadius: '14px',
    padding: '14px',
    border: '1px solid rgba(0,255,136,0.18)',
  }

  const cellTitle: React.CSSProperties = {
    fontSize: '12px',
    color: '#334155',
    margin: 0,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
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
        width: '100%',
        maxWidth: '820px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.3)',
        }}
      >
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
          ☀️ Weather — {location.name}, {location.province}
        </h2>
        <p style={{ fontSize: '12px', color: '#334155', margin: '2px 0 0 0' }}>
          Live data from Open-Meteo · {location.lat.toFixed(2)}, {location.lng.toFixed(2)}
        </p>
      </div>

      <div
        style={{
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(22,128,60,0.85), rgba(13,90,41,0.85))',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: '52px', fontWeight: 700, lineHeight: 1 }}>
            {Math.round(weather.current.temperature_2m)}°C
          </div>
          <div style={{ fontSize: '14px', marginTop: '6px', opacity: 0.95 }}>{label}</div>
          <div style={{ fontSize: '13px', marginTop: '4px', opacity: 0.85 }}>
            Feels like {Math.round(weather.current.apparent_temperature)}° · H{todayMax}° L{todayMin}°
          </div>
        </div>
        <div style={{ fontSize: '72px' }}>{icon}</div>
      </div>

      {/* Hourly — grid, no horizontal scroll */}
      <div style={{ padding: '16px 20px' }}>
        <h3
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: '#334155',
            margin: '0 0 10px 0',
            letterSpacing: '0.5px',
          }}
        >
          NEXT 24 HOURS
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, minmax(0, 1fr))',
            gap: '8px',
          }}
        >
          {hourlyWindow.map((h, i) => (
            <div
              key={i}
              style={{
                textAlign: 'center',
                background: 'rgba(255,255,255,0.25)',
                borderRadius: '10px',
                padding: '8px 4px',
                border: '1px solid rgba(0,255,136,0.15)',
              }}
            >
              <div style={{ fontSize: '11px', color: '#334155' }}>
                {new Date(h.time).toLocaleTimeString('en', { hour: '2-digit', hour12: false })}
              </div>
              <div style={{ fontSize: '18px', margin: '2px 0' }}>
                {weatherIcons[h.code] || '🌤️'}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                {Math.round(h.temp)}°
              </div>
              {h.precip > 0 && (
                <div style={{ fontSize: '10px', color: '#0ea5e9' }}>💧{h.precip}%</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 7-day */}
      <div style={{ padding: '0 20px 16px' }}>
        <h3
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: '#334155',
            margin: '0 0 10px 0',
            letterSpacing: '0.5px',
          }}
        >
          7-DAY FORECAST
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {weather.daily.time.slice(0, 7).map((day, i) => (
            <div
              key={day}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '14px',
                color: '#0f172a',
                padding: '6px 0',
                borderBottom: '1px solid rgba(255,255,255,0.25)',
              }}
            >
              <span style={{ width: '70px', color: '#334155', fontWeight: 500 }}>
                {i === 0 ? 'Today' : new Date(day).toLocaleDateString('en', { weekday: 'short' })}
              </span>
              <span style={{ fontSize: '20px', width: '30px', textAlign: 'center' }}>
                {weatherIcons[weather.daily.weather_code[i]] || '🌤️'}
              </span>
              <span style={{ width: '60px', textAlign: 'right', color: '#0ea5e9' }}>
                {weather.daily.precipitation_sum[i].toFixed(1)} mm
              </span>
              <span style={{ width: '50px', textAlign: 'right', color: '#16803c', fontWeight: 600 }}>
                {Math.round(weather.daily.temperature_2m_min[i])}°
              </span>
              <span style={{ width: '50px', textAlign: 'right', color: '#dc2626', fontWeight: 600 }}>
                {Math.round(weather.daily.temperature_2m_max[i])}°
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Detail grid */}
      <div
        style={{
          padding: '0 20px 20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '10px',
        }}
      >
        <div style={cellStyle}>
          <p style={cellTitle}>Wind</p>
          <p style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: '4px 0 0 0' }}>
            {Math.round(weather.current.wind_speed_10m)} km/h
          </p>
          <p style={{ fontSize: '12px', color: '#334155', margin: '2px 0 0 0' }}>
            {getWindDirection(weather.current.wind_direction_10m)}
          </p>
        </div>

        <div style={cellStyle}>
          <p style={cellTitle}>Humidity</p>
          <p style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: '4px 0 0 0' }}>
            {weather.current.relative_humidity_2m}%
          </p>
        </div>

        <div style={cellStyle}>
          <p style={cellTitle}>Pressure</p>
          <p style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: '4px 0 0 0' }}>
            {Math.round(weather.current.surface_pressure)} hPa
          </p>
        </div>

        <div style={cellStyle}>
          <p style={cellTitle}>Visibility</p>
          <p style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: '4px 0 0 0' }}>
            {(weather.current.visibility / 1000).toFixed(0)} km
          </p>
          <p style={{ fontSize: '12px', color: visInfo.color, margin: '2px 0 0 0', fontWeight: 600 }}>
            {visInfo.label}
          </p>
        </div>

        <div style={cellStyle}>
          <p style={cellTitle}>UV Index</p>
          <p style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: '4px 0 0 0' }}>
            {weather.daily.uv_index_max[0].toFixed(1)}
          </p>
          <p style={{ fontSize: '12px', color: uvInfo.color, margin: '2px 0 0 0', fontWeight: 600 }}>
            {uvInfo.label}
          </p>
        </div>

        {aqiInfo && air && (
          <div style={cellStyle}>
            <p style={cellTitle}>Air Quality</p>
            <p style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: '4px 0 0 0' }}>
              {air.current.european_aqi}
            </p>
            <p style={{ fontSize: '12px', color: aqiInfo.color, margin: '2px 0 0 0', fontWeight: 600 }}>
              {aqiInfo.label}
            </p>
          </div>
        )}

        <div style={cellStyle}>
          <p style={cellTitle}>Sunrise</p>
          <p style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '4px 0 0 0' }}>
            {new Date(weather.daily.sunrise[0]).toLocaleTimeString('en', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })}
          </p>
        </div>

        <div style={cellStyle}>
          <p style={cellTitle}>Sunset</p>
          <p style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '4px 0 0 0' }}>
            {new Date(weather.daily.sunset[0]).toLocaleTimeString('en', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })}
          </p>
        </div>
      </div>
    </div>
  )
}
