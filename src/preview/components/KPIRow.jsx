import StatCard from './StatCard';
import { KPI_STATS, KPI_MOBILE_ORDER } from '../data';
import { T } from '../theme';

export default function KPIRow({ isMobile }) {
  if (isMobile) {
    const ordered = KPI_MOBILE_ORDER
      .map((k) => KPI_STATS.find((s) => s.key === k))
      .filter(Boolean);

    return (
      <div style={{ position: 'relative', marginTop: 12 }}>
        <div
          style={{
            display: 'flex',
            gap: 10,
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            padding: '4px 14px 14px',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}
          className="hide-scrollbar"
        >
          {ordered.map((s) => (
            <div
              key={s.key}
              style={{ flex: '0 0 75%', maxWidth: 280, scrollSnapAlign: 'start' }}
            >
              <StatCard stat={s} compact />
            </div>
          ))}
        </div>
        {/* right edge fade for scroll hint */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 14,
            width: 32,
            pointerEvents: 'none',
            background: `linear-gradient(to left, ${T.bg}, transparent)`,
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
        gap: 12,
        marginTop: 14,
      }}
    >
      {KPI_STATS.map((s) => (
        <StatCard key={s.key} stat={s} />
      ))}
    </div>
  );
}
