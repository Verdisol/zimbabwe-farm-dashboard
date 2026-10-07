export type LearnCategory =
  | 'all'
  | 'fungal'
  | 'bacterial'
  | 'viral'
  | 'prevention'
  | 'pests'
  | 'crops'
  | 'cash-crops'
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
  { key: 'crops', label: 'Food Crops', icon: '🌾' },
  { key: 'cash-crops', label: 'Cash Crops', icon: '💰' },
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
  {
    category: 'fungal',
    icon: '🍄',
    title: 'Wheat Leaf Rust (Puccinia triticina)',
    body: 'Orange-brown pustules on wheat leaves. Zimbabwe\'s most important wheat disease. Rises when temperatures warm up around August.',
    action: 'Plant resistant varieties (SC Nduna, SC Smart, SC Sekuru). Apply propiconazole (Tilt) at first signs. Spray before seed fill and repeat 3–4 weeks later. Destroy volunteer wheat.',
  },
  {
    category: 'fungal',
    icon: '🍄',
    title: 'Loose Smut & Damping Off (Wheat)',
    body: 'Seed-borne fungal disease. Smut produces black powdery heads. Damping off kills seedlings before or just after emergence.',
    action: 'Use certified seed. Treat seed with Baytan 150FS (150ml/100kg seed). Rogue and destroy infected plants. Rotate crops.',
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
  {
    category: 'bacterial',
    icon: '🧫',
    title: 'Cotton Bacterial Blight',
    body: 'Angular water-soaked spots on cotton leaves that turn brown. Can cause boll rot. Spreads in wet, warm conditions.',
    action: 'Plant certified disease-free seed. Avoid overhead irrigation. Rotate away from cotton for 2 years.',
  },

  // ---------- VIRAL ----------
  {
    category: 'viral',
    icon: '🦟',
    title: 'Mosaic Virus',
    body: 'Mottled light and dark green (sometimes yellow) pattern on leaves; leaf curl, puckering, stunting. Affects tomatoes, cucumbers, beans, peppers, tobacco.',
    action: 'No chemical cure. Remove and destroy infected plants. Control aphids and whiteflies. Use certified disease-free transplants.',
  },
  {
    category: 'viral',
    icon: '🦟',
    title: 'Curly Top Virus',
    body: 'Leaves curl upward, become leathery, turn yellow or bronze. Spread by beet leafhoppers. Affects tomatoes, beets, beans, squash.',
    action: 'No cure. Control leafhopper vectors with insecticide. Remove weed hosts near fields.',
  },
  {
    category: 'viral',
    icon: '🦟',
    title: 'Maize Streak Virus',
    body: 'Yellow streaks along maize leaves. Stunts growth and reduces cob size. Spread by leafhoppers.',
    action: 'Plant tolerant varieties. Treat seed with Cruiser or Gaucho. Spray hoppers around the field. Keep surroundings free of green grass hosts.',
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
  {
    category: 'prevention',
    icon: '🌱',
    title: 'Soil Testing Before Planting',
    body: 'Wheat and tobacco yields depend on soil pH and balanced nutrients. Lime acidic soils to reach pH 5.1–6.5 (wheat) or 5.0–6.5 (tobacco). Soil analysis guides fertilizer choice.',
  },

  // ---------- PESTS ----------
  {
    category: 'pests',
    icon: '🐛',
    title: 'Fall Armyworm (Maize & Wheat)',
    body: 'Ragged holes in leaves; moist sawdust-like frass in the whorl. Attacks maize and wheat at all stages.',
    action: 'Scout weekly. Apply approved pesticide or neem oil. Rotate crops. Plant early.',
  },
  {
    category: 'pests',
    icon: '🐛',
    title: 'Striga Weed (Sorghum & Maize)',
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
    title: 'Aphids (Cowpeas & Wheat)',
    body: 'Clusters of tiny green or black insects on new growth. Distort leaves and can transmit viruses.',
    action: 'Spray with soapy water or neem oil. Encourage ladybirds. For wheat, apply Dimethoate 40EC (30ml/15L knapsack) or Thunder (15ml/15L).',
  },
  {
    category: 'pests',
    icon: '🐛',
    title: 'Cotton Bollworm (Helicoverpa)',
    body: 'Larvae bore into cotton bolls, destroying lint. Zimbabwe\'s most damaging cotton pest.',
    action: 'Scout weekly from squaring stage. Spray at threshold using approved insecticide. Rotate chemical classes to avoid resistance.',
  },
  {
    category: 'pests',
    icon: '🐛',
    title: 'Quelea Birds (Wheat, Sorghum, Millet)',
    body: 'Massive flocks descend on grain crops during late grain-filling. Can devastate an entire crop in a few days.',
    action: 'Scare with bells, tins, or reflectors. Deploy bird-scaring gangs (4 people/ha). Report to AGRITEX and National Parks. Use 9,10-Anthraquinone (Bird Shield) seed dressing or foliar spray at soft dough stage.',
  },
  {
    category: 'pests',
    icon: '🐛',
    title: 'Tobacco Budworm & Aphids',
    body: 'Budworm larvae feed on tobacco leaves and flower buds, reducing leaf quality. Aphids transmit mosaic viruses.',
    action: 'Scout weekly. Apply approved pesticide at threshold. Remove volunteer tobacco plants. Practice field hygiene.',
  },

  // ---------- CROPS (Food) ----------
  {
    category: 'crops',
    icon: '🌾',
    title: 'Maize',
    body: 'Needs 500–800 mm of rainfall per season. Plant with the first effective rains. Watch for fall armyworm. Zimbabwe\'s staple crop.',
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
  {
    category: 'crops',
    icon: '🌾',
    title: 'Pearl Millet',
    body: 'Most drought-tolerant cereal in Zimbabwe. Matures in 85–100 days. Essential food security crop in NR IV and V.',
  },

  // ---------- CASH CROPS (NEW) ----------
  {
    category: 'cash-crops',
    icon: '🍂',
    title: 'Tobacco — Growing Requirements',
    body: 'Zimbabwe\'s top export. Needs warm climate (20–30°C), full sunlight (6–8 hrs daily), well-drained sandy loams, and 90–120 frost-free days. Relative humidity 60–70% is ideal. Sensitive to frost and waterlogging.',
    action: 'Start seedbeds 8–10 weeks before last frost. Transplant at 3–4 leaf stage after frost risk passes. Apply 7:14:7 basal at 400–600 kg/ha. Top dress with AN in 2–3 splits. Reap leaves progressively from bottom as they ripen.',
  },
  {
    category: 'cash-crops',
    icon: '🍂',
    title: 'Tobacco — Varieties (Kutsaga)',
    body: 'KRK 26: flue-cured, resistant to black shank and root-knot nematodes, best on light sandy soils. T 66: popular flue-cured, good leaf quality. K 35: high-yielding flue-cured with strong disease package.',
    action: 'Match variety to your soil type and market demand. Source seed from Kutsaga Research Station. Curing method must match variety — flue-cured varieties require barn curing for 5–7 days.',
  },
  {
    category: 'cash-crops',
    icon: '🌿',
    title: 'Cotton — Growing Requirements',
    body: 'Zimbabwe\'s second-largest export. Drought-tolerant cash crop for hotter semi-arid regions (Gokwe, Muzarabani, Chiredzi). Planted with summer rains in November. Harvested May–July. Supports 200,000+ smallholder households.',
    action: 'Plant in NR III, IV, V. Use certified seed from Cottco or Quton. Apply basal Compound C. Top dress at squaring. Scout for bollworm weekly. Hand-pick in 3–4 rounds as bolls open.',
  },
  {
    category: 'cash-crops',
    icon: '🌿',
    title: 'Cotton — Varieties (Quton)',
    body: 'SZ 9314: Zimbabwe\'s most widely grown, high ginning outturn, tolerant to jassids. LS 9219: suited to lower-rainfall regions NR IV and V. A 637-24: higher yield potential but needs better rainfall, suited to NR III.',
    action: 'Most farmers operate under contract schemes with Cottco which supplies seed, fertilizer, and chemicals. Payment disputes are common — keep records of deliveries. Grade and market through AMA-registered buyers.',
  },
  {
    category: 'cash-crops',
    icon: '🌾',
    title: 'Wheat — Growing Requirements',
    body: 'Winter irrigated crop. Optimum day temps 15–20°C with cooler nights. Yields 8–12 t/ha on highveld (>1200m), 4.5–7 t/ha on lowveld (<900m). Needs 400–600 mm total water. Zimbabwe has no dryland wheat — it is grown entirely under irrigation.',
    action: 'Plant mid-April to end of May. Highveld up to 25 May; Middleveld 7–15 May; Lowveld 1–10 May. Seed rate 110–125 kg/ha drilled. Target 250,000–300,000 plants/ha. Basal 7:14:7 at 300–500 kg/ha. Top dress with AN or Urea in 2 splits after hardening period.',
  },
  {
    category: 'cash-crops',
    icon: '🌾',
    title: 'Wheat — Irrigation Schedule',
    body: 'Zimbabwe wheat is fully irrigated. Total gross water: 450–600 mm/ha. Critical stages: root development, heading, booting, blister, milk dough, grain filling. On sandy soils: irrigate every 7–9 days with 30–35 mm. On clays: every 10–14 days with 40–45 mm.',
    action: 'Bring soil to field capacity to 1.2m depth at planting. Apply light irrigation at 4–5 days after sowing to break crust. Hardening: stop irrigation for 10–14 days after emergence to stimulate crown roots. Stop irrigation when peduncle (neck) turns yellow — physiological maturity.',
  },
  {
    category: 'cash-crops',
    icon: '🌾',
    title: 'Wheat — Varieties (Seed Co)',
    body: 'SC Nduna: white seeded, short statured, disease resistant, 125 days. SC Sekuru: red seeded, 130 days, ideal for bread. SC Smart: red seeded, resistant to leaf rust and powdery mildew, 128 days. SC Stallion: red seeded, strong disease package. SC Sahai: summer variety — plant January, yields lower (~3 t/ha).',
    action: 'Match variety to planting date and disease pressure. Most farmers plant mid-May. Late planting (after May) loses ~50 kg/ha/day. Choose SC Smart or SC Stallion where leaf rust is a known problem.',
  },
  {
    category: 'cash-crops',
    icon: '🌾',
    title: 'Wheat — Weed Control',
    body: 'Grass weeds: Puma Super (300–500 ml/ha), Ally + Banvel mix (5g + 100ml + 0.1% Sanawett/ha). Broadleaf weeds: Bromoxynil 22.5 EC (90–120 ml/15L), Dicamba/Banvel (15–20 ml/15L), MCPA (190 ml/15L). Apply at 3–5 leaf stage of crop.',
    action: 'Apply post-emergence herbicide after the hardening period (2 weeks after emergence). Use combinations like Buctril DS at 0.5L + MCPA at 2.0L for better spectrum. Read labels carefully and use protective gear.',
  },
  {
    category: 'cash-crops',
    icon: '🌾',
    title: 'Wheat — Disease Control',
    body: 'Main diseases: Leaf rust (Shavit-tolerant varieties), Stem rust, Powdery mildew, Fusarium head blight, Take-all. Two preventative fungicide sprays are recommended in disease-prone areas. Apply Tilt (Propiconazole 250EC) at 30ml/15L at first signs.',
    action: 'Plant resistant varieties. Follow recommended planting dates. Destroy volunteer wheat. Apply fungicide for rust before seed fill, repeat 3–4 weeks later if disease continues. Scout regularly and spray at economic threshold.',
  },
  {
    category: 'cash-crops',
    icon: '🌾',
    title: 'Wheat — Harvesting & Quelea Birds',
    body: 'Harvest by combine when moisture content reaches 12.5%. Do not over-dry. Quelea birds are a major threat during late grain filling — they can reduce yields significantly if not controlled.',
    action: 'Scare quelea birds before harvest with bells, tins, whistles, or reflectors. Use bird-scaring gangs (4 people/ha). Report sightings to AGRITEX and National Parks. Use Bird Shield (9,10-Anthraquinone 50% WP) seed dressing or foliar spray at soft dough stage. Set combine blades well to reduce harvest losses.',
  },

  // ---------- EXPERT ----------
  {
    category: 'expert',
    icon: '🏛️',
    title: 'Call a Plant Pathologist If…',
    body: 'Symptoms are unusual or do not match common diseases in your region. Multiple diseases appear at once. Treatment applied correctly but symptoms keep spreading. You see a new pattern of decline across multiple fields. You suspect a new or emerging pathogen.',
    action: 'Contact extension services, agricultural colleges, or the national plant health network. Many accept leaf and soil samples by mail.',
  },
  {
    category: 'expert',
    icon: '🏛️',
    title: 'Contact AGRITEX or Kutsaga for…',
    body: 'Tobacco variety advice (Kutsaga Research Station). Cotton contract disputes and AMA support. Wheat variety selection and disease identification. Quelea bird control coordination.',
    action: 'Kutsaga Research Station for tobacco. AGRITEX for wheat and food crops. Cotton Company of Zimbabwe (Cottco) or Quton for cotton. Agricultural Marketing Authority (AMA) for market disputes.',
  },
]
