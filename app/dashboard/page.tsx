'use client'

import { useState } from 'react'
import Sidebar, { TabKey } from './Sidebar'
import TopBar from './TopBar'
import MapView from './MapView'
import WeatherCard from './WeatherCard'
import ChartSection from './ChartSection'
import PredictionCard from './PredictionCard'
import Market from './Market'
import { Toaster } from 'sonner'

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

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview')

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.55), rgba(255,255,255,0.55)), url(/images/background.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <Sidebar activeTab={activeTab} onChangeTab={setActiveTab} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TopBar />

        <main style={{ padding: '24px', flex: 1 }}>
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'map' && <MapTab />}
          {activeTab === 'weather' && <WeatherTab />}
          {activeTab === 'predictions' && <PredictionsTab />}
          {activeTab === 'market' && <MarketTab />}
          {activeTab === 'learn' && <LearnTab />}
          {activeTab === 'help' && <HelpTab />}
        </main>
      </div>

      <Toaster position="top-right" richColors />
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string
  value: string
  icon: string
  color: string
}) {
  return (
    <div
      style={{
        ...cardStyle,
        borderLeft: `4px solid ${color}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 0 25px rgba(0,255,136,0.45)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 0 15px rgba(0,255,136,0.18)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
      <p style={{ fontSize: '13px', color: '#1f2937', margin: 0, fontWeight: 500 }}>
        {title}
      </p>
      <p
        style={{
          fontSize: '22px',
          fontWeight: 700,
          color: '#0f172a',
          margin: '4px 0 0 0',
        }}
      >
        {value}
      </p>
    </div>
  )
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h1
        style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#0f172a',
          margin: 0,
          textShadow: '0 1px 4px rgba(255,255,255,0.6)',
        }}
      >
        {title}
      </h1>
      <p
        style={{
          fontSize: '14px',
          color: '#334155',
          margin: '4px 0 0 0',
          textShadow: '0 1px 3px rgba(255,255,255,0.6)',
        }}
      >
        {subtitle}
      </p>
    </div>
  )
}

function GlowWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        borderRadius: '16px',
        border: '1px solid rgba(0,255,136,0.20)',
        boxShadow: '0 0 15px rgba(0,255,136,0.18)',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        height: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 0 25px rgba(0,255,136,0.45)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 0 15px rgba(0,255,136,0.18)'
      }}
    >
      {children}
    </div>
  )
}

function OverviewTab() {
  return (
    <>
      <SectionHeading title="Overview" subtitle="Your farm at a glance" />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <StatCard title="Current Weather" value="—" icon="☀️" color="#0ea5e9" />
        <StatCard title="Rainfall (30 days)" value="— mm" icon="🌧️" color="#16803c" />
        <StatCard title="Predicted Yield" value="— t/ha" icon="🌽" color="#f59e0b" />
        <StatCard title="Alerts" value="0 active" icon="🔔" color="#dc2626" />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <GlowWrapper>
          <MapView />
        </GlowWrapper>
        <GlowWrapper>
          <WeatherCard />
        </GlowWrapper>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
          gap: '16px',
        }}
      >
        <GlowWrapper>
          <ChartSection />
        </GlowWrapper>
        <GlowWrapper>
          <PredictionCard />
        </GlowWrapper>
      </div>
    </>
  )
}

function MapTab() {
  return (
    <>
      <SectionHeading title="Map" subtitle="Explore your district and surrounding areas" />
      <div style={{ height: 'calc(100vh - 180px)', minHeight: '520px' }}>
        <GlowWrapper>
          <MapView />
        </GlowWrapper>
      </div>
    </>
  )
}

function WeatherTab() {
  return (
    <>
      <SectionHeading title="Weather" subtitle="Current conditions and 7-day forecast" />
      <GlowWrapper>
        <WeatherCard />
      </GlowWrapper>
    </>
  )
}

function PredictionsTab() {
  return (
    <>
      <SectionHeading
        title="Predictions"
        subtitle="Random Forest predictions of maize yield"
      />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
          gap: '16px',
        }}
      >
        <GlowWrapper>
          <ChartSection />
        </GlowWrapper>
        <GlowWrapper>
          <PredictionCard />
        </GlowWrapper>
      </div>
    </>
  )
}

function MarketTab() {
  return (
    <>
      <SectionHeading
        title="Market"
        subtitle="Producer prices and wholesale market rates across Zimbabwe"
      />
      <Market />
    </>
  )
}

function LearnTab() {
  return (
    <>
      <SectionHeading
        title="Did You Know?"
        subtitle="Crop education, pest help, and best practices"
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        <LearnCard
          crop="Maize"
          fact="Maize needs 500–800 mm of rainfall per season. Plant with the first effective rains."
          pest="Fall armyworm"
          treatment="Scout early, apply neem oil or approved pesticide, and rotate crops."
        />
        <LearnCard
          crop="Sorghum"
          fact="Sorghum is drought-tolerant and needs only 400 mm of rainfall. Great for dry areas."
          pest="Striga weed"
          treatment="Rotate with legumes and use resistant varieties."
        />
        <LearnCard
          crop="Groundnuts"
          fact="Groundnuts fix nitrogen in the soil, improving fertility for the next crop."
          pest="Leaf spot disease"
          treatment="Use resistant varieties and practice crop rotation."
        />
        <LearnCard
          crop="Cowpeas"
          fact="Cowpeas are a fast-maturing legume that improves soil and provides protein."
          pest="Aphids"
          treatment="Spray with soapy water or use neem-based solutions."
        />
      </div>
    </>
  )
}

function LearnCard({
  crop,
  fact,
  pest,
  treatment,
}: {
  crop: string
  fact: string
  pest: string
  treatment: string
}) {
  return (
    <div
      style={{
        ...cardStyle,
        borderLeft: '4px solid #16803c',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 0 25px rgba(0,255,136,0.45)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 0 15px rgba(0,255,136,0.18)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <h3
        style={{
          fontSize: '17px',
          color: '#0f3d20',
          margin: 0,
          fontWeight: 700,
          textShadow: '0 1px 3px rgba(255,255,255,0.6)',
        }}
      >
        {crop}
      </h3>
      <p
        style={{
          fontSize: '14px',
          color: '#1f2937',
          lineHeight: 1.6,
          marginTop: '8px',
        }}
      >
        {fact}
      </p>
      <div
        style={{
          marginTop: '14px',
          background: 'rgba(255, 248, 225, 0.75)',
          padding: '12px',
          borderRadius: '10px',
        }}
      >
        <p
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#7a4a1f',
            margin: 0,
          }}
        >
          🐛 Pest: {pest}
        </p>
        <p
          style={{
            fontSize: '13px',
            color: '#334155',
            margin: '4px 0 0 0',
          }}
        >
          💊 Treatment: {treatment}
        </p>
      </div>
    </div>
  )
}

function HelpTab() {
  return (
    <>
      <SectionHeading
        title="Help Centre"
        subtitle="Get support, ask questions, or contact a consultant"
      />

      <div style={{ ...cardStyle, maxWidth: '640px' }}>
        <h3 style={{ fontSize: '16px', color: '#0f172a', margin: 0, fontWeight: 700 }}>
          Need help with your farm?
        </h3>
        <p
          style={{
            fontSize: '14px',
            color: '#1f2937',
            lineHeight: 1.7,
            marginTop: '10px',
          }}
        >
          Our agriculture consultants can help you with:
        </p>
        <ul
          style={{
            color: '#1f2937',
            lineHeight: 1.9,
            marginTop: '8px',
            fontSize: '14px',
          }}
        >
          <li>Pest and disease identification and treatment</li>
          <li>Choosing the right crop variety for your district</li>
          <li>Understanding the Random Forest yield predictions</li>
          <li>Climate-smart farming practices</li>
        </ul>
        <a
          href="mailto:help@farmdashboard.co.zw"
          style={{
            display: 'inline-block',
            marginTop: '16px',
            background: '#16803c',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '14px',
            boxShadow: '0 0 15px rgba(0,255,136,0.35)',
          }}
        >
          Contact a Consultant
        </a>
      </div>
    </>
  )
}
