import { useEffect } from 'react';

const DEFAULTS = {
  title: 'AllStreetLive — Off-Market Real Estate Deals',
  description: 'A nationwide marketplace where wholesalers, flippers, and investors find off-market deals, contractors, and partners.',
  image: 'https://allstreetlive.com/og-default.jpg',
  url: 'https://allstreetlive.com',
};

function setMeta(selector, attr, value) {
  if (!value) return;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    const [, name] = selector.match(/\[([^=]+)="[^"]+"\]/) || [];
    const key = name || 'name';
    const val = (selector.match(/="([^"]+)"\]/) || [])[1];
    if (val) el.setAttribute(key, val);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

export function useSEO({ title, description, image, url } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} · AllStreetLive` : DEFAULTS.title;
    const desc = description || DEFAULTS.description;
    const img = image || DEFAULTS.image;
    const link = url || (typeof window !== 'undefined' ? window.location.href : DEFAULTS.url);

    const prevTitle = document.title;
    document.title = fullTitle;

    setMeta('meta[name="description"]', 'content', desc);
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', desc);
    setMeta('meta[property="og:image"]', 'content', img);
    setMeta('meta[property="og:url"]', 'content', link);
    setMeta('meta[property="og:type"]', 'content', 'website');
    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', desc);
    setMeta('meta[name="twitter:image"]', 'content', img);

    return () => { document.title = prevTitle; };
  }, [title, description, image, url]);
}
