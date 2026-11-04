function OverviewTab({ language }: { language: Language }) {
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null)
  const [selectedWard, setSelectedWard] = useState<any>(null)

  return (
    <>
      <SectionHeading title={t(language, 'tab_overview_title')} subtitle={t(language, 'tab_overview_sub')} />
      <LocationPicker />
      <div style={{ marginBottom: '16px' }}>
        <WardMapSelector
          height="420px"
          onDistrictSelect={setSelectedDistrict}
          onWardSelect={setSelectedWard}
        />
      </div>
      {selectedDistrict && (
        <div style={{ ...cardStyle, marginBottom: '16px' }}>
          <h3 style={{ fontSize: '15px', color: '#0f3d20', margin: 0, fontWeight: 700 }}>
            📍 {selectedDistrict.name}
          </h3>
          <p style={{ fontSize: '13px', color: '#1f2937', marginTop: '6px' }}>
            Drought Score: <strong>{selectedDistrict.score?.toFixed(0) || '—'}/100</strong>
            {selectedWard && (
              <>
                {' '}· Ward: <strong>{selectedWard.properties?.ADM3_NAME || selectedWard.properties?.WARD_NAME || 'Selected'}</strong>
              </>
            )}
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
