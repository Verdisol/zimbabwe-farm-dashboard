export type NaturalRegionKey = 'I' | 'II' | 'III' | 'IV' | 'V'

export type CropVariety = {
  name: string
  maturityDays: number
  maturityClass: 'ultra-early' | 'early' | 'medium' | 'late'
  droughtTolerance: 'low' | 'medium' | 'high' | 'very-high'
  yieldPotential: string
  note: string
}

export type GrowingConditions = {
  optimalTempMin: number
  optimalTempMax: number
  frostSensitive: boolean
  sunlightHours: number
  humidityMin: number
  humidityMax: number
  windTolerant: boolean
  offSeasonPossible: boolean
}

export type CropRequirement = {
  name: string
  minRainfall: number
  maxRainfall: number
  optimalRainfall: number
  droughtTolerance: 'low' | 'medium' | 'high' | 'very-high'
  growingDays: number
  bestRegions: NaturalRegionKey[]
  description: string
  plantingSteps: string[]
  varieties: CropVariety[]
  peakWaterMmPerWeek: number
  irrigationNote: string
  growingConditions: GrowingConditions
  offSeasonMonths: string[]
}

export type NaturalRegion = {
  key: NaturalRegionKey
  name: string
  rainfall: string
  rainfallMin: number
  rainfallMax: number
  soils: string
  mainCrops: string
  resilience: 'High' | 'Medium' | 'Medium–Low' | 'Low'
  description: string
}

export const naturalRegions: Record<NaturalRegionKey, NaturalRegion> = {
  I: {
    key: 'I',
    name: 'Natural Region I',
    rainfall: 'Over 1,000 mm',
    rainfallMin: 1000,
    rainfallMax: 1200,
    soils: 'Deep, fertile red and brown loams',
    mainCrops: 'Maize, wheat, tobacco, horticulture, tea, coffee',
    resilience: 'High',
    description: 'High-rainfall, high-altitude zone. Best for intensive cropping and dairy.',
  },
  II: {
    key: 'II',
    name: 'Natural Region II',
    rainfall: '750–1,000 mm',
    rainfallMin: 750,
    rainfallMax: 1000,
    soils: 'Sandy loams, moderately fertile',
    mainCrops: 'Maize, sorghum, millet, soybean, groundnut, tobacco, cotton',
    resilience: 'High',
    description: "Zimbabwe's main food bowl. Mixed farming with periodic dry spells.",
  },
  III: {
    key: 'III',
    name: 'Natural Region III',
    rainfall: '650–800 mm',
    rainfallMin: 650,
    rainfallMax: 800,
    soils: 'Clay loams and light sandy soils',
    mainCrops: 'Sorghum, millet, groundnuts, sunflower, cotton',
    resilience: 'Medium',
    description: 'Semi-arid zone with patchy rainfall. Drought-tolerant crops and livestock.',
  },
  IV: {
    key: 'IV',
    name: 'Natural Region IV',
    rainfall: '450–650 mm',
    rainfallMin: 450,
    rainfallMax: 650,
    soils: 'Shallow sandy loams, low fertility',
    mainCrops: 'Pearl millet, sorghum, small beans, cotton, livestock',
    resilience: 'Low',
    description: 'Arid, risk-prone zone. Focus on drought-tolerant grains and livestock.',
  },
  V: {
    key: 'V',
    name: 'Natural Region V',
    rainfall: 'Less than 450 mm',
    rainfallMin: 0,
    rainfallMax: 450,
    soils: 'Kalahari sands, shallow rocky soils',
    mainCrops: 'Drought-hardy grains with irrigation; cotton; livestock',
    resilience: 'Low',
    description: 'Most arid zone. Dryland cropping only with irrigation.',
  },
}

const districtToRegion: Record<string, NaturalRegionKey> = {
  Harare: 'II', Chitungwiza: 'II', Epworth: 'II', Mutare: 'II', Nyanga: 'I',
  Rusape: 'II', Marondera: 'II', Murehwa: 'II', Bindura: 'II', Chinhoyi: 'II',
  Mutoko: 'III', Karoi: 'III', Chegutu: 'II', Kadoma: 'III', Gweru: 'III',
  Kwekwe: 'III', Masvingo: 'IV', Zvishavane: 'IV', Bikita: 'III', Gokwe: 'IV',
  Bulawayo: 'IV', Gwanda: 'IV', Beitbridge: 'V', Plumtree: 'V', Chiredzi: 'V',
  Hwange: 'V', Lupane: 'IV', 'Victoria Falls': 'V', Chipinge: 'III',
}

export function getZoneFromLocation(districtName: string): NaturalRegionKey {
  return districtToRegion[districtName] || 'III'
}

export function getNaturalRegion(key: NaturalRegionKey): NaturalRegion {
  return naturalRegions[key]
}

// ------------------------------------------------------------------
// Crops with growing conditions for off-season planning
// ------------------------------------------------------------------
export const crops: CropRequirement[] = [
  {
    name: 'Maize',
    minRainfall: 450, maxRainfall: 800, optimalRainfall: 600,
    droughtTolerance: 'low', growingDays: 120,
    bestRegions: ['I', 'II'],
    description: 'Staple food crop. Requires consistent rainfall and fertile soil.',
    plantingSteps: [
      'Plant with first effective rains (25mm over 7 days)',
      'Use certified drought-tolerant varieties in marginal areas',
      'Apply basal fertilizer (Compound D) at planting',
      'Top dress with Ammonium Nitrate at 3, 6, and 9 weeks',
      'Scout for fall armyworm weekly',
      'Harvest when husks dry and kernels are hard',
    ],
    varieties: [
      { name: 'SC 449 (Seed Co)', maturityDays: 90, maturityClass: 'ultra-early', droughtTolerance: 'high', yieldPotential: 'Up to 8 t/ha', note: 'Ultra-early hybrid — escapes late-season drought.' },
      { name: 'SC 419 (Seed Co)', maturityDays: 120, maturityClass: 'early', droughtTolerance: 'medium', yieldPotential: 'Up to 14 t/ha', note: 'Very early-maturing, strong stay-green.' },
      { name: 'SC 633 (Seed Co)', maturityDays: 140, maturityClass: 'medium', droughtTolerance: 'medium', yieldPotential: 'Up to 15 t/ha', note: 'Medium maturing, high yielding.' },
      { name: 'SC 719 (Seed Co)', maturityDays: 150, maturityClass: 'late', droughtTolerance: 'low', yieldPotential: 'Up to 16 t/ha', note: 'Top late-maturing hybrid.' },
      { name: 'SC 727 (Seed Co)', maturityDays: 158, maturityClass: 'late', droughtTolerance: 'low', yieldPotential: 'Highest yielder in Zimbabwe', note: 'Best yielder. Needs full season.' },
    ],
    peakWaterMmPerWeek: 60,
    irrigationNote: 'Peak demand 60–70 mm/week during flowering and grain filling.',
    growingConditions: {
      optimalTempMin: 18, optimalTempMax: 30, frostSensitive: true,
      sunlightHours: 6, humidityMin: 40, humidityMax: 80,
      windTolerant: false, offSeasonPossible: true,
    },
    offSeasonMonths: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
  },
  {
    name: 'Sorghum',
    minRainfall: 300, maxRainfall: 500, optimalRainfall: 400,
    droughtTolerance: 'high', growingDays: 110,
    bestRegions: ['III', 'IV', 'V'],
    description: 'Drought-tolerant small grain. Excellent for semi-arid regions.',
    plantingSteps: [
      'Plant with first rains in November-December',
      'Use improved varieties (Macia, SV4)',
      'Apply basal fertilizer at planting',
      'Thin to 25cm spacing',
      'Control striga weed by rotating with legumes',
      'Harvest when grains hard and heads dry',
    ],
    varieties: [
      { name: 'Macia (SDS 3220)', maturityDays: 115, maturityClass: 'early', droughtTolerance: 'high', yieldPotential: 'Up to 3 t/ha', note: 'Popular white sorghum for dry regions IV and V.' },
      { name: 'SV 2', maturityDays: 110, maturityClass: 'early', droughtTolerance: 'very-high', yieldPotential: 'Up to 2.5 t/ha', note: 'Early maturity suited to Zimbabwe dry areas.' },
    ],
    peakWaterMmPerWeek: 45,
    irrigationNote: 'Needs 400–500 mm total. Supplement during flowering if dry spell > 10 days.',
    growingConditions: {
      optimalTempMin: 20, optimalTempMax: 35, frostSensitive: true,
      sunlightHours: 6, humidityMin: 30, humidityMax: 70,
      windTolerant: true, offSeasonPossible: true,
    },
    offSeasonMonths: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
  },
  {
    name: 'Pearl Millet',
    minRainfall: 250, maxRainfall: 450, optimalRainfall: 350,
    droughtTolerance: 'very-high', growingDays: 100,
    bestRegions: ['IV', 'V'],
    description: 'Most drought-tolerant cereal. Thrives where other crops fail.',
    plantingSteps: [
      'Plant after first effective rains',
      'Broadcast or drill seed in rows',
      'Thin seedlings to 20-30cm apart',
      'Minimal fertilizer needed',
      'Weed 2-3 times during early growth',
      'Harvest when heads turn brown and grains hard',
    ],
    varieties: [
      { name: 'PMV 2 (SDMV 89004)', maturityDays: 85, maturityClass: 'ultra-early', droughtTolerance: 'very-high', yieldPotential: 'Up to 2 t/ha', note: 'Released 1992. Matures in 80–90 days.' },
    ],
    peakWaterMmPerWeek: 35,
    irrigationNote: 'Very drought-tolerant. Supplementary irrigation rarely needed.',
    growingConditions: {
      optimalTempMin: 22, optimalTempMax: 38, frostSensitive: true,
      sunlightHours: 7, humidityMin: 25, humidityMax: 60,
      windTolerant: true, offSeasonPossible: true,
    },
    offSeasonMonths: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
  },
  {
    name: 'Groundnuts',
    minRainfall: 450, maxRainfall: 600, optimalRainfall: 500,
    droughtTolerance: 'medium', growingDays: 120,
    bestRegions: ['II', 'III'],
    description: 'Legume that fixes nitrogen and provides protein and oil.',
    plantingSteps: [
      'Plant with first effective rains',
      'Use certified seed',
      'Inoculate seed with rhizobium',
      'Apply gypsum at flowering',
      'Control leaf spot disease',
      'Harvest when leaves yellow and pods mature',
    ],
    varieties: [
      { name: 'Ilanda', maturityDays: 90, maturityClass: 'ultra-early', droughtTolerance: 'high', yieldPotential: 'Up to 4 t/ha', note: 'Very short season (85–100 days). Escapes drought.' },
      { name: 'Nyanda', maturityDays: 93, maturityClass: 'early', droughtTolerance: 'medium', yieldPotential: 'Up to 2.3 t/ha', note: 'Short season, released 2000.' },
      { name: 'Jesa', maturityDays: 122, maturityClass: 'medium', droughtTolerance: 'medium', yieldPotential: 'Up to 3.2 t/ha', note: 'Good resistance to early leaf spot.' },
      { name: 'Flamingo', maturityDays: 175, maturityClass: 'late', droughtTolerance: 'low', yieldPotential: 'Up to 3 t/ha', note: 'Long season (150–200 days). Full-season areas only.' },
    ],
    peakWaterMmPerWeek: 50,
    irrigationNote: 'Critical: flowering to pod fill. Needs 500–600 mm total.',
    growingConditions: {
      optimalTempMin: 20, optimalTempMax: 30, frostSensitive: true,
      sunlightHours: 6, humidityMin: 50, humidityMax: 80,
      windTolerant: false, offSeasonPossible: true,
    },
    offSeasonMonths: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
  },
  {
    name: 'Cowpeas',
    minRainfall: 300, maxRainfall: 500, optimalRainfall: 400,
    droughtTolerance: 'high', growingDays: 90,
    bestRegions: ['III', 'IV', 'V'],
    description: 'Fast-maturing legume. Improves soil and provides protein.',
    plantingSteps: [
      'Plant with first rains',
      'Space plants 30cm apart',
      'Minimal fertilizer needed',
      'Control aphids with soapy water or neem',
      'Harvest when pods dry and turn brown',
    ],
    varieties: [
      { name: 'CBC2 (Crop Breeding Institute)', maturityDays: 80, maturityClass: 'ultra-early', droughtTolerance: 'very-high', yieldPotential: 'Up to 2.5 t/ha', note: 'Matures in 75–85 days. NR III, IV, V.' },
      { name: 'CBC1', maturityDays: 80, maturityClass: 'ultra-early', droughtTolerance: 'very-high', yieldPotential: 'Up to 2 t/ha', note: 'Fits short-rain areas.' },
    ],
    peakWaterMmPerWeek: 40,
    irrigationNote: 'Needs 300–500 mm total. Responds to irrigation during flowering.',
    growingConditions: {
      optimalTempMin: 20, optimalTempMax: 35, frostSensitive: true,
      sunlightHours: 6, humidityMin: 30, humidityMax: 70,
      windTolerant: true, offSeasonPossible: true,
    },
    offSeasonMonths: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
  },
  {
    name: 'Sunflower',
    minRainfall: 400, maxRainfall: 600, optimalRainfall: 500,
    droughtTolerance: 'medium', growingDays: 110,
    bestRegions: ['II', 'III'],
    description: 'Oilseed crop with good market demand. Moderately drought-tolerant.',
    plantingSteps: [
      'Plant at onset of rains',
      'Space rows 75cm apart, plants 25cm apart',
      'Apply basal fertilizer',
      'Control weeds in first 6 weeks',
      'Harvest when heads turn brown and seeds dry',
    ],
    varieties: [
      { name: 'Msasa (Hybrid)', maturityDays: 83, maturityClass: 'ultra-early', droughtTolerance: 'high', yieldPotential: 'Up to 3 t/ha, 45% oil', note: 'Head nods at maturity. Best for marginal areas.' },
      { name: 'Hybrid (DR&SS)', maturityDays: 100, maturityClass: 'early', droughtTolerance: 'medium', yieldPotential: 'Up to 3 t/ha, 49% oil', note: 'Improved disease tolerance.' },
    ],
    peakWaterMmPerWeek: 50,
    irrigationNote: 'Needs 400–600 mm total. Critical: flowering and seed fill.',
    growingConditions: {
      optimalTempMin: 20, optimalTempMax: 30, frostSensitive: true,
      sunlightHours: 7, humidityMin: 40, humidityMax: 70,
      windTolerant: true, offSeasonPossible: true,
    },
    offSeasonMonths: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
  },
  // ---------- OFF-SEASON HORTICULTURE ----------
  {
    name: 'Tomatoes',
    minRainfall: 400, maxRainfall: 600, optimalRainfall: 500,
    droughtTolerance: 'low', growingDays: 120,
    bestRegions: ['I', 'II'],
    description: 'High-value horticulture. Grown year-round under irrigation, tunnels, or open field.',
    plantingSteps: [
      'Start seedlings in nursery 4–6 weeks before transplanting',
      'Transplant when 12–15cm tall',
      'Space 60cm between rows, 40cm within rows',
      'Apply basal fertilizer at transplanting',
      'Stake and prune indeterminates weekly',
      'Harvest at colour break for market',
    ],
    varieties: [
      { name: 'Trinity', maturityDays: 90, maturityClass: 'early', droughtTolerance: 'medium', yieldPotential: '40kg/crate, 5000+ kg/ha', note: 'Can be grown throughout the year. Resistant to nematodes. Popular in Mutoko.' },
      { name: 'Cadella', maturityDays: 95, maturityClass: 'medium', droughtTolerance: 'medium', yieldPotential: 'High tunnel yield', note: 'Long shelf life. Recommended for tunnel production.' },
    ],
    peakWaterMmPerWeek: 55,
    irrigationNote: 'Drip irrigation preferred. Avoid overhead to reduce disease. Water daily in hot weather.',
    growingConditions: {
      optimalTempMin: 18, optimalTempMax: 28, frostSensitive: true,
      sunlightHours: 6, humidityMin: 50, humidityMax: 70,
      windTolerant: false, offSeasonPossible: true
