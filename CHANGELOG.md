# Zimbabwe Farm Dashboard — Project Changelog

A complete record of all features, decisions, and data sources for the
dissertation project: *Design and Development of a Web-Based Climate-Smart
Agriculture Advisory Dashboard for Smallholder Farmers in Zimbabwe*.

---

## 1. Project Foundation

| Item | Detail |
|---|---|
| Framework | Next.js 14 (App Router) + React 18 + TypeScript |
| Hosting | Vercel (free tier, auto-deploy from GitHub) |
| Database | Neon PostgreSQL (serverless, free tier) |
| ML API | Python 3.11 + Flask + scikit-learn on Render (free tier) |
| Version control | GitHub (all work done via browser, no terminal) |

---

## 2. Authentication & User Management

- Login page (`app/page.tsx`) with farmer photo background, 70% transparent glass card
- Register page (`app/register/page.tsx`) — saves to `farmers` table
- API routes: `app/api/login/route.ts`, `app/api/register/route.ts`
- `farmers` table: id, name, email, password, district, preferred_language, created_at
- `farmerEmail` stored in localStorage for subscription lookup
- Sonner toast alerts on login success/failure

---

## 3. Dashboard Layout

- **Sidebar** — brown transparent with farmer.jpg background, glow on active/hover, fixed (main content scrolls)
- **TopBar** — 70% transparent photo background, strong text shadow, pulsing green glow, language dropdown, Export PDF button, avatar
- **PriceTicker** — scrolling market prices bar under the header, visible on every tab
- **Background** — background.jpeg behind the entire dashboard
- **Glass cards** — 20% white transparent with green glow and hover lift

---

## 4. Tabs Built

### 4.1 Overview
- LocationPicker (dropdown of all 91 districts + clickable map)
- StatCards — live weather, 30-day rainfall, predicted yield, alerts
- WeatherCard — current + 24h hourly + 7-day forecast + wind, humidity, pressure, visibility, UV, AQI, sunrise/sunset
- PredictionCard — Random Forest yield prediction via Render API
- ChartSection — maize yield trend (line chart)

### 4.2 Map
- Leaflet + OpenStreetMap with zoom, drag, popup markers
- LocationPicker with draggable marker
- Centered on selected district

### 4.3 Weather
- Full WeatherCard
- LocationPicker at top
- Card capped at 820px width, centered

### 4.4 Drought Monitor
- **DroughtMonitor** — 30-year rainfall z-score classification
  - Status: Extreme Drought / Drought / Normal / Good / Bumper Harvest
  - 4 stat tiles: last 12 months rainfall, 30-year average, deviation, percentile rank
  - Monthly rainfall bar chart (last 12 months)
- **CropAdvisor** — multi-layer crop advisory (see section 5)

### 4.5 Predictions
- ChartSection + PredictionCard
- Random Forest API integration

### 4.6 Charts
- Line chart (maize yield trend 2015–2024)
- Bar chart (yield by year)
- Pie chart (crop area distribution)
- Histogram (yield frequency distribution)
- All custom SVG, no external chart library

### 4.7 Market
- Filterable price table (crop, province, market)
- Scrollable data table with Share button
- 38+ commodities from Mbare Musika (26-09-26)

### 4.8 Learn (Did You Know?)
- 9 category filters: All, Fungal, Bacterial, Viral, Prevention, Pests, Food Crops, Cash Crops, Expert
- 40+ educational cards
- Sources: Folio3 AgTech (2026), AGRITEX, Kutsaga, Seed Co

### 4.9 Help
- Tawk.to live chat widget
- Consultant contact information
- 4 listed services

### 4.10 Subscription
- 3 plans: Monthly USD 40, Quarterly USD 100, Yearly USD 400
- 4 payment methods: EcoCash, Mukuru, InnBucks, Bank Transfer
- Reference code generation (e.g. ZF-ABCD1234)
- Status card showing Pending / Approved / Rejected
- `subscriptions` table in Neon

---

## 5. Crop Advisor — Detailed

Located on the Drought Monitor tab, below DroughtMonitor.

### 5.1 Terrain & Elevation Card
- Source: Copernicus DEM GLO-90 via Open-Meteo Elevation API
- Elevation, relief zone (Lowveld/Middleveld/Highveld/Eastern Highlands)
- Slope classification (FAO standard) with terrain-specific advice

### 5.2 Seasonal Climate Outlook Card
- Source: ECMWF SEAS5 via Open-Meteo Seasonal API
- 6-month precipitation forecast aggregated per month
- Status: Below Normal / Normal / Above Normal
- Month-by-month projection grid
- Onset detection: first month ≥40mm during Nov–March
- Growing window: days from onset to 30 April

### 5.3 Planting Strategy Card
- Headline based on forecast status
- Planting window — when to plant, how to prepare basins
- Bridging irrigation — frequency and amounts if rains are delayed
  - Dry year: 20–25mm every 5–7 days
  - Pot-holing technique (1–2L per plant) for severe wilting
- Variety advice — matched to flowering window vs. rainfall peak

### 5.4 Irrigation Advisory
- Appears when dry spells detected in the 6-month forecast
- Per-crop water requirements (peak mm/week from FAO Kc values)

### 5.5 Crop Advisory
- Recommended crops filtered by region + rainfall + drought status
- Dynamic pool expands when rainfall simulation changes
- Fallback to drought-tolerant crops if none match
- Not Recommended list with rainfall threshold shown

### 5.6 Crop Cards (expandable)
Each card shows:
- Rainfall needs (min–max mm)
- Matching varieties count
- Drought tolerance rating
- 💧 Water requirement (peak mm/week + irrigation note)
- 🌱 Varieties that fit the growing window (name, maturity days, class, drought tolerance, yield potential, note)
- Step-by-step growing guide
- Best regions

### 5.7 Rainfall Simulator
- Slider 0–1200mm for demonstration
- Recalculates recommendations live
- Reset to live data button

---

## 6. Crops & Varieties Supported

### Field Crops
| Crop | Varieties Documented |
|---|---|
| **Maize** | SC 449 (90d), SC 419 (120d), SC 633 (140d), SC 719 (150d), SC 727 (158d) |
| **Sorghum** | Macia (115d), SV 2 (110d) |
| **Pearl Millet** | PMV 2 (85d) |
| **Finger Millet** | (none yet) |
| **Groundnuts** | Ilanda (90d), Nyanda (93d), Jesa (122d), Flamingo (175d) |
| **Cowpeas** | CBC2 (80d), CBC1 (80d) |
| **Sunflower** | Msasa (83d), Hybrid DR&SS (100d) |
| **Tobacco** | KRK 26, T 66, K 35 |
| **Cotton** | SZ 9314, LS 9219, A 637-24 |
| **Wheat** | SC Nduna, SC Sekuru, SC Smart, SC Stallion, SC Sahai |

### Off-Season Horticulture Crops (v2.5)
| Crop | Maturity | Off-Season Window |
|---|---|---|
| **Tomatoes** | 90–95 days | Mar–Sep |
| **Butternuts** | 100 days | Mar–Aug |
| **Cabbage** | 85 days | Mar–Sep |
| **Rape** | 55 days | Mar–Sep |
| **Covo** | 55 days | Mar–Sep |
| **Tsunga** | 55 days | Mar–Sep |
| **Peas (Mangetout/Sugar snap)** | 60–65 days | Feb–May |
| **Onions** | 140–145 days | Mar–Sep |
| **Carrots** | 90 days | Mar–Sep |
| **Potatoes** | 100–110 days | Mar–Aug |

Each crop now includes **growing conditions**: optimal temperature range, frost sensitivity, sunlight hours, humidity range, wind tolerance, and off-season months.

---

## 7. Natural Regions (NR I–V)

| Region | Rainfall | Main Crops |
|---|---|---|
| **NR I** | >1,000 mm | Maize, wheat, tea, coffee, horticulture |
| **NR II** | 750–1,000 mm | Maize, sorghum, groundnuts, tobacco, cotton |
| **NR III** | 650–800 mm | Sorghum, millet, groundnuts, sunflower, cotton |
| **NR IV** | 450–650 mm | Pearl millet, sorghum, cotton, livestock |
| **NR V** | <450 mm | Drought-hardy grains, cotton with irrigation, livestock |

Source: Farmonaut (2026) & AGRITEX classifications.

---

## 8. All 91 Districts

Districts grouped by province:
- Bulawayo (1), Harare (1)
- Manicaland (7), Mashonaland Central (8), Mashonaland East (9), Mashonaland West (8)
- Masvingo (7), Matabeleland North (8), Matabeleland South (7), Midlands (8)

Coordinates based on OCHA/HDX boundaries and MSD station coordinates.

---

## 9. Multilingual Support

- Languages: English (en), Shona (sn), Ndebele (nd)
- Translated: sidebar nav, top bar welcome, tab headings, log out button
- Not translated (future work): card contents, chart labels, market table, learn cards
- Storage: `language` in localStorage
- Event-driven: `languageChanged` event updates all components live

---

## 10. PDF Export

- Location: Header, before the language dropdown
- Library: jsPDF + html2canvas
- Captures: current tab content inside `#export-area`
- PDF design: Green header bar, title, generated date/time, location, page footers
- Filename: `zimbabwe-farm-dashboard-YYYY-MM-DD.pdf`

---

## 11. External APIs Used

| API | Purpose |
|---|---|
| Open-Meteo Forecast | Live weather, hourly, 7-day |
| Open-Meteo Archive | 30-year rainfall history |
| Open-Meteo Seasonal (ECMWF SEAS5) | 6-month outlook |
| Open-Meteo Elevation (Copernicus DEM) | Terrain |
| Open-Meteo Air Quality | AQI |
| OpenStreetMap | Map tiles |
| Tawk.to | Live chat |
| Neon | PostgreSQL database |
| Render | ML API hosting |

---

## 12. Data Sources (for citation)

- Open-Meteo (open-meteo.com) — weather, seasonal, terrain APIs
- ECMWF SEAS5 via Open-Meteo Seasonal API
- Copernicus DEM GLO-90 via Open-Meteo Elevation API
- OpenStreetMap contributors
- Farmonaut (2026) — Natural Farming Regions in Zimbabwe: 2025 Essential Guide
- AGRITEX Zimbabwe — crop advisory rules
- FAO — crop water requirements (Kc values)
- Seed Co (2026) — maize and wheat variety data
- Kutsaga Research Station — tobacco varieties and agronomy
- Quton — cotton varieties
- DR&SS Zimbabwe — sunflower and cowpea varieties
- ICRISAT Bulawayo — sorghum and groundnut varieties
- Agriseeds (Pvt) Ltd — wheat fertilizer, herbicide, planting date data
- Folio3 AgTech (2026) — plant disease reference content
- OCHA/HDX Zimbabwe — administrative boundaries and district coordinates
- MSD Zimbabwe — meteorological station coordinates
- Farmers.co.zw — Mbare Musika daily market prices (26-09-26)

---

## 13. Key Design Decisions

1. All free, no paid services — deployed entirely on free tiers
2. Browser-only development — no terminal required
3. Rule-based crop advisory — transparent and citable for a dissertation
4. Two ML systems — Random Forest for yield, z-score for drought
5. Glass card design — semi-transparent with green glow
6. Photo backgrounds — farmer.jpg for sidebar/header, background.jpeg for content
7. No heavy chart libraries — custom SVG keeps bundle small
8. Multilingual approach — translation keys in a single file, event-driven updates
9. PDF export client-side — no server required
10. Simulated payments — real gateway integration out of scope for dissertation

---

## 14. Known Limitations (for Chapter 7)

- Payment processing is simulated; no real money transacts
- Market prices are illustrative (Farmers.co.zw listings), not live API
- Random Forest trained on synthetic data; field data required for production
- Seasonal forecasts indicate direction, not exact rainfall
- Terrain uses single-point elevation, not full DEM analysis
- Content translation covers sidebar/headings only
- Weather fetches district centroid — no microclimate variation
- No field validation of crop advisory recommendations
- No admin panel for approving subscriptions
- Off-season crop advice assumes irrigation availability

---

## 15. Suggested Future Work

1. Real payment gateway integration (Paynow Zimbabwe)
2. CHIRPS / GEE integration for satellite rainfall
3. Field data collection for ML retraining
4. Admin approval panel for subscriptions
5. Progressive Web App (offline mode)
6. Full Shona/Ndebele translation
7. SMS fallback for offline farmers
8. Voice interface for low-literacy users
9. Multi-crop yield prediction for horticulture
10. Integration with real market price APIs

---

## 16. Change Log

### v1.0 — Initial build
Login page, register page, Neon database, dashboard shell, OSM map, live weather, chart

### v1.1 — Multilingual
Translations for English/Shona/Ndebele, wired into sidebar and headings

### v1.2 — ML Predictions
Random Forest Python API deployed to Render, PredictionCard

### v1.3 — Market & Ticker
Market prices table with filters, PriceTicker scrolling bar

### v1.4 — Learn Section
30+ disease and pest cards, 8 category filters

### v1.5 — Subscription System
Plans, 4 payment methods, reference codes, status tracking

### v1.6 — PDF Export
jsPDF + html2canvas export button in the header

### v1.7 — Drought Monitor
30-year rainfall z-score classification, monthly chart

### v1.8 — Crop Advisor (initial)
Recommended crops, variety matching, irrigation notes

### v1.9 — Natural Regions
NR I–V integration, tobacco/cotton/wheat crops added

### v2.0 — Seasonal Forecast
ECMWF SEAS5 outlook, onset detection, growing window

### v2.1 — Planting Strategy
Bridging irrigation, pot-holing technique, variety timing

### v2.2 — Terrain
Elevation, relief zone, slope classification

### v2.3 — All 91 Districts
Complete district dataset with coordinates

### v2.4 — Mbare Musika Market Prices
Updated marketData with daily prices from Farmers.co.zw (26-09-26). 38+ commodities including horticulture, fruits, legumes, grains.

### v2.5 — Off-Season Crops & Multi-Crop Support
Added growing conditions (temperature, humidity, sunlight, wind) to all crops. Added off-season months. Added 12 new horticulture crops: Tomatoes, Butternuts, Cabbage, Rape, Covo, Tsunga, Peas, Onions, Carrots, Potatoes.

---

*This changelog is maintained alongside the project as a reference for the
dissertation write-up. Each chapter of the dissertation will cite specific
sections above.*
