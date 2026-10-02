export type District = {
  name: string
  province: string
  lat: number
  lng: number
}

export const districts: District[] = [
  // Harare Province
  { name: 'Harare', province: 'Harare', lat: -17.8252, lng: 31.0335 },
  { name: 'Chitungwiza', province: 'Harare', lat: -18.0127, lng: 31.0755 },
  { name: 'Epworth', province: 'Harare', lat: -17.8894, lng: 31.1475 },
  { name: 'Murehwa', province: 'Mashonaland East', lat: -17.65, lng: 31.7833 },
  { name: 'Marondera', province: 'Mashonaland East', lat: -18.1853, lng: 31.5519 },
  { name: 'Mutoko', province: 'Mashonaland East', lat: -17.4, lng: 32.2167 },
  { name: 'Wedza', province: 'Mashonaland East', lat: -18.6167, lng: 31.5833 },

  // Bulawayo
  { name: 'Bulawayo', province: 'Bulawayo', lat: -20.1325, lng: 28.6265 },

  // Manicaland
  { name: 'Mutare', province: 'Manicaland', lat: -18.9707, lng: 32.6709 },
  { name: 'Chipinge', province: 'Manicaland', lat: -20.1889, lng: 32.6236 },
  { name: 'Nyanga', province: 'Manicaland', lat: -18.2167, lng: 32.75 },
  { name: 'Rusape', province: 'Manicaland', lat: -18.5294, lng: 32.1303 },

  // Mashonaland Central
  { name: 'Bindura', province: 'Mashonaland Central', lat: -17.3019, lng: 31.3306 },
  { name: 'Mount Darwin', province: 'Mashonaland Central', lat: -16.7725, lng: 31.5836 },
  { name: 'Shamva', province: 'Mashonaland Central', lat: -17.3167, lng: 31.5667 },

  // Mashonaland West
  { name: 'Chinhoyi', province: 'Mashonaland West', lat: -17.3667, lng: 30.2 },
  { name: 'Karoi', province: 'Mashonaland West', lat: -16.81, lng: 29.6917 },
  { name: 'Kadoma', province: 'Mashonaland West', lat: -18.3333, lng: 29.9167 },
  { name: 'Chegutu', province: 'Mashonaland West', lat: -18.13, lng: 30.14 },

  // Masvingo
  { name: 'Masvingo', province: 'Masvingo', lat: -20.0637, lng: 30.8277 },
  { name: 'Chiredzi', province: 'Masvingo', lat: -21.05, lng: 31.6667 },
  { name: 'Zvishavane', province: 'Masvingo', lat: -20.3333, lng: 30.0667 },
  { name: 'Bikita', province: 'Masvingo', lat: -20.0833, lng: 31.3167 },

  // Matabeleland North
  { name: 'Hwange', province: 'Matabeleland North', lat: -18.3647, lng: 26.4981 },
  { name: 'Victoria Falls', province: 'Matabeleland North', lat: -17.9243, lng: 25.8572 },
  { name: 'Lupane', province: 'Matabeleland North', lat: -18.9333, lng: 27.8 },

  // Matabeleland South
  { name: 'Gwanda', province: 'Matabeleland South', lat: -20.9333, lng: 29.0 },
  { name: 'Beitbridge', province: 'Matabeleland South', lat: -22.2167, lng: 30.0 },
  { name: 'Plumtree', province: 'Matabeleland South', lat: -20.4833, lng: 27.8167 },

  // Midlands
  { name: 'Gweru', province: 'Midlands', lat: -19.45, lng: 29.8167 },
  { name: 'Kwekwe', province: 'Midlands', lat: -18.9281, lng: 29.8147 },
  { name: 'Zvishavane', province: 'Midlands', lat: -20.3333, lng: 30.0667 },
  { name: 'Gokwe', province: 'Midlands', lat: -18.2, lng: 28.9333 },
]

export function findNearestDistrict(lat: number, lng: number): District {
  let nearest = districts[0]
  let minDist = Infinity
  for (const d of districts) {
    const dx = d.lat - lat
    const dy = d.lng - lng
    const dist = dx * dx + dy * dy
    if (dist < minDist) {
      minDist = dist
      nearest = d
    }
  }
  return nearest
}

export function getSavedLocation(): District | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem('farmerLocation')
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

export function saveLocation(district: District) {
  if (typeof window === 'undefined') return
  localStorage.setItem('farmerLocation', JSON.stringify(district))
  window.dispatchEvent(new Event('locationChanged'))
}
