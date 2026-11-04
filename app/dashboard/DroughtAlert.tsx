'use client'

import { useEffect, useState } from 'react'

export default function DroughtAlert({
  district,
  onClose,
}: {
  district: any
  onClose: () => void
}) {
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    if (!district || muted) return

    const playBeep = (type: string) => {
      try {
        const ctx = new (
          window.AudioContext || (window as any).webkitAudioContext
        )()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)

        if (type === 'extreme') {
          osc.frequency.value = 800
          gain.gain.setValueAtTime(0.5, ctx.currentTime)
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8)
          osc.start()
          osc.stop(ctx.currentTime + 0.8)
        } else if (type === 'severe') {
          osc.frequency.value = 600
          gain.gain.setValueAtTime(0.3, ctx.currentTime)
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
          osc.start()
          osc.stop(ctx.currentTime + 0.5)
        }
      } catch (e) {
        // Audio blocked by browser — silent
      }
    }

    if (district.score >= 86) {
      playBeep('extreme')
      navigator.vibrate?.([500, 200, 500])
    } else if (district.score >= 71) {
      playBeep('severe')
      navigator.vibrate?.([300, 100, 300])
    }
  }, [district, muted])

  if (!district) return null

  const isExtreme = district.score >= 86
  const isSevere = district.score >= 71
  const isAlert = district.score >= 51

  if (!isAlert) return null

  const bgColor = isExtreme ? '#7f1d1d' : isSevere ? '#ef4444' : '#f97316'
  const animClass = isExtreme
    ? 'animate-blink-fast'
    : isSevere
    ? 'animate-blink-medium'
    : 'animate-blink-slow'
  const message = isExtreme
    ? 'EXTREME DROUGHT — EMERGENCY'
    : isSevere
    ? 'SEVERE DROUGHT — DO NOT PLANT MAIZE'
    : 'DROUGHT ALERT — Plant Sorghum or Millet'

  return (
    <div
      className={animClass}
      style={{
        position: 'fixed',
        top: '96px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '640px',
        zIndex: 9999,
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
        color: 'white',
        fontWeight: 700,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: bgColor,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '28px' }}>⚠️</span>
        <div>
          <div style={{ fontSize: '16px' }}>
            {district.name}: {message}
          </div>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 400,
              opacity: 0.9,
              marginTop: '2px',
            }}
          >
            Drought Score: {district.score.toFixed(0)}/100
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setMuted(!muted)}
          style={{
            padding: '6px 12px',
            background: 'rgba(0,0,0,0.25)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          {muted ? '🔇 Unmute' : '🔊 Mute'}
        </button>
        <button
          onClick={onClose}
          style={{
            padding: '6px 12px',
            background: 'white',
            color: '#0f172a',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Close
        </button>
      </div>
    </div>
  )
}
