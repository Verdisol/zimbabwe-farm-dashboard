'use client'

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import Sidebar, { TabKey } from './Sidebar'
import TopBar from './TopBar'
import MapView from './MapView'
import WeatherCard from './WeatherCard'
import DroughtMonitor from './DroughtMonitor'
import DroughtAlert from './DroughtAlert'
import ChartSection from './ChartSection'
import PredictionCard from './PredictionCard'
import Market from './Market'
import Subscription from './Subscription'
import Charts from './Charts'
import StatCards from './StatCards'
import LocationPicker from './LocationPicker'
import CropAdvisor from './CropAdvisor'
import { learnItems, learnCategories, LearnCategory } from './learnData'
import { Language, getSavedLanguage, t } from './translations'
import { Toaster } from 'sonner'

const WardMapSelector = dynamic<{
  onDistrictSelect?: (data: any) => void
  onWardSelect?: (ward: any) => void
  height?: string
  showLegend?: boolean
}>(() => import('./WardMapSelector'), { ssr: false })

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
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    setLanguage(getSavedLanguage())
    const onLanguageChange = () => setLanguage(getSavedLanguage())
    window.addEventListener('languageChanged', onLanguageChange)
    window.addEventListener('storage', onLanguageChange)
    return () => {
      window.removeEventListener('languageChanged', onLanguageChange)
      window.removeEventListener('storage', onLanguageChange)
    }
  }, [])

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundImage: 'linear-gradient(rgba(255,255,255,0.55), rgba(255,255,255,0.55)), url(/images/background.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
      <div style={{ flexShrink: 0 }}><Sidebar activeTab={activeTab} onChangeTab={setActiveTab} /></div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflowY: 'auto' }}>
        <TopBar />
        <main style={{ padding: '24px', flex: 1 }}>
          <div id="export-area">
            {activeTab === 'overview' && <OverviewTab language={language} />}
            {activeTab === 'map' && <MapTab language={language} />}
            {activeTab === 'weather' && <WeatherTab language={language} />}
            {activeTab === 'drought' && <DroughtTab language={language} />}
            {activeTab === 'predictions' && <PredictionsTab language={language} />}
            {activeTab === 'charts' && <ChartsTab language={language} />}
            {activeTab === 'market' && <MarketTab language={language} />}
            {activeTab === 'learn' && <LearnTab language={language} />}
            {activeTab === 'help' && <HelpTab language={language} />}
            {activeTab === 'subscribe' && <SubscribeTab language={language} />}
          </div>
        </main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  )
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: 0, textShadow: '0 1px 4px rgba(255,255,255,0.6)' }}>{title}</h1>
      <p style={{ fontSize: '14px', color: '#334155', margin: '4px 0 0 0', textShadow: '0 1px 3px rgba(255,255,255,0.6)' }}>{subtitle}</p>
    </div>
  )
}

function GlowWrapper({ children }: { children: React.ReactNode }) {
  return <div style={{ borderRadius: '16px', border: '1px solid rgba(0,255,136,0.20)', boxShadow: '0 0 15px rgba(0,255,136,0.18)', transition: 'all 0.3s ease', overflow: 'hidden', height: '100%' }}>{children}</div>
}

function IndexTile({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.55)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
      <p style={{ fontSize: '10px', color: '#475569', margin: 0, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</p>
      <p style={{ fontSize: '18px', fontWeight: 800, color, margin: '4px 0 0 0' }}>{value}</p>
    </div>
  )
}

function OverviewTab({ language }: { language: Language }) {
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null)
  const [selectedWard, setSelectedWard] = useState<any>(null)

  return (
    <>
      <SectionHeading title={t(language, 'tab_overview_title')} subtitle={t(language, 'tab_overview_sub')} />
      <LocationPicker />
      <div style={{ marginBottom: '16px' }}>
        <WardMapSelector height="420px" onDistrictSelect={setSelectedDistrict} onWardSelect={setSelectedWard} />
      </div>
      {selectedDistrict && (
        <div style={{ ...cardStyle, marginBottom: '16px' }}>
          <h3 style={{ fontSize: '15px', color: '#0f3d20', margin: 0, fontWeight: 700 }}>📍 {selectedDistrict.name}</h3>
          <p style={{ fontSize: '13px', color: '#1f2937', marginTop: '6px' }}>
            Drought Score: <strong>{selectedDistrict.score?.toFixed(0) || '—'}/100</strong>
            {selectedWard && <> · Ward: <strong>{selectedWard.properties?.WARD || selectedWard.properties?.ADM3_NAME || 'Selected'}</strong></>}
          </p>
        </div>
      )}
      <StatCards />
      <div style={{ marginBottom: '16px' }}><GlowWrapper><WeatherCard /></GlowWrapper></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '16px' }}>
        <GlowWrapper><PredictionCard /></GlowWrapper>
        <GlowWrapper><ChartSection /></GlowWrapper>
      </div>
    </>
  )
}

function MapTab({ language }: { language: Language }) {
  return (
    <>
      <SectionHeading title={t(language, 'tab_map_title')} subtitle={t(language, 'tab_map_sub')} />
      <LocationPicker />
      <div style={{ height: 'calc(100vh - 340px)', minHeight: '520px' }}><GlowWrapper><MapView /></GlowWrapper></div>
    </>
  )
}

function WeatherTab({ language }: { language: Language }) {
  return (
    <>
      <SectionHeading title={t(language, 'tab_weather_title')} subtitle={t(language, 'tab_weather_sub')} />
      <LocationPicker />
      <GlowWrapper><WeatherCard /></GlowWrapper>
    </>
  )
}

function DroughtTab({ language }: { language: Language }) {
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null)
  const [selectedWard, setSelectedWard] = useState<any>(null)
  const [rainfallStatus, setRainfallStatus] = useState<string>('normal')
  const [muted, setMuted] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isAudioUnlocked = useRef(false)

  const satelliteDrought = selectedDistrict && selectedDistrict.score >= 51
  const rainfallDrought = rainfallStatus === 'drought' || rainfallStatus === 'extreme-drought'
  const isDrought = satelliteDrought || rainfallDrought

  // 1. Initialize audio and unlock on first click
  useEffect(() => {
    // Create the audio element pointing to your MP3
    const audio = new Audio('https://cdn.pixabay.com/download/audio/2026/06/02/audio_26933dce5c.mp3?filename=tithuh-warning-545568.mp3')
    audio.loop = true
    audioRef.current = audio

    const unlockAudio = () => {
      if (isAudioUnlocked.current) return
      isAudioUnlocked.current = true
      
      // Play and immediately pause to satisfy browser autoplay policies
      audio.play().then(() => {
        audio.pause()
        audio.currentTime = 0
      }).catch(e => console.log('Audio unlock failed', e))

      window.removeEventListener('click', unlockAudio)
      window.removeEventListener('touchstart', unlockAudio)
    }

    window.addEventListener('click', unlockAudio)
    window.addEventListener('touchstart', unlockAudio)

    return () => {
      window.removeEventListener('click', unlockAudio)
      window.removeEventListener('touchstart', unlockAudio)
      audio.pause()
    }
  }, [])

  // 2. Play/Stop the MP3 based on drought status and mute state
  useEffect(() => {
    if (!audioRef.current) return

    if (isDrought && !muted) {
      audioRef.current.play().catch(e => console.log('Audio blocked:', e))
    } else {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [isDrought, muted])

  return (
    <>
      <SectionHeading title={t(language, 'tab_drought_title')} subtitle="Select district and ward to see spatial drought analysis" />

      {isDrought && !muted && <div className="fullscreen-red-flash" />}

      {isDrought && (
        <div style={{ marginBottom: '16px', padding: '16px', background: '#dc2626', color: 'white', borderRadius: '12px', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 99999 }}>
          <span>⚠️ DROUGHT WARNING — {selectedDistrict?.name}</span>
          <button onClick={() => setMuted(!muted)} style={{ background: 'rgba(0,0,0,0.35)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
            {muted ? '🔇 Unmute' : '🔊 Mute'}
          </button>
        </div>
      )}

      <DroughtAlert district={selectedDistrict} onClose={() => setSelectedDistrict(null)} />

      <div style={{ marginBottom: '20px' }}>
        <WardMapSelector height="500px" onDistrictSelect={setSelectedDistrict} onWardSelect={setSelectedWard} />
      </div>

      {selectedDistrict && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '20px', padding: '16px', background: 'rgba(255,255,255,0.30)', borderRadius: '16px' }}>
          <IndexTile label="Drought Score" value={`${selectedDistrict.score?.toFixed(0) || '—'}/100`} color={selectedDistrict.score >= 71 ? '#dc2626' : selectedDistrict.score >= 51 ? '#f59e0b' : '#16803c'} />
          <IndexTile label="NDVI" value={selectedDistrict.indices?.NDVI?.toFixed(2) ?? '—'} color="#16803c" />
          <IndexTile label="SAVI" value={selectedDistrict.indices?.SAVI?.toFixed(2) ?? '—'} color="#16803c" />
          <IndexTile label="LST (°C)" value={selectedDistrict.indices?.LST_C?.toFixed(1) ?? '—'} color="#dc2626" />
          <IndexTile label="Soil Moisture" value={selectedDistrict.indices?.Soil_Moisture?.toFixed(3) ?? '—'} color="#0ea5e9" />
          <IndexTile label="NDVI Anomaly" value={`${selectedDistrict.indices?.NDVI_Anomaly_pct?.toFixed(1) ?? '—'}%`} color={(selectedDistrict.indices?.NDVI_Anomaly_pct ?? 0) < 0 ? '#dc2626' : '#16803c'} />
        </div>
      )}

      {selectedWard && (
        <div style={{ padding: '16px', background: 'rgba(255,255,255,0.30)', borderRadius: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', color: '#0f3d20' }}>📍 Ward selected</h3>
          <p style={{ marginTop: '6px', fontSize: '14px' }}>
            {selectedWard.properties?.WARD || selectedWard.properties?.ADM3_NAME || selectedWard.properties?.WARD_NAME || 'Ward'}
          </p>
        </div>
      )}

      <LocationPicker />
      <div style={{ marginBottom: '16px' }}>
        <DroughtMonitor onStatusChange={(s: string) => setRainfallStatus(s)} />
      </div>
      <CropAdvisor />
    </>
  )
}

function PredictionsTab({ language }: { language: Language }) {
  return (
    <>
      <SectionHeading title={t(language, 'tab_predictions_title')} subtitle={t(language, 'tab_predictions_sub')} />
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '16px' }}>
        <GlowWrapper><ChartSection /></GlowWrapper>
        <GlowWrapper><PredictionCard /></GlowWrapper>
      </div>
    </>
  )
}

function ChartsTab({ language }: { language: Language }) {
  return (
    <>
      <SectionHeading title={t(language, 'tab_charts_title')} subtitle={t(language, 'tab_charts_sub')} />
      <Charts />
    </>
  )
}

function MarketTab({ language }: { language: Language }) {
  return (
    <>
      <SectionHeading title={t(language, 'tab_market_title')} subtitle={t(language, 'tab_market_sub')} />
      <Market />
    </>
  )
}

function LearnTab({ language }: { language: Language }) {
  const [category, setCategory] = useState<LearnCategory>('all')
  const filtered = category === 'all' ? learnItems : learnItems.filter((i) => i.category === category)

  return (
    <>
      <SectionHeading title={t(language, 'tab_learn_title')} subtitle={t(language, 'tab_learn_sub')} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
        {learnCategories.map((c) => {
          const isActive = category === c.key
          return (
            <button key={c.key} onClick={() => setCategory(c.key)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '999px', border: isActive ? '1px solid rgba(0,255,136,0.55)' : '1px solid rgba(255,255,255,0.4)', background: isActive ? 'rgba(0,255,136,0.20)' : 'rgba(255,255,255,0.35)', color: '#0f172a', fontSize: '13px', fontWeight: isActive ? 700 : 500, cursor: 'pointer', boxShadow: isActive ? '0 0 15px rgba(0,255,136,0.40)' : 'none', transition: 'all 0.25s ease', backdropFilter: 'blur(6px)' }}>
              <span>{c.icon}</span>{c.label}
            </button>
          )
        })}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {filtered.map((item, i) => (
          <div key={i} style={{ ...cardStyle, borderLeft: '4px solid #16803c' }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>{item.icon}</div>
            <h3 style={{ fontSize: '17px', color: '#0f3d20', margin: 0, fontWeight: 700, textShadow: '0 1px 3px rgba(255,255,255,0.6)' }}>{item.title}</h3>
            <p style={{ fontSize: '14px', color: '#1f2937', lineHeight: 1.6, marginTop: '8px' }}>{item.body}</p>
            {item.action && (
              <div style={{ marginTop: '14px', background: 'rgba(255, 248, 225, 0.75)', padding: '12px', borderRadius: '10px' }}>
                <p style={{ fontSize: '13px', color: '#334155', margin: 0, fontWeight: 500 }}>💊 <strong>Action:</strong> {item.action}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

function HelpTab({ language }: { language: Language }) {
  return (
    <>
      <SectionHeading title={t(language, 'tab_help_title')} subtitle={t(language, 'tab_help_sub')} />
      <div style={{ ...cardStyle, maxWidth: '640px' }}>
        <h3 style={{ fontSize: '16px', color: '#0f172a', margin: 0, fontWeight: 700 }}>Need help with your farm?</h3>
        <p style={{ fontSize: '14px', color: '#1f2937', lineHeight: 1.7, marginTop: '10px' }}>Our agriculture consultants can help you with:</p>
        <ul style={{ color: '#1f2937', lineHeight: 1.9, marginTop: '8px', fontSize: '14px' }}>
          <li>Pest and disease identification and treatment</li>
          <li>Choosing the right crop variety for your district</li>
          <li>Understanding the Random Forest yield predictions</li>
          <li>Climate-smart farming practices</li>
        </ul>
        <a href="mailto:help@farmdashboard.co.zw" style={{ display: 'inline-block', marginTop: '16px', background: '#16803c', color: 'white', padding: '12px 20px', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '14px', boxShadow: '0 0 15px rgba(0,255,136,0.35)' }}>Contact a Consultant</a>
      </div>
    </>
  )
}

function SubscribeTab({ language }: { language: Language }) {
  return (
    <>
      <SectionHeading title={t(language, 'tab_subscribe_title')} subtitle={t(language, 'tab_subscribe_sub')} />
      <Subscription />
    </>
  )
}
