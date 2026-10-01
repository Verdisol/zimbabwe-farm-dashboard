import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password, district, preferred_language } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      )
    }

    const sql = neon(process.env.DATABASE_URL!)

    const existing = await sql`SELECT id FROM farmers WHERE email = ${email}`
    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    const result = await sql`
      INSERT INTO farmers (name, email, password, district, preferred_language)
      VALUES (${name}, ${email}, ${password}, ${district || null}, ${preferred_language || 'en'})
      RETURNING id, name, email, district, preferred_language
    `

    return NextResponse.json({ success: true, farmer: result[0] }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    )
  }
}
