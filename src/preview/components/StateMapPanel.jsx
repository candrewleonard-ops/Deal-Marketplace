import { useMemo, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { T } from '../theme';
import { STATE_DEAL_COUNTS, STATE_NAMES, TOP_STATES_NEW } from '../data';

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

// Coordinate centers for the labeled state bubbles (approximate, optimized for visual layout).
const STATE_BUBBLE_COORDS = {
  WA: [-120.5, 47.5],
  OR: [-120.5, 43.9],
  CA: [-119.5, 37.0],
  AZ: [-111.7, 34.2],
  CO: [-105.5, 39.0],
  TX: [-99.0, 31.2],
  IL: [-89.3, 40.1],
  MI: [-85.4, 44.0],
  NY: [-75.5, 42.9],
  PA: [-77.5, 40.9],
  TN: [-86.7, 35.9],
  GA: [-83.6, 32.7],
  NC: [-79.5, 35.5],
  FL: [-81.8, 28.6],
};

export default function StateMapPanel({ selected, onToggle }) {
  const [hover, setHover] = useState(null);

  const featured = useMemo(
    () => Object.keys(STATE_BUBBLE_COORDS),
    []
  );

  return (
    <section
      style={{
        background: `linear-gradient(180deg, ${T.card} 0%, ${T.bgRaised} 100%)`,
        border: `1px solid ${T.border}`,
        borderRadius: T.rLg,
        padding: 16,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: T.limeSoft,
              border: `1px solid rgba(217,255,79,0.3)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: T.lime,
            }}
          >
            <MapPin size={14} />
          </div>
          <div>
            <div style={{ color: T.text, fontWeight: 800, fontSize: 15, letterSpacing: '-0.2px' }}>
              Browse by State
            </div>
            <div style={{ color: T.textMuted, fontSize: 11.5, marginTop: 1 }}>
              Click a state to explore deals
            </div>
          </div>
        </div>
        <button
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '7px 12px',
            borderRadius: 9,
            background: T.bg,
            border: `1px solid ${T.border}`,
            color: T.textDim,
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          View all states <ArrowUpRight size={12} />
        </button>
      </div>

      {/* Map */}
      <div
        style={{
          position: 'relative',
          background: `radial-gradient(ellipse at 50% 50%, rgba(217,255,79,0.04), transparent 70%), ${T.cardAlt}`,
          borderRadius: 12,
          border: `1px solid ${T.border}`,
          padding: '10px 6px 6px',
          marginTop: 12,
          overflow: 'hidden',
        }}
      >
        <ComposableMap
          projection="geoAlbersUsa"
          style={{ width: '100%', height: 'auto', display: 'block' }}
          projectionConfig={{ scale: 1000 }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const abbr = FIPS_TO_ABBR[String(geo.id).padStart(2, '0')];
                if (!abbr) return null;
                const isSelected = selected.includes(abbr);
                const isHovered = hover === abbr;
                const fill = isSelected
                  ? 'rgba(217,255,79,0.22)'
                  : isHovered
                    ? '#1c212b'
                    : '#13171f';
                const stroke = isSelected ? T.lime : '#202632';
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => onToggle && onToggle(abbr)}
                    onMouseEnter={() => setHover(abbr)}
                    onMouseLeave={() => setHover(null)}
                    style={{
                      default: { fill, stroke, strokeWidth: 0.9, outline: 'none', cursor: 'pointer', transition: 'fill 0.15s' },
                      hover:   { fill: isSelected ? 'rgba(217,255,79,0.32)' : '#1c212b', stroke: T.lime, strokeWidth: 1, outline: 'none', cursor: 'pointer' },
                      pressed: { fill: 'rgba(217,255,79,0.4)', outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {featured.map((abbr) => {
            const coord = STATE_BUBBLE_COORDS[abbr];
            const count = STATE_DEAL_COUNTS[abbr];
            const isSelected = selected.includes(abbr);
            return (
              <Marker key={abbr} coordinates={coord}>
                <g
                  style={{ cursor: 'pointer' }}
                  onClick={() => onToggle && onToggle(abbr)}
                >
                  <rect
                    x={-26}
                    y={-12}
                    rx={11}
                    ry={11}
                    width={52}
                    height={22}
                    fill={isSelected ? T.lime : '#0a0c10'}
                    stroke={isSelected ? T.lime : 'rgba(217,255,79,0.45)'}
                    strokeWidth={1.2}
                    style={{
                      filter: isSelected
                        ? 'drop-shadow(0 0 12px rgba(217,255,79,0.65))'
                        : 'drop-shadow(0 0 6px rgba(217,255,79,0.25))',
                    }}
                  />
                  <text
                    textAnchor="middle"
                    y={-1}
                    style={{
                      fontFamily: T.font,
                      fontSize: 7.5,
                      fontWeight: 800,
                      letterSpacing: 0.4,
                      fill: isSelected ? '#07080b' : T.text,
                    }}
                  >
                    {abbr}
                  </text>
                  <text
                    textAnchor="middle"
                    y={7.4}
                    style={{
                      fontFamily: T.font,
                      fontSize: 6.6,
                      fontWeight: 700,
                      fill: isSelected ? '#07080b' : T.lime,
                    }}
                  >
                    {count}
                  </text>
                </g>
              </Marker>
            );
          })}
        </ComposableMap>

        {/* hover badge */}
        {hover && (
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: 12,
              padding: '6px 10px',
              borderRadius: 8,
              background: 'rgba(7,8,11,0.85)',
              border: `1px solid ${T.border}`,
              color: T.text,
              fontSize: 11.5,
              fontWeight: 700,
              backdropFilter: 'blur(8px)',
            }}
          >
            <span style={{ color: T.lime }}>{hover}</span> · {STATE_NAMES[hover]}
            {STATE_DEAL_COUNTS[hover] != null && (
              <span style={{ color: T.textDim, marginLeft: 6 }}>
                {STATE_DEAL_COUNTS[hover].toLocaleString()} deals
              </span>
            )}
          </div>
        )}
      </div>

      {/* Top states */}
      <div
        style={{
          marginTop: 16,
          padding: '14px 16px',
          background: T.cardAlt,
          border: `1px solid ${T.border}`,
          borderRadius: 12,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}
        >
          <span style={{ color: T.text, fontWeight: 800, fontSize: 13 }}>
            Top States by New Deals
          </span>
          <span style={{ color: T.textMuted, fontSize: 11 }}>Last 7 days</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TOP_STATES_NEW.map((s, i) => (
            <div
              key={s.abbr}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 4px',
                borderBottom: i < TOP_STATES_NEW.length - 1 ? `1px solid ${T.borderSoft}` : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    background: T.limeSoft,
                    color: T.lime,
                    fontSize: 11,
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {i + 1}
                </span>
                <div>
                  <div style={{ color: T.text, fontSize: 13, fontWeight: 700 }}>{s.name}</div>
                  <div style={{ color: T.textMuted, fontSize: 11 }}>{s.count.toLocaleString()} deals</div>
                </div>
              </div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 3,
                  padding: '3px 8px',
                  borderRadius: 999,
                  background: T.greenSoft,
                  color: '#4ade80',
                  fontSize: 11,
                  fontWeight: 800,
                }}
              >
                <ArrowUpRight size={11} strokeWidth={3} />
                {s.delta}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
