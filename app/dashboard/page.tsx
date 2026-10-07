'use client'

import { useState } from 'react'
import Sidebar, { TabKey } from './Sidebar'
import TopBar from './TopBar'
import MapView from './MapView'
import WeatherCard from './WeatherCard'
import DroughtMonitor from './DroughtMonitor'
import ChartSection from './ChartSection'
import PredictionCard from './PredictionCard'
import Market from './Market'
import Subscription from './Subscription'
import Charts from './Charts'
import StatCards from './StatCards'
import LocationPicker from './LocationPicker'
import { learnItems, learnCategories, LearnCategory } from './learnData'
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
        height: '100vh',
        overflow: 'hidden',
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.55), rgba(255,255,255,0.55)), url(/images/background.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <Sidebar activeTab={activeTab} onChangeTab={setActiveTab} />
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        <TopBar />

        <main style={{ padding: '24px', flex: 1 }}>
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'map' && <MapTab />}
          {activeTab === 'weather' && <WeatherTab />}
          {activeTab === 'drought' && <DroughtTab />}
          {activeTab === 'predictions' && <PredictionsTab />}
          {activeTab === 'charts' && <ChartsTab />}
          {activeTab === 'market' && <MarketTab />}
          {activeTab === 'learn' && <LearnTab />}
          {activeTab === 'help' && <HelpTab />}
          {activeTab === 'subscribe' && <SubscribeTab />}
        </main>
      </div>

      <Toaster position="top-right" richColors />
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

      <LocationPicker />

      <StatCards />

      <div style={{ marginBottom: '16px' }}>
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
          <PredictionCard />
        </GlowWrapper>
        <GlowWrapper>
          <ChartSection />
        </GlowWrapper>
      </div>
    </>
  )
}

function MapTab() {
  return (
    <>
      <SectionHeading title="Map" subtitle="Explore your district and surrounding areas" />
      <LocationPicker />
      <div style={{ height: 'calc(100vh - 340px)', minHeight: '520px' }}>
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
      <LocationPicker />
      <GlowWrapper>
        <WeatherCard />
      </GlowWrapper>
    </>
  )
}

function DroughtTab() {
  return (
    <>
      <SectionHeading
        title="Drought Monitor"
        subtitle="Live drought and bumper harvest status for your district"
      />
      <LocationPicker />
      <DroughtMonitor />
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

function ChartsTab() {
  return (
    <>
      <SectionHeading
        title="Charts"
        subtitle="Visual analysis of maize yield, crop distribution, and frequency"
      />
      <Charts />
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
  const [category, setCategory] = useState<LearnCategory>('all')

  const filtered =
    category === 'all' ? learnItems : learnItems.filter((i) => i.category === category)

  return (
    <>
      <SectionHeading
        title="Did You Know?"
        subtitle="Crop education, pest help, disease identification, and best practices"
      />

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '20px',
        }}
      >
        {learnCategories.map((c) => {
          const isActive = category === c.key
          return (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 16px',
                borderRadius: '999px',
                border: isActive
                  ? '1px solid rgba(0,255,136,0.55)'
                  : '1px solid rgba(255,255,255,0.4)',
                background: isActive
                  ? 'rgba(0,255,136,0.20)'
                  : 'rgba(255,255,255,0.35)',
                color: '#0f172a',
                fontSize: '13px',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                boxShadow: isActive ? '0 0 15px rgba(0,255,136,0.40)' : 'none',
                transition: 'all 0.25s ease',
                backdropFilter: 'blur(6px)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.boxShadow = '0 0 12px rgba(0,255,136,0.25)'
                  e.currentTarget.style.background = 'rgba(0,255,136,0.10)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.35)'
                }
              }}
            >
              <span>{c.icon}</span>
              {c.label}
            </button>
          )
        })}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {filtered.map((item, i) => (
          <div
            key={i}
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
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>{item.icon}</div>
            <h3
              style={{
                fontSize: '17px',
                color: '#0f3d20',
                margin: 0,
                fontWeight: 700,
                textShadow: '0 1px 3px rgba(255,255,255,0.6)',
              }}
            >
              {item.title}
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: '#1f2937',
                lineHeight: 1.6,
                marginTop: '8px',
              }}
            >
              {item.body}
            </p>
            {item.action && (
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
                    color: '#334155',
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  💊 <strong>Action:</strong> {item.action}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
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

function SubscribeTab() {
  return (
    <>
      <SectionHeading
        title="Subscription"
        subtitle="Choose a plan and pay with EcoCash, Mukuru, InnBucks, or Bank Transfer"
      />
      <Subscription />
    </>
  )
}
