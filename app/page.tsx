export default function Home() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(/images/farmer.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '16px',
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.7)',
          borderRadius: '20px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
          width: '100%',
          maxWidth: '420px',
          padding: '40px 32px',
        }}
      >
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#1f2937',
            textAlign: 'center',
            margin: '0 0 8px 0',
          }}
        >
          Welcome Back
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: '#64748b',
            textAlign: 'center',
            margin: '0 0 28px 0',
          }}
        >
          Sign in to your dashboard
        </p>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '6px',
              }}
            >
              Email or Username
            </label>
            <input
              type="text"
              placeholder="Enter your email"
              style={{
                width: '100%',
                height: '50px',
                padding: '0 14px',
                background: 'rgba(255,255,255,0.96)',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                fontSize: '15px',
                color: '#1f2937',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '6px',
              }}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              style={{
                width: '100%',
                height: '50px',
                padding: '0 14px',
                background: 'rgba(255,255,255,0.96)',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                fontSize: '15px',
                color: '#1f2937',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '14px',
            }}
          >
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1f2937' }}>
              <input type="checkbox" />
              Remember me
            </label>
            <a href="/forgot" style={{ color: '#16803c', textDecoration: 'none', fontWeight: 500 }}>
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            style={{
              height: '50px',
              background: '#16803c',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(22,128,60,0.25)',
              marginTop: '4px',
            }}
          >
            Sign In
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#64748b', fontSize: '14px' }}>
          New here?{' '}
          <a href="/register" style={{ color: '#16803c', fontWeight: 600, textDecoration: 'none' }}>
            Create an account
          </a>
        </p>
      </div>
    </div>
  )
}
