'use client'

import { useState } from 'react'

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    district: '',
    preferred_language: 'en',
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (res.ok) {
        setMessage('✅ Account created! Redirecting to login...')
        setTimeout(() => {
          window.location.href = '/'
        }, 1500)
      } else {
        setMessage('❌ ' + (data.error || 'Something went wrong'))
      }
    } catch (err) {
      setMessage('❌ Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    height: '50px',
    padding: '0 14px',
    background: 'rgba(255,255,255,0.96)',
    border: '1px solid #d1d5db',
    borderRadius: '12px',
    fontSize: '15px',
    color: '#1f2937',
    outline: 'none',
    boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    color: '#1f2937',
    marginBottom: '6px',
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(/images/farmer.jpg)`,
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
          maxWidth: '440px',
          padding: '36px 32px',
        }}
      >
        <h1
          style={{
            fontSize: '26px',
            fontWeight: 700,
            color: '#1f2937',
            textAlign: 'center',
            margin: '0 0 6px 0',
          }}
        >
          Create Your Account
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: '#64748b',
            textAlign: 'center',
            margin: '0 0 24px 0',
          }}
        >
          Join the Zimbabwe Farm Dashboard
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Tendai Moyo"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Choose a strong password"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>District</label>
            <input
              type="text"
              name="district"
              value={form.district}
              onChange={handleChange}
              placeholder="e.g. Murehwa"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Preferred Language</label>
            <select
              name="preferred_language"
              value={form.preferred_language}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="en">English</option>
              <option value="sn">Shona</option>
              <option value="nd">Ndebele</option>
            </select>
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
              marginTop: '6px',
            }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
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

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#64748b', fontSize: '14px' }}>
          Already have an account?{' '}
          <a href="/" style={{ color: '#16803c', fontWeight: 600, textDecoration: 'none' }}>
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}
