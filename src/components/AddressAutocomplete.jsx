import { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2, Check } from 'lucide-react';

/**
 * Address autocomplete dropdown — typeahead suggestions like Google Places,
 * but using the free OpenStreetMap Nominatim API (no key, US-restricted).
 *
 * When the user picks a suggestion we call onSelect with a fully-parsed
 * address object so the parent form can fill city / state / zip too.
 *
 * Props:
 *   value         — current street value (controlled)
 *   onChange      — (text) => void, fires on every keystroke
 *   onSelect      — ({ street, city, state, zip, lat, lon, displayName }) => void
 *   placeholder   — input placeholder
 *   inputStyle    — extra style overrides for the input
 *   inputClassName — extra class for the input
 */
export default function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = 'Start typing an address…',
  inputStyle,
  inputClassName = 'input-dark',
}) {
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const [picked, setPicked] = useState(false); // shows green check briefly after a pick
  const wrapRef = useRef(null);
  const abortRef = useRef(null);
  const debounceRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  // Debounced query
  useEffect(() => {
    if (!value || value.trim().length < 3) {
      setResults([]);
      setLoading(false);
      return;
    }
    if (picked) return; // don't re-query right after a pick

    setLoading(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      // Abort any in-flight request
      if (abortRef.current) abortRef.current.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      try {
        const url = new URL('https://nominatim.openstreetmap.org/search');
        url.searchParams.set('format', 'json');
        url.searchParams.set('addressdetails', '1');
        url.searchParams.set('countrycodes', 'us');
        url.searchParams.set('limit', '6');
        url.searchParams.set('q', value);

        const res = await fetch(url.toString(), {
          signal: ctrl.signal,
          headers: { 'Accept-Language': 'en' },
        });
        if (!res.ok) throw new Error('Geocoder error');
        const data = await res.json();
        const parsed = (Array.isArray(data) ? data : [])
          .map(parseNominatimResult)
          .filter(Boolean);
        setResults(parsed);
        setOpen(parsed.length > 0);
        setHighlight(parsed.length > 0 ? 0 : -1);
      } catch (e) {
        if (e.name !== 'AbortError') {
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => clearTimeout(debounceRef.current);
  }, [value, picked]);

  function pick(item) {
    setPicked(true);
    onSelect?.(item);
    setOpen(false);
    setResults([]);
    setHighlight(-1);
    // re-allow searching after a brief moment so the user can edit
    setTimeout(() => setPicked(false), 800);
  }

  function onKeyDown(e) {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight(h => (h + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight(h => (h <= 0 ? results.length - 1 : h - 1));
    } else if (e.key === 'Enter' && highlight >= 0) {
      e.preventDefault();
      pick(results[highlight]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <input
          value={value}
          onChange={(e) => { setPicked(false); onChange?.(e.target.value); }}
          onFocus={() => { if (results.length > 0) setOpen(true); }}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className={inputClassName}
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
          style={{
            width: '100%', padding: '10px 12px 10px 34px',
            borderRadius: 9, fontSize: 13,
            ...inputStyle,
          }}
        />
        <MapPin
          size={14}
          style={{
            position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)',
            color: picked ? '#10b981' : '#8b5cf6', pointerEvents: 'none',
          }}
        />
        {loading && (
          <Loader2
            size={14}
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              color: '#8b5cf6', pointerEvents: 'none',
              animation: 'addr-spin 0.8s linear infinite',
            }}
          />
        )}
        {!loading && picked && (
          <Check
            size={14}
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              color: '#10b981', pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {open && results.length > 0 && (
        <div
          role="listbox"
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
            background: '#161629',
            border: '1px solid #2a2a3e',
            borderRadius: 12,
            boxShadow: '0 18px 50px rgba(0,0,0,0.55)',
            zIndex: 50,
            overflow: 'hidden',
            animation: 'addr-fade-in 0.15s ease-out',
          }}
        >
          {results.map((r, i) => (
            <button
              key={`${r.lat}-${r.lon}-${i}`}
              type="button"
              role="option"
              aria-selected={highlight === i}
              onMouseEnter={() => setHighlight(i)}
              onMouseDown={(e) => { e.preventDefault(); pick(r); }}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                width: '100%', textAlign: 'left',
                padding: '10px 12px',
                background: highlight === i ? 'rgba(139,92,246,0.12)' : 'transparent',
                border: 'none',
                borderBottom: i < results.length - 1 ? '1px solid #1e1e2e' : 'none',
                color: '#e2e8f0', cursor: 'pointer',
                transition: 'background 0.1s ease',
              }}
            >
              <MapPin
                size={14}
                style={{
                  flexShrink: 0, marginTop: 2,
                  color: highlight === i ? '#a78bfa' : '#475569',
                }}
              />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{
                  color: '#f8fafc', fontSize: 13, fontWeight: 600,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {r.street || r.displayName.split(',')[0]}
                </div>
                <div style={{
                  color: '#94a3b8', fontSize: 11, marginTop: 1,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {[r.city, r.state, r.zip].filter(Boolean).join(', ')}
                </div>
              </div>
            </button>
          ))}
          <div style={{
            padding: '6px 12px',
            background: '#0f0f18',
            borderTop: '1px solid #1e1e2e',
            fontSize: 10,
            color: '#475569',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span>↑↓ to navigate · ↵ to select · esc to close</span>
            <span>Powered by OSM</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes addr-fade-in {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes addr-spin {
          from { transform: translateY(-50%) rotate(0deg); }
          to { transform: translateY(-50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Reduce a US state name to a 2-letter abbreviation
const STATE_ABBR = {
  alabama:'AL', alaska:'AK', arizona:'AZ', arkansas:'AR', california:'CA',
  colorado:'CO', connecticut:'CT', delaware:'DE', 'district of columbia':'DC',
  florida:'FL', georgia:'GA', hawaii:'HI', idaho:'ID', illinois:'IL',
  indiana:'IN', iowa:'IA', kansas:'KS', kentucky:'KY', louisiana:'LA',
  maine:'ME', maryland:'MD', massachusetts:'MA', michigan:'MI', minnesota:'MN',
  mississippi:'MS', missouri:'MO', montana:'MT', nebraska:'NE', nevada:'NV',
  'new hampshire':'NH', 'new jersey':'NJ', 'new mexico':'NM', 'new york':'NY',
  'north carolina':'NC', 'north dakota':'ND', ohio:'OH', oklahoma:'OK',
  oregon:'OR', pennsylvania:'PA', 'rhode island':'RI', 'south carolina':'SC',
  'south dakota':'SD', tennessee:'TN', texas:'TX', utah:'UT', vermont:'VT',
  virginia:'VA', washington:'WA', 'west virginia':'WV', wisconsin:'WI', wyoming:'WY',
};

function parseNominatimResult(r) {
  if (!r || !r.address) return null;
  const a = r.address;

  const houseNumber = a.house_number || '';
  const road = a.road || a.pedestrian || a.footway || '';
  const street = [houseNumber, road].filter(Boolean).join(' ').trim();

  const city = a.city || a.town || a.village || a.hamlet || a.suburb || a.county || '';
  const stateName = (a.state || '').toLowerCase();
  const state = STATE_ABBR[stateName] || (a.state ? a.state.slice(0, 2).toUpperCase() : '');
  const zip = a.postcode || '';

  // Skip results that don't even have a street or city — they're not useful for posting a deal
  if (!street && !city) return null;

  return {
    street,
    city,
    state,
    zip,
    lat: parseFloat(r.lat),
    lon: parseFloat(r.lon),
    displayName: r.display_name || '',
  };
}
