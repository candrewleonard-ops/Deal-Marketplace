import { T } from '../theme';
import { DEAL_TYPES } from '../data';

export default function CategoryChips({ value, onChange, isMobile }) {
  return (
    <div style={{ position: 'relative' }}>
      <div
        className="hide-scrollbar"
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          paddingBottom: 4,
          paddingRight: isMobile ? 28 : 0,
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
        }}
      >
        {DEAL_TYPES.map((dt) => {
          const active = value === dt.value;
          return (
            <button
              key={dt.value}
              onClick={() => onChange(dt.value)}
              style={{
                padding: '8px 14px',
                borderRadius: 999,
                border: `1px solid ${active ? T.lime : T.border}`,
                background: active ? T.limeSoft : T.card,
                color: active ? T.lime : T.textDim,
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flex: '0 0 auto',
                boxShadow: active ? `0 0 0 1px rgba(217,255,79,0.3) inset, 0 0 16px rgba(217,255,79,0.18)` : 'none',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = T.text; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = T.textDim; }}
            >
              {dt.label}
            </button>
          );
        })}
      </div>
      {isMobile && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 4,
            width: 28,
            pointerEvents: 'none',
            background: `linear-gradient(to left, ${T.bg}, transparent)`,
          }}
        />
      )}
    </div>
  );
}
