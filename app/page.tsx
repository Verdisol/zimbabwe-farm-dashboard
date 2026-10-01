export default function Home() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: 'url(/images/farmer.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      />

      <div
        style={{
          position: 'relative',
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          width: '100%',
          maxWidth: '420px',
          margin: '20px',
        }}
      >
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#2E7D32',
            textAlign: 'center',
            marginBottom: '8px',
          }}
        >
          🌾 Zimbabwe Farm Dashboard
        </h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '32px' }}>
          Welcome back, farmer!
        </p>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="email"
            placeholder="Email"
            style={{
              padding: '14px',
              borderRadius: '12px',
              border: '1px solid #ddd',
              fontSize: '16px',
            }}
          />
          <input
            type="password"
            placeholder="Password"
            style={{
              padding: '14px',
              borderRadius: '12px',
              border: '1px solid #ddd',
              fontSize: '16px',
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Log In
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#666' }}>
          New here?{' '}
          <a href="/register" style={{ color: '#4CAF50', fontWeight: 'bold' }}>
            Create an account
          </a>
        </p>
      </div>
    </div>
  )
}
