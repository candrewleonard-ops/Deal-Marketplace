import { createClient } from '@supabase/supabase-js';

// These are exposed to the browser by design. The anon key is a *public*
// client key — access is enforced by Row Level Security in Postgres, not by
// hiding this string. NEVER ship the service_role key to the client.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && anonKey ? createClient(url, anonKey) : null;

/** True once both env vars are set (Cloudflare Pages / .env.local). */
export const isSupabaseConfigured = !!supabase;

export const PHOTO_BUCKET = 'deal-photos';
