import { useEffect, useState } from 'react';

// Returns 'mobile' (<768), 'tablet' (768–1199), or 'desktop' (>=1200)
export function useBreakpoint() {
  const get = () => {
    if (typeof window === 'undefined') return 'desktop';
    const w = window.innerWidth;
    if (w < 768)  return 'mobile';
    if (w < 1200) return 'tablet';
    return 'desktop';
  };
  const [bp, setBp] = useState(get);
  useEffect(() => {
    const onR = () => setBp(get());
    window.addEventListener('resize', onR);
    return () => window.removeEventListener('resize', onR);
  }, []);
  return bp;
}
