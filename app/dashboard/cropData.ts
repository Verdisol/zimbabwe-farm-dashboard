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
