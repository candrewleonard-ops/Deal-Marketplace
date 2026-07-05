/**
 * Launch state: the demo inventory is gone. Every deal on the site now comes
 * from Supabase (src/lib/deals.js). This module keeps the deal-type taxonomy
 * and the helper signatures other pages rely on.
 */
export const deals = [];

export const dealTypes = [
  { value: 'all', label: 'All Deals' },
  { value: 'fix-flip', label: 'Fix & Flip' },
  { value: 'rental', label: 'Landlord/Rental' },
  { value: 'creative', label: 'Creative Financing' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'land', label: 'Land' },
];

export const getDealById = (id) => deals.find(d => String(d.id) === String(id));
export const getSimilarDeals = (deal, count = 3) =>
  deals.filter(d => d.id !== deal.id && d.dealType === deal.dealType).slice(0, count);
