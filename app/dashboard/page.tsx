import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function DashboardPage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TopBar />

        <main style={{ padding: '24px', flex: 1 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <StatCard title="Current Weather" value="—" icon="☀️" color="#0ea5e9" />
            <StatCard title="Rainfall (30 days)" value="— mm" icon="🌧️" color="#16803c" />
            <StatCard title="Predicted Yield" value="— t/ha" icon="🌽" color="#f59e0b" />
            <StatCard title="Alerts" value="0 active" icon="🔔" color="#dc2626" />
          </div>

          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}
          >
            <h2 style={{ fontSize: '18px', color: '#1f2937', marginTop: 0 }}>
              Getting started
            </h2>
            <p style={{ color: '#64748b', lineHeight: 1.7 }}>
              We're building this dashboard step by step. Soon you'll see:
            </p>
            <ul style={{ color: '#475569', lineHeight: 1.9, marginTop: '8px' }}>
              <li>🗺️ Interactive map of your district with OSM base layer</li>
              <li>☀️ Live weather and 7-day forecast for your location</li>
              <li>📊 Charts showing rainfall and yield trends</li>
              <li>🤖 Random Forest predictions of your crop yield</li>
              <li>🔔 Weather alerts and notifications</li>
              <li>📚 "Did You Know" crop education and pest help</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string
  value: string
  icon: string
  color: string
}) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        borderLeft: `4px solid ${color}`,
      }}
    >
      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
      <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>{title}</p>
      <p
        style={{
          fontSize: '22px',
          fontWeight: 700,
          color: '#1f2937',
          margin: '4px 0 0 0',
        }}
      >
        {value}
      </p>
    </div>
  )
}
