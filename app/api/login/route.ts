import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const sql = neon(process.env.DATABASE_URL!)

    const rows = await sql`
      SELECT id, name, email, password, district, preferred_language
      FROM farmers
      WHERE email = ${email}
    `

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const farmer = rows[0]

    if (farmer.password !== password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      farmer: {
        id: farmer.id,
        name: farmer.name,
        email: farmer.email,
        district: farmer.district,
        preferred_language: farmer.preferred_language,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    )
  }
}
