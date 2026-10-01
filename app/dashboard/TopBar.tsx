'use client'

import { useState } from 'react'

export default function TopBar() {
  const [language, setLanguage] = useState('en')

  return (
    <header
      style={{
        background: 'white',
        padding: '16px 24px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#1f2937', margin: 0 }}>
          Welcome back, Farmer 🌱
        </h1>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0 0' }}>
          Your farm at a glance
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '10px',
            border: '1px solid #d1d5db',
            background: 'white',
            color: '#1f2937',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          <option value="en">English</option>
          <option value="sn">Shona</option>
          <option value="nd">Ndebele</option>
        </select>

        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#16803c',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '16px',
          }}
        >
          T
        </div>
      </div>
    </header>
  )
}
