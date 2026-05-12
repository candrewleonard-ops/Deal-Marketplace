import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Camera, ExternalLink, Loader2, MapPin, X, ImageOff } from 'lucide-react';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

/**
 * Embedded Google Street View for a property address.
 *
 *  - Inline 16:9 preview powered by the Street View Static API (accepts a
 *    plain address string, no geocoding needed).
 *  - First fires a metadata check (free) so we can show a graceful
 *    "no street view available" state for rural addresses instead of
 *    Google's gray placeholder image.
 *  - Tap the preview to open a fullscreen modal with a larger image and
 *    an "Open in Google Maps" deep-link for the full interactive pano.
 *
 * Requires:
 *  - VITE_GOOGLE_MAPS_API_KEY set at build time
 *  - "Street View Static API" enabled in the Google Cloud project
 *
 * If the key is missing this component renders nothing — the rest of the
 * deal page is unaffected.
 */
export default function StreetView({ address, city, state, zip }) {
  const fullAddress = useMemo(
    () => [address, city, state, zip].filter(Boolean).join(', '),
    [address, city, state, zip]
  );

  const [metaStatus, setMetaStatus] = useState('loading'); // loading | ok | none | error
  const [open, setOpen] = useState(false);

  // Cheap metadata probe so we can show "no street view" without burning a
  // paid image request on rural addresses.
  useEffect(() => {
    if (!API_KEY || !fullAddress) return;
    let cancelled = false;

    const url = new URL('https://maps.googleapis.com/maps/api/streetview/metadata');
    url.searchParams.set('location', fullAddress);
    url.searchParams.set('key', API_KEY);
    url.searchParams.set('source', 'outdoor'); // prefer outdoor panos for properties

    fetch(url.toString())
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        if (data?.status === 'OK') setMetaStatus('ok');
        else if (data?.status === 'ZERO_RESULTS' || data?.status === 'NOT_FOUND') setMetaStatus('none');
        else setMetaStatus('error');
      })
      .catch(() => { if (!cancelled) setMetaStatus('error'); });

    return () => { cancelled = true; };
  }, [fullAddress]);

  if (!API_KEY) {
    // No key configured — silently hide the component. The deal page still works.
    return null;
  }

  const previewSrc = buildStreetViewUrl(fullAddress, 800, 450);
  const expandedSrc = buildStreetViewUrl(fullAddress, 1600, 900);
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  return (
    <div style={{
      background: '#12121e',
      border: '1px solid #1e1e2e',
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 24,
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 18px',
        borderBottom: '1px solid #1e1e2e',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: 'rgba(139,92,246,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Camera size={16} style={{ color: '#a78bfa' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: 14 }}>Street View</div>
          <div style={{ color: '#64748b', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {fullAddress}
          </div>
        </div>
        <a
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '6px 10px', borderRadius: 8,
            background: 'rgba(255,255,255,0.04)', border: '1px solid #1e1e2e',
            color: '#94a3b8', textDecoration: 'none', fontSize: 12, fontWeight: 700,
            flexShrink: 0,
          }}
        >
          Open in Maps <ExternalLink size={11} />
        </a>
      </div>

      {/* Image / states */}
      {metaStatus === 'loading' && (
        <div style={{
          aspectRatio: '16 / 9',
          background: '#0f0f18',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 10, color: '#64748b', fontSize: 13,
        }}>
          <Loader2 size={16} style={{ color: '#8b5cf6', animation: 'addr-spin 0.8s linear infinite' }} />
          Loading street view…
        </div>
      )}

      {metaStatus === 'none' && (
        <div style={{
          aspectRatio: '16 / 9',
          background: 'linear-gradient(135deg, #0f0f18, #12121e)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 8, color: '#64748b', fontSize: 13, padding: 20, textAlign: 'center',
        }}>
          <ImageOff size={28} style={{ color: '#475569' }} />
          <div style={{ color: '#94a3b8', fontWeight: 600 }}>No street view available</div>
          <div style={{ fontSize: 12, maxWidth: 320 }}>
            Google doesn't have street-level imagery for this address yet.
          </div>
          <a
            href={mapsLink}
            target="_blank" rel="noopener noreferrer"
            style={{
              marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 5,
              color: '#a78bfa', fontSize: 12, fontWeight: 700, textDecoration: 'none',
            }}
          >
            <MapPin size={12} /> View on map
          </a>
        </div>
      )}

      {metaStatus === 'error' && (
        <div style={{
          aspectRatio: '16 / 9',
          background: '#0f0f18',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#64748b', fontSize: 13, padding: 20, textAlign: 'center',
        }}>
          Couldn't load street view right now.
        </div>
      )}

      {metaStatus === 'ok' && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open street view fullscreen"
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
            style={{
              width: '100%', aspectRatio: '16 / 9', objectFit: 'cover',
              display: 'block',
              transition: 'transform 0.4s cubic-bezier(.2,.9,.3,1)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          />
          {/* "Tap to expand" pill */}
          <div style={{
            position: 'absolute', bottom: 12, right: 12,
            background: 'rgba(10,10,15,0.78)',
            backdropFilter: 'blur(8px)',
            color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: 0.4,
            padding: '6px 10px', borderRadius: 999,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <Camera size={11} /> TAP TO EXPAND
          </div>
        </button>
      )}

      {/* Fullscreen modal */}
      {open && typeof document !== 'undefined' && createPortal(
        <Fullscreen
          src={expandedSrc}
          address={fullAddress}
          mapsLink={mapsLink}
          onClose={() => setOpen(false)}
        />,
        document.body
      )}
    </div>
  );
}

function Fullscreen({ src, address, mapsLink, onClose }) {
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

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 600,
        background: 'rgba(0,0,0,0.92)',
        backdropFilter: 'blur(10px)',
        display: 'flex', flexDirection: 'column',
        animation: 'sv-fade-in 0.18s ease-out',
      }}
    >
      {/* Top bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          padding: '14px 16px', paddingTop: 'calc(14px + env(safe-area-inset-top))',
          display: 'flex', alignItems: 'center', gap: 10,
          color: '#fff',
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
          }}
        >
          <X size={18} />
        </button>
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 16px 16px',
        }}
      >
        <img
          src={src}
          alt={`Street view of ${address}`}
          style={{
            maxWidth: '100%', maxHeight: '100%',
            borderRadius: 12,
            boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
            objectFit: 'contain',
          }}
        />
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
