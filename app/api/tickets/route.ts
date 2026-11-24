import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { farmer_email, district, crop_type, ai_diagnosis, confidence_score } = body

    const sql = neon(process.env.DATABASE_URL!)

    await sql`
      INSERT INTO disease_tickets (farmer_email, district, crop_type, ai_diagnosis, confidence_score)
      VALUES (${farmer_email}, ${district}, ${crop_type}, ${ai_diagnosis}, ${confidence_score})
    `

    return NextResponse.json({ success: true, message: 'Ticket raised successfully' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
