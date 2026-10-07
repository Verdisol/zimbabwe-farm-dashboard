'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type Plan = 'monthly' | 'quarterly' | 'yearly'
type Method = 'ecocash' | 'mukuru' | 'innbucks' | 'bank'

type ExistingSub = {
  id: number
  plan: string
  payment_method: string
  reference_code: string
  amount_usd: number
  status: string
  created_at: string
} | null

const plans: { key: Plan; label: string; price: number; period: string; note: string }[] = [
  {
    key: 'monthly',
    label: 'Monthly',
    price: 40,
    period: '/month',
    note: 'Best for trying out the full dashboard',
  },
  {
    key: 'quarterly',
    label: 'Quarterly',
    price: 100,
    period: '/3 months',
    note: 'Save USD 20 (17% off)',
  },
  {
    key: 'yearly',
    label: 'Yearly',
    price: 400,
    period: '/year',
    note: 'Save USD 80 (17% off)',
  },
]

const methods: { key: Method; label: string; icon: string; instructions: string }[] = [
  {
    key: 'ecocash',
    label: 'EcoCash',
    icon: '📱',
    instructions:
      'Dial *151*2*2*[merchant code]*[amount]# and enter your PIN. Use the reference code shown above as your payment reference so we can match your payment.',
  },
  {
    key: 'mukuru',
    label: 'Mukuru',
    icon: '💸',
    instructions:
      'Visit any Mukuru agent or use the Mukuru app. Send the exact amount to the recipient number shown after submission. Use the reference code as your payment note.',
  },
  {
    key: 'innbucks',
    label: 'InnBucks',
    icon: '🟢',
    instructions:
      'Open your InnBucks app or visit a Simbisa outlet. Send the amount to the InnBucks number shown after submission. Use the reference code as the memo.',
  },
  {
    key: 'bank',
    label: 'Bank Transfer',
    icon: '🏦',
    instructions:
      'Transfer the exact amount to the account shown after submission. Use the reference code as your deposit reference so we can match your payment.',
  },
]

function getStatusBadge(status: string) {
  if (status === 'approved' || status === 'paid') {
    return { label: 'Approved', color: '#16803c', bg: 'rgba(22,128,60,0.15)', icon: '✅' }
  }
  if (status === 'rejected' || status === 'cancelled') {
    return { label: 'Rejected', color: '#dc2626', bg: 'rgba(220,38,38,0.12)', icon: '❌' }
  }
  return { label: 'Pending Approval', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', icon: '⏳' }
}

export default function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>('monthly')
  const [selectedMethod, setSelectedMethod] = useState<Method>('ecocash')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [receipt, setReceipt] = useState<null | {
    reference_code: string
    amount_usd: number
    plan: string
    payment_method: string
  }>(null)

  const [existing, setExisting] = useState<ExistingSub>(null)
  const [loadingStatus, setLoadingStatus] = useState(false)

  // Try to read the logged-in user's email from localStorage
  // (we save it on login so we can look up their subscription)
  useEffect(() => {
    const savedEmail = localStorage.getItem('farmerEmail')
    if (savedEmail) {
      setEmail(savedEmail)
      fetchStatus(savedEmail)
    }
  }, [])

  const fetchStatus = (userEmail: string) => {
    if (!userEmail) return
    setLoadingStatus(true)
    fetch(`/api/subscription-status?email=${encodeURIComponent(userEmail)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.hasSubscription) {
          setExisting(data.subscription)
        } else {
          setExisting(null)
        }
      })
      .catch(() => {
        /* silent */
      })
      .finally(() => setLoadingStatus(false))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmer_email: email,
          plan: selectedPlan,
          payment_method: selectedMethod,
          phone_or_account: phone,
        }),
      })
      const data = await res.json()

      if (res.ok) {
        setReceipt({
          reference_code: data.subscription.reference_code,
          amount_usd: Number(data.subscription.amount_usd),
          plan: data.subscription.plan,
          payment_method: data.subscription.payment_method,
        })
        toast.success('Subscription submitted! 🌾', {
          description: 'Follow the payment instructions below.',
        })
        // Refresh status card
        fetchStatus(email)
      } else {
        toast.error('Submission failed', { description: data.error })
      }
    } catch (err) {
      toast.error('Network error', { description: 'Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setReceipt(null)
    setPhone('')
    setLoading(false)
  }

  const planObj = plans.find((p) => p.key === selectedPlan)!
  const methodObj = methods.find((m) => m.key === selectedMethod)!

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Status card — shown if a subscription exists */}
      {existing && (
        <div
          style={{
            background: getStatusBadge(existing.status).bg,
            border: `1px solid ${getStatusBadge(existing.status).color}`,
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 0 20px rgba(0,255,136,0.20)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '28px' }}>{getStatusBadge(existing.status).icon}</span>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: 700,
                  color: getStatusBadge(existing.status).color,
                }}
              >
                {getStatusBadge(existing.status).label}
              </h3>
              <p
                style={{
                  margin: '2px 0 0 0',
                  fontSize: '13px',
                  color: '#334155',
                }}
              >
                Reference: <strong>{existing.reference_code}</strong>
              </p>
            </div>
          </div>

          <div
            style={{
              marginTop: '14px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '10px',
            }}
          >
            <div>
              <p
                style={{
                  fontSize: '11px',
                  color: '#334155',
                  margin: 0,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                Plan
              </p>
              <p style={{ margin: '2px 0 0 0', color: '#0f172a', fontWeight: 700 }}>
                {existing.plan}
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: '11px',
                  color: '#334155',
                  margin: 0,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                Amount
              </p>
              <p style={{ margin: '2px 0 0 0', color: '#0f172a', fontWeight: 700 }}>
                USD {Number(existing.amount_usd).toFixed(2)}
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: '11px',
                  color: '#334155',
                  margin: 0,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                Method
              </p>
              <p style={{ margin: '2px 0 0 0', color: '#0f172a', fontWeight: 700 }}>
                {existing.payment_method}
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: '11px',
                  color: '#334155',
                  margin: 0,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                Submitted
              </p>
              <p style={{ margin: '2px 0 0 0', color: '#0f172a', fontWeight: 700 }}>
                {new Date(existing.created_at).toLocaleDateString('en-GB')}
              </p>
            </div>
          </div>

          <p style={{ fontSize: '12px', color: '#475569', marginTop: '12px', marginBottom: 0 }}>
            If your payment has been received, the administrator will approve this
            subscription shortly.
          </p>
        </div>
      )}

      {!receipt ? (
        <form
          onSubmit={handleSubmit}
          style={{
            background: 'rgba(255,255,255,0.20)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(0,255,136,0.20)',
            boxShadow: '0 0 15px rgba(0,255,136,0.18)',
            padding: '24px',
          }}
        >
          <h2 style={{ fontSize: '16px', color: '#0f172a', margin: '0 0 12px 0' }}>
            1. Choose a plan
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              marginBottom: '24px',
            }}
          >
            {plans.map((p) => {
              const isActive = selectedPlan === p.key
              return (
                <button
                  type="button"
                  key={p.key}
                  onClick={() => setSelectedPlan(p.key)}
                  style={{
                    padding: '18px 16px',
                    borderRadius: '14px',
                    border: isActive
                      ? '2px solid rgba(0,255,136,0.75)'
                      : '1px solid rgba(255,255,255,0.5)',
                    background: isActive
                      ? 'rgba(0,255,136,0.15)'
                      : 'rgba(255,255,255,0.4)',
                    boxShadow: isActive ? '0 0 20px rgba(0,255,136,0.35)' : 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#0f3d20',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {p.label}
                  </div>
                  <div
                    style={{
                      fontSize: '26px',
                      fontWeight: 800,
                      color: '#0f172a',
                      marginTop: '6px',
                    }}
                  >
                    USD {p.price}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#334155',
                      marginTop: '2px',
                    }}
                  >
                    {p.period}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#16803c',
                      fontWeight: 600,
                      marginTop: '8px',
                    }}
                  >
                    {p.note}
                  </div>
                </button>
              )
            })}
          </div>

          <h2 style={{ fontSize: '16px', color: '#0f172a', margin: '0 0 12px 0' }}>
            2. Choose a payment method
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '12px',
              marginBottom: '24px',
            }}
          >
            {methods.map((m) => {
              const isActive = selectedMethod === m.key
              return (
                <button
                  type="button"
                  key={m.key}
                  onClick={() => setSelectedMethod(m.key)}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    border: isActive
                      ? '2px solid rgba(0,255,136,0.75)'
                      : '1px solid rgba(255,255,255,0.5)',
                    background: isActive
                      ? 'rgba(0,255,136,0.15)'
                      : 'rgba(255,255,255,0.4)',
                    boxShadow: isActive ? '0 0 20px rgba(0,255,136,0.35)' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <span style={{ fontSize: '22px' }}>{m.icon}</span>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#0f172a',
                    }}
                  >
                    {m.label}
                  </span>
                </button>
              )
            })}
          </div>

          <h2 style={{ fontSize: '16px', color: '#0f172a', margin: '0 0 12px 0' }}>
            3. Your details
          </h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#1f2937',
                  marginBottom: '4px',
                }}
              >
                Email (same as your account)
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={(e) => fetchStatus(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  height: '46px',
                  padding: '0 14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '10px',
                  fontSize: '14px',
                  color: '#0f172a',
                  background: 'rgba(255,255,255,0.92)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#1f2937',
                  marginBottom: '4px',
                }}
              >
                {selectedMethod === 'bank'
                  ? 'Bank account number'
                  : 'Mobile number (EcoCash / Mukuru / InnBucks)'}
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={
                  selectedMethod === 'bank' ? 'e.g. 0123456789012' : 'e.g. 0771234567'
                }
                style={{
                  width: '100%',
                  height: '46px',
                  padding: '0 14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '10px',
                  fontSize: '14px',
                  color: '#0f172a',
                  background: 'rgba(255,255,255,0.92)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              height: '52px',
              background: loading ? '#94a3b8' : '#16803c',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 0 20px rgba(0,255,136,0.35)',
            }}
          >
            {loading ? 'Submitting...' : `Submit — USD ${planObj.price}`}
          </button>
        </form>
      ) : (
        <div
          style={{
            background: 'rgba(255,255,255,0.20)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(0,255,136,0.35)',
            boxShadow: '0 0 25px rgba(0,255,136,0.35)',
            padding: '24px',
          }}
        >
          <h2 style={{ fontSize: '18px', color: '#0f3d20', margin: 0 }}>
            ✅ Subscription submitted — pending approval
          </h2>
          <p style={{ fontSize: '14px', color: '#334155', marginTop: '10px' }}>
            Your reference code is:
          </p>
          <div
            style={{
              margin: '8px 0 18px',
              padding: '14px 18px',
              background: '#16803c',
              color: 'white',
              borderRadius: '12px',
              fontSize: '22px',
              fontWeight: 800,
              letterSpacing: '2px',
              textAlign: 'center',
            }}
          >
            {receipt.reference_code}
          </div>

          <div style={{ fontSize: '14px', color: '#1f2937', lineHeight: 1.7 }}>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Amount:</strong> USD {receipt.amount_usd.toFixed(2)}
            </p>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Plan:</strong> {receipt.plan}
            </p>
            <p style={{ margin: '0 0 12px 0' }}>
              <strong>Method:</strong> {receipt.payment_method}
            </p>
          </div>

          <div
            style={{
              background: 'rgba(255,248,225,0.85)',
              padding: '16px',
              borderRadius: '12px',
              marginTop: '12px',
            }}
          >
            <h3 style={{ fontSize: '14px', color: '#7a4a1f', margin: '0 0 6px 0' }}>
              Next: Complete your payment
            </h3>
            <p style={{ fontSize: '13px', color: '#334155', margin: 0, lineHeight: 1.7 }}>
              {methodObj.instructions}
            </p>
          </div>

          <button
            onClick={reset}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: 'transparent',
              color: '#16803c',
              border: '1px solid #16803c',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Submit another subscription
          </button>
        </div>
      )}
    </div>
  )
}
