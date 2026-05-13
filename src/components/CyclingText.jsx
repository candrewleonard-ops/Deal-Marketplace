import { useEffect, useState } from 'react';

const DEFAULT_PHRASES = [
  'Buy Fix n Flips',
  'Buy Rentals',
  'With No Credit',
  'Get More Deals',
  'Wholesale',
  'Find Wholesale Deals',
];

/**
 * Renders a word that swaps every `interval` ms. The incoming word slides
 * down from above; the outgoing word slides further down and fades out.
 */
export default function CyclingText({
  phrases = DEFAULT_PHRASES,
  interval = 3000,
  style,
  className,
}) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (phrases.length <= 1) return;
    const id = setInterval(() => {
      setIdx(n => (n + 1) % phrases.length);
    }, interval);
    return () => clearInterval(id);
  }, [phrases.length, interval]);

  const longest = phrases.reduce((a, b) => (a.length > b.length ? a : b), '');

  return (
    <span
      className={className}
      style={{
        position: 'relative',
        display: 'inline-block',
        overflow: 'hidden',
        verticalAlign: 'baseline',
        ...style,
      }}
    >
      {/* Invisible spacer locks the width so siblings don't reflow on each swap */}
      <span style={{ visibility: 'hidden', whiteSpace: 'nowrap' }}>{longest}</span>
      <span
        key={idx}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'inline-block',
          whiteSpace: 'nowrap',
          animation: 'asl-cycle-in 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {phrases[idx]}
      </span>

      <style>{`
        @keyframes asl-cycle-in {
          0%   { opacity: 0; transform: translateY(-110%); }
          60%  { opacity: 1; }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </span>
  );
}
