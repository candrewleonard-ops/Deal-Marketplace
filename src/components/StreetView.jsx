import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Camera, ExternalLink, Loader2, MapPin, X, ImageOff, ChevronRight } from 'lucide-react';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

/**
 * Compact, tap-to-load Street View card for a property address.
 *
 *   Initial state  → small placeholder card, NO API calls (saves tokens).
 *   User taps      → free metadata probe to see if Google has imagery.
 *                    If yes → loads the static image inline (~$0.007).
 *                    If no  → shows clean "no street view available" state.
 *   Tap loaded img → fullscreen modal with high-res image.
 *
 * Requires:
 *   - VITE_GOOGLE_MAPS_API_KEY set at build time
 *   - "Street View Static API" enabled in the Google Cloud project
 *   - API key restrictions allow Street View Static API
 *
 * Renders nothing if the key isn't configured.
 */
export default function StreetView({ address, city, state, zip }) {
  const fullAddress = [address, city, state, zip].filter(Boolean).join(', ');

  // 'placeholder' (default) → 'loading' → 'ok' | 'none' | 'error'
  const [phase, setPhase] = useState('placeholder');
  const [errorMsg, setErrorMsg] = useState('');
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState(null); // { lat, lng } from metadata probe

  if (!API_KEY) return null;

  async function loadStreetView() {
    setPhase('loading');
    setErrorMsg('');
    try {
      const url = new URL('https://maps.googleapis.com/maps/api/streetview/metadata');
      url.searchParams.set('location', fullAddress);
      url.searchParams.set('key', API_KEY);
      url.searchParams.set('source', 'outdoor');

      const res = await fetch(url.toString());
      if (!res.ok) {
        // Network-level error or auth failure — surface the HTTP status
        const text = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status}${text ? ` — ${text.slice(0, 120)}` : ''}`);
      }
      const data = await res.json();
      if (data?.status === 'OK') {
        if (data.location?.lat != null && data.location?.lng != null) {
          setLocation({ lat: data.location.lat, lng: data.location.lng });
        }
        setPhase('ok');
      } else if (data?.status === 'ZERO_RESULTS' || data?.status === 'NOT_FOUND') {
        setPhase('none');
      } else if (data?.status === 'REQUEST_DENIED') {
        // Most common cause: Street View Static API not enabled, or API key
        // restrictions don't include this API. Show the actual message.
        setErrorMsg(data?.error_message || 'API key not authorized for Street View Static API. Enable the API in Google Cloud Console.');
        setPhase('error');
      } else if (data?.status === 'OVER_QUERY_LIMIT') {
        setErrorMsg('Daily Street View quota exceeded.');
        setPhase('error');
      } else {
        setErrorMsg(data?.error_message || `Unexpected status: ${data?.status || 'unknown'}`);
        setPhase('error');
      }
    } catch (e) {
      setErrorMsg(e.message || String(e));
      setPhase('error');
    }
  }

  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
  const previewSrc  = buildStreetViewUrl(fullAddress, 800, 450);
  const expandedSrc = buildStreetViewUrl(fullAddress, 1600, 900);

  // ── Placeholder (no API call yet) ──
  if (phase === 'placeholder') {
    return (
      <button
        onClick={loadStreetView}
        aria-label="Load street view"
        style={{
          width: '100%',
          background: '#12121e',
          border: '1px solid #1e1e2e',
          borderRadius: 14,
          padding: '12px 14px',
          marginBottom: 16,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 12,
          textAlign: 'left',
          WebkitTapHighlightColor: 'transparent',
          transition: 'border-color 0.15s, background 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.45)'; e.currentTarget.style.background = '#14142a'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e2e'; e.currentTarget.style.background = '#12121e'; }}
      >
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 6px 16px rgba(139,92,246,0.35)',
        }}>
          <Camera size={18} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: 14 }}>Street View</div>
          <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 1 }}>Tap to load — see the property from the street</div>
        </div>
        <ChevronRight size={18} style={{ color: '#475569' }} />
      </button>
    );
  }

  // ── Loading ──
  if (phase === 'loading') {
    return (
      <div style={{
        background: '#12121e', border: '1px solid #1e1e2e',
        borderRadius: 14, padding: '14px 16px', marginBottom: 16,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <Loader2 size={16} style={{ color: '#a78bfa', animation: 'addr-spin 0.8s linear infinite' }} />
        <span style={{ color: '#94a3b8', fontSize: 14 }}>Loading street view…</span>
      </div>
    );
  }

  // ── Loaded image (compact inline preview, tap to expand) ──
  if (phase === 'ok') {
    return (
      <div style={{
        background: '#12121e', border: '1px solid #1e1e2e',
        borderRadius: 14, overflow: 'hidden', marginBottom: 16,
      }}>
        <div style={{
          padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: 10,
          borderBottom: '1px solid #1e1e2e',
        }}>
          <Camera size={14} style={{ color: '#a78bfa' }} />
          <span style={{ color: '#f8fafc', fontWeight: 700, fontSize: 13, flex: 1 }}>Street View</span>
          <a
            href={mapsLink}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              color: '#a78bfa', fontSize: 11, fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Open in Maps <ExternalLink size={10} />
          </a>
        </div>
        <button
          onClick={() => setOpen(true)}
          aria-label="Expand street view"
          style={{
            display: 'block', width: '100%', padding: 0,
            background: 'none', border: 'none', cursor: 'zoom-in',
            position: 'relative', overflow: 'hidden',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <img
            src={previewSrc}
            alt={`Street view of ${fullAddress}`}
            loading="lazy"
            onError={() => { setPhase('error'); setErrorMsg('Failed to fetch the street view image.'); }}
            style={{
              width: '100%', aspectRatio: '16 / 9', objectFit: 'cover',
              display: 'block',
            }}
          />
          <div style={{
            position: 'absolute', bottom: 10, right: 10,
            background: 'rgba(10,10,15,0.78)',
            backdropFilter: 'blur(8px)',
            color: '#fff', fontSize: 10, fontWeight: 800, letterSpacing: 0.5,
            padding: '5px 9px', borderRadius: 999,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <Camera size={10} /> TAP TO EXPLORE
          </div>
        </button>

        {open && typeof document !== 'undefined' && createPortal(
          <Fullscreen
            src={expandedSrc}
            address={fullAddress}
            mapsLink={mapsLink}
            location={location}
            apiKey={API_KEY}
            onClose={() => setOpen(false)}
          />,
          document.body
        )}
      </div>
    );
  }

  // ── No imagery available ──
  if (phase === 'none') {
    return (
      <div style={{
        background: '#12121e', border: '1px solid #1e1e2e',
        borderRadius: 14, padding: '14px 16px', marginBottom: 16,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'rgba(100,116,139,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <ImageOff size={18} style={{ color: '#94a3b8' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: 13 }}>No street view available</div>
          <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 1 }}>Google doesn't have street imagery for this address.</div>
        </div>
        <a
          href={mapsLink}
          target="_blank" rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '6px 10px', borderRadius: 8,
            background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)',
            color: '#a78bfa', textDecoration: 'none', fontSize: 12, fontWeight: 700,
            flexShrink: 0,
          }}
        >
          <MapPin size={12} /> Map
        </a>
      </div>
    );
  }

  // ── Error ──
  return (
    <div style={{
      background: '#12121e', border: '1px solid rgba(239,68,68,0.3)',
      borderRadius: 14, padding: '14px 16px', marginBottom: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'rgba(239,68,68,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <ImageOff size={16} style={{ color: '#ef4444' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: 13 }}>Street View unavailable</div>
        </div>
        <button
          onClick={loadStreetView}
          style={{
            padding: '5px 10px', borderRadius: 8,
            background: 'rgba(255,255,255,0.05)', border: '1px solid #1e1e2e',
            color: '#94a3b8', cursor: 'pointer', fontSize: 11, fontWeight: 700,
          }}
        >
          Retry
        </button>
      </div>
      {errorMsg && (
        <div style={{
          color: '#fca5a5', fontSize: 11, fontFamily: 'monospace',
          background: 'rgba(239,68,68,0.06)', padding: '6px 10px', borderRadius: 6,
          wordBreak: 'break-word',
        }}>
          {errorMsg}
        </div>
      )}
      <div style={{ color: '#64748b', fontSize: 11, marginTop: 8, lineHeight: 1.5 }}>
        Most common cause: <strong style={{ color: '#94a3b8' }}>Street View Static API</strong> isn't enabled in Google Cloud Console, or the API key's allowed-APIs list doesn't include it.
      </div>
    </div>
  );
}

function Fullscreen({ src, address, mapsLink, location, apiKey, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  // Build interactive Maps Embed URL when we have lat/lng (free, no per-load cost)
  const embedUrl = location && apiKey
    ? `https://www.google.com/maps/embed/v1/streetview?key=${apiKey}&location=${location.lat},${location.lng}&fov=90&pitch=0`
    : null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 600,
        background: '#000',
        display: 'flex', flexDirection: 'column',
        animation: 'sv-fade-in 0.18s ease-out',
      }}
    >
      {/* Header bar — stop propagation so taps here don't bubble */}
      <div
        style={{
          padding: '14px 16px', paddingTop: 'calc(14px + env(safe-area-inset-top))',
          display: 'flex', alignItems: 'center', gap: 10,
          color: '#fff',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(10px)',
          zIndex: 1,
          flexShrink: 0,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 14 }}>Street View</div>
          <div style={{ color: '#94a3b8', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {address}
          </div>
        </div>
        <a
          href={mapsLink}
          target="_blank" rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '8px 12px', borderRadius: 8,
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff', textDecoration: 'none', fontSize: 12, fontWeight: 700,
            flexShrink: 0,
          }}
        >
          Open in Maps <ExternalLink size={12} />
        </a>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)', border: 'none',
            color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Interactive panorama (or static fallback) */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {embedUrl ? (
          <iframe
            title="Street View"
            src={embedUrl}
            allow="fullscreen"
            style={{
              width: '100%', height: '100%',
              border: 'none', display: 'block',
            }}
          />
        ) : (
          <img
            src={src}
            alt={`Street view of ${address}`}
            style={{
              width: '100%', height: '100%',
              objectFit: 'contain',
            }}
          />
        )}
      </div>

      <style>{`
        @keyframes sv-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function buildStreetViewUrl(address, width, height) {
  const url = new URL('https://maps.googleapis.com/maps/api/streetview');
  url.searchParams.set('size', `${width}x${height}`);
  url.searchParams.set('location', address);
  url.searchParams.set('fov', '85');
  url.searchParams.set('pitch', '0');
  url.searchParams.set('source', 'outdoor');
  url.searchParams.set('key', API_KEY);
  return url.toString();
}
