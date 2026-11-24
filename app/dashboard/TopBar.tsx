'use client'

import { useState, useEffect } from 'react'
import PriceTicker from './PriceTicker'
import ExportButton from './ExportButton'
import {
  languages,
  getSavedLanguage,
  saveLanguage,
  t,
} from './translations'
import type { Language } from './translations'

export default function TopBar() {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    setLanguage(getSavedLanguage())

    // Preserve the existing email-from-URL behaviour used by the dashboard.
    try {
      const savedEmail = localStorage.getItem('farmerEmail')
      if (!savedEmail) {
        const url = new URL(window.location.href)
        const email = url.searchParams.get('email')
        if (email) {
          localStorage.setItem('farmerEmail', email)
        }
      }
    } catch (error) {
      // The header should still work when browser storage is unavailable.
      console.warn('Could not read or save farmer email.', error)
    }
  }, [])

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    saveLanguage(lang)
  }

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        width: '100%',
      }}
    >
      {/* Compact brand header. The background is intentionally transparent so
          the dashboard's /public/background.webp image remains visible behind it. */}
      <header
        style={{
          boxSizing: 'border-box',
          minHeight: '48px',
          padding: '4px 18px',
          background:
            'linear-gradient(90deg, rgba(7,45,27,0.76), rgba(9,63,36,0.48))',
          borderBottom: '1px solid rgba(0,255,136,0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px 14px',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        {/* Dashboard identity */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flex: '1 1 360px',
            minWidth: 0,
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: '34px',
              height: '34px',
              flex: '0 0 34px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #36a861, #0d5a29)',
              border: '1px solid rgba(255,255,255,0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.20)',
            }}
          >
            CSA
          </div>

          <div style={{ minWidth: 0, lineHeight: 1.15 }}>
            <h1
              style={{
                margin: 0,
                color: '#ffffff',
                fontSize: '15px',
                lineHeight: '19px',
                fontWeight: 750,
                letterSpacing: '0.1px',
                textShadow: '0 1px 4px rgba(0,0,0,0.65)',
                whiteSpace: 'normal',
              }}
            >
              Climate-Smart Agriculture Advisory Dashboard
            </h1>
            <p
              style={{
                margin: '2px 0 0 0',
                color: 'rgba(255,255,255,0.92)',
                fontSize: '10px',
                lineHeight: '13px',
                textShadow: '0 1px 3px rgba(0,0,0,0.65)',
              }}
            >
              Zimbabwe&nbsp; · &nbsp;{t(language, 'topbar_welcome')}&nbsp; · &nbsp;
              {t(language, 'topbar_subtitle')}
            </p>
          </div>
        </div>

        {/* Existing dashboard controls, reduced to a compact single row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '9px',
            flex: '0 0 auto',
          }}
        >
          <div
            style={{
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              overflow: 'visible',
            }}
          >
            <div
              style={{
                transform: 'scale(0.80)',
                transformOrigin: 'right center',
              }}
            >
              <ExportButton targetId="export-area" label="Export PDF" />
            </div>
          </div>

          <select
            aria-label="Select dashboard language"
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as Language)}
            style={{
              boxSizing: 'border-box',
              height: '34px',
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.65)',
              background: 'rgba(255,255,255,0.92)',
              color: '#0f172a',
              fontSize: '12px',
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
              fontWeight: 600,
              boxShadow: '0 2px 6px rgba(0,0,0,0.14)',
              maxWidth: '112px',
            }}
          >
            {languages.map((l) => (
              <option key={l.key} value={l.key}>
                {l.label}
              </option>
            ))}
          </select>

          <div
            aria-label="Farmer profile"
            title="Farmer profile"
            style={{
              width: '34px',
              height: '34px',
              flex: '0 0 34px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #16803c, #0d5a29)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 750,
              fontSize: '15px',
              boxShadow: '0 0 9px rgba(0,255,136,0.30)',
              border: '1.5px solid rgba(255,255,255,0.75)',
            }}
          >
            T
          </div>
        </div>
      </header>

      {/* Keep the existing market ticker directly below the compact header. */}
      <PriceTicker />
    </div>
  )
}
