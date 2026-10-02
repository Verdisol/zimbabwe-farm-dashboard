'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Toaster } from 'sonner'

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (res.ok) {
        setMessage('✅ Logged in! Redirecting...')
        toast.success('Welcome back! 🌾', {
          description: 'Redirecting to your dashboard...',
        })
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 1000)
      } else {
        setMessage('❌ ' + (data.error || 'Login failed'))
        toast.error('Login failed', {
          description: data.error || 'Check your email and password.',
        })
      }
    } catch (err) {
      setMessage('❌ Network error. Please try again.')
      toast.error('Network error', {
        description: 'Could not reach the server. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
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
            disabled={loading}
            style={{
              height: '50px',
              background: loading ? '#94a3b8' : '#16803c',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(22,128,60,0.25)',
              marginTop: '4px',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {message && (
          <p
            style={{
              textAlign: 'center',
              marginTop: '16px',
              fontSize: '14px',
              color: message.startsWith('✅') ? '#16803c' : '#dc2626',
            }}
          >
            {message}
          </p>
        )}

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#64748b', fontSize: '14px' }}>
          New here?{' '}
          <a href="/register" style={{ color: '#16803c', fontWeight: 600, textDecoration: 'none' }}>
            Create an account
          </a>
        </p>
      </div>

      <Toaster position="top-right" richColors />
    </div>
  )
}
