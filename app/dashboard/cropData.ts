export type NaturalRegionKey = 'I' | 'II' | 'III' | 'IV' | 'V'

export type CropVariety = {
  name: string
  maturityDays: number
  maturityClass: 'ultra-early' | 'early' | 'medium' | 'late'
  droughtTolerance: 'low' | 'medium' | 'high' | 'very-high'
  yieldPotential: string
  note: string
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
    mainCrops: 'Maize, sorghum, millet, soybean, groundnut, tobacco, cotton',
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
    mainCrops: 'Sorghum, millet, groundnuts, sunflower, cotton',
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
    mainCrops: 'Pearl millet, sorghum, small beans, cotton, livestock',
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
    mainCrops: 'Drought-hardy grains with irrigation; cotton; livestock and wildlife ranching',
    resilience: 'Low',
    description:
      'Most arid zone. Dryland cropping only with irrigation. Pastoralism and wildlife key.',
  },
}

const districtToRegion: Record<string, NaturalRegionKey> = {
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
  Mutoko: 'III',
  Karoi: 'III',
  Chegutu: 'II',
  Kadoma: 'III',
  Gweru: 'III',
  Kwekwe: 'III',
  Masvingo: 'IV',
  Zvishavane: 'IV',
  Bikita: 'III',
  Gokwe: 'IV',
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
    varieties: [
      { name: 'SC 449 (Seed Co)', maturityDays: 90, maturityClass: 'ultra-early', droughtTolerance: 'high', yieldPotential: 'Up to 8 t/ha', note: 'Ultra-early hybrid — escapes late-season drought.' },
      { name: 'SC 419 (Seed Co)', maturityDays: 120, maturityClass: 'early', droughtTolerance: 'medium', yieldPotential: 'Up to 14 t/ha', note: 'Very early-maturing, strong stay-green.' },
      { name: 'SC 633 (Seed Co)', maturityDays: 140, maturityClass: 'medium', droughtTolerance: 'medium', yieldPotential: 'Up to 15 t/ha', note: 'Medium maturing, high yielding.' },
      { name: 'SC 719 (Seed Co)', maturityDays: 150, maturityClass: 'late', droughtTolerance: 'low', yieldPotential: 'Up to 16 t/ha', note: 'Top late-maturing hybrid.' },
      { name: 'SC 727 (Seed Co)', maturityDays: 158, maturityClass: 'late', droughtTolerance: 'low', yieldPotential: 'Highest yielder in Zimbabwe', note: 'Best yielder. Needs full season and reliable rainfall.' },
    ],
    peakWaterMmPerWeek: 60,
    irrigationNote: 'Peak demand 60–70 mm/week during flowering and grain filling. Irrigate 2–3 times per week.',
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
      'Minimal fertilizer needed',
      'Weed 2-3 times during early growth',
      'Harvest when heads turn brown and grains hard',
    ],
    varieties: [
      { name: 'PMV 2 (SDMV 89004)', maturityDays: 85, maturityClass: 'ultra-early', droughtTolerance: 'very-high', yieldPotential: 'Up to 2 t/ha', note: 'Released 1992. Matures in 80–90 days. NR IV and V.' },
    ],
    peakWaterMmPerWeek: 35,
    irrigationNote: 'Very drought-tolerant. Supplementary irrigation rarely needed.',
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
      'Harvest when heads mature',
    ],
    varieties: [],
    peakWaterMmPerWeek: 40,
    irrigationNote: 'Needs 500–1000 mm total. Irrigate if dry spell during flowering.',
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
    varieties: [
      { name: 'Msasa (Hybrid)', maturityDays: 83, maturityClass: 'ultra-early', droughtTolerance: 'high', yieldPotential: 'Up to 3 t/ha, 45% oil', note: 'Head nods at maturity. Best for marginal areas with short seasons.' },
      { name: 'Hybrid (DR&SS)', maturityDays: 100, maturityClass: 'early', droughtTolerance: 'medium', yieldPotential: 'Up to 3 t/ha, 49% oil', note: 'Improved disease and moisture stress tolerance.' },
    ],
    peakWaterMmPerWeek: 50,
    irrigationNote: 'Needs 400–600 mm total. Critical: flowering and seed fill.',
  },
  {
    name: 'Tobacco',
    minRainfall: 500,
    maxRainfall: 900,
    optimalRainfall: 700,
    droughtTolerance: 'low',
    growingDays: 150,
    bestRegions: ['I', 'II'],
    description:
      'Zimbabwe\'s top agricultural export. Requires warm climate (20–30°C), full sunlight, well-drained sandy loams, and 90–120 frost-free days.',
    plantingSteps: [
      'Start seedbeds 8–10 weeks before last frost (Aug–Sept)',
      'Transplant when soil temp ≥ 18°C and 90+ frost-free days remain',
      'Apply basal fertilizer 7:14:7 at 400–600 kg/ha based on soil test',
      'Top dress with Ammonium Nitrate or Super Cereal Blend in 2–3 splits',
      'Scout for aphids, budworm, and leaf diseases weekly',
      'Reap leaves progressively from bottom as they ripen (yellow-green mottling)',
      'Cure in barns (flue-cured) for 5–7 days with controlled temp/humidity',
    ],
    varieties: [
      { name: 'KRK 26 (Kutsaga)', maturityDays: 150, maturityClass: 'medium', droughtTolerance: 'low', yieldPotential: '3.0–4.0 t/ha cured leaf', note: 'Flue-cured. Resistant to black shank and root-knot nematodes. Best on light sandy soils.' },
      { name: 'T 66 (Kutsaga)', maturityDays: 145, maturityClass: 'medium', droughtTolerance: 'low', yieldPotential: '2.8–3.5 t/ha', note: 'Popular flue-cured variety. Good leaf quality. Requires well-drained soils.' },
      { name: 'K 35 (Kutsaga)', maturityDays: 155, maturityClass: 'medium', droughtTolerance: 'low', yieldPotential: '3.2–4.2 t/ha', note: 'High-yielding flue-cured variety with good disease resistance package.' },
    ],
    peakWaterMmPerWeek: 45,
    irrigationNote:
      'Needs 500–700 mm total. Irrigation essential in Zimbabwe. Stop irrigation when leaves start ripening to avoid leaf quality loss.',
  },
  {
    name: 'Cotton',
    minRainfall: 400,
    maxRainfall: 700,
    optimalRainfall: 550,
    droughtTolerance: 'high',
    growingDays: 180,
    bestRegions: ['III', 'IV', 'V'],
    description:
      'Zimbabwe\'s second-highest agricultural export. Drought-tolerant cash crop for hotter semi-arid regions. Supports 200,000+ smallholder households.',
    plantingSteps: [
      'Plant with summer rains in November (mono-planting)',
      'Use certified seed from Cottco or Quton (contract scheme)',
      'Apply basal Compound C or 7:14:7 at planting',
      'Top dress with Ammonium Nitrate at squaring stage',
      'Scout for bollworm, aphids, and jassids — spray at threshold',
      'Hand-pick in 3–4 rounds from May to July as bolls open',
      'Grade and market through Cottco or AMA-registered buyer',
    ],
    varieties: [
      { name: 'SZ 9314 (Quton)', maturityDays: 180, maturityClass: 'medium', droughtTolerance: 'high', yieldPotential: '1.5–2.5 t/ha seed cotton', note: 'Zimbabwe\'s most widely grown cotton. High ginning outturn. Tolerant to jassids.' },
      { name: 'LS 9219 (Quton)', maturityDays: 175, maturityClass: 'medium', droughtTolerance: 'high', yieldPotential: '1.2–2.0 t/ha seed cotton', note: 'Suited to lower-rainfall regions (NR IV and V).' },
      { name: 'A 637-24 (Quton)', maturityDays: 185, maturityClass: 'late', droughtTolerance: 'medium', yieldPotential: '1.8–2.8 t/ha seed cotton', note: 'Higher yield potential but needs better rainfall. Suited to NR III.' },
    ],
    peakWaterMmPerWeek: 50,
    irrigationNote:
      'Dryland crop in NR III–V. Needs 400–700 mm total. Peak demand during flowering and boll formation. Supplemental irrigation increases yield significantly.',
  },
  {
    name: 'Wheat',
    minRainfall: 400,
    maxRainfall: 600,
    optimalRainfall: 500,
    droughtTolerance: 'low',
    growingDays: 130,
    bestRegions: ['I', 'II'],
    description:
      'Winter irrigated crop. Best grown under irrigation in Zimbabwe with optimum day temps 15–20°C and cooler nights. Yields 8–12 t/ha on highveld vs 4.5–7 t/ha on lowveld.',
    plantingSteps: [
      'Plant mid-April to end of May (Highveld up to 25 May; Middleveld 7–15 May; Lowveld 1–10 May)',
      'Seed rate: 110–125 kg/ha drilled; 125–135 kg/ha broadcast; 150–160 kg/ha in Lowveld',
      'Target population: 250,000–300,000 plants/ha',
      'Apply basal fertilizer (Compound D or 7:14:7) at 300–550 kg/ha based on soil test',
      'Apply light irrigation at 4–5 days after sowing to break soil crust',
      'Hardening stage: stop irrigation 10–14 days to stimulate crown roots',
      'Top dress with AN or Urea in 2 splits (day 22 and day 35) after hardening',
      'Irrigate every 7–9 days on sandy soils, 10–14 days on clays',
      'Stop irrigation when peduncle (neck below ear) turns yellow',
      'Harvest at 12.5% moisture; monitor for Quelea birds',
    ],
    varieties: [
      { name: 'SC Nduna (Seed Co)', maturityDays: 125, maturityClass: 'early', droughtTolerance: 'low', yieldPotential: '8–10 t/ha under irrigation', note: 'White seeded bread wheat. Short statured, disease resistant.' },
      { name: 'SC Sekuru (Seed Co)', maturityDays: 130, maturityClass: 'medium', droughtTolerance: 'low', yieldPotential: '8–11 t/ha', note: 'Red seeded, ideal for bread making. Well adapted to winter production.' },
      { name: 'SC Smart (Seed Co)', maturityDays: 128, maturityClass: 'medium', droughtTolerance: 'low', yieldPotential: '8–12 t/ha', note: 'Red seeded, high yielding, resistant to leaf rust and powdery mildew.' },
      { name: 'SC Stallion (Seed Co)', maturityDays: 130, maturityClass: 'medium', droughtTolerance: 'low', yieldPotential: '8–11 t/ha', note: 'Red seeded, strong disease resistance package.' },
      { name: 'SC Sahai (Seed Co)', maturityDays: 125, maturityClass: 'early', droughtTolerance: 'medium', yieldPotential: 'Up to 3 t/ha in summer', note: 'Summer wheat variety — plant around January. Lower yields than winter crop.' },
    ],
    peakWaterMmPerWeek: 55,
    irrigationNote:
      'Total gross water: 450–600 mm per ha. Critical stages: root development, heading, booting, blister, milk dough, grain filling. On sandy soils: 7–9 day cycles of 30–35 mm. On clays: 10–14 day cycles of 40–45 mm.',
  },
]

/**
 * Recommend crops based on estimated seasonal rainfall (mm),
 * drought status, and natural region.
 *
 * The pool expands dynamically:
 *  - Always include crops suited to the region
 *  - Also include crops whose rainfall requirement is met,
 *    even if not listed for the region (in case of unusual weather)
 *  - In drought, restrict to high / very-high drought-tolerant crops
 */
export function getCropAdvice(
  seasonalRainfall: number,
  droughtStatus: string,
  regionKey: NaturalRegionKey
): CropRequirement[] {
  const isDrought =
    droughtStatus === 'drought' || droughtStatus === 'extreme-drought'

  // Start with region-specific crops
  const regionCrops = crops.filter((c) => c.bestRegions.includes(regionKey))

  // Then add any other crops whose minimum rainfall the season satisfies
  const otherCrops = crops.filter(
    (c) =>
      !regionCrops.find((r) => r.name === c.name) &&
      seasonalRainfall >= c.minRainfall
  )

  let pool = [...regionCrops, ...otherCrops]

  // During drought, keep only drought-tolerant crops
  if (isDrought) {
    pool = pool.filter(
      (c) => c.droughtTolerance === 'high' || c.droughtTolerance === 'very-high'
    )
  }

  // Final filter: seasonal rainfall must meet at least 70% of crop minimum
  return pool.filter((c) => seasonalRainfall >= c.minRainfall * 0.7)
}

export function matchVarietyToSeason(
  crop: CropRequirement,
  daysAvailable: number
): CropVariety[] {
  if (!crop.varieties || crop.varieties.length === 0) return []
  return crop.varieties.filter((v) => v.maturityDays <= daysAvailable)
}

export function irrigationAdvice(
  crop: CropRequirement,
  monthlyRain: number[],
  regionKey: NaturalRegionKey
): { needed: boolean; message: string } {
  const isDryRegion = regionKey === 'IV' || regionKey === 'V'
  const drySpell = monthlyRain.some((r) => r < 40)

  if (isDryRegion && crop.droughtTolerance === 'low') {
    return {
      needed: true,
      message: `Low drought tolerance in NR ${regionKey}. Supplementary irrigation strongly recommended. Peak water need: ~${crop.peakWaterMmPerWeek} mm/week. ${crop.irrigationNote}`,
    }
  }

  if (drySpell && crop.droughtTolerance !== 'very-high') {
    return {
      needed: true,
      message: `Dry spells detected. Consider supplementary irrigation during flowering. Peak water need: ~${crop.peakWaterMmPerWeek} mm/week. ${crop.irrigationNote}`,
    }
  }

  return {
    needed: false,
    message: `Rainfall looks sufficient. Peak water need if irrigation is used: ~${crop.peakWaterMmPerWeek} mm/week. ${crop.irrigationNote}`,
  }
}
