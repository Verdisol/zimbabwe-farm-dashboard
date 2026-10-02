export type LearnCategory =
  | 'all'
  | 'fungal'
  | 'bacterial'
  | 'viral'
  | 'prevention'
  | 'pests'
  | 'crops'
  | 'expert'

export type LearnItem = {
  category: LearnCategory
  title: string
  body: string
  action?: string
  icon: string
}

export const learnCategories: { key: LearnCategory; label: string; icon: string }[] = [
  { key: 'all', label: 'All', icon: '📚' },
  { key: 'fungal', label: 'Fungal Diseases', icon: '🍄' },
  { key: 'bacterial', label: 'Bacterial Diseases', icon: '🧫' },
  { key: 'viral', label: 'Viral Diseases', icon: '🦟' },
  { key: 'prevention', label: 'Prevention', icon: '🌱' },
  { key: 'pests', label: 'Pests', icon: '🐛' },
  { key: 'crops', label: 'Crops', icon: '🌾' },
  { key: 'expert', label: 'When to Call an Expert', icon: '🏛️' },
]

export const learnItems: LearnItem[] = [
  // ---------- FUNGAL ----------
  {
    category: 'fungal',
    icon: '🍄',
    title: 'Powdery Mildew',
    body: 'White, powdery coating on leaves and stems. Thrives in warm days, cool nights, and high humidity on leaves. Affects wheat, grapes, cucumbers, squash.',
    action: 'Apply sulfur-based or potassium bicarbonate fungicide. Improve air circulation. Remove infected material.',
  },
  {
    category: 'fungal',
    icon: '🍄',
    title: 'Downy Mildew',
    body: 'Yellow patches on top of leaves; gray or purple fuzz underneath. Develops in cool, wet weather. Affects grapes, lettuce, spinach, brassicas.',
    action: 'Use copper-based fungicide. Avoid overhead irrigation. Space plants for airflow.',
  },
  {
    category: 'fungal',
    icon: '🍄',
    title: 'Early Blight',
    body: 'Dark concentric rings (like a target) on older leaves of tomatoes and potatoes. Moves upward over time.',
    action: 'Apply fungicide early. Remove infected lower leaves. Rotate crops next season.',
  },
  {
    category: 'fungal',
    icon: '🍄',
    title: 'Late Blight',
    body: 'Water-soaked gray-green lesions; white mold on undersides. Spreads very fast in cool, wet weather. Same pathogen as the Irish Potato Famine.',
    action: 'Apply copper or mancozeb fungicide. Monitor closely after rain. Remove badly infected plants immediately.',
  },
  {
    category: 'fungal',
    icon: '🍄',
    title: 'Fusarium Wilt',
    body: 'Yellowing from lower leaves upward; plants wilt even when soil is wet. Soil-borne and affects tomatoes, bananas, cotton, soybeans.',
    action: 'Plant resistant varieties. Rotate crops over 3–4 years. Consider soil solarization in severe cases.',
  },
  {
    category: 'fungal',
    icon: '🍄',
    title: 'Gray Mold (Botrytis)',
    body: 'Grayish-brown fuzzy mold on stems, flowers, and fruit. Common in strawberries, tomatoes, grapes, and flowers.',
    action: 'Remove infected tissue. Apply fungicide at first signs. Improve airflow in the canopy.',
  },
  {
    category: 'fungal',
    icon: '🍄',
    title: 'Rust',
    body: 'Orange, red, or brown powdery pustules on leaf undersides. Affects wheat, maize, soybeans, coffee, beans.',
    action: 'Plant resistant varieties. Use triazole or strobilurin fungicides. Remove volunteer plants.',
  },
  {
    category: 'fungal',
    icon: '🍄',
    title: 'Black Spot',
    body: 'Dark circular spots on leaves, followed by yellowing and leaf drop. Common on roses, stone fruits, mangoes.',
    action: 'Apply fungicide sprays. Remove infected debris. Avoid overhead watering.',
  },
  {
    category: 'fungal',
    icon: '🍄',
    title: 'Root Rot',
    body: 'Wilting, yellowing, brown/black mushy roots, stunted growth. Caused by soil pathogens like Pythium, Phytophthora, Fusarium, Rhizoctonia.',
    action: 'Improve drainage. Stop overwatering. Apply biological fungicides (Trichoderma or Bacillus).',
  },

  // ---------- BACTERIAL ----------
  {
    category: 'bacterial',
    icon: '🧫',
    title: 'Bacterial Leaf Spot',
    body: 'Water-soaked spots that turn brown or black with yellow halos. Common in tomatoes and peppers. Spreads in warm, wet weather.',
    action: 'Use disease-free seed. Avoid overhead irrigation. Apply copper bactericides preventively.',
  },
  {
    category: 'bacterial',
    icon: '🧫',
    title: 'Fire Blight',
    body: 'Blossoms and shoots turn brown and curl into a "shepherd\'s crook". Affects apples, pears, quince. Spreads during warm, wet flowering.',
    action: 'Prune infected branches 12 inches below damage. Sterilize tools between cuts. Apply copper sprays at bloom.',
  },

  // ---------- VIRAL ----------
  {
    category: 'viral',
    icon: '🦟',
    title: 'Mosaic Virus',
    body: 'Mottled light and dark green (sometimes yellow) pattern on leaves; leaf curl, puckering, stunting. Affects tomatoes, cucumbers, beans, peppers.',
    action: 'No chemical cure. Remove and destroy infected plants. Control aphids and whiteflies. Use certified disease-free transplants.',
  },
  {
    category: 'viral',
    icon: '🦟',
    title: 'Curly Top Virus',
    body: 'Leaves curl upward, become leathery, turn yellow or bronze. Spread by beet leafhoppers. Affects tomatoes, beets, beans, squash.',
    action: 'No cure. Control leafhopper vectors with insecticide. Remove weed hosts near fields.',
  },

  // ---------- PREVENTION ----------
  {
    category: 'prevention',
    icon: '🌱',
    title: 'Crop Rotation',
    body: 'Rotating crops prevents the buildup of soil-borne pathogens. A 3–4 year rotation between unrelated crop families is enough to reduce pressure from Fusarium wilt, early blight, and bacterial spot.',
  },
  {
    category: 'prevention',
    icon: '🌱',
    title: 'Resistant Varieties',
    body: 'Planting disease-resistant varieties is the cheapest long-term defense. Seed suppliers and extension services publish resistance ratings per variety.',
  },
  {
    category: 'prevention',
    icon: '🌱',
    title: 'Sanitation and Tool Hygiene',
    body: 'Remove crop debris after harvest. Sterilize pruning tools between plants. Clean equipment before moving between fields.',
  },
  {
    category: 'prevention',
    icon: '🌱',
    title: 'Irrigation Management',
    body: 'Switch from overhead irrigation to drip or subsurface irrigation to eliminate leaf wetness. Water early in the morning so leaves dry before night.',
  },
  {
    category: 'prevention',
    icon: '🌱',
    title: 'Disease Triangle',
    body: 'Disease appears when three things align: a susceptible plant, a pathogen, and favorable environmental conditions. Break any one of the three and disease stops.',
  },

  // ---------- PESTS ----------
  {
    category: 'pests',
    icon: '🐛',
    title: 'Fall Armyworm (Maize)',
    body: 'Ragged holes in leaves; moist sawdust-like frass in the whorl. Attacks maize at all stages.',
    action: 'Scout weekly. Apply approved pesticide or neem oil. Rotate crops. Plant early.',
  },
  {
    category: 'pests',
    icon: '🐛',
    title: 'Striga Weed (Sorghum)',
    body: 'Purple flowers close to the ground; sucks nutrients from sorghum and maize roots.',
    action: 'Rotate with legumes. Hand-pull before flowering. Use resistant varieties.',
  },
  {
    category: 'pests',
    icon: '🐛',
    title: 'Leaf Spot (Groundnuts)',
    body: 'Dark brown circular spots on groundnut leaves; leaves dry and fall early.',
    action: 'Use resistant varieties. Rotate crops. Apply fungicide if severe.',
  },
  {
    category: 'pests',
    icon: '🐛',
    title: 'Aphids (Cowpeas)',
    body: 'Clusters of tiny green or black insects on new growth. Distort leaves and can transmit viruses.',
    action: 'Spray with soapy water or neem oil. Encourage ladybirds. Remove heavily infested shoots.',
  },

  // ---------- CROPS ----------
  {
    category: 'crops',
    icon: '🌾',
    title: 'Maize',
    body: 'Needs 500–800 mm of rainfall per season. Plant with the first effective rains. Watch for fall armyworm.',
  },
  {
    category: 'crops',
    icon: '🌾',
    title: 'Sorghum',
    body: 'Drought-tolerant; needs only 400 mm of rainfall. Great for dry regions. Watch for striga weed.',
  },
  {
    category: 'crops',
    icon: '🌾',
    title: 'Groundnuts',
    body: 'Fix nitrogen in the soil, improving fertility for the next crop. Watch for leaf spot disease.',
  },
  {
    category: 'crops',
    icon: '🌾',
    title: 'Cowpeas',
    body: 'Fast-maturing legume that improves soil and provides protein. Watch for aphids.',
  },

  // ---------- EXPERT ----------
  {
    category: 'expert',
    icon: '🏛️',
    title: 'Call a Plant Pathologist If…',
    body: 'Symptoms are unusual or do not match common diseases in your region. Multiple diseases appear at once. Treatment applied correctly but symptoms keep spreading. You see a new pattern of decline across multiple fields. You suspect a new or emerging pathogen.',
    action: 'Contact extension services, agricultural colleges, or the national plant health network. Many accept leaf and soil samples by mail.',
  },
]
