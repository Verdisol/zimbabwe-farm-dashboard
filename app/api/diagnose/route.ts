import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image') as File

    if (!imageFile) {
      return NextResponse.json({ error: 'No image uploaded' }, { status: 400 })
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer())
    const base64Image = buffer.toString('base64')

    const response = await fetch('https://plant.id/api/v3/identification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': process.env.PLANT_ID_API_KEY!,
      },
      body: JSON.stringify({
        images: [base64Image],
        health: 'all', 
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Plant.id API failed')
    }

    // --- Improved Parsing Logic ---
    const diseaseSuggestions = data.result?.disease?.suggestions || []
    
    // Find the first disease with a probability > 10% to filter out noise
    const topDisease = diseaseSuggestions.find((d: any) => d.probability > 0.1)
    
    // If we found a disease, we override the "healthy" status
    const isHealthy = !topDisease 
    
    let treatmentText = 'Consult an agronomist for treatment options.'
    if (topDisease && topDisease.details?.treatment) {
      const t = topDisease.details.treatment
      treatmentText = t.biological || t.chemical || t.prevention || treatmentText
    }

    return NextResponse.json({
      success: true,
      is_healthy: isHealthy,
      disease_name: topDisease?.name || 'Unknown',
      probability: topDisease?.probability || 0,
      treatment: treatmentText,
      description: topDisease?.details?.description || 'No specific description available.'
    })

  } catch (error: any) {
    console.error("Diagnosis Error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
