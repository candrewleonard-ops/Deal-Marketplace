/**
 * Image hosting + transformation abstraction.
 *
 * Wraps how image URLs are constructed so we can swap providers (Cloudflare R2
 * + Images, Cloudinary, imgix, Supabase Storage) without touching components.
 *
 * Usage:
 *   <img src={imageUrl(deal.images[0], { w: 800, h: 450, fit: 'cover' })} />
 *
 * Migration sketch (Cloudflare Images):
 *   const ACCOUNT_HASH = import.meta.env.VITE_CF_IMAGES_HASH;
 *   export function imageUrl(src, { w, h, fit } = {}) {
 *     if (!src) return placeholder({ w, h });
 *     if (isExternal(src)) return src;          // picsum or already CDN'd
 *     const variant = `w=${w || 800}/h=${h || 450}/fit=${fit || 'cover'}`;
 *     return `https://imagedelivery.net/${ACCOUNT_HASH}/${src}/${variant}`;
 *   }
 *
 * For uploads:
 *   uploadImage(file) →  returns image key (string)
 *     Today: returns object-URL for preview only (no persistence).
 *     Later: POST to /api/uploads → R2 → returns key.
 */

const PICSUM = /picsum\.photos/;
const GOOGLE_MAPS = /maps\.googleapis\.com/;

function isExternal(src) {
  return /^https?:\/\//.test(src);
}

export function imageUrl(src, { w, h, fit = 'cover' } = {}) {
  if (!src) return placeholder({ w, h });

  // Already-hosted external (picsum, Google, etc.) — return as-is so we don't break dev.
  if (isExternal(src)) {
    // picsum supports /WIDTH/HEIGHT in the path, so we could rewrite, but URLs
    // are already sized in the mock data. Leave alone.
    return src;
  }

  // Local relative path — would route through CDN in production.
  return src;
}

export function placeholder({ w = 800, h = 450, seed = 'asl' } = {}) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}

export function avatarUrl(user, size = 96) {
  if (user?.avatar) return imageUrl(user.avatar, { w: size, h: size });
  const seed = user?.username || user?.name || 'user';
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${size}/${size}`;
}

/**
 * Uploads to Supabase Storage when configured; otherwise falls back to an
 * in-browser object URL (preview only — not persisted).
 */
export async function uploadImage(file) {
  if (!file) throw new Error('No file provided');

  const { supabase, isSupabaseConfigured, PHOTO_BUCKET } = await import('./supabase');

  if (isSupabaseConfigured) {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const path = `deals/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage
      .from(PHOTO_BUCKET)
      .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type });
    if (error) throw error;
    const { data } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path);
    return { key: path, url: data.publicUrl, size: file.size, mime: file.type, isLocal: false };
  }

  const previewUrl = typeof URL !== 'undefined' && URL.createObjectURL
    ? URL.createObjectURL(file)
    : '';
  return {
    key: `local-${Date.now()}-${file.name}`,
    url: previewUrl,
    size: file.size,
    mime: file.type,
    isLocal: true,
  };
}

export default { imageUrl, placeholder, avatarUrl, uploadImage };
