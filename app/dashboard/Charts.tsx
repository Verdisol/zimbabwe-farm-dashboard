'use client'

// ---------- Sample data (editable) ----------
const yieldData = [
  { year: '2015', yield: 0.9 },
  { year: '2016', yield: 0.6 },
  { year: '2017', yield: 1.1 },
  { year: '2018', yield: 0.8 },
  { year: '2019', yield: 1.3 },
  { year: '2020', yield: 1.0 },
  { year: '2021', yield: 1.5 },
  { year: '2022', yield: 1.1 },
  { year: '2023', yield: 1.6 },
  { year: '2024', yield: 1.4 },
]

const cropDistribution = [
  { label: 'Maize', value: 45, color: '#16803c' },
  { label: 'Sorghum', value: 20, color: '#f59e0b' },
  { label: 'Groundnuts', value: 15, color: '#0ea5e9' },
  { label: 'Cowpeas', value: 10, color: '#dc2626' },
  { label: 'Millet', value: 10, color: '#7c3aed' },
]

const yieldHistogram = [
  { range: '<0.5', count: 0 },
  { range: '0.5–0.8', count: 2 },
  { range: '0.8–1.1', count: 4 },
  { range: '1.1–1.4', count: 3 },
  { range: '1.4–1.7', count: 2 },
  { range: '>1.7', count: 0 },
]

// ---------- Common wrappers ----------
const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.20)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  borderRadius: '16px',
  padding: '20px',
  border: '1px solid rgba(0,255,136,0.20)',
  boxShadow: '0 0 15px rgba(0,255,136,0.18)',
  transition: 'all 0.3s ease',
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 0 25px rgba(0,255,136,0.45)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 0 15px rgba(0,255,136,0.18)'
      }}
    >
      <div style={{ marginBottom: '14px' }}>
        <h3
          style={{
            fontSize: '16px',
            color: '#0f3d20',
            margin: 0,
            fontWeight: 700,
            textShadow: '0 1px 3px rgba(255,255,255,0.6)',
          }}
        >
          {title}
        </h3>
        <p style={{ fontSize: '12px', color: '#334155', margin: '2px 0 0 0' }}>{subtitle}</p>
      </div>
      {children}
    </div>
  )
}

// ---------- Line Chart ----------
function LineChart() {
  const width = 520
  const height = 220
  const padding = { top: 16, right: 16, bottom: 28, left: 36 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom
  const maxY = Math.max(...yieldData.map((d) => d.yield))

  const points = yieldData.map((d, i) => {
    const x = padding.left + (i / (yieldData.length - 1)) * chartW
    const y = padding.top + chartH - (d.yield / maxY) * chartH
    return { x, y, ...d }
  })

  const linePath = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(' ')

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${
    padding.top + chartH
  } L ${padding.left} ${padding.top + chartH} Z`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto' }}>
      {[0, 0.5, 1.0, 1.5, 2.0].map((val) => {
        const y = padding.top + chartH - (val / maxY) * chartH
        return (
          <g key={val}>
            <line
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1"
            />
            <text x={padding.left - 6} y={y + 3} textAnchor="end" fontSize="10" fill="#334155">
              {val}
            </text>
          </g>
        )
      })}
      <path d={areaPath} fill="rgba(22,128,60,0.20)" />
      <path
        d={linePath}
        fill="none"
        stroke="#16803c"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {points.map((p) => (
        <g key={p.year}>
          <circle cx={p.x} cy={p.y} r="5" fill="#16803c" />
          <circle cx={p.x} cy={p.y} r="2" fill="white" />
          <text x={p.x} y={height - 8} textAnchor="middle" fontSize="10" fill="#334155">
            {p.year}
          </text>
        </g>
      ))}
    </svg>
  )
}

// ---------- Bar Chart ----------
function BarChart() {
  const width = 520
  const height = 220
  const padding = { top: 16, right: 16, bottom: 28, left: 36 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom
  const maxY = Math.max(...yieldData.map((d) => d.yield))
  const barW = chartW / yieldData.length - 8

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto' }}>
      {[0, 0.5, 1.0, 1.5, 2.0].map((val) => {
        const y = padding.top + chartH - (val / maxY) * chartH
        return (
          <g key={val}>
            <line
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1"
            />
            <text x={padding.left - 6} y={y + 3} textAnchor="end" fontSize="10" fill="#334155">
              {val}
            </text>
          </g>
        )
      })}
      {yieldData.map((d, i) => {
        const x = padding.left + i * (chartW / yieldData.length) + 4
        const h = (d.yield / maxY) * chartH
        const y = padding.top + chartH - h
        return (
          <g key={d.year}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={h}
              rx="4"
              fill="url(#barGradient)"
            />
            <text x={x + barW / 2} y={height - 8} textAnchor="middle" fontSize="10" fill="#334155">
              {d.year.slice(2)}
            </text>
            <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize="10" fill="#0f3d20" fontWeight="600">
              {d.yield}
            </text>
          </g>
        )
      })}
      <defs>
        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16803c" />
          <stop offset="100%" stopColor="#0d5a29" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// ---------- Pie Chart ----------
function PieChart() {
  const size = 220
  const cx = size / 2
  const cy = size / 2
  const r = 85
  const innerR = 45
  const total = cropDistribution.reduce((sum, d) => sum + d.value, 0)

  let cumulative = 0
  const slices = cropDistribution.map((d) => {
    const startAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2
    cumulative += d.value
    const endAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2

    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)
    const ix1 = cx + innerR * Math.cos(startAngle)
    const iy1 = cy + innerR * Math.sin(startAngle)
    const ix2 = cx + innerR * Math.cos(endAngle)
    const iy2 = cy + innerR * Math.sin(endAngle)

    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0

    const path = [
      `M ${x1} ${y1}`,
      `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${ix2} ${iy2}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix1} ${iy1}`,
      'Z',
    ].join(' ')

    return { ...d, path }
  })

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
      <svg viewBox={`0 0 ${size} ${size}`} style={{ width: '180px', height: '180px' }}>
        {slices.map((s) => (
          <path key={s.label} d={s.path} fill={s.color} />
        ))}
        <text
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          fontSize="14"
          fill="#0f3d20"
          fontWeight="700"
        >
          Crops
        </text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {cropDistribution.map((d) => (
          <div
            key={d.label}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#1f2937' }}
          >
            <span
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '4px',
                background: d.color,
                display: 'inline-block',
              }}
            />
            <span style={{ fontWeight: 600 }}>{d.label}</span>
            <span style={{ color: '#334155' }}>{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------- Histogram ----------
function Histogram() {
  const width = 520
  const height = 220
  const padding = { top: 16, right: 16, bottom: 28, left: 36 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom
  const maxY = Math.max(...yieldHistogram.map((d) => d.count)) || 1
  const barW = chartW / yieldHistogram.length - 10

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto' }}>
      {[0, 1, 2, 3, 4].map((val) => {
        const y = padding.top + chartH - (val / maxY) * chartH
        return (
          <g key={val}>
            <line
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1"
            />
            <text x={padding.left - 6} y={y + 3} textAnchor="end" fontSize="10" fill="#334155">
              {val}
            </text>
          </g>
        )
      })}
      {yieldHistogram.map((d, i) => {
        const x = padding.left + i * (chartW / yieldHistogram.length) + 5
        const h = (d.count / maxY) * chartH
        const y = padding.top + chartH - h
        return (
          <g key={d.range}>
            <rect x={x} y={y} width={barW} height={h} rx="4" fill="#0ea5e9" />
            <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize="10" fill="#0f3d20" fontWeight="600">
              {d.count}
            </text>
            <text x={x + barW / 2} y={height - 8} textAnchor="middle" fontSize="10" fill="#334155">
              {d.range}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ---------- Main Component ----------
export default function Charts() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ChartCard
        title="📈 Maize Yield Trend (2015–2024)"
        subtitle="Historical yields in tons per hectare"
      >
        <LineChart />
      </ChartCard>

      <ChartCard
        title="📊 Yield by Year (Bar Chart)"
        subtitle="Direct comparison of annual maize yields"
      >
        <BarChart />
      </ChartCard>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px',
        }}
      >
        <ChartCard
          title="🥧 Crop Area Distribution (Pie Chart)"
          subtitle="Share of cultivated area by crop"
        >
          <PieChart />
        </ChartCard>

        <ChartCard
          title="📉 Yield Frequency Distribution (Histogram)"
          subtitle="How often each yield range occurs, 2015–2024"
        >
          <Histogram />
        </ChartCard>
      </div>
    </div>
  )
}
