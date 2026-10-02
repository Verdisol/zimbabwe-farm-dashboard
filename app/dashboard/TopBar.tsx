'use client'

import { useState, useEffect } from 'react'

export default function TopBar() {
  const [language, setLanguage] = useState('en')

  // Inject the pulse keyframes once
  useEffect(() => {
    if (document.getElementById('topbar-pulse')) return
    const style = document.createElement('style')
    style.id = 'topbar-pulse'
    style.innerHTML = `
      @keyframes topbarPulse {
        0%, 100% {
          box-shadow: 0 0 12px rgba(0,255,136,0.25), 0 2px 10px rgba(0,0,0,0.15);
        }
        50% {
          box-shadow: 0 0 26px rgba(0,255,136,0.55), 0 2px 14px rgba(0,0,0,0.20);
        }
      }
    `
    document.head.appendChild(style)
  }, [])

  return (
    <header
      style={{
        background:
          'linear-gradient(rgba(255,255,255,0.20), rgba(255,255,255,0.20)), url(/images/farmer.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '48px 32px',
        borderBottom: '1px solid rgba(0,255,136,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '32px',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        animation: 'topbarPulse 4s ease-in-out infinite',
      }}
    >
      {/* Centered welcome text */}
      <div style={{ textAlign: 'center', flex: 1 }}>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#ffffff',
            margin: 0,
            textShadow: '0 2px 8px rgba(0,0,0,0.75), 0 1px 3px rgba(0,0,0,0.9)',
            letterSpacing: '0.3px',
          }}
        >
          Welcome back, Farmer
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: 'rgba(255,255,255,0.95)',
            margin: '6px 0 0 0',
            textShadow: '0 2px 6px rgba(0,0,0,0.75), 0 1px 2px rgba(0,0,0,0.9)',
          }}
        >
          Your farm at a glance
        </p>
      </div>

      {/* Right-side controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.6)',
            background: 'rgba(255,255,255,0.85)',
            color: '#0f172a',
            fontSize: '14px',
            cursor: 'pointer',
            backdropFilter: 'blur(6px)',
            fontWeight: 500,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          <option value="en">English</option>
          <option value="sn">Shona</option>
          <option value="nd">Ndebele</option>
        </select>

        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #16803c, #0d5a29)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '20px',
            boxShadow: '0 0 15px rgba(0,255,136,0.45)',
            border: '2px solid rgba(255,255,255,0.7)',
          }}
        >
          T
        </div>
      </div>
    </header>
  )
}
