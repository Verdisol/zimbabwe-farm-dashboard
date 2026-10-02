'use client'

import { useRouter, usePathname } from 'next/navigation'

const navItems = [
  { label: 'Overview', href: '/dashboard' },
  { label: 'Map', href: '/dashboard' },
  { label: 'Weather', href: '/dashboard' },
  { label: 'Predictions', href: '/dashboard' },
  { label: 'Learn', href: '/dashboard' },
  { label: 'Help', href: '/dashboard' },
]

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <aside
      style={{
        width: '220px',
        minHeight: '100vh',
        background: 'rgba(101, 67, 33, 0.8)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: '24px 14px',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        borderRight: '1px solid rgba(255,255,255,0.15)',
      }}
    >
      <div style={{ marginBottom: '28px', paddingLeft: '6px' }}>
        <h2
          style={{
            fontSize: '17px',
            fontWeight: 700,
            margin: 0,
            color: '#ffffff',
            textShadow: '0 2px 6px rgba(0,0,0,0.6)',
            letterSpacing: '0.3px',
          }}
        >
          Farm Dashboard
        </h2>
        <p
          style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.85)',
            margin: '4px 0 0 0',
            textShadow: '0 1px 4px rgba(0,0,0,0.6)',
          }}
        >
          Zimbabwe
        </p>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href && item.label === 'Overview'
          return (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              style={{
                display: 'block',
                padding: '12px 14px',
                background: isActive ? 'rgba(22,128,60,0.9)' : 'transparent',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 500,
                textAlign: 'left',
                cursor: 'pointer',
                textShadow: '0 1px 4px rgba(0,0,0,0.55)',
                boxShadow: isActive ? '0 6px 16px rgba(22,128,60,0.35)' : 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(22,128,60,0.9)'
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(22,128,60,0.55)'
                e.currentTarget.style.transform = 'translateX(2px)'
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.transform = 'translateX(0)'
                }
              }}
            >
              {item.label}
            </button>
          )
        })}
      </nav>

      <button
        onClick={() => {
          window.location.href = '/'
        }}
        style={{
          marginTop: '24px',
          padding: '12px',
          background: 'rgba(0,0,0,0.3)',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontSize: '14px',
          cursor: 'pointer',
          fontWeight: 500,
          textShadow: '0 1px 4px rgba(0,0,0,0.6)',
        }}
      >
        Log out
      </button>
    </aside>
  )
}
