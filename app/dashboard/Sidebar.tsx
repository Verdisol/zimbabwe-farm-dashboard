'use client'

export type TabKey =
  | 'overview'
  | 'map'
  | 'weather'
  | 'drought'
  | 'predictions'
  | 'charts'
  | 'market'
  | 'learn'
  | 'help'
  | 'subscribe'

const navItems: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'map', label: 'Map' },
  { key: 'weather', label: 'Weather' },
  { key: 'drought', label: 'Drought Monitor' },
  { key: 'predictions', label: 'Predictions' },
  { key: 'charts', label: 'Charts' },
  { key: 'market', label: 'Market' },
  { key: 'learn', label: 'Learn' },
  { key: 'help', label: 'Help' },
  { key: 'subscribe', label: 'Subscription' },
]

export default function Sidebar({
  activeTab,
  onChangeTab,
}: {
  activeTab: TabKey
  onChangeTab: (tab: TabKey) => void
}) {
  return (
    <aside
      style={{
        width: '230px',
        height: '100vh',
        background:
          'linear-gradient(rgba(101,67,33,0.82), rgba(101,67,33,0.82)), url(/images/farmer.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '24px 14px',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
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

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {navItems.map((item) => {
          const isActive = activeTab === item.key
          return (
            <button
              key={item.key}
              onClick={() => onChangeTab(item.key)}
              style={{
                display: 'block',
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                background: isActive ? 'rgba(0,255,136,0.16)' : 'transparent',
                border: isActive
                  ? '1px solid rgba(0,255,136,0.45)'
                  : '1px solid rgba(255,255,255,0.08)',
                boxShadow: isActive ? '0 0 20px rgba(0,255,136,0.35)' : 'none',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: 500,
                textAlign: 'left',
                cursor: 'pointer',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(0,255,136,0.10)'
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(0,255,136,0.30)'
                  e.currentTarget.style.border = '1px solid rgba(0,255,136,0.30)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'
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
          background: 'rgba(0,0,0,0.35)',
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
