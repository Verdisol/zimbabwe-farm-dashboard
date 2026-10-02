import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'

function generateReference() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = 'ZF-'
  for (let i = 0; i < 8; i++) {
    out += chars[Math.floor(Math.random() * chars.length)]
  }
  return out
}

const planPrices: Record<string, number> = {
  monthly: 2.0,
  quarterly: 5.0,
  yearly: 15.0,
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { farmer_email, plan, payment_method, phone_or_account } = body

    if (!farmer_email || !plan || !payment_method) {
      return NextResponse.json(
        { error: 'Email, plan and payment method are required' },
        { status: 400 }
      )
    }

    const amount = planPrices[plan]
    if (!amount) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const reference = generateReference()
    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`
      INSERT INTO subscriptions
        (farmer_email, plan, payment_method, phone_or_account, reference_code, amount_usd, status)
      VALUES
        (${farmer_email}, ${plan}, ${payment_method}, ${phone_or_account || null}, ${reference}, ${amount}, 'pending')
      RETURNING id, farmer_email, plan, payment_method, reference_code, amount_usd, status, created_at
    `

    return NextResponse.json({ success: true, subscription: result[0] }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    )
  }
}
