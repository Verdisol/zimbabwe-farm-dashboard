export type CropRequirement = {
  name: string
  minRainfall: number
  maxRainfall: number
  optimalRainfall: number
  droughtTolerance: 'low' | 'medium' | 'high' | 'very-high'
  growingDays: number
  bestZones: string[]
  description: string
  plantingSteps: string[]
}

export const crops: CropRequirement[] = [
  {
    name: 'Maize',
    minRainfall: 450,
    maxRainfall: 800,
    optimalRainfall: 600,
    droughtTolerance: 'low',
    growingDays: 120,
    bestZones: ['II', 'III'],
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
    bestZones: ['III', 'IV', 'V'],
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
    bestZones: ['IV', 'V'],
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
    bestZones: ['IV', 'V'],
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
    bestZones: ['II', 'III'],
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
    bestZones: ['III', 'IV', 'V'],
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
    bestZones: ['II', 'III'],
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
 * Recommend crops based on the estimated seasonal rainfall (mm)
 * and the drought status.
 *
 * Logic:
 *  - If drought or extreme drought → keep only high / very-high drought-tolerant crops
 *  - A crop is recommended if seasonal rainfall is at least 70% of its minimum requirement
 *    (this allows some flexibility for uncertain estimates)
 */
export function getCropAdvice(
  seasonalRainfall: number,
  droughtStatus: string
): CropRequirement[] {
  const isDrought =
    droughtStatus === 'drought' || droughtStatus === 'extreme-drought'

  const pool = isDrought
    ? crops.filter(
        (c) =>
          c.droughtTolerance === 'high' ||
          c.droughtTolerance === 'very-high'
      )
    : crops

  return pool.filter((c) => seasonalRainfall >= c.minRainfall * 0.7)
}

export function getZoneFromLocation(districtName: string): string {
  const zoneMap: Record<string, string> = {
    Harare: 'II',
    Chitungwiza: 'II',
    Murehwa: 'II',
    Marondera: 'II',
    Mutoko: 'III',
    Bulawayo: 'IV',
    Mutare: 'II',
    Chipinge: 'III',
    Bindura: 'II',
    Chinhoyi: 'II',
    Karoi: 'III',
    Masvingo: 'IV',
    Chiredzi: 'V',
    Hwange: 'V',
    Gwanda: 'V',
    Beitbridge: 'V',
    Gweru: 'III',
    Kwekwe: 'III',
    Gokwe: 'IV',
  }
  return zoneMap[districtName] || 'III'
}
