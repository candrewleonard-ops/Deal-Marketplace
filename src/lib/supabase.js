import { createClient } from '@supabase/supabase-js';

// These are PUBLIC client credentials by design. The publishable/anon key is
// meant to ship in the browser bundle — data access is enforced by Row Level
// Security in Postgres, not by hiding this string. (NEVER ship the
// service_role / secret key to the client.)
//
// Env vars take precedence so you can rotate without a code change; the
// baked-in fallbacks guarantee the app works even if the Cloudflare env
// vars aren't set, since a git push auto-deploys.
const FALLBACK_URL = 'https://atpvkwtmuxzunjvkvlhs.supabase.co';
const FALLBACK_KEY = 'sb_publishable_cr0IV-e71VnaB04OYanetQ_Txw6eesy';

const url = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_KEY;

export const supabase = url && anonKey ? createClient(url, anonKey) : null;

/** True once a URL + key are available (env vars or the baked-in fallback). */
export const isSupabaseConfigured = !!supabase;

export const PHOTO_BUCKET = 'deal-photos';

