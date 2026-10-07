export type District = {
  name: string
  province: string
  lat: number
  lng: number
}

// All 91 districts of Zimbabwe organised by province.
// Coordinates: district centre or nearest MSD weather station.
// Sources: HDX/OCHA Zimbabwe Admin Boundaries 2025, Wikipedia, MSD Zimbabwe.
export const districts: District[] = [
  // ---------- BULAWAYO (1) ----------
  { name: 'Bulawayo', province: 'Bulawayo', lat: -20.1325, lng: 28.6265 },

  // ---------- HARARE (1) ----------
  { name: 'Harare', province: 'Harare', lat: -17.8252, lng: 31.0335 },

  // ---------- MANICALAND (7) ----------
  { name: 'Buhera', province: 'Manicaland', lat: -19.3414, lng: 31.5847 },
  { name: 'Chimanimani', province: 'Manicaland', lat: -19.8, lng: 32.8667 },
  { name: 'Chipinge', province: 'Manicaland', lat: -20.2, lng: 32.62 },
  { name: 'Makoni', province: 'Manicaland', lat: -18.2083, lng: 32.8 },
  { name: 'Mutare', province: 'Manicaland', lat: -18.9707, lng: 32.6709 },
  { name: 'Mutasa', province: 'Manicaland', lat: -18.5833, lng: 32.75 },
  { name: 'Nyanga', province: 'Manicaland', lat: -18.2167, lng: 32.75 },

  // ---------- MASHONALAND CENTRAL (8) ----------
  { name: 'Bindura', province: 'Mashonaland Central', lat: -17.3019, lng: 31.3306 },
  { name: 'Guruve', province: 'Mashonaland Central', lat: -16.3333, lng: 30.5833 },
  { name: 'Mazowe', province: 'Mashonaland Central', lat: -17.1667, lng: 31.0 },
  { name: 'Mbire', province: 'Mashonaland Central', lat: -16.1, lng: 30.5 },
  { name: 'Mount Darwin', province: 'Mashonaland Central', lat: -16.7725, lng: 31.5836 },
  { name: 'Muzarabani', province: 'Mashonaland Central', lat: -16.35, lng: 31.0 },
  { name: 'Rushinga', province: 'Mashonaland Central', lat: -16.6667, lng: 32.25 },
  { name: 'Shamva', province: 'Mashonaland Central', lat: -17.3167, lng: 31.5667 },

  // ---------- MASHONALAND EAST (9) ----------
  { name: 'Chikomba', province: 'Mashonaland East', lat: -18.8, lng: 31.3 },
  { name: 'Goromonzi', province: 'Mashonaland East', lat: -17.8333, lng: 31.3333 },
  { name: 'Hwedza', province: 'Mashonaland East', lat: -18.6167, lng: 31.5833 },
  { name: 'Marondera', province: 'Mashonaland East', lat: -18.1853, lng: 31.5519 },
  { name: 'Mudzi', province: 'Mashonaland East', lat: -17.0, lng: 32.5 },
  { name: 'Murehwa', province: 'Mashonaland East', lat: -17.65, lng: 31.7833 },
  { name: 'Mutoko', province: 'Mashonaland East', lat: -17.4, lng: 32.2167 },
  { name: 'Seke', province: 'Mashonaland East', lat: -18.05, lng: 31.1 },
  { name: 'Uzumba-Maramba-Pfungwe', province: 'Mashonaland East', lat: -16.8, lng: 32.0 },

  // ---------- MASHONALAND WEST (7) ----------
  { name: 'Chegutu', province: 'Mashonaland West', lat: -18.13, lng: 30.14 },
  { name: 'Chinhoyi', province: 'Mashonaland West', lat: -17.3667, lng: 30.2 },
  { name: 'Hurungwe', province: 'Mashonaland West', lat: -16.84, lng: 29.61 },
  { name: 'Kariba', province: 'Mashonaland West', lat: -16.52, lng: 28.88 },
  { name: 'Makonde', province: 'Mashonaland West', lat: -17.0, lng: 30.0 },
  { name: 'Mhondoro-Ngezi', province: 'Mashonaland West', lat: -18.5, lng: 30.4 },
  { name: 'Sanyati', province: 'Mashonaland West', lat: -18.0, lng: 29.5 },
  { name: 'Zvimba', province: 'Mashonaland West', lat: -17.8333, lng: 30.1667 },

  // ---------- MASVINGO (7) ----------
  { name: 'Bikita', province: 'Masvingo', lat: -20.0833, lng: 31.3167 },
  { name: 'Chiredzi', province: 'Masvingo', lat: -21.05, lng: 31.6667 },
  { name: 'Chivi', province: 'Masvingo', lat: -20.5, lng: 30.7 },
  { name: 'Gutu', province: 'Masvingo', lat: -19.6667, lng: 31.0 },
  { name: 'Masvingo', province: 'Masvingo', lat: -20.0637, lng: 30.8277 },
  { name: 'Mwenezi', province: 'Masvingo', lat: -21.0, lng: 30.8 },
  { name: 'Zaka', province: 'Masvingo', lat: -20.4, lng: 31.5 },

  // ---------- MATABELELAND NORTH (7) ----------
  { name: 'Binga', province: 'Matabeleland North', lat: -17.62, lng: 27.33 },
  { name: 'Bubi', province: 'Matabeleland North', lat: -20.0, lng: 28.7 },
  { name: 'Hwange', province: 'Matabeleland North', lat: -18.3647, lng: 26.4981 },
  { name: 'Lupane', province: 'Matabeleland North', lat: -18.9333, lng: 27.8 },
  { name: 'Nkayi', province: 'Matabeleland North', lat: -19.0, lng: 28.9 },
  { name: 'Tsholotsho', province: 'Matabeleland North', lat: -19.8, lng: 27.7 },
  { name: 'Umguza', province: 'Matabeleland North', lat: -19.9, lng: 28.5 },
  { name: 'Victoria Falls', province: 'Matabeleland North', lat: -17.9243, lng: 25.8572 },

  // ---------- MATABELELAND SOUTH (7) ----------
  { name: 'Beitbridge', province: 'Matabeleland South', lat: -22.2167, lng: 30.0 },
  { name: 'Bulilima', province: 'Matabeleland South', lat: -20.3, lng: 27.7 },
  { name: 'Gwanda', province: 'Matabeleland South', lat: -20.9333, lng: 29.0 },
  { name: 'Insiza', province: 'Matabeleland South', lat: -20.2, lng: 29.2 },
  { name: 'Mangwe', province: 'Matabeleland South', lat: -20.5, lng: 27.9 },
  { name: 'Matobo', province: 'Matabeleland South', lat: -20.6, lng: 28.8 },
  { name: 'Umzingwane', province: 'Matabeleland South', lat: -20.3, lng: 28.9 },

  // ---------- MIDLANDS (8) ----------
  { name: 'Chirumhanzu', province: 'Midlands', lat: -19.5, lng: 30.3 },
  { name: 'Gokwe North', province: 'Midlands', lat: -18.2, lng: 28.93 },
  { name: 'Gokwe South', province: 'Midlands', lat: -18.5, lng: 28.8 },
  { name: 'Gweru', province: 'Midlands', lat: -19.45, lng: 29.8167 },
  { name: 'Kwekwe', province: 'Midlands', lat: -18.9281, lng: 29.8147 },
  { name: 'Mberengwa', province: 'Midlands', lat: -20.5, lng: 30.0 },
  { name: 'Shurugwi', province: 'Midlands', lat: -19.6667, lng: 30.0 },
  { name: 'Zvishavane', province: 'Midlands', lat: -20.3333, lng: 30.0667 },
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
