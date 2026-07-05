/**
 * Listing-age helpers. Deals saved in Supabase carry a created_at timestamp
 * (every existing row already has one, so history backfills for free) —
 * these turn it into live, human labels computed fresh on every render.
 */

/** "just now" / "42m ago" / "5h ago" / "3d ago" / "2w ago" / "4mo ago" */
export function timeAgo(ts) {
  if (!ts) return '';
  const s = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 7 * 86400) return `${Math.floor(s / 86400)}d ago`;
  if (s < 30 * 86400) return `${Math.floor(s / (7 * 86400))}w ago`;
  return `${Math.floor(s / (30 * 86400))}mo ago`;
}

/** Whole days since a timestamp (0 for today). */
export function daysSince(ts) {
  if (!ts) return 0;
  return Math.max(0, Math.floor((Date.now() - new Date(ts).getTime()) / 86400000));
}

/** Compact card label: prefers the precise timestamp, falls back to daysListed. */
export function listedLabel(deal) {
  if (deal?.createdAt) {
    const label = timeAgo(deal.createdAt);
    return label === 'just now' ? 'just listed' : `listed ${label}`;
  }
  return `${deal?.daysListed ?? 0}d listed`;
}

/** Sentence label for the deal page: "Listed 3 hours ago" etc. */
export function listedSentence(deal) {
  if (deal?.createdAt) {
    const label = timeAgo(deal.createdAt);
    return label === 'just now' ? 'Listed just now' : `Listed ${label}`;
  }
  const d = deal?.daysListed ?? 0;
  return `Listed ${d} day${d === 1 ? '' : 's'} ago`;
}
