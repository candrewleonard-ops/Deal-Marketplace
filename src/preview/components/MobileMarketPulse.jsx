import { Flame, TrendingUp, Sparkles, MapPin } from 'lucide-react';
import { T } from '../theme';
import { MOBILE_PULSE } from '../data';

export default function MobileMarketPulse() {
  return (
    <section
      style={{
        background: `linear-gradient(135deg, ${T.card} 0%, ${T.bgRaised} 100%)`,
        border: `1px solid ${T.border}`,
        borderRadius: T.rLg,
        padding: 14,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217,255,79,0.18), transparent 70%)',
          filter: 'blur(8px)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              background: T.limeSoft,
              border: `1px solid rgba(217,255,79,0.3)`,
              color: T.lime,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrendingUp size={13} />
          </span>
          <span style={{ color: T.text, fontWeight: 800, fontSize: 14 }}>Market Pulse</span>
        </div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '3px 8px',
            borderRadius: 999,
            background: 'rgba(34,197,94,0.14)',
            border: '1px solid rgba(34,197,94,0.3)',
            color: '#4ade80',
            fontSize: 10,
            fontWeight: 800,
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: '#4ade80',
              boxShadow: '0 0 6px rgba(74,222,128,0.8)',
            }}
          />
          STRONG
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <Tile
          icon={<Flame size={14} />}
          label="Hot Market"
          value={MOBILE_PULSE.hotMarket}
          extra={MOBILE_PULSE.hotMarketDelta}
        />
        <Tile
          icon={<TrendingUp size={14} />}
          label="Buyer Demand"
          value={MOBILE_PULSE.buyerDemand}
          extra="32 states"
        />
        <Tile
          icon={<Sparkles size={14} />}
          label="New Today"
          value={MOBILE_PULSE.newDealsToday}
          extra="+9.1%"
        />
        <Tile
          icon={<MapPin size={14} />}
          label="Markets"
          value="48"
          extra="all states"
        />
      </div>
      <button
        style={{
          marginTop: 12,
          width: '100%',
          padding: '12px',
          borderRadius: 11,
          border: `1px solid ${T.border}`,
          background: T.bg,
          color: T.text,
          fontWeight: 700,
          fontSize: 13,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        <MapPin size={13} color={T.lime} />
        View Market Map
      </button>
    </section>
  );
}

function Tile({ icon, label, value, extra }) {
  return (
    <div
      style={{
        background: T.cardAlt,
        border: `1px solid ${T.border}`,
        borderRadius: 10,
        padding: '10px 11px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: T.lime, marginBottom: 4 }}>
        {icon}
        <span style={{ color: T.textDim, fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>
          {label}
        </span>
      </div>
      <div style={{ color: T.text, fontSize: 16, fontWeight: 800, letterSpacing: '-0.3px' }}>
        {value}
      </div>
      <div style={{ color: '#4ade80', fontSize: 11, fontWeight: 700, marginTop: 1 }}>{extra}</div>
    </div>
  );
}
