'use client'

import { useRouter } from 'next/navigation'

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: '🏠' },
  { label: 'Map', href: '/dashboard/map', icon: '🗺️' },
  { label: 'Weather', href: '/dashboard/weather', icon: '☀️' },
  { label: 'Predictions', href: '/dashboard/predictions', icon: '🤖' },
  { label: 'Learn', href: '/dashboard/learn', icon: '📚' },
  { label: 'Help', href: '/dashboard/help', icon: '💬' },
]

export default function Sidebar() {
  const router = useRouter()

  return (
    <aside
      style={{
        width: '240px',
        minHeight: '100vh',
        background: '#16803c',
        color: 'white',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
      }}
    >
      <div style={{ marginBottom: '32px', paddingLeft: '8px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>
          🌾 Farm Dashboard
        </h2>
        <p style={{ fontSize: '12px', color: '#c8e6c9', margin: '4px 0 0 0' }}>
          Zimbabwe
        </p>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {navItems.map((item) => (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 12px',
              background: 'transparent',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              textAlign: 'left',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#14672f')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <span style={{ fontSize: '18px' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <button
        onClick={() => {
          window.location.href = '/'
        }}
        style={{
          marginTop: '24px',
          padding: '12px',
          background: 'rgba(255,255,255,0.15)',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontSize: '14px',
          cursor: 'pointer',
          fontWeight: 500,
        }}
      >
        ← Log out
      </button>
    </aside>
  )
}
