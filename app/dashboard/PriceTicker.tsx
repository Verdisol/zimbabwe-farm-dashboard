'use client'

import { marketData } from './marketData'

export default function PriceTicker() {
  if (!marketData || marketData.length === 0) return null

  const items = [...marketData, ...marketData]

  return (
    <div
      style={{
        width: '100%',
        background:
          'linear-gradient(90deg, rgba(22,128,60,0.92), rgba(13,90,41,0.92))',
        borderTop: '1px solid rgba(0,255,136,0.45)',
        borderBottom: '1px solid rgba(0,255,136,0.45)',
        overflow: 'hidden',
        position: 'relative',
        height: '44px',
      }}
    >
      <style>{`
        @keyframes priceTickerScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes priceTickerPulse {
          0%, 100% {
            box-shadow: 0 0 12px rgba(0,255,136,0.35), inset 0 0 8px rgba(0,255,136,0.10);
          }
          50% {
            box-shadow: 0 0 26px rgba(0,255,136,0.75), inset 0 0 14px rgba(0,255,136,0.25);
          }
        }
        .price-ticker-track {
          display: flex;
          width: max-content;
          white-space: nowrap;
          will-change: transform;
          animation: priceTickerScroll 40s linear infinite;
        }
        .price-ticker-bar {
          animation: priceTickerPulse 3s ease-in-out infinite;
        }
      `}</style>

      <div
        className="price-ticker-bar"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      />

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          padding: '0 14px',
          display: 'flex',
          alignItems: 'center',
          background: '#0d5a29',
          color: 'white',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '1px',
          zIndex: 2,
          textShadow: '0 1px 4px rgba(0,0,0,0.6)',
          boxShadow: '2px 0 12px rgba(0,0,0,0.35)',
        }}
      >
        MARKET
      </div>

      <div
        style={{
          paddingLeft: '90px',
          paddingTop: '6px',
          paddingBottom: '6px',
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div className="price-ticker-track">
          {items.map((row, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0 26px',
                borderRight: '1px solid rgba(255,255,255,0.12)',
                fontSize: '13px',
                color: 'white',
                textShadow: '0 1px 4px rgba(0,0,0,0.55)',
              }}
            >
              <span style={{ fontWeight: 700 }}>{row.produce}</span>
              <span
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 500,
                }}
              >
                {row.province}
              </span>
              <span style={{ color: '#c8ffd8', fontWeight: 700 }}>
                USD {row.average.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
