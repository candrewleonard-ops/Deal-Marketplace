/**
 * Database abstraction layer.
 *
 * All app code should import from here instead of `src/data/*.js` directly.
 * Today it returns mock data synchronously; swap the implementation for a
 * real backend (Supabase, Firestore, REST API) without touching call sites.
 *
 * Migration sketch (Supabase):
 *   import { createClient } from '@supabase/supabase-js';
 *   const sb = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
 *   export const db = {
 *     deals: {
 *       list:   async (filters) => (await sb.from('deals').select('*').match(filters || {})).data,
 *       get:    async (id)      => (await sb.from('deals').select('*').eq('id', id).single()).data,
 *       create: async (deal)    => (await sb.from('deals').insert(deal).select().single()).data,
 *       update: async (id, p)   => (await sb.from('deals').update(p).eq('id', id).select().single()).data,
 *       remove: async (id)      => (await sb.from('deals').delete().eq('id', id)).error == null,
 *     },
 *     ...
 *   };
 *
 * Every method is async so callers don't need to change when swapped to a
 * real network layer.
 */

import {
  deals as mockDeals,
  getDealById,
  getSimilarDeals,
  dealTypes,
} from '../data/deals';
import {
  users as mockUsers,
  getUserById,
  currentUser as mockCurrentUser,
} from '../data/users';
import { posts as mockPosts } from '../data/posts';
import { groups as mockGroups } from '../data/groups';
import { contractors as mockContractors } from '../data/contractors';
import { cities as mockCities } from '../data/cities';

const ok = (v) => Promise.resolve(v);

export const db = {
  deals: {
    list:    (filters)   => ok(filterDeals(mockDeals, filters)),
    get:     (id)        => ok(getDealById(id)),
    similar: (deal, n=3) => ok(getSimilarDeals(deal, n)),
    types:   ()          => ok(dealTypes),
  },
  users: {
    list:    ()          => ok(mockUsers),
    get:     (id)        => ok(getUserById(id)),
    me:      ()          => ok(mockCurrentUser),
  },
  posts: {
    list:    (filters)   => ok(filterBy(mockPosts, filters)),
  },
  groups: {
    list:    ()          => ok(mockGroups),
    get:     (id)        => ok(mockGroups.find(g => String(g.id) === String(id))),
  },
  contractors: {
    list:    (filters)   => ok(filterBy(mockContractors, filters)),
  },
  cities: {
    list:    ()          => ok(mockCities),
    get:     (id)        => ok(mockCities.find(c => String(c.id) === String(id) || c.slug === id)),
  },
};

function filterBy(items, filters) {
  if (!filters) return items;
  return items.filter(item =>
    Object.entries(filters).every(([k, v]) => v == null || item[k] === v)
  );
}

function filterDeals(items, filters) {
  if (!filters) return items;
  return items.filter(d => {
    if (filters.city && d.city !== filters.city) return false;
    if (filters.state && d.state !== filters.state) return false;
    if (filters.dealType && d.dealType !== filters.dealType) return false;
    if (filters.maxPrice && (d.listingPrice || d.price) > filters.maxPrice) return false;
    if (filters.minPrice && (d.listingPrice || d.price) < filters.minPrice) return false;
    if (filters.sellerId && String(d.sellerId) !== String(filters.sellerId)) return false;
    return true;
  });
}

export default db;
