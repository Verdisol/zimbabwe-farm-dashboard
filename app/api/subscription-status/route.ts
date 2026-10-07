import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter required' },
        { status: 400 }
      )
    }

    const sql = neon(process.env.DATABASE_URL!)

    const rows = await sql`
      SELECT id, plan, payment_method, reference_code, amount_usd, status, created_at
      FROM subscriptions
      WHERE farmer_email = ${email}
      ORDER BY created_at DESC
      LIMIT 1
    `

    if (rows.length === 0) {
      return NextResponse.json({ hasSubscription: false })
    }

    return NextResponse.json({
      hasSubscription: true,
      subscription: rows[0],
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    )
  }
}
