'use client'

// Historical maize yield data for Zimbabwe (tons per hectare)
// Source: FAOSTAT & HarvestStat Africa approximations
const yieldData = [
  { year: 2015, yield: 0.9, rainfall: 620 },
  { year: 2016, yield: 0.6, rainfall: 410 },
  { year: 2017, yield: 1.1, rainfall: 780 },
  { year: 2018, yield: 0.8, rainfall: 520 },
  { year: 2019, yield: 1.3, rainfall: 850 },
  { year: 2020, yield: 1.0, rainfall: 660 },
  { year: 2021, yield: 1.5, rainfall: 910 },
  { year: 2022, yield: 1.1, rainfall: 700 },
  { year: 2023, yield: 1.6, rainfall: 950 },
  { year: 2024, yield: 1.4, rainfall: 890 },
]

export default function ChartSection() {
  const width = 700
  const height = 260
  const padding = { top: 20, right: 20, bottom: 30, left: 40 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom

  const maxYield = Math.max(...yieldData.map((d) => d.yield))
  const minYield = 0

  // Convert data to SVG points
  const points = yieldData.map((d, i) => {
    const x = padding.left + (i / (yieldData.length - 1)) * chartW
    const y =
      padding.top + chartH - ((d.yield - minYield) / (maxYield - minYield)) * chartH
    return { x, y, ...d }
  })

  const linePath = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(' ')

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${
    padding.top + chartH
  } L ${padding.left} ${padding.top + chartH} Z`

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        padding: '20px',
      }}
    >
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1f2937', margin: 0 }}>
          📊 Maize Yield Trend (2015–2024)
        </h2>
        <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
          Historical yields in tons per hectare
        </p>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        {/* Grid lines */}
        {[0, 0.5, 1.0, 1.5, 2.0].map((val) => {
          const y =
            padding.top + chartH - ((val - minYield) / (maxYield - minYield)) * chartH
          return (
            <g key={val}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill="#94a3b8"
              >
                {val}
              </text>
            </g>
          )
        })}

        {/* Area under line */}
        <path d={areaPath} fill="rgba(22,128,60,0.15)" />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#16803c"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Data points */}
        {points.map((p) => (
          <g key={p.year}>
            <circle cx={p.x} cy={p.y} r="5" fill="#16803c" />
            <circle cx={p.x} cy={p.y} r="2.5" fill="white" />
            <text
              x={p.x}
              y={height - 8}
              textAnchor="middle"
              fontSize="10"
              fill="#64748b"
            >
              {p.year}
            </text>
          </g>
        ))}
      </svg>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '12px',
          fontSize: '12px',
          color: '#64748b',
        }}
      >
        <span>📈 Average yield: 1.13 t/ha</span>
        <span>🌧️ Average rainfall: 729 mm</span>
      </div>
    </div>
  )
}
