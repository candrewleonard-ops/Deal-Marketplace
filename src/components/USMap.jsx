import { useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

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

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Map — fills container, no extra coloring by default */}
      <div style={{ borderRadius: '10px', overflow: 'hidden', background: '#0a0a0f' }}>
        <ComposableMap
          projection="geoAlbersUsa"
          style={{ width: '100%', height: 'auto', display: 'block' }}
          projectionConfig={{ scale: 1050 }}
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
                        fill: isSelected ? '#8b5cf6' : '#1e1e2e',
                        stroke: '#0a0a0f',
                        strokeWidth: 0.8,
                        outline: 'none',
                        cursor: 'pointer',
                        transition: 'fill 0.12s ease',
                      },
                      hover: {
                        fill: isSelected ? '#7c3aed' : '#2e2e42',
                        stroke: isSelected ? '#a78bfa' : '#2e2e42',
                        strokeWidth: 1,
                        outline: 'none',
                        cursor: 'pointer',
                      },
                      pressed: {
                        fill: isSelected ? '#6d28d9' : '#3b3b52',
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

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: 'fixed',
          left: tooltip.x + 12,
          top: tooltip.y - 40,
          background: '#1a1a2e',
          border: '1px solid #2e2e42',
          borderRadius: '8px',
          padding: '8px 12px',
          pointerEvents: 'none',
          zIndex: 9999,
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        }}>
          <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '13px' }}>{tooltip.name}</div>
          <div style={{ color: '#8b5cf6', fontWeight: 600, fontSize: '12px' }}>
            {tooltip.count} deal{tooltip.count !== 1 ? 's' : ''}
            {selectedStates.includes(tooltip.abbr) ? ' · Selected' : ''}
          </div>
        </div>
      )}
    </div>
  );
}
