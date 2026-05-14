import { Activity, DollarSign, Tag, Sparkles, Users, Gauge, ArrowUpRight } from 'lucide-react';
import { T } from '../theme';

const ICONS = {
  activity: Activity,
  dollar:   DollarSign,
  tag:      Tag,
  sparkles: Sparkles,
  users:    Users,
  pulse:    Gauge,
};

export default function StatCard({ stat, compact }) {
  const Icon = ICONS[stat.icon] || Activity;
  return (
    <div
      style={{
        position: 'relative',
        background: `linear-gradient(180deg, ${T.card} 0%, ${T.bgRaised} 100%)`,
        border: `1px solid ${T.border}`,
        borderRadius: T.rLg,
        padding: compact ? '12px 14px' : '14px 16px',
        minWidth: compact ? 200 : 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        overflow: 'hidden',
        transition: 'transform 0.2s ease, border-color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(217,255,79,0.28)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = T.border;
      }}
    >
      {/* subtle lime corner glow */}
      <div
        style={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 90,
          height: 90,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217,255,79,0.16), transparent 70%)',
          filter: 'blur(8px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            background: T.limeSoft,
            border: `1px solid rgba(217,255,79,0.25)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: T.lime,
            flexShrink: 0,
          }}
        >
          <Icon size={15} strokeWidth={2.2} />
        </div>
        {stat.live ? (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '3px 8px',
              borderRadius: 999,
              background: 'rgba(34,197,94,0.14)',
              border: '1px solid rgba(34,197,94,0.32)',
              color: '#4ade80',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 0.4,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#4ade80',
                boxShadow: '0 0 8px rgba(74,222,128,0.8)',
              }}
            />
            LIVE
          </span>
        ) : stat.pulse ? (
          <span
            style={{
              padding: '3px 8px',
              borderRadius: 999,
              background: T.limeSoft,
              border: `1px solid rgba(217,255,79,0.32)`,
              color: T.lime,
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 0.6,
            }}
          >
            {stat.delta}
          </span>
        ) : (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              padding: '3px 8px',
              borderRadius: 999,
              background: 'rgba(34,197,94,0.14)',
              color: '#4ade80',
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 0.3,
            }}
          >
            <ArrowUpRight size={10} strokeWidth={3} />
            {stat.delta}
          </span>
        )}
      </div>

      <div
        style={{
          color: T.text,
          fontSize: compact ? 22 : 24,
          fontWeight: 800,
          letterSpacing: '-0.5px',
          lineHeight: 1,
          marginTop: 2,
        }}
      >
        {stat.value}
      </div>
      <div
        style={{
          color: T.textDim,
          fontSize: 11.5,
          fontWeight: 600,
          letterSpacing: 0.3,
          textTransform: 'uppercase',
        }}
      >
        {stat.label}
      </div>
      <div style={{ color: T.textMuted, fontSize: 11 }}>{stat.sub}</div>
    </div>
  );
}
