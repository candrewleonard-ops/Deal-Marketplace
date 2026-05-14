import { TrendingUp, Flame, Hammer, ArrowRight, Plus, Star, Home, ShieldCheck, Gauge } from 'lucide-react';
import { T } from '../theme';
import { MARKET_INSIGHTS, TRUSTED_REVIEW } from '../data';

const ICONS = {
  cashflow: TrendingUp,
  flame:    Flame,
  hammer:   Hammer,
};

function InsightCard({ insight }) {
  const Icon = ICONS[insight.icon] || TrendingUp;
  return (
    <button
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        borderRadius: 12,
        background: T.cardAlt,
        border: `1px solid ${T.border}`,
        color: T.text,
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
        transition: 'all 0.18s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(217,255,79,0.32)';
        e.currentTarget.style.transform = 'translateX(2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = T.border;
        e.currentTarget.style.transform = 'translateX(0)';
      }}
    >
      <span
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: T.limeSoft,
          border: `1px solid rgba(217,255,79,0.3)`,
          color: T.lime,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={16} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: T.text, fontWeight: 700, fontSize: 13 }}>{insight.title}</div>
        <div style={{ color: T.textMuted, fontSize: 11.5 }}>{insight.desc}</div>
      </div>
      <ArrowRight size={14} color={T.textDim} />
    </button>
  );
}

export function MarketInsightsCard() {
  return (
    <section
      style={{
        background: `linear-gradient(180deg, ${T.card} 0%, ${T.bgRaised} 100%)`,
        border: `1px solid ${T.border}`,
        borderRadius: T.rLg,
        padding: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ color: T.text, fontWeight: 800, fontSize: 14, letterSpacing: '-0.2px' }}>
          Market Insights
        </div>
        <Gauge size={14} color={T.lime} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {MARKET_INSIGHTS.map((m) => (
          <InsightCard key={m.key} insight={m} />
        ))}
      </div>

      {/* Buyer demand mini indicator */}
      <div
        style={{
          marginTop: 12,
          padding: '10px 12px',
          borderRadius: 11,
          background: T.cardAlt,
          border: `1px solid ${T.border}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ color: T.textDim, fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase' }}>
            Buyer Demand
          </span>
          <span style={{ color: T.lime, fontSize: 12, fontWeight: 800 }}>High</span>
        </div>
        <div style={{ position: 'relative', height: 6, borderRadius: 999, background: T.bg, overflow: 'hidden' }}>
          <div
            style={{
              width: '78%',
              height: '100%',
              background: `linear-gradient(90deg, ${T.limeDim} 0%, ${T.lime} 100%)`,
              borderRadius: 999,
              boxShadow: `0 0 12px ${T.limeGlow}`,
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, color: T.textMuted, fontSize: 10 }}>
          <span>Low</span><span>Avg</span><span>High</span><span>Hot</span>
        </div>
      </div>
    </section>
  );
}

export function PostYourDealCard({ onPost }) {
  return (
    <section
      style={{
        background: `linear-gradient(135deg, rgba(217,255,79,0.08) 0%, ${T.bgRaised} 80%)`,
        border: `1px solid rgba(217,255,79,0.32)`,
        borderRadius: T.rLg,
        padding: 18,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217,255,79,0.22), transparent 70%)',
          filter: 'blur(10px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: T.lime,
          color: '#07080b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 22px ${T.limeGlow}`,
          marginBottom: 12,
        }}
      >
        <Home size={24} strokeWidth={2.4} />
      </div>
      <div style={{ color: T.text, fontWeight: 900, fontSize: 18, letterSpacing: '-0.4px' }}>
        Post Your Deal
      </div>
      <div style={{ color: T.textDim, fontSize: 12.5, marginTop: 4, marginBottom: 12 }}>
        Reach thousands of active buyers and investors.
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 14 }}>
        {['Get more exposure', 'Sell faster', 'Verified investor network'].map((t) => (
          <li
            key={t}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: T.text,
              fontSize: 12.5,
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: T.lime,
                color: '#07080b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            {t}
          </li>
        ))}
      </ul>
      <button
        onClick={onPost}
        style={{
          width: '100%',
          padding: '12px 14px',
          borderRadius: 12,
          border: 'none',
          background: T.lime,
          color: '#07080b',
          fontWeight: 900,
          fontSize: 14,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          boxShadow: `0 0 0 1px rgba(217,255,79,0.4), 0 8px 22px rgba(217,255,79,0.32)`,
        }}
      >
        <Plus size={15} strokeWidth={3} />
        Post a Deal
      </button>
    </section>
  );
}

export function TrustedByInvestorsCard() {
  return (
    <section
      style={{
        background: `linear-gradient(180deg, ${T.card} 0%, ${T.bgRaised} 100%)`,
        border: `1px solid ${T.border}`,
        borderRadius: T.rLg,
        padding: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <ShieldCheck size={14} color={T.lime} />
        <span style={{ color: T.text, fontWeight: 800, fontSize: 13, letterSpacing: '-0.1px' }}>
          Trusted by Investors
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
        {TRUSTED_REVIEW.avatars.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              objectFit: 'cover',
              border: `2px solid ${T.card}`,
              marginLeft: i === 0 ? 0 : -10,
              boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
            }}
          />
        ))}
        <div style={{ marginLeft: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={11} color="#fbbf24" fill="#fbbf24" />
            ))}
            <span style={{ color: T.text, fontSize: 12.5, fontWeight: 800, marginLeft: 2 }}>{TRUSTED_REVIEW.rating}</span>
          </div>
          <div style={{ color: T.textMuted, fontSize: 11, marginTop: 1 }}>
            from {TRUSTED_REVIEW.reviews} reviews
          </div>
        </div>
      </div>
      <blockquote
        style={{
          color: T.text,
          fontSize: 13,
          fontWeight: 500,
          fontStyle: 'italic',
          margin: 0,
          paddingLeft: 10,
          borderLeft: `2px solid ${T.lime}`,
          lineHeight: 1.5,
        }}
      >
        “{TRUSTED_REVIEW.quote}”
      </blockquote>
      <div style={{ color: T.textDim, fontSize: 11.5, fontWeight: 700, marginTop: 6 }}>
        — {TRUSTED_REVIEW.author}
      </div>
    </section>
  );
}

export default function RightInsightsPanel({ onPost }) {
  return (
    <aside
      style={{
        width: 300,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <MarketInsightsCard />
      <PostYourDealCard onPost={onPost} />
      <TrustedByInvestorsCard />
    </aside>
  );
}
