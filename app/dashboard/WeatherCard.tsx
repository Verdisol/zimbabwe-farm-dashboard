'use client'

import { useEffect, useState } from 'react'
import { getSavedLocation, District, districts, saveLocation } from './locationData'

// ... (Keep all your existing Weather type and helper functions exactly as they are) ...
// For brevity, I am only showing the component part that changes:

export default function WeatherCard() {
  const [location, setLocation] = useState<District>(districts[0])
  const [weather, setWeather] = useState<any>(null)
  const [air, setAir] = useState<any>(null)
  const [error, setError] = useState('')

  // 1. Listen for location changes (from map clicks or dropdowns)
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

  // 2. Fetch weather when location changes
  useEffect(() => {
    setWeather(null)
    setError('')

    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lng}` +
      '&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_direction_10m,surface_pressure,weather_code,visibility' +
      '&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code,sunrise,sunset,uv_index_max,wind_speed_10m_max' +
      '&hourly=temperature_2m,precipitation_probability,weather_code' +
      '&timezone=Africa/Harare&forecast_days=7'

    const airUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${location.lat}&longitude=${location.lng}&current=european_aqi&timezone=Africa/Harare`

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

  // ... (Keep all your existing return UI and helper functions exactly as they are) ...
}
