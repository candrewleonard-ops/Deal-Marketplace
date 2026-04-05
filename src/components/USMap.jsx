import { useState, useMemo } from 'react';

// Tile grid layout (NPR/538 election map style)
const stateGrid = [
  [null,null,null,null,null,null,null,null,null,null,null,'ME'],
  [null,null,null,null,null,null,null,null,'VT','NH',null,null],
  ['AK',null,null,null,null,'MN','WI',null,'MI','NY','MA',null],
  [null,'WA','ID','MT','ND','SD','IA','IL','IN','OH','PA','NJ','CT','RI'],
  [null,'OR','UT','WY','NE','MO','KY','WV','VA','MD','DE'],
  [null,'CA','NV','CO','KS','AR','TN','NC','SC'],
  [null,null,'AZ','NM','OK','LA','MS','AL','GA'],
  ['HI',null,null,null,'TX',null,null,null,'FL'],
];

const stateNames = {
  AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',CT:'Connecticut',DE:'Delaware',FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming',DC:'D.C.',
};

function getColor(count) {
  if (!count) return { bg: '#1a1a2e', text: '#475569', border: '#1e1e2e' };
  if (count >= 16) return { bg: 'rgba(139, 92, 246, 0.9)', text: '#fff', border: '#8b5cf6' };
  if (count >= 6) return { bg: 'rgba(139, 92, 246, 0.55)', text: '#fff', border: 'rgba(139, 92, 246, 0.8)' };
  return { bg: 'rgba(139, 92, 246, 0.25)', text: '#f8fafc', border: 'rgba(139, 92, 246, 0.4)' };
}

export default function USMap({ deals = [], onStateClick }) {
  const [hoverState, setHoverState] = useState(null);

  const countsByState = useMemo(() => {
    const map = {};
    deals.forEach(d => {
      if (!d.state) return;
      map[d.state] = (map[d.state] || 0) + 1;
    });
    return map;
  }, [deals]);

  const tileSize = 54;
  const gap = 4;

  return (
    <div style={{ position: 'relative', padding: '16px 8px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px`, alignItems: 'flex-start' }}>
        {stateGrid.map((row, rIdx) => (
          <div key={rIdx} style={{ display: 'flex', gap: `${gap}px` }}>
            {row.map((state, cIdx) => {
              if (!state) {
                return <div key={cIdx} style={{ width: tileSize, height: tileSize }} />;
              }
              const count = countsByState[state] || 0;
              const color = getColor(count);
              return (
                <button
                  key={state}
                  onClick={() => onStateClick && onStateClick(state)}
                  onMouseEnter={() => setHoverState(state)}
                  onMouseLeave={() => setHoverState(null)}
                  style={{
                    width: tileSize, height: tileSize,
                    background: color.bg, border: `1px solid ${color.border}`,
                    borderRadius: '8px', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    color: color.text, fontWeight: 700, fontSize: '13px',
                    transition: 'all 0.15s', padding: 0,
                    transform: hoverState === state ? 'scale(1.08)' : 'scale(1)',
                    boxShadow: hoverState === state ? '0 4px 16px rgba(139, 92, 246, 0.5)' : 'none',
                  }}
                >
                  <span>{state}</span>
                  {count > 0 && (
                    <span style={{ fontSize: '10px', fontWeight: 600, opacity: 0.9 }}>{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {hoverState && (
        <div style={{
          position: 'absolute', top: '8px', right: '12px',
          background: '#0d0d1a', border: '1px solid #1e1e2e',
          borderRadius: '8px', padding: '8px 12px',
          color: '#f8fafc', fontSize: '13px', fontWeight: 600,
          pointerEvents: 'none',
        }}>
          {stateNames[hoverState]} · {countsByState[hoverState] || 0} deals
        </div>
      )}

      {/* Legend */}
      <div style={{ marginTop: '16px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ color: '#475569', fontSize: '12px', fontWeight: 600 }}>DEALS:</span>
        {[
          { label: '0', c: getColor(0) },
          { label: '1-5', c: getColor(1) },
          { label: '6-15', c: getColor(6) },
          { label: '16+', c: getColor(20) },
        ].map(({ label, c }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: 16, height: 16, background: c.bg, border: `1px solid ${c.border}`, borderRadius: '4px' }} />
            <span style={{ color: '#94a3b8', fontSize: '12px' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
