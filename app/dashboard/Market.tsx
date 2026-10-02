'use client'

import { useState } from 'react'
import { marketData, crops, provinces, MarketRow } from './marketData'

export default function Market() {
  const [selectedCrop, setSelectedCrop] = useState('All crops')
  const [selectedProvince, setSelectedProvince] = useState('All provinces')
  const [selectedMarket, setSelectedMarket] = useState('All markets')
  const [filtered, setFiltered] = useState<MarketRow[]>(marketData)

  const allMarkets = ['All markets', ...Array.from(new Set(marketData.map((m) => m.market)))]

  const applyFilter = () => {
    let rows = marketData

    if (selectedCrop !== 'All crops') {
      rows = rows.filter((r) => r.produce === selectedCrop)
    }
    if (selectedProvince !== 'All provinces') {
      rows = rows.filter((r) => r.province === selectedProvince)
    }
    if (selectedMarket !== 'All markets') {
      rows = rows.filter((r) => r.market === selectedMarket)
    }

    setFiltered(rows)
  }

  const resetFilter = () => {
    setSelectedCrop('All crops')
    setSelectedProvince('All provinces')
    setSelectedMarket('All markets')
    setFiltered(marketData)
  }

  const selectStyle: React.CSSProperties = {
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.5)',
    background: 'rgba(255,255,255,0.85)',
    fontSize: '14px',
    color: '#0f172a',
    cursor: 'pointer',
    minWidth: '180px',
    outline: 'none',
  }

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.20)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(0,255,136,0.20)',
        boxShadow: '0 0 15px rgba(0,255,136,0.18)',
        padding: '20px',
      }}
    >
      <h2
        style={{
          fontSize: '20px',
          fontWeight: 700,
          color: '#0f172a',
          margin: '0 0 4px 0',
          textShadow: '0 1px 3px rgba(255,255,255,0.6)',
        }}
      >
        Market Prices
      </h2>
      <p style={{ fontSize: '13px', color: '#334155', margin: '0 0 18px 0' }}>
        Select a crop, province, and market to see current producer prices.
      </p>

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '20px',
          alignItems: 'center',
        }}
      >
        <select
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
          style={selectStyle}
        >
          {crops.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
          style={selectStyle}
        >
          {provinces.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          value={selectedMarket}
          onChange={(e) => setSelectedMarket(e.target.value)}
          style={selectStyle}
        >
          {allMarkets.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <button
          onClick={applyFilter}
          style={{
            padding: '12px 28px',
            background: '#16803c',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 0 15px rgba(0,255,136,0.35)',
          }}
        >
          Filter
        </button>

        <button
          onClick={resetFilter}
          style={{
            padding: '12px 20px',
            background: 'rgba(255,255,255,0.6)',
            color: '#0f172a',
            border: '1px solid rgba(22,128,60,0.35)',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Reset
        </button>
      </div>

      {/* Results table */}
      <div
        style={{
          background: 'rgba(255,255,255,0.55)',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid rgba(22,128,60,0.15)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px',
              color: '#0f172a',
            }}
          >
            <thead>
              <tr style={{ background: 'rgba(22,128,60,0.15)' }}>
                {['Produce', 'Market', 'Location', 'Range', 'Average', 'Date', 'Source', ''].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: 'left',
                        padding: '14px 12px',
                        fontWeight: 700,
                        color: '#0f3d20',
                        fontSize: '13px',
                        letterSpacing: '0.3px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: '30px',
                      textAlign: 'center',
                      color: '#64748b',
                    }}
                  >
                    No results match your filter. Try adjusting the dropdowns.
                  </td>
                </tr>
              )}

              {filtered.map((row, i) => (
                <tr
                  key={i}
                  style={{
                    borderTop: '1px solid rgba(22,128,60,0.12)',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.4)',
                  }}
                >
                  <td style={{ padding: '14px 12px', fontWeight: 600 }}>{row.produce}</td>
                  <td style={{ padding: '14px 12px', color: '#334155' }}>{row.market}</td>
                  <td style={{ padding: '14px 12px', color: '#334155' }}>{row.location}</td>
                  <td style={{ padding: '14px 12px', color: '#334155', whiteSpace: 'nowrap' }}>
                    USD {row.rangeLow.toFixed(2)} - {row.rangeHigh.toFixed(2)}
                  </td>
                  <td style={{ padding: '14px 12px', fontWeight: 700, color: '#0f3d20' }}>
                    USD {row.average.toFixed(2)}
                  </td>
                  <td style={{ padding: '14px 12px', color: '#334155', whiteSpace: 'nowrap' }}>
                    {new Date(row.date).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td style={{ padding: '14px 12px', color: '#334155' }}>{row.source}</td>
                  <td style={{ padding: '14px 12px' }}>
                    <button
                      onClick={() => {
                        const text = `${row.produce} — ${row.market} — USD ${row.average.toFixed(
                          2
                        )} (${row.date})`
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(text)
                          alert('Copied to clipboard: ' + text)
                        } else {
                          alert(text)
                        }
                      }}
                      style={{
                        padding: '6px 14px',
                        background: 'transparent',
                        color: '#16803c',
                        border: '1px solid #16803c',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Share
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p
        style={{
          fontSize: '11px',
          color: '#475569',
          marginTop: '14px',
          fontStyle: 'italic',
        }}
      >
        Illustrative price data — for demonstration purposes. Real producers should verify
        prices with GMB and local markets.
      </p>
    </div>
  )
}
