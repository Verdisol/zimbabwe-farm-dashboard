'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { getSavedLocation } from './locationData'

export default function DiseaseScanner() {
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [cropType, setCropType] = useState('Maize')
  const [farmerEmail, setFarmerEmail] = useState('')
  const [district, setDistrict] = useState('')

  useEffect(() => {
    const email = localStorage.getItem('farmerEmail') || 'unknown@farmer.com'
    setFarmerEmail(email)
    
    const loc = getSavedLocation()
    if (loc) setDistrict(loc.name)
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
      setPreview(URL.createObjectURL(e.target.files[0]))
      setResult(null)
    }
  }

  const handleScan = async () => {
    if (!image) {
      toast.error('Please upload an image first')
      return
    }
    setIsLoading(true)

    const formData = new FormData()
    formData.append('image', image)

    try {
      const res = await fetch('/api/diagnose', { method: 'POST', body: formData })
      const data = await res.json()

      if (res.ok) {
        setResult(data)
        toast.success('Scan complete!')
      } else {
        toast.error(data.error || 'Failed to scan image')
      }
    } catch (err) {
      toast.error('Network error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRaiseFlag = async () => {
    if (!result) return

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmer_email: farmerEmail,
          district: district,
          crop_type: cropType,
          ai_diagnosis: result.disease_name,
          confidence_score: result.probability * 100
        })
      })

      if (res.ok) {
        toast.success('🚩 Flag raised! An agronomist will review your case shortly.')
      } else {
        toast.error('Failed to raise flag.')
      }
    } catch (err) {
      toast.error('Network error')
    }
  }

  return (
    <div style={{ 
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url(/tractor-bg.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      borderRadius: '16px', 
      padding: '24px', 
      border: '1px solid rgba(0,255,136,0.20)',
      boxShadow: '0 0 15px rgba(0,255,136,0.18)'
    }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: '#0f3d20' }}>📸 AI Crop Disease Scanner</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px' }}>
        
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px', color: '#1f2937' }}>Select Crop</label>
          <select value={cropType} onChange={(e) => setCropType(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}>
            <option>Maize</option>
            <option>Tomatoes</option>
            <option>Potatoes</option>
            <option>Sorghum</option>
            <option>Groundnuts</option>
          </select>
        </div>

        <div style={{ border: '2px dashed #16803c', borderRadius: '12px', padding: '20px', textAlign: 'center', background: 'rgba(255,255,255,0.8)' }}>
          <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} id="file-upload" />
          <label htmlFor="file-upload" style={{ cursor: 'pointer', fontWeight: 600, color: '#16803c' }}>
            Tap to take a photo or upload
          </label>
          {preview && <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '16px', borderRadius: '8px' }} />}
        </div>

        <button onClick={handleScan} disabled={isLoading || !image} style={{ padding: '14px', background: isLoading || !image ? '#94a3b8' : '#16803c', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: isLoading || !image ? 'not-allowed' : 'pointer' }}>
          {isLoading ? 'Scanning with AI...' : 'Scan Leaf'}
        </button>

        {result && (
          <div style={{ background: 'rgba(255,248,225,0.95)', padding: '20px', borderRadius: '12px', border: '1px solid #f59e0b' }}>
            <h3 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>
              {result.is_healthy ? '✅ Healthy Plant Detected' : `⚠️ Detected: ${result.disease_name}`}
            </h3>
            {!result.is_healthy && (
              <>
                <p style={{ fontSize: '14px', marginBottom: '8px' }}><strong>Confidence:</strong> {(result.probability * 100).toFixed(1)}%</p>
                <p style={{ fontSize: '14px', marginBottom: '8px' }}><strong>Treatment:</strong> {result.treatment}</p>
                <p style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic', marginBottom: '16px' }}>{result.description}</p>
                
                <button onClick={handleRaiseFlag} style={{ padding: '12px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', width: '100%' }}>
                  🚩 Raise Flag for Agronomist Review
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
