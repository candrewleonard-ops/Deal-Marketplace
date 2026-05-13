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
 * Cycles through `phrases`, swapping the visible word every `interval` ms.
 * The new word slides in from above.
 *
 * Uses CSS grid (not position: absolute) so the cycling span inherits all
 * font/gradient/color cleanly, and a hidden longest-phrase spacer locks the
 * width so neighbours don't reflow on swap.
 *
 * Pass `textStyle` if the cycling word needs its own gradient — DO NOT wrap
 * the component in a gradient parent (background-clip:text doesn't inherit
 * to children).
 */
export default function CyclingText({
  phrases = DEFAULT_PHRASES,
  interval = 3000,
  style,
  className,
  textStyle,
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
        display: 'inline-grid',
        overflow: 'hidden',
        verticalAlign: 'bottom',
        ...style,
      }}
    >
      {/* Spacer locks the width to the longest phrase */}
      <span
        aria-hidden
        style={{
          gridArea: '1 / 1',
          visibility: 'hidden',
          whiteSpace: 'nowrap',
          ...textStyle,
        }}
      >
        {longest}
      </span>
      {/* Visible cycling phrase — keyed so a new mount triggers the animation */}
      <span
        key={idx}
        style={{
          gridArea: '1 / 1',
          whiteSpace: 'nowrap',
          animation: 'asl-cycle-in 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
          ...textStyle,
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
