import { useState, useMemo, useEffect, useRef, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, SlidersHorizontal, X, TrendingUp, ChevronDown, ChevronUp,
  RotateCcw, MapPin
} from 'lucide-react';
import DealCard from '../components/DealCard';
import BuyBoxModal, { BuyBoxSideButton } from '../components/BuyBoxModal';
const USMap = lazy(() => import('../components/USMap')); // d3 is heavy — load after first paint
import { deals, dealTypes } from '../data/deals';
import { listLiveDeals } from '../lib/deals';
import { getViewCounts, getHeartCounts } from '../lib/engagement';
import { useSEO } from '../hooks/useSEO';
import { useAuth } from '../context/AuthContext';

// Detect mobile viewport (matches Tailwind 'md' breakpoint)
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);
  return isMobile;
}

// State name lookup for friendly labels in the dropdown
const STATE_NAMES = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
};

const CITIES = [
  'All Cities','Atlanta, GA','Phoenix, AZ','Dallas, TX','Houston, TX',
  'Memphis, TN','Indianapolis, IN','Kansas City, MO','Birmingham, AL',
  'Jacksonville, FL','Tampa, FL','Orlando, FL','Charlotte, NC',
  'Detroit, MI','Cleveland, OH','Cincinnati, OH','St. Louis, MO',
  'Baltimore, MD','Philadelphia, PA','Las Vegas, NV','Columbus, OH',
];

// Yellow-accented selectable chip for the desktop Quick Filters rail.
function chip(on) {
  return {
    flex: 1, padding: '8px 0', borderRadius: 8, cursor: 'pointer',
    background: on ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.04)',
    border: `1px solid ${on ? '#f59e0b' : '#232925'}`,
    color: on ? '#fbbf24' : '#95a29b',
    fontSize: 12, fontWeight: 800,
  };
}
const priceInp = {
  width: '100%', padding: '9px 10px 9px 22px', borderRadius: 9,
  background: '#131614', border: '1px solid #232925',
  color: '#f8fafc', fontSize: 13, fontWeight: 700, outline: 'none',
};

export default function Marketplace() {
  useSEO({
    title: 'Marketplace',
    description: 'Browse off-market real estate deals nationwide. Wholesale, fix & flip, subject-to, and creative finance opportunities.',
  });
  const isMobile = useIsMobile();
  const [activeType,      setActiveType]      = useState('all');
  const [search,          setSearch]          = useState('');
  const [showFilters,     setShowFilters]     = useState(false);
  const [city,            setCity]            = useState('All Cities');
  const [priceValue,      setPriceValue]      = useState(1000000);
  const [priceMode,       setPriceMode]       = useState('max');
  const [minBeds,         setMinBeds]         = useState(0);
  const [minBaths,        setMinBaths]        = useState(0);
  const [priceMin,        setPriceMin]        = useState('');
  const [priceMax,        setPriceMax]        = useState('');
  const [sortBy,          setSortBy]          = useState('newest');
  const [selectedStates,  setSelectedStates]  = useState([]);
  const [newestOnly,      setNewestOnly]      = useState(false);
  const [liveDeals,       setLiveDeals]       = useState([]);
  const [dealStats,       setDealStats]       = useState({}); // id → {views, hearts}
  const [showBuyBox,      setShowBuyBox]      = useState(false);
  const buyBoxSnapshot = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, requireAuth } = useAuth();

  // Mobile: pop the Buy Box once per session so buyers can dial in their
  // criteria immediately. The side handle brings it back anytime.
  useEffect(() => {
    if (!isMobile) return;
    let seen = false;
    try { seen = !!sessionStorage.getItem('asl-buybox-seen-v1'); } catch { seen = true; }
    if (!seen) {
      const t = setTimeout(() => openBuyBox(), 700);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  function openBuyBox() {
    buyBoxSnapshot.current = {
      activeType, selectedStates, minBeds, minBaths, priceMin, priceMax,
    };
    setShowBuyBox(true);
  }

  function closeBuyBox(apply) {
    if (!apply && buyBoxSnapshot.current) {
      const s = buyBoxSnapshot.current;
      setActiveType(s.activeType);
      setSelectedStates(s.selectedStates);
      setMinBeds(s.minBeds);
      setMinBaths(s.minBaths);
      setPriceMin(s.priceMin);
      setPriceMax(s.priceMax);
    }
    try { sessionStorage.setItem('asl-buybox-seen-v1', '1'); } catch { /* ignore */ }
    setShowBuyBox(false);
  }

  // Pull user-posted deals from the database (no-op if Supabase isn't set up).
  // Stale-while-revalidate: paint instantly from the session cache, then
  // refresh from Supabase in the background.
  useEffect(() => {
    let alive = true;
    try {
      const cached = sessionStorage.getItem('asl-live-deals-cache-v1');
      if (cached) setLiveDeals(JSON.parse(cached));
    } catch { /* ignore */ }
    listLiveDeals().then(rows => {
      if (!alive) return;
      setLiveDeals(rows);
      try { sessionStorage.setItem('asl-live-deals-cache-v1', JSON.stringify(rows)); } catch { /* ignore */ }
    }).catch(() => {});
    return () => { alive = false; };
  }, []);

  // Posted deals appear first, then the seed/sample deals.
  const allDeals = useMemo(() => [...liveDeals, ...deals], [liveDeals]);

  // Real engagement counts for everything on screen (one bulk query each).
  useEffect(() => {
    if (!allDeals.length) return;
    let alive = true;
    const ids = allDeals.map(d => d.id);
    Promise.all([getViewCounts(ids), getHeartCounts(ids)])
      .then(([views, hearts]) => {
        if (!alive) return;
        const merged = {};
        for (const id of ids) {
          merged[id] = { views: views[String(id)] || 0, hearts: hearts[String(id)] || 0 };
        }
        setDealStats(merged);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [allDeals]);

  function goPostDeal() {
    if (!isAuthenticated) {
      requireAuth('post a deal', 'post-deal', '/post-deal');
      return;
    }
    navigate('/post-deal');
  }

  // States that actually have deals (for the mobile dropdown), sorted by deal count desc
  const statesWithDeals = useMemo(() => {
    const counts = {};
    for (const d of allDeals) counts[d.state] = (counts[d.state] || 0) + 1;
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([abbr, count]) => ({ abbr, count, name: STATE_NAMES[abbr] || abbr }));
  }, [allDeals]);

  function handleStateToggle(abbr) {
    if (abbr === '__CLEAR__') { setSelectedStates([]); return; }
    setSelectedStates(prev =>
      prev.includes(abbr) ? prev.filter(s => s !== abbr) : [...prev, abbr]
    );
  }

  function resetAll() {
    setActiveType('all');
    setSearch('');
    setCity('All Cities');
    setPriceValue(1000000);
    setPriceMode('max');
    setMinBeds(0);
    setSortBy('newest');
    setSelectedStates([]);
    setNewestOnly(false);
  }

  const filtered = useMemo(() => {
    return allDeals.filter(d => {
      if (activeType !== 'all' && d.dealType !== activeType) return false;
      if (city !== 'All Cities') {
        const [c, s] = city.split(', ');
        if (d.city !== c || d.state !== s) return false;
      }
      if (selectedStates.length > 0 && !selectedStates.includes(d.state)) return false;
      const lp = d.listingPrice || d.price;
      if (priceMode === 'max' && lp > priceValue) return false;
      if (priceMode === 'min' && lp < priceValue) return false;
      if (minBeds > 0 && d.beds < minBeds) return false;
      if (minBaths > 0 && (d.baths || 0) < minBaths) return false;
      const pmin = Number(priceMin) || 0;
      const pmax = Number(priceMax) || 0;
      if (pmin && lp < pmin) return false;
      if (pmax && lp > pmax) return false;
      if (newestOnly && d.daysListed > 7) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!d.title.toLowerCase().includes(q) && !d.city.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [allDeals, activeType, search, city, priceValue, priceMode, minBeds, minBaths, priceMin, priceMax, selectedStates, newestOnly]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortBy === 'price-low')  arr.sort((a, b) => (a.listingPrice || a.price) - (b.listingPrice || b.price));
    else if (sortBy === 'price-high') arr.sort((a, b) => (b.listingPrice || b.price) - (a.listingPrice || a.price));
    else if (sortBy === 'views') arr.sort((a, b) => (dealStats[b.id]?.views || 0) - (dealStats[a.id]?.views || 0));
    else arr.sort((a, b) => a.daysListed - b.daysListed);
    const sponsored = arr.filter(d => d.isSponsored);
    const regular   = arr.filter(d => !d.isSponsored);
    return [...sponsored, ...regular];
  }, [filtered, sortBy, dealStats]);

  const hasActiveFilters = activeType !== 'all' || search || city !== 'All Cities'
    || priceValue < 1000000 || minBeds > 0 || selectedStates.length > 0 || newestOnly;

  return (
    <div className="page-enter" style={{ background: '#0a0b0a', minHeight: '100vh' }}>

      {/* ── Top header bar ── */}
      <div style={{
        background: 'linear-gradient(180deg, #0e100e 0%, #0a0b0a 100%)',
        borderBottom: '1px solid #232925',
        padding: isMobile ? '12px 14px' : '18px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* subtle gradient orb in header */}
        <div style={{
          position: 'absolute', top: '-40%', left: '-5%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 200, 5,0.12), transparent 70%)',
          filter: 'blur(30px)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 1500, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h1 style={{
                color: '#f8fafc', fontWeight: 800,
                fontSize: isMobile ? 20 : 24, margin: 0,
                letterSpacing: '-0.5px',
              }}>
                <span className="gradient-text">Deal</span> Marketplace
              </h1>
              <p style={{ color: '#95a29b', margin: '2px 0 0', fontSize: '13px' }}>
                <span style={{ color: '#00c805', fontWeight: 700 }}>{sorted.length}</span>
                {' '}of {allDeals.length} off-market deals
                {selectedStates.length > 0 && ` · ${selectedStates.join(', ')}`}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              {hasActiveFilters && (
                <button onClick={resetAll} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 9, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                  <RotateCcw size={13} /> Reset
                </button>
              )}
              {!isMobile && (
                <button onClick={goPostDeal} className="gradient-btn" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 9, border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
                  + Post a Deal
                </button>
              )}
            </div>
          </div>

          {/* Search + city + filters row */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: isMobile ? '1 1 100%' : 1, minWidth: 180, position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#00c805', pointerEvents: 'none' }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder={isMobile ? 'Search deals…' : 'Search city, market, or keyword…'}
                className="input-dark"
                style={{ width: '100%', padding: isMobile ? '11px 12px 11px 38px' : '10px 12px 10px 36px', borderRadius: 10, fontSize: 13 }}
              />
            </div>
            {!isMobile && (
              <select value={city} onChange={e => setCity(e.target.value)}
                className="input-dark"
                style={{ padding: '10px 12px', borderRadius: 9, fontSize: 13, minWidth: 150, cursor: 'pointer' }}
              >
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            )}
            {/* Mobile-only: state filter dropdown (replaces the map on phones) */}
            {isMobile && (
              <select
                value={selectedStates[0] || ''}
                onChange={e => setSelectedStates(e.target.value ? [e.target.value] : [])}
                className="input-dark"
                style={{ padding: '10px 12px', borderRadius: '9px', fontSize: '13px', minWidth: '150px', cursor: 'pointer', flex: 1 }}
              >
                <option value="">All States</option>
                {statesWithDeals.map(({ abbr, count, name }) => (
                  <option key={abbr} value={abbr}>{name} ({count})</option>
                ))}
              </select>
            )}
            <button onClick={() => setNewestOnly(n => !n)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '10px 14px', borderRadius: '9px', background: newestOnly ? 'linear-gradient(135deg,#00c805,#00e5a0)' : 'rgba(255,255,255,0.04)', border: newestOnly ? 'none' : '1px solid #232925', color: newestOnly ? '#fff' : '#95a29b', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
              <TrendingUp size={13} /> Newest
            </button>
            <button onClick={() => setShowFilters(f => !f)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', borderRadius: '9px', background: showFilters ? 'rgba(0, 200, 5,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${showFilters ? 'rgba(0, 200, 5,0.3)' : '#232925'}`, color: showFilters ? '#00c805' : '#95a29b', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
              <SlidersHorizontal size={14} />
              Filters
              {(priceValue < 1000000 || minBeds > 0) && <span style={{ background: '#00c805', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>!</span>}
            </button>
            {/* Sort */}
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="input-dark"
              style={{ padding: '10px 12px', borderRadius: '9px', fontSize: '13px', cursor: 'pointer' }}
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price ↑ Low to High</option>
              <option value="price-high">Price ↓ High to Low</option>
              <option value="views">Most Views</option>
            </select>
          </div>

          {/* Advanced filters panel */}
          {showFilters && (
            <div style={{ marginTop: '12px', background: '#1a1f1b', border: '1px solid #232925', borderRadius: '10px', padding: '16px', display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ color: '#95a29b', fontSize: '11px', fontWeight: 700 }}>
                    {priceMode === 'max' ? 'MAX' : 'MIN'} LISTING PRICE
                  </label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {['min','max'].map(m => (
                      <button key={m} onClick={() => setPriceMode(m)} style={{ padding: '2px 8px', borderRadius: '10px', background: priceMode === m ? 'rgba(0, 200, 5,0.2)' : 'transparent', border: `1px solid ${priceMode === m ? '#00c805' : '#232925'}`, color: priceMode === m ? '#00c805' : '#95a29b', cursor: 'pointer', fontSize: '10px', fontWeight: 700 }}>{m}</button>
                    ))}
                  </div>
                </div>
                <input type="range" min={0} max={1000000} step={5000} value={priceValue}
                  onChange={e => setPriceValue(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: '#00c805', marginBottom: '4px' }}
                />
                <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '13px' }}>
                  {priceValue >= 1000000 ? 'No Max' : `$${priceValue.toLocaleString()}`}
                </div>
              </div>
              <div>
                <label style={{ color: '#95a29b', fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>MIN BEDS</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[0,1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => setMinBeds(n)} style={{ width: '34px', height: '34px', borderRadius: '7px', background: minBeds === n ? 'rgba(0, 200, 5,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${minBeds === n ? '#00c805' : '#232925'}`, color: minBeds === n ? '#00c805' : '#95a29b', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}>
                      {n === 0 ? 'Any' : `${n}+`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Deal type tabs */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
            {dealTypes.map(({ value, label }) => (
              <button key={value} onClick={() => setActiveType(value)} style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: activeType === value ? 'linear-gradient(135deg,#00c805,#00e5a0)' : 'rgba(255,255,255,0.04)', border: `1px solid ${activeType === value ? 'transparent' : '#232925'}`, color: activeType === value ? '#fff' : '#95a29b', cursor: 'pointer', transition: 'all 0.15s' }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body: map+deals on desktop, deals-only on mobile ── */}
      <div style={{ maxWidth: 1500, margin: '0 auto', display: 'flex', gap: 0, minHeight: 'calc(100vh - 200px)', flexDirection: isMobile ? 'column' : 'row' }}>

        {/* ── LEFT: sticky filter + map rail (hidden on mobile) ──
             Filters live at the TOP of the rail so they're visible without
             scrolling; the state map sits underneath. */}
        <div style={{
          width: 'clamp(320px, 27vw, 430px)', flexShrink: 0,
          position: 'sticky', top: '0',
          height: 'calc(100vh - 64px)',
          overflowY: 'auto',
          borderRight: '1px solid #232925',
          background: '#0e100e',
          padding: '14px 12px',
          display: isMobile ? 'none' : 'flex',
          flexDirection: 'column', gap: '12px',
        }}>
          {/* ── Quick Filters — always visible at the top of the rail ── */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(245,158,11,0.07), rgba(245,158,11,0.02))',
            border: '1px solid rgba(245,158,11,0.28)',
            borderRadius: 14, padding: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <SlidersHorizontal size={15} style={{ color: '#fbbf24' }} />
                <span style={{ color: '#f8fafc', fontWeight: 800, fontSize: 14 }}>Quick Filters</span>
              </div>
              {(minBeds > 0 || minBaths > 0 || priceMin || priceMax) && (
                <button
                  onClick={() => { setMinBeds(0); setMinBaths(0); setPriceMin(''); setPriceMax(''); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 20,
                    background: 'rgba(245,158,11,0.14)', border: '1px solid rgba(245,158,11,0.35)',
                    color: '#fbbf24', cursor: 'pointer', fontSize: 11, fontWeight: 700,
                  }}
                >
                  <RotateCcw size={10} /> Clear
                </button>
              )}
            </div>

            {/* Bedrooms */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ color: '#fbbf24', fontSize: 11, fontWeight: 800, letterSpacing: 0.5, marginBottom: 7 }}>BEDROOMS</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[0, 1, 2, 3, 4, 5].map(n => {
                  const on = minBeds === n;
                  return (
                    <button key={n} onClick={() => setMinBeds(n)} style={chip(on)}>
                      {n === 0 ? 'Any' : `${n}+`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bathrooms */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ color: '#fbbf24', fontSize: 11, fontWeight: 800, letterSpacing: 0.5, marginBottom: 7 }}>BATHROOMS</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[0, 1, 2, 3, 4].map(n => {
                  const on = minBaths === n;
                  return (
                    <button key={n} onClick={() => setMinBaths(n)} style={chip(on)}>
                      {n === 0 ? 'Any' : `${n}+`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price range */}
            <div>
              <div style={{ color: '#fbbf24', fontSize: 11, fontWeight: 800, letterSpacing: 0.5, marginBottom: 7 }}>LISTING PRICE</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#707d75', fontSize: 13, fontWeight: 700 }}>$</span>
                  <input
                    type="number" value={priceMin} onChange={e => setPriceMin(e.target.value)}
                    placeholder="Min"
                    style={priceInp}
                  />
                </div>
                <span style={{ color: '#707d75', fontSize: 13, fontWeight: 700 }}>–</span>
                <div style={{ position: 'relative', flex: 1 }}>
                  <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#707d75', fontSize: 13, fontWeight: 700 }}>$</span>
                  <input
                    type="number" value={priceMax} onChange={e => setPriceMax(e.target.value)}
                    placeholder="Max"
                    style={priceInp}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                {[['< $25k', '', '25000'], ['$25–50k', '25000', '50000'], ['$50–100k', '50000', '100000'], ['$100k+', '100000', '']].map(([label, lo, hi]) => (
                  <button
                    key={label}
                    onClick={() => { setPriceMin(lo); setPriceMax(hi); }}
                    style={{
                      padding: '5px 10px', borderRadius: 16, cursor: 'pointer',
                      background: (String(priceMin) === lo && String(priceMax) === hi) ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${(String(priceMin) === lo && String(priceMax) === hi) ? '#f59e0b' : '#232925'}`,
                      color: (String(priceMin) === lo && String(priceMax) === hi) ? '#fbbf24' : '#95a29b',
                      fontSize: 11, fontWeight: 700,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{
              marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(245,158,11,0.18)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ color: '#95a29b', fontSize: 12 }}>Matching deals</span>
              <span style={{ color: '#fbbf24', fontWeight: 800, fontSize: 15 }}>{sorted.length}</span>
            </div>
          </div>

          {/* ── Browse by State map — under the filters ── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <MapPin size={15} style={{ color: '#00c805' }} />
              <span style={{ color: '#f8fafc', fontWeight: 700, fontSize: '14px' }}>Browse by State</span>
            </div>
            {selectedStates.length > 0 && (
              <button
                onClick={() => setSelectedStates([])}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', background: 'rgba(0, 200, 5,0.12)', border: '1px solid rgba(0, 200, 5,0.25)', color: '#4ade80', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}
              >
                <RotateCcw size={10} /> Reset
              </button>
            )}
          </div>

          <p style={{ color: '#5a675f', fontSize: '12px', margin: 0, lineHeight: 1.5 }}>
            Click any state to filter deals. Click again to deselect.
          </p>

          <Suspense fallback={<div className="skeleton" style={{ width: '100%', aspectRatio: '1.6', borderRadius: 10 }} />}>
            <USMap deals={allDeals} selectedStates={selectedStates} onStateToggle={handleStateToggle} />
          </Suspense>

          {/* Active state chips */}
          {selectedStates.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {selectedStates.map(abbr => (
                <span key={abbr} onClick={() => handleStateToggle(abbr)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(0, 200, 5,0.15)', border: '1px solid rgba(0, 200, 5,0.3)', color: '#4ade80', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                  {abbr} <span style={{ fontSize: '14px', lineHeight: 1 }}>×</span>
                </span>
              ))}
            </div>
          )}

          {/* Deal count per selected state summary */}
          {selectedStates.length > 0 && (
            <div style={{ background: '#131614', border: '1px solid #232925', borderRadius: '10px', padding: '12px' }}>
              {selectedStates.map(abbr => {
                const count = allDeals.filter(d => d.state === abbr).length;
                return (
                  <div key={abbr} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #232925', lastChild: { borderBottom: 'none' } }}>
                    <span style={{ color: '#95a29b', fontSize: '12px' }}>{abbr}</span>
                    <span style={{ color: '#00c805', fontWeight: 700, fontSize: '12px' }}>{count} deal{count !== 1 ? 's' : ''}</span>
                  </div>
                );
              })}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', marginTop: '4px' }}>
                <span style={{ color: '#f8fafc', fontSize: '12px', fontWeight: 700 }}>Showing</span>
                <span style={{ color: '#f8fafc', fontWeight: 800, fontSize: '13px' }}>{sorted.length} deals</span>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: deal listings ── */}
        <div style={{ flex: 1, padding: isMobile ? '14px 12px 32px' : '20px 20px 40px', minWidth: 0 }}>

          {/* ── Shop by State — big, scrollable, drives the map selection too ── */}
          {statesWithDeals.length > 0 && (
            <div style={{ marginBottom: isMobile ? 14 : 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 9 }}>
                <MapPin size={14} style={{ color: '#00c805' }} />
                <span style={{ color: '#f8fafc', fontWeight: 800, fontSize: 13, letterSpacing: 0.3 }}>SHOP BY STATE</span>
                <span style={{ color: '#5a675f', fontSize: 12 }}>· tap to filter, tap again to clear</span>
              </div>
              <div className="scroll-x-hidden" style={{ display: 'flex', gap: 8, paddingBottom: 4 }}>
                <button
                  onClick={() => setSelectedStates([])}
                  style={{
                    flexShrink: 0, padding: isMobile ? '10px 16px' : '11px 20px', borderRadius: 14,
                    cursor: 'pointer', fontSize: 14, fontWeight: 800,
                    background: selectedStates.length === 0 ? 'linear-gradient(135deg, #00c805, #00e05c)' : 'rgba(255,255,255,0.04)',
                    border: selectedStates.length === 0 ? 'none' : '1px solid #232925',
                    color: selectedStates.length === 0 ? '#052012' : '#95a29b',
                    boxShadow: selectedStates.length === 0 ? '0 6px 18px rgba(0,200,5,0.35)' : 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  🇺🇸 All States
                </button>
                {statesWithDeals.map(({ abbr, count, name }) => {
                  const on = selectedStates.includes(abbr);
                  return (
                    <button
                      key={abbr}
                      onClick={() => handleStateToggle(abbr)}
                      style={{
                        flexShrink: 0, padding: isMobile ? '8px 14px' : '9px 18px', borderRadius: 14,
                        cursor: 'pointer', textAlign: 'left',
                        background: on ? 'linear-gradient(135deg, #00c805, #00e05c)' : '#131614',
                        border: on ? 'none' : '1px solid #232925',
                        boxShadow: on ? '0 6px 18px rgba(0,200,5,0.35)' : 'none',
                        transition: 'transform 0.12s',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={(e) => { if (!on) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      <span style={{ display: 'block', color: on ? '#052012' : '#f8fafc', fontWeight: 900, fontSize: 15, letterSpacing: 0.2 }}>
                        {abbr}
                      </span>
                      <span style={{ display: 'block', color: on ? 'rgba(5,32,18,0.75)' : '#707d75', fontSize: 10.5, fontWeight: 700 }}>
                        {name.length > 12 ? abbr : name} · {count} deal{count === 1 ? '' : 's'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {allDeals.length === 0 ? (
            /* ── Launch state: the market is open and empty — own it ── */
            <div style={{ textAlign: 'center', padding: '70px 20px' }}>
              <div style={{
                width: 88, height: 88, borderRadius: 26, margin: '0 auto 18px',
                background: 'linear-gradient(135deg, rgba(0,200,5,0.16), rgba(0,229,160,0.08))',
                border: '1px solid rgba(0,200,5,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38,
              }}>
                🏁
              </div>
              <h3 style={{ color: '#f8fafc', fontWeight: 900, fontSize: 24, marginBottom: 8, letterSpacing: '-0.4px' }}>
                The market just opened
              </h3>
              <p style={{ color: '#95a29b', fontSize: 14.5, marginBottom: 22, lineHeight: 1.6, maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
                Be the first wholesaler on AllStreet Live — the first deals posted get every buyer's eyes.
              </p>
              <button onClick={goPostDeal} className="gradient-btn" style={{ padding: '14px 32px', borderRadius: 12, fontWeight: 900, fontSize: 16 }}>
                + Post the first deal
              </button>
            </div>
          ) : sorted.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: '40px', marginBottom: '14px' }}>🏚️</div>
              <h3 style={{ color: '#f8fafc', fontWeight: 700, marginBottom: '6px' }}>No deals found</h3>
              <p style={{ color: '#5a675f', fontSize: '14px', marginBottom: '20px' }}>Try adjusting your filters or selecting different states</p>
              <button onClick={resetAll} style={{ padding: '11px 24px', borderRadius: '10px', background: 'linear-gradient(135deg,#00c805,#00e5a0)', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              {/* Sponsored section */}
              {sorted.some(d => d.isSponsored) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <span style={{ color: '#95a29b', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', whiteSpace: 'nowrap' }}>SPONSORED</span>
                  <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, #232925, transparent)' }} />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: isMobile ? '14px' : '18px' }}>
                {sorted.map((deal, idx) => (
                  <div key={deal.id}>
                    {idx === sorted.filter(d => d.isSponsored).length && idx > 0 && (
                      <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '10px', margin: '6px 0 14px' }}>
                        <span style={{ color: '#95a29b', fontSize: '11px', fontWeight: 700, letterSpacing: '1px' }}>ALL DEALS</span>
                        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, #232925, transparent)' }} />
                      </div>
                    )}
                    <DealCard deal={deal} stats={dealStats[deal.id]} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Mobile Buy Box: auto-pops once, reopenable via side handle ── */}
      {isMobile && !showBuyBox && <BuyBoxSideButton onClick={openBuyBox} />}
      <BuyBoxModal
        open={isMobile && showBuyBox}
        onClose={closeBuyBox}
        matchCount={sorted.length}
        activeType={activeType} setActiveType={setActiveType}
        dealTypes={dealTypes}
        selectedStates={selectedStates} setSelectedStates={setSelectedStates}
        statesWithDeals={statesWithDeals}
        minBeds={minBeds} setMinBeds={setMinBeds}
        minBaths={minBaths} setMinBaths={setMinBaths}
        priceMin={priceMin} setPriceMin={setPriceMin}
        priceMax={priceMax} setPriceMax={setPriceMax}
      />
    </div>
  );
}
