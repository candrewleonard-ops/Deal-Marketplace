/**
 * AllStreet Live brand mark.
 *
 *  <Logo />                       → icon + "AllStreet" wordmark (navbar default)
 *  <Logo size="lg" tagline />     → bigger, with "LIVE" + "REAL ESTATE · REAL TIME"
 *  <Logo iconOnly />              → just the chart glyph
 *
 * The glyph is a black rounded card with a gold ascending area chart and a
 * node at the peak — drawn as inline SVG so it stays crisp at any size.
 */

const GOLD = '#d4af37';
const GOLD_LT = '#e8c860';
const CREAM = '#efe6cf';

export function LogoGlyph({ size = 34, radius }) {
  const r = radius ?? Math.round(size * 0.22);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="AllStreet Live"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="asl-fill" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="asl-line" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor={GOLD} />
          <stop offset="100%" stopColor={GOLD_LT} />
        </linearGradient>
      </defs>

      {/* Card */}
      <rect x="2" y="2" width="96" height="96" rx={r} ry={r} fill="#070707" stroke="#241f17" strokeWidth="1.5" />

      {/* Faint gridlines */}
      {[32, 50, 68].map((y) => (
        <line key={y} x1="14" y1={y} x2="86" y2={y} stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
      ))}

      {/* Area fill under the curve */}
      <path
        d="M14 82 L34 64 L52 54 L70 38 L86 22 L86 82 Z"
        fill="url(#asl-fill)"
      />

      {/* The ascending line */}
      <path
        d="M14 82 L34 64 L52 54 L70 38 L86 22"
        fill="none"
        stroke="url(#asl-line)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Peak node */}
      <circle cx="86" cy="22" r="5.5" fill="#070707" stroke={GOLD} strokeWidth="3" />
    </svg>
  );
}

export default function Logo({ size = 'sm', tagline = false, iconOnly = false, style }) {
  const dims = {
    sm: { glyph: 30, word: 18, live: 9,  gap: 9 },
    md: { glyph: 40, word: 24, live: 11, gap: 11 },
    lg: { glyph: 64, word: 40, live: 14, gap: 16 },
  }[size] || { glyph: 30, word: 18, live: 9, gap: 9 };

  if (iconOnly) return <LogoGlyph size={dims.glyph} />;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: dims.gap, ...style }}>
      <LogoGlyph size={dims.glyph} />
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{
          fontWeight: 800,
          fontSize: dims.word,
          letterSpacing: '-0.5px',
          fontFamily: 'Georgia, "Times New Roman", serif',
          whiteSpace: 'nowrap',
        }}>
          <span style={{ color: CREAM }}>All</span>
          <span style={{ color: GOLD }}>Street</span>
        </span>
        {tagline && (
          <>
            <span style={{
              color: '#8a8a8a',
              fontSize: dims.live,
              fontWeight: 600,
              letterSpacing: dims.live * 0.4,
              marginTop: dims.live * 0.5,
              textAlign: 'center',
            }}>
              · LIVE ·
            </span>
            <span style={{
              color: '#5f5f5f',
              fontSize: dims.live * 0.78,
              fontWeight: 600,
              letterSpacing: dims.live * 0.25,
              marginTop: dims.live * 0.45,
              whiteSpace: 'nowrap',
            }}>
              REAL ESTATE · REAL TIME
            </span>
          </>
        )}
        {!tagline && (
          <span style={{
            color: '#7a7a7a',
            fontSize: dims.live,
            fontWeight: 700,
            letterSpacing: dims.live * 0.55,
            marginTop: 3,
          }}>
            LIVE
          </span>
        )}
      </div>
    </div>
  );
}
