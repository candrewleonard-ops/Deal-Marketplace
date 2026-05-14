import { useState } from 'react';
import { ChevronDown, RotateCcw, Bookmark } from 'lucide-react';
import { T } from '../theme';
import { FILTER_DEAL_TYPES } from '../data';

function SectionLabel({ children, action }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
      }}
    >
      <span
        style={{
          color: T.textDim,
          fontSize: 10.5,
          fontWeight: 800,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
        }}
      >
        {children}
      </span>
      {action}
    </div>
  );
}

function NumberInput({ placeholder, value, onChange }) {
  return (
    <input
      type="text"
      inputMode="numeric"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ''))}
      style={{
        flex: 1,
        minWidth: 0,
        padding: '9px 11px',
        borderRadius: 9,
        border: `1px solid ${T.border}`,
        background: T.bg,
        color: T.text,
        fontSize: 12.5,
        fontWeight: 600,
        outline: 'none',
      }}
      onFocus={(e) => { e.currentTarget.style.borderColor = T.lime; }}
      onBlur={(e)  => { e.currentTarget.style.borderColor = T.border; }}
    />
  );
}

function Pair({ left, right }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {left}
      {right}
    </div>
  );
}

function CheckRow({ label, count, checked, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '8px 10px',
        borderRadius: 8,
        background: checked ? T.limeSoft : 'transparent',
        border: `1px solid ${checked ? 'rgba(217,255,79,0.3)' : 'transparent'}`,
        color: checked ? T.lime : T.text,
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.15s',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span
          style={{
            width: 16,
            height: 16,
            borderRadius: 4,
            border: `1.5px solid ${checked ? T.lime : '#2a2f3a'}`,
            background: checked ? T.lime : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: checked ? `0 0 8px rgba(217,255,79,0.55)` : 'none',
          }}
        >
          {checked && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#07080b" strokeWidth="4">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </span>
        {label}
      </span>
      {count != null && (
        <span style={{ color: T.textMuted, fontSize: 11, fontVariantNumeric: 'tabular-nums' }}>
          {count.toLocaleString()}
        </span>
      )}
    </button>
  );
}

function PillRow({ options, value, onSelect }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            style={{
              flex: '1 1 auto',
              minWidth: 42,
              padding: '7px 10px',
              borderRadius: 9,
              border: `1px solid ${isActive ? T.lime : T.border}`,
              background: isActive ? T.limeSoft : T.bg,
              color: isActive ? T.lime : T.textDim,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: isActive ? `0 0 0 1px rgba(217,255,79,0.3) inset` : 'none',
              transition: 'all 0.15s',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

const BED_OPTIONS = [
  { value: 0, label: 'Any' },
  { value: 1, label: '1+' },
  { value: 2, label: '2+' },
  { value: 3, label: '3+' },
  { value: 4, label: '4+' },
  { value: 5, label: '5+' },
];
const BATH_OPTIONS = BED_OPTIONS.filter((b) => b.value <= 4);
const STATUS_OPTIONS = [
  { value: 'any', label: 'Any' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'vacant', label: 'Vacant' },
];

const DEAL_TYPE_COUNTS = {
  all: 2318, 'fix-flip': 942, 'buy-hold': 681, land: 264, commercial: 188, creative: 243,
};

export function FilterSidebarContent({
  state,
  setState,
  onApply,
  matchedCount = 2318,
  showApply = true,
  mobile = false,
}) {
  const [showMore, setShowMore] = useState(false);
  const types = showMore
    ? FILTER_DEAL_TYPES
    : FILTER_DEAL_TYPES.slice(0, 6);

  const reset = () => {
    setState({
      dealTypes: ['all'],
      minPrice: '', maxPrice: '',
      minArv: '', maxArv: '',
      minCoC: '', maxCoC: '',
      minCap: '', maxCap: '',
      beds: 0,
      baths: 0,
      status: 'any',
    });
  };

  const toggleType = (val) => {
    if (val === 'all') {
      setState({ ...state, dealTypes: ['all'] });
      return;
    }
    const next = new Set(state.dealTypes.filter((v) => v !== 'all'));
    if (next.has(val)) next.delete(val);
    else next.add(val);
    setState({ ...state, dealTypes: next.size === 0 ? ['all'] : [...next] });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        padding: mobile ? '14px 16px 96px' : '16px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ color: T.text, fontWeight: 800, fontSize: 15, letterSpacing: '-0.2px' }}>
            Filter Deals
          </span>
        </div>
        <button
          onClick={reset}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            background: 'transparent',
            border: 'none',
            color: T.textDim,
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <RotateCcw size={11} />
          Reset
        </button>
      </div>

      {/* Deal Type */}
      <div>
        <SectionLabel>Deal Type</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {types.map((dt) => (
            <CheckRow
              key={dt.value}
              label={dt.label}
              count={DEAL_TYPE_COUNTS[dt.value]}
              checked={
                dt.value === 'all'
                  ? state.dealTypes.includes('all')
                  : state.dealTypes.includes(dt.value)
              }
              onToggle={() => toggleType(dt.value)}
            />
          ))}
          <button
            onClick={() => setShowMore((v) => !v)}
            style={{
              alignSelf: 'flex-start',
              background: 'transparent',
              border: 'none',
              color: T.lime,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              padding: '6px 10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {showMore ? 'Show less' : 'Show more'}
            <ChevronDown
              size={12}
              style={{
                transform: showMore ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.15s',
              }}
            />
          </button>
        </div>
      </div>

      {/* Price Range */}
      <div>
        <SectionLabel>Price Range</SectionLabel>
        <Pair
          left={<NumberInput placeholder="Min Price" value={state.minPrice} onChange={(v) => setState({ ...state, minPrice: v })} />}
          right={<NumberInput placeholder="Max Price" value={state.maxPrice} onChange={(v) => setState({ ...state, maxPrice: v })} />}
        />
      </div>

      {/* Estimated ARV */}
      <div>
        <SectionLabel>Estimated ARV</SectionLabel>
        <Pair
          left={<NumberInput placeholder="Min ARV" value={state.minArv} onChange={(v) => setState({ ...state, minArv: v })} />}
          right={<NumberInput placeholder="Max ARV" value={state.maxArv} onChange={(v) => setState({ ...state, maxArv: v })} />}
        />
      </div>

      {/* CoC */}
      <div>
        <SectionLabel>Cash on Cash Return</SectionLabel>
        <Pair
          left={<NumberInput placeholder="Min %" value={state.minCoC} onChange={(v) => setState({ ...state, minCoC: v })} />}
          right={<NumberInput placeholder="Max %" value={state.maxCoC} onChange={(v) => setState({ ...state, maxCoC: v })} />}
        />
      </div>

      {/* Cap Rate */}
      <div>
        <SectionLabel>Cap Rate</SectionLabel>
        <Pair
          left={<NumberInput placeholder="Min %" value={state.minCap} onChange={(v) => setState({ ...state, minCap: v })} />}
          right={<NumberInput placeholder="Max %" value={state.maxCap} onChange={(v) => setState({ ...state, maxCap: v })} />}
        />
      </div>

      {/* Bedrooms */}
      <div>
        <SectionLabel>Bedrooms</SectionLabel>
        <PillRow options={BED_OPTIONS} value={state.beds} onSelect={(v) => setState({ ...state, beds: v })} />
      </div>

      {/* Bathrooms */}
      <div>
        <SectionLabel>Bathrooms</SectionLabel>
        <PillRow options={BATH_OPTIONS} value={state.baths} onSelect={(v) => setState({ ...state, baths: v })} />
      </div>

      {/* Property Status */}
      <div>
        <SectionLabel>Property Status</SectionLabel>
        <PillRow
          options={STATUS_OPTIONS}
          value={state.status}
          onSelect={(v) => setState({ ...state, status: v })}
        />
      </div>

      {/* Save search link (desktop) */}
      {showApply && !mobile && (
        <>
          <button
            onClick={onApply}
            style={{
              padding: '13px 18px',
              borderRadius: 12,
              border: 'none',
              background: T.lime,
              color: '#07080b',
              fontWeight: 800,
              fontSize: 14,
              cursor: 'pointer',
              boxShadow: `0 0 0 1px rgba(217,255,79,0.4), 0 8px 24px rgba(217,255,79,0.28)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            Apply Filters
            <span
              style={{
                padding: '2px 8px',
                borderRadius: 999,
                background: 'rgba(7,8,11,0.18)',
                color: '#07080b',
                fontSize: 11,
                fontWeight: 800,
              }}
            >
              {matchedCount.toLocaleString()} Deals
            </span>
          </button>
          <button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '10px',
              background: 'transparent',
              border: 'none',
              color: T.textDim,
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Bookmark size={13} />
            Save this search
          </button>
        </>
      )}
    </div>
  );
}

export default function FilterSidebar(props) {
  return (
    <aside
      style={{
        width: 280,
        flexShrink: 0,
        background: `linear-gradient(180deg, ${T.card} 0%, ${T.bgRaised} 100%)`,
        border: `1px solid ${T.border}`,
        borderRadius: T.rLg,
        position: 'sticky',
        top: 88,
        maxHeight: 'calc(100vh - 110px)',
        overflowY: 'auto',
      }}
    >
      <FilterSidebarContent {...props} />
    </aside>
  );
}
