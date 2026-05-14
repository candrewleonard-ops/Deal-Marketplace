import { TrendingUp, Flame, Hammer, ArrowRight } from 'lucide-react';
import { T } from '../theme';
import { MARKET_INSIGHTS } from '../data';

const ICONS = { cashflow: TrendingUp, flame: Flame, hammer: Hammer };

export default function MobileInsightCarousel() {
  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ color: T.text, fontWeight: 800, fontSize: 14, letterSpacing: '-0.2px' }}>
          Market Insights
        </span>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          style={{ color: T.lime, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}
        >
          See all
        </a>
      </div>
      <div
        className="hide-scrollbar"
        style={{
          display: 'flex',
          gap: 10,
          overflowX: 'auto',
          paddingBottom: 6,
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
        }}
      >
        {MARKET_INSIGHTS.map((m) => {
          const Icon = ICONS[m.icon] || TrendingUp;
          return (
            <div
              key={m.key}
              style={{
                flex: '0 0 78%',
                maxWidth: 290,
                scrollSnapAlign: 'start',
                background: `linear-gradient(180deg, ${T.card} 0%, ${T.bgRaised} 100%)`,
                border: `1px solid ${T.border}`,
                borderRadius: T.rLg,
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: T.limeSoft,
                    border: `1px solid rgba(217,255,79,0.3)`,
                    color: T.lime,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={15} />
                </span>
                <ArrowRight size={14} color={T.textDim} />
              </div>
              <div style={{ color: T.text, fontWeight: 800, fontSize: 14 }}>{m.title}</div>
              <div style={{ color: T.textMuted, fontSize: 12 }}>{m.desc}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
