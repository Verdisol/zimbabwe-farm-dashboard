import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image') as File

    if (!imageFile) {
      return NextResponse.json({ error: 'No image uploaded' }, { status: 400 })
    }

    // Convert image to base64
    const buffer = Buffer.from(await imageFile.arrayBuffer())
    const base64Image = buffer.toString('base64')

    // Call Plant.id v3 API
    const response = await fetch('https://plant.id/api/v3/identification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': process.env.PLANT_ID_API_KEY!,
      },
      body: JSON.stringify({
        images: [base64Image],
        health: 'all', 
        similar_images: true,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      const errorMsg = data.message || data.error || 'Plant.id API failed'
      throw new Error(errorMsg)
    }

    // Parse v3 Response
    const isHealthy = data.result?.is_healthy?.binary ?? false
    const diseaseSuggestions = data.result?.disease?.suggestions || []
    const topDisease = diseaseSuggestions.length > 0 ? diseaseSuggestions[0] : null

    const treatment = topDisease?.details?.treatment || {}
    const treatmentText = treatment.biological || treatment.chemical || treatment.prevention || 'Consult an agronomist.'

    return NextResponse.json({
      success: true,
      is_healthy: isHealthy,
      disease_name: topDisease?.name || 'Unknown',
      probability: topDisease?.probability || 0,
      treatment: treatmentText,
      description: topDisease?.details?.description || ''
    })

  } catch (error: any) {
    console.error("Diagnosis Error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
