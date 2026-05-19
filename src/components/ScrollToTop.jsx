import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Resets scroll to the top whenever the route changes. Without this, React
 * Router preserves the previous page's scroll position — so opening a deal
 * from far down the marketplace would land you mid-page instead of at the
 * photos. Mounted once inside <Router>.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}
