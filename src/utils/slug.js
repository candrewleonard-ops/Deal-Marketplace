/**
 * SEO-friendly listing URLs.
 *
 * A deal titled "Woodlands Texas Fix n Flip" with id 2 lives at
 *   /marketplace/woodlands-texas-fix-n-flip-2
 * The human-readable slug carries the keywords Google indexes; the trailing
 * id keeps lookups exact and collision-proof (the same pattern Zillow and
 * Redfin use). Old bare-id links (/marketplace/2) still resolve, and
 * DealDetail canonical-redirects them to the slug URL.
 */

export function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')   // underscores too — guarantees "asl_" can't appear in a slug
    .replace(/^-+|-+$/g, '')
    .slice(0, 70)
    .replace(/-+$/g, '');
}

/** Canonical path for a deal. Falls back to city/state when there's no title. */
export function dealPath(deal) {
  if (!deal) return '/marketplace';
  const base = slugify(deal.title) || slugify(`${deal.city} ${deal.state} ${deal.dealType}`) || 'deal';
  return `/marketplace/${base}-${deal.id}`;
}

/** Absolute canonical URL (for share sheets + og:url). */
export function dealUrl(deal) {
  return `https://allstreetlive.com${dealPath(deal)}`;
}

/**
 * Pull the deal id back out of a URL param. Accepts:
 *   "woodlands-texas-fix-n-flip-2"        → "2"
 *   "brick-ranch-asl_1c2d-3e4f…"          → "asl_1c2d-3e4f…"  (Supabase deals)
 *   "2"                                    → "2"               (legacy links)
 */
export function idFromSlug(param) {
  if (!param) return null;
  const live = param.match(/-?(asl_.+)$/);
  if (live) return live[1];
  const numeric = param.match(/(?:^|-)(\d+)$/);
  if (numeric) return numeric[1];
  return param;
}
