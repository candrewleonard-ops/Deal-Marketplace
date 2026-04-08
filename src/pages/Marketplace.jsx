import { useState, useMemo } from 'react';
import {
  Search, SlidersHorizontal, X, TrendingUp, ChevronDown, ChevronUp,
  RotateCcw, MapPin
} from 'lucide-react';
import DealCard from '../components/DealCard';
import USMap from '../components/USMap';
import PostDealModal from '../components/PostDealModal';
import { deals, dealTypes } from '../data/deals';

const CITIES = [
  'All Cities','Atlanta, GA','Phoenix, AZ','Dallas, TX','Houston, TX',
  'Memphis, TN','Indianapolis, IN','Kansas City, MO','Birmingham, AL',
  'Jacksonville, FL','Tampa, FL','Orlando, FL','Charlotte, NC',
  'Detroit, MI','Cleveland, OH','Cincinnati, OH','St. Louis, MO',
  'Baltimore, MD','Philadelphia, PA','Las Vegas, NV','Columbus, OH',
];

function FBAdCalculator() {
  const [budget, setBudget] = useState(20);
  const fee = (budget * 0.15).toFixed(2);
  const total = (budget + parseFloat(fee)).toFixed(2);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#f8fafc', fontWeight: 700 }}>$</span>
        <input type="number" min={5} max={1000} value={budget}
          onChange={e => setBudget(Math.max(5, parseInt(e.target.value) || 5))}
          className="input-dark"
          style={{ flex: 1, padding: '9px 12px', borderRadius: '8px', fontSize: '14px' }}
        />
        <span style={{ color: '#94a3b8', fontSize: '13px', whiteSpace: 'nowrap' }}>/day</span>
      </div>
      <div style={{ background: '#12121e', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {[['Ad spend', `$${budget}/day`, '#f8fafc'],['Platform fee (15%)', `+$${fee}/day`, '#f59e0b'],['Total', `$${total}/day`, '#10b981']].map(([l, v, c], i) => (
          <div key={l} style={{ display: 'flex', justifyContent: 'space-between', ...(i === 2 ? { paddingTop: '7px', borderTop: '1px solid #1e1e2e' } : {}) }}>
            <span style={{ color: '#94a3b8', fontSize: '13px' }}>{l}</span>
            <span style={{ color: c, fontWeight: i === 2 ? 800 : 600, fontSize: i === 2 ? '15px' : '13px' }}>{v}</span>
          </div>
        ))}
      </div>
      <button className="gradient-btn" style={{ padding: '10px', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer' }}>
        Launch Facebook Ads · ${total}/day
      </button>
    </div>
  );
}

export default function Marketplace() {
  const [activeType,      setActiveType]      = useState('all');
  const [search,          setSearch]          = useState('');
  const [showFilters,     setShowFilters]     = useState(false);
  const [city,            setCity]            = useState('All Cities');
  const [priceValue,      setPriceValue]      = useState(1000000);
  const [priceMode,       setPriceMode]       = useState('max');
  const [minBeds,         setMinBeds]         = useState(0);
  const [sortBy,          setSortBy]          = useState('newest');
  const [selectedStates,  setSelectedStates]  = useState([]);
  const [newestOnly,      setNewestOnly]      = useState(false);
  const [showPromote,     setShowPromote]     = useState(false);
  const [selectedTier,    setSelectedTier]    = useState(null);
  const [showPostDeal,    setShowPostDeal]    = useState(false);

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
    return deals.filter(d => {
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
      if (newestOnly && d.daysListed > 7) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!d.title.toLowerCase().includes(q) && !d.city.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [activeType, search, city, priceValue, priceMode, minBeds, selectedStates, newestOnly]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortBy === 'price-low')  arr.sort((a, b) => (a.listingPrice || a.price) - (b.listingPrice || b.price));
    else if (sortBy === 'price-high') arr.sort((a, b) => (b.listingPrice || b.price) - (a.listingPrice || a.price));
    else if (sortBy === 'views') arr.sort((a, b) => (b.views || 0) - (a.views || 0));
    else arr.sort((a, b) => a.daysListed - b.daysListed);
    const sponsored = arr.filter(d => d.isSponsored);
    const regular   = arr.filter(d => !d.isSponsored);
    return [...sponsored, ...regular];
  }, [filtered, sortBy]);

  const hasActiveFilters = activeType !== 'all' || search || city !== 'All Cities'
    || priceValue < 1000000 || minBeds > 0 || selectedStates.length > 0 || newestOnly;

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>

      {/* ── Top header bar ── */}
      <div style={{ background: '#0d0d1a', borderBottom: '1px solid #1e1e2e', padding: '18px 20px' }}>
        <div style={{ maxWidth: '1500px', margin: '0 auto' }}>
          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h1 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '24px', margin: 0 }}>Deal Marketplace</h1>
              <p style={{ color: '#475569', margin: '2px 0 0', fontSize: '13px' }}>
                {sorted.length} of {deals.length} deals
                {selectedStates.length > 0 && ` · ${selectedStates.join(', ')}`}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {hasActiveFilters && (
                <button onClick={resetAll} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                  <RotateCcw size={13} /> Reset
                </button>
              )}
              <button onClick={() => setShowPromote(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '9px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#f59e0b', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
                <TrendingUp size={14} /> Promote a Deal
              </button>
              <button onClick={() => setShowPostDeal(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '9px', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>
                + Post a Deal
              </button>
            </div>
          </div>

          {/* Search + city + filters row */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '180px', position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search city, market, or keyword…"
                className="input-dark"
                style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '9px', fontSize: '13px' }}
              />
            </div>
            <select value={city} onChange={e => setCity(e.target.value)}
              className="input-dark"
              style={{ padding: '10px 12px', borderRadius: '9px', fontSize: '13px', minWidth: '150px', cursor: 'pointer' }}
            >
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <button onClick={() => setNewestOnly(n => !n)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '10px 14px', borderRadius: '9px', background: newestOnly ? 'linear-gradient(135deg,#8b5cf6,#06b6d4)' : 'rgba(255,255,255,0.04)', border: newestOnly ? 'none' : '1px solid #1e1e2e', color: newestOnly ? '#fff' : '#94a3b8', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
              <TrendingUp size={13} /> Newest
            </button>
            <button onClick={() => setShowFilters(f => !f)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', borderRadius: '9px', background: showFilters ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${showFilters ? 'rgba(139,92,246,0.3)' : '#1e1e2e'}`, color: showFilters ? '#8b5cf6' : '#94a3b8', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
              <SlidersHorizontal size={14} />
              Filters
              {(priceValue < 1000000 || minBeds > 0) && <span style={{ background: '#8b5cf6', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>!</span>}
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
            <div style={{ marginTop: '12px', background: '#1a1a2e', border: '1px solid #1e1e2e', borderRadius: '10px', padding: '16px', display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 700 }}>
                    {priceMode === 'max' ? 'MAX' : 'MIN'} LISTING PRICE
                  </label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {['min','max'].map(m => (
                      <button key={m} onClick={() => setPriceMode(m)} style={{ padding: '2px 8px', borderRadius: '10px', background: priceMode === m ? 'rgba(139,92,246,0.2)' : 'transparent', border: `1px solid ${priceMode === m ? '#8b5cf6' : '#1e1e2e'}`, color: priceMode === m ? '#8b5cf6' : '#94a3b8', cursor: 'pointer', fontSize: '10px', fontWeight: 700 }}>{m}</button>
                    ))}
                  </div>
                </div>
                <input type="range" min={0} max={1000000} step={5000} value={priceValue}
                  onChange={e => setPriceValue(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: '#8b5cf6', marginBottom: '4px' }}
                />
                <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '13px' }}>
                  {priceValue >= 1000000 ? 'No Max' : `$${priceValue.toLocaleString()}`}
                </div>
              </div>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>MIN BEDS</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[0,1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => setMinBeds(n)} style={{ width: '34px', height: '34px', borderRadius: '7px', background: minBeds === n ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${minBeds === n ? '#8b5cf6' : '#1e1e2e'}`, color: minBeds === n ? '#8b5cf6' : '#94a3b8', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}>
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
              <button key={value} onClick={() => setActiveType(value)} style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: activeType === value ? 'linear-gradient(135deg,#8b5cf6,#06b6d4)' : 'rgba(255,255,255,0.04)', border: `1px solid ${activeType === value ? 'transparent' : '#1e1e2e'}`, color: activeType === value ? '#fff' : '#94a3b8', cursor: 'pointer', transition: 'all 0.15s' }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Two-column body: MAP LEFT | DEALS RIGHT ── */}
      <div style={{ maxWidth: '1500px', margin: '0 auto', display: 'flex', gap: '0', minHeight: 'calc(100vh - 200px)' }}>

        {/* ── LEFT: sticky map panel ── */}
        <div style={{
          width: '600px', flexShrink: 0,
          position: 'sticky', top: '0',
          height: 'calc(100vh - 64px)',
          overflowY: 'auto',
          borderRight: '1px solid #1e1e2e',
          background: '#0d0d1a',
          padding: '16px 12px',
          display: 'flex', flexDirection: 'column', gap: '14px',
        }}>
          {/* Map header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <MapPin size={15} style={{ color: '#8b5cf6' }} />
              <span style={{ color: '#f8fafc', fontWeight: 700, fontSize: '14px' }}>Browse by State</span>
            </div>
            {selectedStates.length > 0 && (
              <button
                onClick={() => setSelectedStates([])}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#a78bfa', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}
              >
                <RotateCcw size={10} /> Reset
              </button>
            )}
          </div>

          <p style={{ color: '#475569', fontSize: '12px', margin: 0, lineHeight: 1.5 }}>
            Click any state to filter deals. Click again to deselect.
          </p>

          {/* The actual map */}
          <USMap deals={deals} selectedStates={selectedStates} onStateToggle={handleStateToggle} />

          {/* Active state chips */}
          {selectedStates.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {selectedStates.map(abbr => (
                <span key={abbr} onClick={() => handleStateToggle(abbr)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                  {abbr} <span style={{ fontSize: '14px', lineHeight: 1 }}>×</span>
                </span>
              ))}
            </div>
          )}

          {/* Deal count per selected state summary */}
          {selectedStates.length > 0 && (
            <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '10px', padding: '12px' }}>
              {selectedStates.map(abbr => {
                const count = deals.filter(d => d.state === abbr).length;
                return (
                  <div key={abbr} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #1e1e2e', lastChild: { borderBottom: 'none' } }}>
                    <span style={{ color: '#94a3b8', fontSize: '12px' }}>{abbr}</span>
                    <span style={{ color: '#8b5cf6', fontWeight: 700, fontSize: '12px' }}>{count} deal{count !== 1 ? 's' : ''}</span>
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
        <div style={{ flex: 1, padding: '20px 20px 40px', minWidth: 0 }}>
          {sorted.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: '40px', marginBottom: '14px' }}>🏚️</div>
              <h3 style={{ color: '#f8fafc', fontWeight: 700, marginBottom: '6px' }}>No deals found</h3>
              <p style={{ color: '#475569', fontSize: '14px', marginBottom: '20px' }}>Try adjusting your filters or selecting different states</p>
              <button onClick={resetAll} style={{ padding: '11px 24px', borderRadius: '10px', background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              {/* Sponsored section */}
              {sorted.some(d => d.isSponsored) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', whiteSpace: 'nowrap' }}>SPONSORED</span>
                  <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, #1e1e2e, transparent)' }} />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '18px' }}>
                {sorted.map((deal, idx) => (
                  <div key={deal.id}>
                    {idx === sorted.filter(d => d.isSponsored).length && idx > 0 && (
                      <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '10px', margin: '6px 0 14px' }}>
                        <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 700, letterSpacing: '1px' }}>ALL DEALS</span>
                        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, #1e1e2e, transparent)' }} />
                      </div>
                    )}
                    <DealCard deal={deal} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Promote modal ── */}
      {showPromote && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '20px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #1e1e2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '18px', margin: 0 }}>Promote Your Deal</h2>
                <p style={{ color: '#475569', margin: '3px 0 0', fontSize: '13px' }}>Get more buyers with sponsored placement</p>
              </div>
              <button onClick={() => setShowPromote(false)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { tier: 'Starter',  price: '$2/day',  perks: 'Top 20 placement',              color: '#94a3b8', icon: '🔹' },
                { tier: 'Growth',   price: '$5/day',  perks: 'Top 10 placement',              color: '#06b6d4', icon: '🔷' },
                { tier: 'Pro',      price: '$10/day', perks: 'Top 5 · Sponsored badge',       color: '#8b5cf6', icon: '💎' },
                { tier: 'Featured', price: '$20/day', perks: '#1 · Animated glow · Crown',   color: '#f59e0b', icon: '👑' },
              ].map(({ tier, price, perks, color, icon }) => (
                <div key={tier} style={{ background: '#1a1a2e', border: `1px solid ${color}35`, borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>{icon}</span>
                    <div>
                      <div style={{ color, fontWeight: 800, fontSize: '14px' }}>{tier}</div>
                      <div style={{ color: '#94a3b8', fontSize: '12px' }}>{perks}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: '16px' }}>{price}</div>
                    <button onClick={() => { setSelectedTier(tier); alert(`Tier "${tier}" selected at ${price}. Proceeding to checkout...`); setShowPromote(false); }} style={{ marginTop: '4px', padding: '4px 12px', borderRadius: '20px', background: selectedTier === tier ? color : `${color}20`, border: `1px solid ${color}35`, color: selectedTier === tier ? '#12121e' : color, cursor: 'pointer', fontSize: '11px', fontWeight: 700, transition: 'all 0.2s' }} onMouseEnter={e => e.target.style.opacity = '0.8'} onMouseLeave={e => e.target.style.opacity = '1'}>Select</button>
                  </div>
                </div>
              ))}
              <div style={{ background: '#1a1a2e', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '20px' }}>📘</span>
                  <div>
                    <div style={{ color: '#06b6d4', fontWeight: 800, fontSize: '14px' }}>Run Facebook Ads</div>
                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>Retarget motivated sellers & buyers</div>
                  </div>
                </div>
                <FBAdCalculator />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Deal Modal */}
      {showPostDeal && <PostDealModal onClose={() => setShowPostDeal(false)} />}
    </div>
  );
}
