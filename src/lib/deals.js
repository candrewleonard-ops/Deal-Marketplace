import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Live (user-posted) deals stored in Supabase.
 *
 * Rows are mapped to the same shape the UI already uses for mock deals so
 * DealCard / DealDetail / Marketplace don't need to care where a deal came
 * from. When Supabase isn't configured these are all no-ops.
 */

const ASL = 'asl';

/** Supabase row → app deal object (matches src/data/deals.js shape). */
export function rowToDeal(r) {
  const photos = Array.isArray(r.photos) ? r.photos : [];
  return {
    id: `${ASL}_${r.id}`,        // namespaced so it never collides with mock ids
    _supabaseId: r.id,
    isLive: true,
    title: r.title,
    dealType: r.deal_type || 'fix-flip',
    address: r.address || '',
    city: r.city || '',
    state: r.state || '',
    zip: r.zip || '',
    beds: Number(r.beds) || 0,
    baths: Number(r.baths) || 0,
    sqft: Number(r.sqft) || 0,
    yearBuilt: Number(r.year_built) || 0,
    price: Number(r.listing_price) || 0,
    listingPrice: Number(r.listing_price) || 0,
    contractedPrice: Number(r.contracted_price) || 0,
    arv: Number(r.arv) || 0,
    repairCost: Number(r.rehab_low) || 0,
    rehabLow: Number(r.rehab_low) || 0,
    rehabHigh: Number(r.rehab_high) || 0,
    description: r.description || '',
    youtubeUrl: r.youtube_url || '',
    images: photos.length ? photos : ['https://picsum.photos/seed/asl-new/800/600'],
    sellerId: r.seller_id || 'me',
    sellerName: r.seller_name || 'AllStreet member',
    status: r.status || 'available',
    daysListed: 0,
    createdAt: r.created_at,
  };
}

export function isLiveDealId(id) {
  return typeof id === 'string' && id.startsWith(`${ASL}_`);
}

/** Insert a posted deal. `photoUrls` is an array of public Storage URLs. */
export async function createDeal(form, photoUrls, seller) {
  if (!isSupabaseConfigured) {
    return { ok: false, reason: 'not-configured' };
  }
  const payload = {
    title: form.title?.trim(),
    deal_type: form.dealType,
    address: form.address?.trim() || null,
    city: form.city?.trim() || null,
    state: form.state?.trim() || null,
    zip: form.zip?.trim() || null,
    beds: numOrNull(form.beds),
    baths: numOrNull(form.baths),
    sqft: numOrNull(form.sqft),
    year_built: numOrNull(form.yearBuilt),
    contracted_price: numOrNull(form.contractedPrice),
    listing_price: numOrNull(form.listingPrice),
    arv: numOrNull(form.arv),
    rehab_low: numOrNull(form.rehabLow),
    rehab_high: numOrNull(form.rehabHigh),
    description: form.description?.trim() || null,
    youtube_url: form.youtubeUrl?.trim() || null,
    photos: photoUrls || [],
    seller_id: seller?.id != null ? String(seller.id) : null,
    seller_name: seller?.name || null,
    status: 'available',
  };
  const { data, error } = await supabase
    .from('deals')
    .insert(payload)
    .select()
    .single();
  if (error) return { ok: false, reason: error.message };
  return { ok: true, deal: rowToDeal(data) };
}

/** Newest live deals (for the marketplace). */
export async function listLiveDeals(limit = 100) {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data.map(rowToDeal);
}

/** One live deal by its namespaced id (asl_<uuid>). */
export async function getLiveDeal(namespacedId) {
  if (!isSupabaseConfigured || !isLiveDealId(namespacedId)) return null;
  const realId = namespacedId.slice(ASL.length + 1);
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('id', realId)
    .single();
  if (error || !data) return null;
  return rowToDeal(data);
}

function numOrNull(v) {
  if (v === '' || v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
