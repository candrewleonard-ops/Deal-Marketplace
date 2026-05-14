// Centralized tokens for the lime/charcoal investor-dashboard preview.
// Keeping these in one place so the look stays consistent across components.

export const T = {
  // Backgrounds
  bg:        '#07080b',   // page background — near black
  bgRaised:  '#0c0e12',   // slightly raised surface
  card:      '#101319',   // standard card
  cardAlt:   '#0a0c10',   // alt card (map, etc.)
  elevated:  '#161a22',   // hovered/active card

  // Borders
  border:    '#1d2129',
  borderSoft:'#161a22',
  borderHot: 'rgba(217,255,79,0.32)', // lime accent border

  // Text
  text:      '#f1f5f4',
  textDim:   '#a3a9b3',
  textMuted: '#6b7280',
  textFaint: '#475063',

  // Accents
  lime:      '#d9ff4f',
  limeDim:   '#a8cc2f',
  limeGlow:  'rgba(217,255,79,0.55)',
  limeSoft:  'rgba(217,255,79,0.12)',

  green:     '#22c55e',
  greenSoft: 'rgba(34,197,94,0.12)',

  amber:     '#fbbf24',
  amberSoft: 'rgba(251,191,36,0.14)',

  red:       '#ef4444',
  redSoft:   'rgba(239,68,68,0.14)',

  blue:      '#38bdf8',
  blueSoft:  'rgba(56,189,248,0.12)',

  // Effects
  shadow:    '0 8px 24px rgba(0,0,0,0.35)',
  shadowLg:  '0 18px 60px rgba(0,0,0,0.55)',
  glow:      '0 0 0 1px rgba(217,255,79,0.25), 0 6px 22px rgba(217,255,79,0.15)',

  // Radii
  rSm: 8,
  rMd: 12,
  rLg: 16,
  rXl: 22,

  // Font
  font: "'Inter', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
};

export const formatPrice = (n) => {
  if (n == null) return '—';
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 2)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1).replace(/\.0$/, '')}K`;
  return `$${n.toLocaleString()}`;
};

export const formatFull = (n) => (n == null ? '—' : `$${n.toLocaleString()}`);
