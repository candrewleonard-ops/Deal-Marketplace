import { createPortal } from 'react-dom';
import { X, Crosshair, SlidersHorizontal } from 'lucide-react';

/**
 * Mobile "Buy Box" — a bottom sheet that pops up for mobile marketplace
 * visitors so they can dial in what they buy (strategy, state, beds, baths,
 * price) without hunting for filters. Filters apply live; "Cancel" (the X)
 * restores whatever was set before the sheet opened. A floating side button
 * (rendered by Marketplace) brings it back anytime.
 */

const chipOn = {
  background: 'rgba(0, 200, 5, 0.16)', border: '1px solid #00c805', color: '#4ade80',
};
const chipOff = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid #232925', color: '#95a29b',
};
const chipBase = {
  flex: 1, padding: '10px 0', borderRadius: 9, cursor: 'pointer',
  fontSize: 13, fontWeight: 800, textAlign: 'center',
};

function SectionLabel({ children }) {
  return (
    <div style={{ color: '#4ade80', fontSize: 11, fontWeight: 800, letterSpacing: 0.6, margin: '14px 0 7px' }}>
      {children}
    </div>
  );
}

export default function BuyBoxModal({
  open, onClose, matchCount,
  activeType, setActiveType, dealTypes,
  selectedStates, setSelectedStates, statesWithDeals,
  minBeds, setMinBeds, minBaths, setMinBaths,
  priceMin, setPriceMin, priceMax, setPriceMax,
}) {
  if (!open || typeof document === 'undefined') return null;

  const priceInp = {
    width: '100%', padding: '11px 10px 11px 24px', borderRadius: 10,
    background: '#0e100e', border: '1px solid #232925',
    color: '#f8fafc', fontSize: 15, fontWeight: 700, outline: 'none',
  };

  return createPortal(
    <>
      <div
        onClick={() => onClose(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
        }}
      />
      <div style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 310,
        background: '#131614', borderTop: '1px solid #232925',
        borderRadius: '22px 22px 0 0',
        padding: '18px 18px calc(18px + env(safe-area-inset-bottom))',
        maxHeight: '86dvh', overflowY: 'auto',
        boxShadow: '0 -24px 70px rgba(0,0,0,0.6)',
        animation: 'fade-up 0.3s cubic-bezier(.2,.9,.3,1)',
      }}>
        {/* grab handle */}
        <div style={{ width: 44, height: 4, borderRadius: 4, background: '#38403a', margin: '0 auto 14px' }} />

        {/* Header + easy exit */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 4 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12, flexShrink: 0,
            background: 'rgba(0, 200, 5, 0.14)', border: '1px solid rgba(0, 200, 5, 0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Crosshair size={20} style={{ color: '#00c805' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#f8fafc', fontWeight: 900, fontSize: 19, letterSpacing: '-0.3px' }}>
              Set your Buy Box
            </div>
            <div style={{ color: '#95a29b', fontSize: 13, marginTop: 2, lineHeight: 1.45 }}>
              Tell us what you buy — the feed filters itself to match.
            </div>
          </div>
          <button
            onClick={() => onClose(false)}
            aria-label="Close buy box"
            style={{
              width: 38, height: 38, borderRadius: 11, flexShrink: 0,
              background: 'rgba(255,255,255,0.06)', border: '1px solid #232925',
              color: '#95a29b', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <SectionLabel>STRATEGY</SectionLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {dealTypes.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setActiveType(value)}
              style={{
                padding: '9px 14px', borderRadius: 20, cursor: 'pointer',
                fontSize: 12.5, fontWeight: 800,
                ...(activeType === value ? chipOn : chipOff),
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <SectionLabel>STATE</SectionLabel>
        <select
          value={selectedStates[0] || ''}
          onChange={e => setSelectedStates(e.target.value ? [e.target.value] : [])}
          className="input-dark"
          style={{ width: '100%', padding: '12px', borderRadius: 10, fontSize: 15, cursor: 'pointer' }}
        >
          <option value="">All states</option>
          {statesWithDeals.map(({ abbr, count, name }) => (
            <option key={abbr} value={abbr}>{name} ({count} deals)</option>
          ))}
        </select>

        <SectionLabel>BEDROOMS</SectionLabel>
        <div style={{ display: 'flex', gap: 6 }}>
          {[0, 1, 2, 3, 4, 5].map(n => (
            <button key={n} onClick={() => setMinBeds(n)} style={{ ...chipBase, ...(minBeds === n ? chipOn : chipOff) }}>
              {n === 0 ? 'Any' : `${n}+`}
            </button>
          ))}
        </div>

        <SectionLabel>BATHROOMS</SectionLabel>
        <div style={{ display: 'flex', gap: 6 }}>
          {[0, 1, 2, 3, 4].map(n => (
            <button key={n} onClick={() => setMinBaths(n)} style={{ ...chipBase, ...(minBaths === n ? chipOn : chipOff) }}>
              {n === 0 ? 'Any' : `${n}+`}
            </button>
          ))}
        </div>

        <SectionLabel>PRICE RANGE</SectionLabel>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#707d75', fontSize: 14, fontWeight: 700 }}>$</span>
            <input type="number" inputMode="numeric" value={priceMin} onChange={e => setPriceMin(e.target.value)} placeholder="Min" style={priceInp} />
          </div>
          <span style={{ color: '#707d75', fontWeight: 700 }}>–</span>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#707d75', fontSize: 14, fontWeight: 700 }}>$</span>
            <input type="number" inputMode="numeric" value={priceMax} onChange={e => setPriceMax(e.target.value)} placeholder="Max" style={priceInp} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
          {[['< $25k', '', '25000'], ['$25–50k', '25000', '50000'], ['$50–100k', '50000', '100000'], ['$100k+', '100000', '']].map(([label, lo, hi]) => {
            const on = String(priceMin) === lo && String(priceMax) === hi;
            return (
              <button key={label} onClick={() => { setPriceMin(lo); setPriceMax(hi); }}
                style={{ padding: '7px 12px', borderRadius: 16, cursor: 'pointer', fontSize: 12, fontWeight: 700, ...(on ? chipOn : chipOff) }}>
                {label}
              </button>
            );
          })}
        </div>

        {/* Apply / skip */}
        <button
          onClick={() => onClose(true)}
          className="gradient-btn"
          style={{
            width: '100%', marginTop: 18, padding: '15px', borderRadius: 13,
            fontWeight: 900, fontSize: 16,
          }}
        >
          Show {matchCount} matching deal{matchCount === 1 ? '' : 's'}
        </button>
        <button
          onClick={() => onClose(false)}
          style={{
            width: '100%', marginTop: 8, padding: '10px', borderRadius: 10,
            background: 'none', border: 'none', color: '#707d75',
            fontWeight: 700, fontSize: 13, cursor: 'pointer',
          }}
        >
          Skip — just browsing
        </button>
      </div>
    </>,
    document.body
  );
}

/** Floating side handle that reopens the buy box (mobile marketplace only). */
export function BuyBoxSideButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Open buy box filters"
      style={{
        position: 'fixed', right: 0, top: '38%', zIndex: 90,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
        padding: '13px 9px', borderRadius: '14px 0 0 14px',
        background: 'linear-gradient(160deg, #00c805, #00a344)',
        border: 'none', borderRight: 'none',
        color: '#052012', cursor: 'pointer',
        boxShadow: '-6px 6px 22px rgba(0, 200, 5, 0.35)',
      }}
    >
      <SlidersHorizontal size={17} />
      <span style={{
        fontSize: 10, fontWeight: 900, letterSpacing: 1,
        writingMode: 'vertical-rl', textOrientation: 'mixed',
      }}>
        BUY BOX
      </span>
    </button>
  );
}
