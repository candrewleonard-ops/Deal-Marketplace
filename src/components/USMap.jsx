import { useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

// Official US Atlas TopoJSON — proper Albers USA projection with AK/HI insets
const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

// FIPS numeric id → two-letter abbreviation
const FIPS_TO_ABBR = {
  '01':'AL','02':'AK','04':'AZ','05':'AR','06':'CA','08':'CO','09':'CT',
  '10':'DE','11':'DC','12':'FL','13':'GA','15':'HI','16':'ID','17':'IL',
  '18':'IN','19':'IA','20':'KS','21':'KY','22':'LA','23':'ME','24':'MD',
  '25':'MA','26':'MI','27':'MN','28':'MS','29':'MO','30':'MT','31':'NE',
  '32':'NV','33':'NH','34':'NJ','35':'NM','36':'NY','37':'NC','38':'ND',
  '39':'OH','40':'OK','41':'OR','42':'PA','44':'RI','45':'SC','46':'SD',
  '47':'TN','48':'TX','49':'UT','50':'VT','51':'VA','53':'WA','54':'WV',
  '55':'WI','56':'WY',
};

const ABBR_TO_NAME = {
  AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',
  CO:'Colorado',CT:'Connecticut',DC:'D.C.',DE:'Delaware',FL:'Florida',
  GA:'Georgia',HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',
  KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',
  MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',
  MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',
  NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',
  ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',
  RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',TN:'Tennessee',
  TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',
  WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming',
};

export default function USMap({ deals = [], selectedStates = [], onStateToggle }) {
  const [tooltip, setTooltip] = useState(null);

  const countsByState = useMemo(() => {
    const map = {};
    deals.forEach(d => { if (d.state) map[d.state] = (map[d.state] || 0) + 1; });
    return map;
  }, [deals]);

  function getFill(abbr) {
    const isSelected = selectedStates.includes(abbr);
    const count = countsByState[abbr] || 0;
    if (isSelected) return '#8b5cf6';
    if (count >= 10) return 'rgba(139,92,246,0.6)';
    if (count >= 4)  return 'rgba(139,92,246,0.32)';
    if (count >= 1)  return 'rgba(139,92,246,0.18)';
    return '#1a1a2e';
  }

  function getStroke(abbr) {
    return selectedStates.includes(abbr) ? '#a78bfa' : '#0a0a0f';
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Top row: deselect all + legend */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
        {/* Legend */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          {[
            { color: '#1a1a2e',                   label: 'No deals' },
            { color: 'rgba(139,92,246,0.18)',      label: '1–3 deals' },
            { color: 'rgba(139,92,246,0.32)',      label: '4–9 deals' },
            { color: 'rgba(139,92,246,0.60)',      label: '10+ deals' },
            { color: '#8b5cf6',                   label: 'Selected' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: color, border: '1px solid #1e1e2e', flexShrink: 0 }} />
              <span style={{ color: '#94a3b8', fontSize: '11px' }}>{label}</span>
            </div>
          ))}
        </div>
        {selectedStates.length > 0 && (
          <button
            onClick={() => onStateToggle('__CLEAR__')}
            style={{
              background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.35)',
              color: '#a78bfa', borderRadius: '20px', padding: '5px 14px',
              fontSize: '12px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            Deselect All ({selectedStates.length})
          </button>
        )}
      </div>

      {/* Map canvas */}
      <div style={{ borderRadius: '12px', overflow: 'hidden', background: '#0f0f18' }}>
        <ComposableMap
          projection="geoAlbersUsa"
          style={{ width: '100%', height: 'auto', display: 'block' }}
          projectionConfig={{ scale: 1000 }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map(geo => {
                const abbr = FIPS_TO_ABBR[String(geo.id).padStart(2, '0')];
                if (!abbr) return null;
                const isSelected = selectedStates.includes(abbr);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => onStateToggle && onStateToggle(abbr)}
                    onMouseEnter={(e) => {
                      const count = countsByState[abbr] || 0;
                      setTooltip({ abbr, name: ABBR_TO_NAME[abbr] || abbr, count, x: e.clientX, y: e.clientY });
                    }}
                    onMouseMove={(e) => {
                      setTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : null);
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    style={{
                      default: {
                        fill: getFill(abbr),
                        stroke: getStroke(abbr),
                        strokeWidth: isSelected ? 1.5 : 0.6,
                        outline: 'none',
                        cursor: 'pointer',
                      },
                      hover: {
                        fill: isSelected ? '#7c3aed' : ((countsByState[abbr] || 0) > 0 ? 'rgba(139,92,246,0.72)' : '#252538'),
                        stroke: '#a78bfa',
                        strokeWidth: 1.2,
                        outline: 'none',
                        cursor: 'pointer',
                      },
                      pressed: {
                        fill: '#6d28d9',
                        outline: 'none',
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      {/* Tooltip pinned to cursor */}
      {tooltip && (
        <div style={{
          position: 'fixed',
          left: tooltip.x + 14,
          top: tooltip.y - 14,
          background: '#12121e',
          border: '1px solid #1e1e2e',
          borderRadius: '10px',
          padding: '10px 14px',
          pointerEvents: 'none',
          zIndex: 9999,
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          minWidth: '148px',
        }}>
          <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '14px' }}>{tooltip.name}</div>
          <div style={{ color: '#8b5cf6', fontWeight: 600, fontSize: '13px', marginTop: '2px' }}>
            {tooltip.count} deal{tooltip.count !== 1 ? 's' : ''}
          </div>
          <div style={{ color: '#475569', fontSize: '11px', marginTop: '4px' }}>
            {selectedStates.includes(tooltip.abbr) ? '✓ Click to deselect' : 'Click to filter'}
          </div>
        </div>
      )}

      {/* Active state chips */}
      {selectedStates.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
          {selectedStates.map(abbr => (
            <span
              key={abbr}
              onClick={() => onStateToggle(abbr)}
              style={{
                background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.4)',
                color: '#a78bfa', borderRadius: '20px', padding: '3px 10px',
                fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '4px',
              }}
            >
              {ABBR_TO_NAME[abbr] || abbr}
              <span style={{ fontSize: '15px', lineHeight: 1, marginTop: '-1px' }}>×</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
