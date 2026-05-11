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
        const merged = await geocode(value, ctrl.signal);
        setResults(merged);
        // Always open the dropdown when a query has finished, so the user
        // sees either the suggestions or a clear "no matches" message.
        setOpen(true);
        setHighlight(merged.length > 0 ? 0 : -1);
      } catch (e) {
        if (e.name !== 'AbortError') {
          setResults([]);
          setOpen(true);
        }
      } finally {
        setLoading(false);
      }
    }, 320);

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
      <div
        style={{
          position: 'relative',
          // Subtle always-on highlight so users notice the field is "smart"
          background: 'linear-gradient(135deg, rgba(139,92,246,0.35), rgba(6,182,212,0.35))',
          padding: 1.5,
          borderRadius: 11,
          boxShadow: picked
            ? '0 0 0 3px rgba(16,185,129,0.15)'
            : '0 0 16px rgba(139,92,246,0.18)',
          transition: 'box-shadow 0.2s ease',
        }}
      >
        <input
          value={value}
          onChange={(e) => { setPicked(false); onChange?.(e.target.value); }}
          onFocus={() => { if (results.length > 0 || value.trim().length >= 3) setOpen(true); }}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className={inputClassName}
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
          style={{
            width: '100%',
            padding: '11px 38px 11px 14px',
            borderRadius: 9.5,
            fontSize: 14,
            border: 'none',
            display: 'block',
            ...inputStyle,
          }}
        />
        {loading && (
          <Loader2
            size={15}
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              color: '#a78bfa', pointerEvents: 'none',
              animation: 'addr-spin 0.8s linear infinite',
            }}
          />
        )}
        {!loading && picked && (
          <Check
            size={15}
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              color: '#10b981', pointerEvents: 'none',
            }}
          />
        )}
        {!loading && !picked && value.trim().length === 0 && (
          // Tiny "autofill" hint chip when the field is empty — gives the
          // user a visual cue that this field has typeahead.
          <span
            style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              fontSize: 9, fontWeight: 800, letterSpacing: 0.6,
              padding: '2px 7px', borderRadius: 999,
              background: 'rgba(139,92,246,0.15)',
              border: '1px solid rgba(139,92,246,0.3)',
              color: '#a78bfa',
              pointerEvents: 'none',
              textTransform: 'uppercase',
            }}
          >
            Autofill
          </span>
        )}
      </div>

      {open && (
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
          {loading && results.length === 0 && (
            <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, color: '#94a3b8', fontSize: 13 }}>
              <Loader2 size={14} style={{ color: '#8b5cf6', animation: 'addr-spin 0.8s linear infinite' }} />
              Searching addresses…
            </div>
          )}
          {!loading && results.length === 0 && (
            <div style={{ padding: '14px', color: '#94a3b8', fontSize: 13, lineHeight: 1.5 }}>
              <div style={{ color: '#f8fafc', fontWeight: 600, marginBottom: 4 }}>No matches found</div>
              <div style={{ color: '#64748b', fontSize: 12 }}>
                Try adding the city &amp; state — e.g. <span style={{ color: '#a78bfa' }}>"1216 Wayside Dr Lima OH"</span>.
                You can also type the address manually.
              </div>
            </div>
          )}
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
          {results.length > 0 && (
            <div style={{
              padding: '6px 12px',
              background: '#0f0f18',
              borderTop: '1px solid #1e1e2e',
              fontSize: 10,
              color: '#475569',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span>↑↓ to navigate · ↵ to select · esc to close</span>
              <span>US Census · OSM · Photon</span>
            </div>
          )}
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

// ─────────────────────────────────────────────────────────────────────────
// Smart query parser + geocoder
// Nominatim's freeform `q=` param ranks by global popularity, so "lima oh"
// surfaces Lima, Peru before Lima, OH. Parsing the user's input into
// {street, city, state, zip} and using Nominatim's STRUCTURED endpoint
// (`street=`, `city=`, `state=`) is dramatically more accurate.
// ─────────────────────────────────────────────────────────────────────────

const US_STATE_ABBR_SET = new Set(Object.values(STATE_ABBR));

// Common US street suffix tokens — used to find where the street ends and the city begins.
const STREET_SUFFIX = /^(st|street|ave|avenue|rd|road|dr|drive|blvd|boulevard|ln|lane|way|ct|court|pl|place|cir|circle|pkwy|parkway|hwy|highway|ter|terrace|trail|trl|trce|sq|square|cv|cove|bend|bnd|crk|creek|run|loop|row|xing|aly|alley|hl|hill|grv|grove|expy|fwy|mews|walk|path)\.?$/i;

/**
 * Parse a freeform address string into {street, city, state, zip}.
 * Handles:
 *   - "1216 wayside dr lima oh"          → state=OH, city=lima, street="1216 wayside dr"
 *   - "108 britt st franklin va 23851"   → +zip=23851
 *   - "1216 wayside dr, lima, oh"        → comma-separated
 *   - "100 main st new york ny"          → multi-word city
 *   - state names (e.g. "ohio") and abbreviations
 * Returns null if the input doesn't have enough hints (no recognizable state).
 */
function parseQueryToParts(input) {
  if (!input) return null;
  let cleaned = input.trim().replace(/\s+/g, ' ');
  if (!cleaned) return null;

  // Pull out trailing zip code (5-digit, optional +4) so it doesn't confuse state detection
  let zip = '';
  const zipMatch = cleaned.match(/\b(\d{5})(?:-\d{4})?\s*$/);
  if (zipMatch) {
    zip = zipMatch[1];
    cleaned = cleaned.slice(0, zipMatch.index).trim().replace(/,\s*$/, '');
  }

  const findStateInTokens = (tokens) => {
    if (tokens.length === 0) return { stateIdx: -1, state: '' };
    // Try last token as 2-letter abbr
    const last = tokens[tokens.length - 1].toUpperCase();
    if (US_STATE_ABBR_SET.has(last)) return { stateIdx: tokens.length - 1, state: last };
    // Try last 2 tokens as state name (e.g. "new york")
    if (tokens.length >= 2) {
      const last2 = tokens.slice(-2).join(' ').toLowerCase();
      if (STATE_ABBR[last2]) return { stateIdx: tokens.length - 2, state: STATE_ABBR[last2] };
    }
    // Try last 1 token as state name
    const last1 = tokens[tokens.length - 1].toLowerCase();
    if (STATE_ABBR[last1]) return { stateIdx: tokens.length - 1, state: STATE_ABBR[last1] };
    return { stateIdx: -1, state: '' };
  };

  // Comma path — most reliable when present
  if (cleaned.includes(',')) {
    const parts = cleaned.split(',').map(p => p.trim()).filter(Boolean);
    if (parts.length >= 2) {
      const street = parts[0];
      // Walk parts[1..] looking for state. Common shapes:
      //   "street, city, state"
      //   "street, city state"
      //   "street, city"
      const restTokens = parts.slice(1).join(' ').split(/\s+/);
      const { stateIdx, state } = findStateInTokens(restTokens);
      const cityTokens = stateIdx >= 0 ? restTokens.slice(0, stateIdx) : restTokens;
      const city = cityTokens.join(' ').replace(/,/g, '').trim();
      return { street, city, state, zip };
    }
  }

  // No-comma path
  const tokens = cleaned.split(/\s+/);
  if (tokens.length < 2) return null;

  const { stateIdx, state } = findStateInTokens(tokens);
  if (stateIdx <= 0) return null; // need at least street/city before state

  const beforeState = tokens.slice(0, stateIdx);

  // Find the LAST street-suffix token in beforeState — everything up to & including it
  // is the street, everything after is the city.
  let streetEndIdx = -1;
  for (let i = beforeState.length - 1; i >= 0; i--) {
    if (STREET_SUFFIX.test(beforeState[i])) { streetEndIdx = i; break; }
  }

  if (streetEndIdx >= 0 && streetEndIdx < beforeState.length - 1) {
    return {
      street: beforeState.slice(0, streetEndIdx + 1).join(' '),
      city: beforeState.slice(streetEndIdx + 1).join(' '),
      state,
      zip,
    };
  }

  // No street-suffix found. If there's exactly one token before state, treat the
  // whole thing as a city query (e.g. "lima oh"). Otherwise assume the last token
  // before state is the city.
  if (beforeState.length === 1) {
    return { street: '', city: beforeState[0], state, zip };
  }
  return {
    street: beforeState.slice(0, -1).join(' '),
    city: beforeState[beforeState.length - 1],
    state,
    zip,
  };
}

// All results are normalized to this shape:
//   { street, city, state, zip, lat, lon, displayName, _src }

async function geocode(query, signal) {
  const parts = parseQueryToParts(query);

  // Run all three providers in parallel — each one returns normalized
  // records or an empty array on failure. We then merge & rank.
  const tasks = [
    censusGeocode(query, signal).catch((e) => {
      if (e.name !== 'AbortError') console.warn('[geocoder] census failed:', e);
      return [];
    }),
    nominatimGeocode(query, parts, signal).catch((e) => {
      if (e.name !== 'AbortError') console.warn('[geocoder] nominatim failed:', e);
      return [];
    }),
    photonGeocode(query, signal).catch((e) => {
      if (e.name !== 'AbortError') console.warn('[geocoder] photon failed:', e);
      return [];
    }),
  ];

  const [censusRes, nomRes, photonRes] = await Promise.all(tasks);

  // Merge order: Census first (best US residential), Photon next (best
  // autocomplete), Nominatim last. Dedupe by street+city+state.
  const merged = [];
  const seen = new Set();
  for (const r of [...censusRes, ...photonRes, ...nomRes]) {
    const key = `${(r.street || '').toLowerCase().replace(/\s+/g,' ')}|${(r.city || '').toLowerCase()}|${r.state}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(r);
    if (merged.length >= 6) break;
  }
  return merged;
}

// ── US Census Geocoder ───────────────────────────────────────────────────
// Free, no API key, comprehensive US residential coverage. The Census
// Bureau geocodes literally every US address for the decennial count.
async function censusGeocode(query, signal) {
  const url = new URL('https://geocoding.geo.census.gov/geocoder/locations/onelineaddress');
  url.searchParams.set('address', query);
  url.searchParams.set('benchmark', 'Public_AR_Current');
  url.searchParams.set('format', 'json');

  const res = await fetch(url.toString(), { signal });
  if (!res.ok) return [];
  const data = await res.json();
  const matches = data?.result?.addressMatches || [];
  return matches.slice(0, 6).map(censusToNormalized).filter(Boolean);
}

function censusToNormalized(m) {
  if (!m) return null;
  const c = m.addressComponents || {};
  // Reconstruct street: "<from> <preDir> <streetName> <suffixType> <suffixDir>"
  const street = [
    c.fromAddress,
    c.preDirection,
    c.preType,
    c.streetName,
    c.suffixType,
    c.suffixDirection,
  ].filter(Boolean).map(s => titleCase(s)).join(' ').replace(/\s+/g, ' ').trim();

  return {
    street,
    city: titleCase(c.city || ''),
    state: (c.state || '').toUpperCase(),
    zip: c.zip || '',
    lat: m.coordinates?.y,
    lon: m.coordinates?.x,
    displayName: titleCase(m.matchedAddress || ''),
    _src: 'census',
  };
}

function titleCase(s) {
  if (!s) return '';
  return s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

// ── Nominatim (OSM) ──────────────────────────────────────────────────────
async function nominatimGeocode(query, parts, signal) {
  const baseParams = {
    format: 'json',
    addressdetails: '1',
    countrycodes: 'us',
    limit: '6',
  };
  const headers = { 'Accept-Language': 'en' };

  // 1) Structured query when we can extract a state
  if (parts && parts.state && (parts.city || parts.street || parts.zip)) {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    for (const [k, v] of Object.entries(baseParams)) url.searchParams.set(k, v);
    if (parts.street) url.searchParams.set('street', parts.street);
    if (parts.city)   url.searchParams.set('city',   parts.city);
    if (parts.state)  url.searchParams.set('state',  parts.state);
    if (parts.zip)    url.searchParams.set('postalcode', parts.zip);

    const res = await fetch(url.toString(), { signal, headers });
    if (res.ok) {
      const data = await res.json();
      const parsed = (Array.isArray(data) ? data : []).map(parseNominatimResult).filter(Boolean);
      if (parsed.length > 0) return parsed.map(p => ({ ...p, _src: 'nominatim-structured' }));
    }
  }

  // 2) Freeform fallback
  const url = new URL('https://nominatim.openstreetmap.org/search');
  for (const [k, v] of Object.entries(baseParams)) url.searchParams.set(k, v);
  url.searchParams.set('q', query);
  const res = await fetch(url.toString(), { signal, headers });
  if (!res.ok) return [];
  const data = await res.json();
  return (Array.isArray(data) ? data : [])
    .map(parseNominatimResult)
    .filter(Boolean)
    .map(p => ({ ...p, _src: 'nominatim-freeform' }));
}

// ── Photon (Komoot, OSM-based) ───────────────────────────────────────────
// Photon is built specifically for autocomplete: ranks results much better
// than Nominatim freeform and handles partial inputs gracefully.
async function photonGeocode(query, signal) {
  const url = new URL('https://photon.komoot.io/api/');
  url.searchParams.set('q', query);
  url.searchParams.set('limit', '10');
  url.searchParams.set('lang', 'en');
  // Bias toward continental US bbox — improves ranking, doesn't hard-filter.
  url.searchParams.set('bbox', '-125,24,-66,49');

  const res = await fetch(url.toString(), { signal });
  if (!res.ok) return [];
  const data = await res.json();
  const features = data?.features || [];
  return features
    .filter(f => (f?.properties?.countrycode || '').toUpperCase() === 'US')
    .slice(0, 6)
    .map(photonToNormalized)
    .filter(Boolean);
}

function photonToNormalized(f) {
  const p = f.properties || {};
  const coords = f.geometry?.coordinates || [];
  const street = [p.housenumber, p.street].filter(Boolean).join(' ').trim();
  const city = p.city || p.town || p.village || p.county || p.locality || '';
  const stateName = (p.state || '').toLowerCase();
  const state = STATE_ABBR[stateName] || (p.state ? p.state.slice(0, 2).toUpperCase() : '');
  if (!street && !city) return null;
  return {
    street,
    city,
    state,
    zip: p.postcode || '',
    lat: coords[1],
    lon: coords[0],
    displayName: [street, city, state, p.postcode].filter(Boolean).join(', '),
    _src: 'photon',
  };
}

// Exported for tests / debugging
export { parseQueryToParts };
