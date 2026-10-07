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
}

export type NaturalRegionKey = 'I' | 'II' | 'III' | 'IV' | 'V'

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

// ------------------------------------------------------------------
// Zimbabwe Natural Regions (NR I–V)
// Source: Farmonaut (2026). "Natural Farming Regions in Zimbabwe:
// 2025 Essential Guide", and Zimbabwe AGRITEX classifications.
// ------------------------------------------------------------------
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
    description:
      'High-rainfall, high-altitude zone. Best for intensive cropping and dairy. Rare droughts.',
  },
  II: {
    key: 'II',
    name: 'Natural Region II',
    rainfall: '750–1,000 mm',
    rainfallMin: 750,
    rainfallMax: 1000,
    soils: 'Sandy loams, moderately fertile',
    mainCrops: 'Maize, sorghum, millet, soybean, groundnut, tobacco',
    resilience: 'High',
    description:
      "Zimbabwe's main food bowl. Mixed farming with periodic dry spells. Supports most cereal and legume crops.",
  },
  III: {
    key: 'III',
    name: 'Natural Region III',
    rainfall: '650–800 mm',
    rainfallMin: 650,
    rainfallMax: 800,
    soils: 'Clay loams and light sandy soils',
    mainCrops: 'Sorghum, millet, groundnuts, sunflower',
    resilience: 'Medium',
    description:
      'Semi-arid zone with patchy rainfall. Drought-tolerant crops and livestock mixed farming.',
  },
  IV: {
    key: 'IV',
    name: 'Natural Region IV',
    rainfall: '450–650 mm',
    rainfallMin: 450,
    rainfallMax: 650,
    soils: 'Shallow sandy loams, low fertility',
    mainCrops: 'Pearl millet, sorghum, small beans, livestock',
    resilience: 'Low',
    description:
      'Arid, risk-prone zone. Focus on drought-tolerant grains and cattle, goats, sheep.',
  },
  V: {
    key: 'V',
    name: 'Natural Region V',
    rainfall: 'Less than 450 mm',
    rainfallMin: 0,
    rainfallMax: 450,
    soils: 'Kalahari sands, shallow rocky soils',
    mainCrops: 'Drought-hardy grains with irrigation; livestock and wildlife ranching',
    resilience: 'Low',
    description:
      'Most arid zone. Dryland cropping only with irrigation. Pastoralism and wildlife key.',
  },
}

// ------------------------------------------------------------------
// District → Natural Region mapping
// ------------------------------------------------------------------
const districtToRegion: Record<string, NaturalRegionKey> = {
  // NR I / II — Highveld
  Harare: 'II',
  Chitungwiza: 'II',
  Epworth: 'II',
  Mutare: 'II',
  Nyanga: 'I',
  Rusape: 'II',
  Marondera: 'II',
  Murehwa: 'II',
  Bindura: 'II',
  Chinhoyi: 'II',

  // NR II / III — Transitional
  Mutoko: 'III',
  Karoi: 'III',
  Chegutu: 'II',
  Kadoma: 'III',
  Gweru: 'III',
  Kwekwe: 'III',

  // NR III / IV — Semi-arid Midlands & Masvingo
  Masvingo: 'IV',
  Zvishavane: 'IV',
  Bikita: 'III',
  Gokwe: 'IV',

  // NR IV / V — Arid south
  Bulawayo: 'IV',
  Gwanda: 'IV',
  Beitbridge: 'V',
  Plumtree: 'V',
  Chiredzi: 'V',
  Hwange: 'V',
  Lupane: 'IV',
  'Victoria Falls': 'V',
  Chipinge: 'III',
}

export function getZoneFromLocation(districtName: string): NaturalRegionKey {
  return districtToRegion[districtName] || 'III'
}

export function getNaturalRegion(key: NaturalRegionKey): NaturalRegion {
  return naturalRegions[key]
}

// ------------------------------------------------------------------
// Crop requirements
// ------------------------------------------------------------------
export const crops: CropRequirement[] = [
  {
    name: 'Maize',
    minRainfall: 450,
    maxRainfall: 800,
    optimalRainfall: 600,
    droughtTolerance: 'low',
    growingDays: 120,
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
  },
  {
    name: 'Sorghum',
    minRainfall: 300,
    maxRainfall: 500,
    optimalRainfall: 400,
    droughtTolerance: 'high',
    growingDays: 110,
    bestRegions: ['III', 'IV', 'V'],
    description: 'Drought-tolerant small grain. Excellent for semi-arid regions.',
    plantingSteps: [
      'Plant with first rains in November-December',
      'Use improved varieties (e.g., Macia, SV4)',
      'Apply basal fertilizer at planting',
      'Thin to 25cm spacing between plants',
      'Control striga weed by rotating with legumes',
      'Harvest when grains hard and heads dry',
    ],
  },
  {
    name: 'Pearl Millet',
    minRainfall: 250,
    maxRainfall: 450,
    optimalRainfall: 350,
    droughtTolerance: 'very-high',
    growingDays: 100,
    bestRegions: ['IV', 'V'],
    description: 'Most drought-tolerant cereal. Thrives where other crops fail.',
    plantingSteps: [
      'Plant after first effective rains',
      'Broadcast or drill seed in rows',
      'Thin seedlings to 20-30cm apart',
      'Minimal fertilizer needed; apply if available',
      'Weed 2-3 times during early growth',
      'Harvest when heads turn brown and grains hard',
    ],
  },
  {
    name: 'Finger Millet',
    minRainfall: 350,
    maxRainfall: 600,
    optimalRainfall: 450,
    droughtTolerance: 'very-high',
    growingDays: 110,
    bestRegions: ['IV', 'V'],
    description: 'Traditional grain with high nutritional value. Very resilient.',
    plantingSteps: [
      'Plant with early rains in November',
      'Sow in rows 30cm apart',
      'Apply manure or basal fertilizer if available',
      'Thin to 10cm spacing',
      'Weed regularly during early stage',
      'Harvest when heads mature and grains shatter easily',
    ],
  },
  {
    name: 'Groundnuts',
    minRainfall: 450,
    maxRainfall: 600,
    optimalRainfall: 500,
    droughtTolerance: 'medium',
    growingDays: 120,
    bestRegions: ['II', 'III'],
    description: 'Legume that fixes nitrogen and provides protein and oil.',
    plantingSteps: [
      'Plant with first effective rains',
      'Use certified seed varieties',
      'Inoculate seed with rhizobium before planting',
      'Apply gypsum at flowering',
      'Control leaf spot disease',
      'Harvest when leaves yellow and pods mature',
    ],
  },
  {
    name: 'Cowpeas',
    minRainfall: 300,
    maxRainfall: 500,
    optimalRainfall: 400,
    droughtTolerance: 'high',
    growingDays: 90,
    bestRegions: ['III', 'IV', 'V'],
    description: 'Fast-maturing legume. Improves soil and provides protein.',
    plantingSteps: [
      'Plant with first rains',
      'Space plants 30cm apart',
      'Minimal fertilizer needed; legume fixes nitrogen',
      'Control aphids with soapy water or neem',
      'Harvest when pods dry and turn brown',
    ],
  },
  {
    name: 'Sunflower',
    minRainfall: 400,
    maxRainfall: 600,
    optimalRainfall: 500,
    droughtTolerance: 'medium',
    growingDays: 110,
    bestRegions: ['II', 'III'],
    description: 'Oilseed crop with good market demand. Moderately drought-tolerant.',
    plantingSteps: [
      'Plant at onset of rains',
      'Space rows 75cm apart, plants 25cm apart',
      'Apply basal fertilizer',
      'Control weeds in first 6 weeks',
      'Harvest when heads turn brown and seeds dry',
    ],
  },
]

/**
 * Recommend crops based on estimated seasonal rainfall (mm),
 * drought status, and natural region.
 */
export function getCropAdvice(
  seasonalRainfall: number,
  droughtStatus: string,
  regionKey: NaturalRegionKey
): CropRequirement[] {
  const isDrought =
    droughtStatus === 'drought' || droughtStatus === 'extreme-drought'

  // Base pool: crops suited to the natural region
  let pool = crops.filter((c) => c.bestRegions.includes(regionKey))

  // If pool is empty for that region, fall back to drought-tolerant crops
  if (pool.length === 0) {
    pool = crops.filter(
      (c) => c.droughtTolerance === 'high' || c.droughtTolerance === 'very-high'
    )
  }

  // If drought: keep only high / very-high drought-tolerant crops
  if (isDrought) {
    pool = pool.filter(
      (c) => c.droughtTolerance === 'high' || c.droughtTolerance === 'very-high'
    )
  }

  // Rainfall filter: seasonal rainfall ≥ 70% of crop min
  return pool.filter((c) => seasonalRainfall >= c.minRainfall * 0.7)
}
