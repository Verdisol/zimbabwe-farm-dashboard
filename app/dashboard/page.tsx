export default function DashboardPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f1f5f9',
        padding: '32px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#16803c',
            marginBottom: '8px',
          }}
        >
          🌾 Welcome to Your Dashboard
        </h1>
        <p style={{ color: '#64748b', marginBottom: '32px' }}>
          This is where your farm insights will appear.
        </p>

        <div
          style={{
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            marginBottom: '16px',
          }}
        >
          <h2 style={{ fontSize: '18px', color: '#1f2937', marginTop: 0 }}>
            Coming soon:
          </h2>
          <ul style={{ color: '#475569', lineHeight: 1.8 }}>
            <li>🗺️ Interactive map of your farm</li>
            <li>☀️ Live weather updates for your district</li>
            <li>📊 Crop yield charts and trends</li>
            <li>🤖 Random Forest yield predictions</li>
            <li>🔔 Weather alerts and notifications</li>
            <li>📚 "Did You Know" — crop education and pest help</li>
          </ul>
        </div>

        <a
          href="/"
          style={{
            display: 'inline-block',
            color: '#16803c',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          ← Back to login
        </a>
      </div>
    </div>
  )
}
