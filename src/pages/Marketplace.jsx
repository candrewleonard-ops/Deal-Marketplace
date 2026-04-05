import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp, TrendingUp, MapPin } from 'lucide-react';
import DealCard from '../components/DealCard';
import USMap from '../components/USMap';
import { deals, dealTypes } from '../data/deals';

const cities = ['All Cities', 'Atlanta, GA', 'Phoenix, AZ', 'Dallas, TX', 'Houston, TX', 'Memphis, TN', 'Indianapolis, IN', 'Kansas City, MO', 'Birmingham, AL', 'Jacksonville, FL', 'Tampa, FL', 'Orlando, FL', 'Charlotte, NC', 'Detroit, MI', 'Cleveland, OH', 'Cincinnati, OH', 'St. Louis, MO', 'Baltimore, MD', 'Philadelphia, PA', 'Las Vegas, NV', 'Columbus, OH'];

export default function Marketplace() {
  const [activeType, setActiveType] = useState('all');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [city, setCity] = useState('All Cities');
  const [priceValue, setPriceValue] = useState(1000000);
  const [priceMode, setPriceMode] = useState('max'); // 'min' or 'max'
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [minBeds, setMinBeds] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [stateFilter, setStateFilter] = useState(null);
  const [showMap, setShowMap] = useState(true);
  const [newestOnly, setNewestOnly] = useState(false);

  const filtered = useMemo(() => {
    return deals.filter(d => {
      if (activeType !== 'all' && d.dealType !== activeType) return false;
      if (city !== 'All Cities') {
        const [c, s] = city.split(', ');
        if (d.city !== c || d.state !== s) return false;
      }
      if (stateFilter && d.state !== stateFilter) return false;
      const listPrice = d.listingPrice || d.price;
      if (priceMode === 'max' && listPrice > priceValue) return false;
      if (priceMode === 'min' && listPrice < priceValue) return false;
      if (minBeds > 0 && d.beds < minBeds) return false;
      if (newestOnly && d.daysListed > 7) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!d.title.toLowerCase().includes(q) && !d.city.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [activeType, search, city, priceValue, priceMode, minBeds, stateFilter, newestOnly]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortBy === 'price-low') arr.sort((a, b) => (a.listingPrice || a.price) - (b.listingPrice || b.price));
    else if (sortBy === 'price-high') arr.sort((a, b) => (b.listingPrice || b.price) - (a.listingPrice || a.price));
    else if (sortBy === 'views') arr.sort((a, b) => (b.views || 0) - (a.views || 0));
    else arr.sort((a, b) => a.daysListed - b.daysListed); // newest
    // Sponsored first
    const sponsored = arr.filter(d => d.isSponsored);
    const regular = arr.filter(d => !d.isSponsored);
    return [...sponsored, ...regular];
  }, [filtered, sortBy]);

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: '#0d0d1a', borderBottom: '1px solid #1e1e2e',
        padding: '24px 20px',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '28px', margin: 0 }}>Deal Marketplace</h1>
              <p style={{ color: '#475569', margin: '4px 0 0', fontSize: '14px' }}>{deals.length} active deals nationwide</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowPromoteModal(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '10px 18px', borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#f59e0b', cursor: 'pointer', fontWeight: 600, fontSize: '14px',
                  transition: 'all 0.2s',
                }}
              >
                <TrendingUp size={16} />
                Promote a Deal
              </button>
              <button
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '10px 18px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                  border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '14px',
                  transition: 'all 0.2s',
                }}
              >
                + Post a Deal
              </button>
            </div>
          </div>

          {/* Search + Filters Row */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by address, city, or keyword..."
                className="input-dark"
                style={{ width: '100%', padding: '11px 14px 11px 40px', borderRadius: '10px', fontSize: '14px' }}
              />
            </div>

            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              className="input-dark"
              style={{ padding: '11px 14px', borderRadius: '10px', fontSize: '14px', minWidth: '160px', cursor: 'pointer' }}
            >
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '11px 16px', borderRadius: '10px',
                background: showFilters ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${showFilters ? 'rgba(139, 92, 246, 0.3)' : '#1e1e2e'}`,
                color: showFilters ? '#8b5cf6' : '#94a3b8',
                cursor: 'pointer', fontWeight: 600, fontSize: '14px',
                transition: 'all 0.2s',
              }}
            >
              <SlidersHorizontal size={16} />
              Filters
              {(priceValue < 1000000 || minBeds > 0 || stateFilter) && (
                <span style={{
                  background: '#8b5cf6', color: '#fff',
                  borderRadius: '50%', width: '18px', height: '18px',
                  fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>!</span>
              )}
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div style={{
              marginTop: '16px', background: '#1a1a2e',
              border: '1px solid #1e1e2e', borderRadius: '12px',
              padding: '20px', display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 700 }}>
                    {priceMode === 'max' ? 'MAX' : 'MIN'} LISTING PRICE
                  </label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {['min', 'max'].map(m => (
                      <button key={m} onClick={() => setPriceMode(m)} style={{ padding: '3px 10px', borderRadius: '12px', background: priceMode === m ? 'rgba(139, 92, 246, 0.2)' : '#1a1a2e', border: `1px solid ${priceMode === m ? '#8b5cf6' : '#1e1e2e'}`, color: priceMode === m ? '#8b5cf6' : '#94a3b8', cursor: 'pointer', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>{m}</button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="range"
                    min={0}
                    max={1000000}
                    step={5000}
                    value={priceValue}
                    onChange={e => setPriceValue(parseInt(e.target.value))}
                    style={{ flex: 1, accentColor: '#8b5cf6' }}
                  />
                  <span style={{ color: '#f8fafc', fontWeight: 700, minWidth: '90px', fontSize: '14px' }}>
                    {priceValue >= 1000000 ? 'No Max' : `$${priceValue.toLocaleString()}`}
                  </span>
                </div>
              </div>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '10px' }}>SORT BY</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input-dark" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="views">Most Views</option>
                </select>
              </div>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '10px' }}>
                  MIN BEDROOMS
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[0, 1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => setMinBeds(n)}
                      style={{
                        width: '36px', height: '36px', borderRadius: '8px',
                        background: minBeds === n ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${minBeds === n ? '#8b5cf6' : '#1e1e2e'}`,
                        color: minBeds === n ? '#8b5cf6' : '#94a3b8',
                        cursor: 'pointer', fontWeight: 700, fontSize: '13px',
                        transition: 'all 0.2s',
                      }}
                    >
                      {n === 0 ? 'Any' : n + '+'}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  onClick={() => { setPriceValue(1000000); setPriceMode('max'); setMinBeds(0); setCity('All Cities'); setSearch(''); setStateFilter(null); setNewestOnly(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '10px 16px', borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#ef4444', cursor: 'pointer', fontWeight: 600, fontSize: '13px',
                  }}
                >
                  <X size={14} /> Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Deal Type Tabs */}
          <div style={{ display: 'flex', gap: '4px', marginTop: '16px', flexWrap: 'wrap' }}>
            {dealTypes.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setActiveType(value)}
                style={{
                  padding: '8px 18px', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
                  background: activeType === value ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${activeType === value ? 'transparent' : '#1e1e2e'}`,
                  color: activeType === value ? '#fff' : '#94a3b8',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* US Map Collapsible + Newest Button */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => setNewestOnly(!newestOnly)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '20px',
              background: newestOnly ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)' : 'rgba(255,255,255,0.04)',
              border: newestOnly ? 'none' : '1px solid #1e1e2e',
              color: newestOnly ? '#fff' : '#94a3b8', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
            }}
          >
            <TrendingUp size={14} /> Newest Deals {newestOnly && '(7d)'}
          </button>
          {stateFilter && (
            <button onClick={() => setStateFilter(null)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '20px', background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#8b5cf6', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
              State: {stateFilter} <X size={12} />
            </button>
          )}
        </div>
        <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '12px', overflow: 'hidden' }}>
          <button
            onClick={() => setShowMap(!showMap)}
            style={{ width: '100%', padding: '14px 18px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#f8fafc' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '14px' }}>
              <MapPin size={16} style={{ color: '#8b5cf6' }} /> View Deals by State
            </span>
            {showMap ? <ChevronUp size={18} style={{ color: '#94a3b8' }} /> : <ChevronDown size={18} style={{ color: '#94a3b8' }} />}
          </button>
          {showMap && (
            <div style={{ borderTop: '1px solid #1e1e2e' }}>
              <USMap deals={deals} onStateClick={(state) => setStateFilter(state)} />
            </div>
          )}
        </div>
      </div>

      {/* Deals Grid */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 20px' }}>
        {sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏚️</div>
            <h3 style={{ color: '#f8fafc', fontWeight: 700, marginBottom: '8px' }}>No deals found</h3>
            <p style={{ color: '#475569', fontSize: '14px' }}>Try adjusting your filters or search terms</p>
            <button
              onClick={() => { setActiveType('all'); setSearch(''); setCity('All Cities'); setPriceValue(1000000); setMinBeds(0); setStateFilter(null); setNewestOnly(false); }}
              style={{
                marginTop: '20px', padding: '12px 24px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '14px',
              }}
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div style={{ color: '#475569', fontSize: '13px', marginBottom: '20px' }}>
              Showing <strong style={{ color: '#f8fafc' }}>{sorted.length}</strong> deals
              {search && <> matching "<strong style={{ color: '#8b5cf6' }}>{search}</strong>"</>}
            </div>

            {/* Sponsored Section Label */}
            {sorted.some(d => d.isSponsored) && (
              <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 700, letterSpacing: '1px' }}>SPONSORED DEALS</span>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, #1e1e2e, transparent)' }} />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {sorted.map((deal, idx) => (
                <div key={deal.id}>
                  {/* Show regular deals label after sponsored */}
                  {idx === sorted.filter(d => d.isSponsored).length && idx > 0 && (
                    <div style={{
                      gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '12px',
                      marginBottom: '0', marginTop: '8px',
                    }}>
                      <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 700, letterSpacing: '1px' }}>ALL DEALS</span>
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

      {/* Promote Modal */}
      {showPromoteModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            background: '#12121e', border: '1px solid #1e1e2e',
            borderRadius: '20px', width: '100%', maxWidth: '500px',
            maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
          }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #1e1e2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '20px', margin: 0 }}>Promote Your Deal</h2>
                <p style={{ color: '#475569', margin: '4px 0 0', fontSize: '14px' }}>Get more eyes on your deal with sponsored placement</p>
              </div>
              <button onClick={() => setShowPromoteModal(false)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { tier: 'Starter', price: '$2/day', perks: 'Appears in top 20', color: '#94a3b8', icon: '🔹' },
                { tier: 'Growth', price: '$5/day', perks: 'Appears in top 10', color: '#06b6d4', icon: '🔷' },
                { tier: 'Pro', price: '$10/day', perks: 'Top 5 · Sponsored badge', color: '#8b5cf6', icon: '💎' },
                { tier: 'Featured', price: '$20/day', perks: '#1 spot · Animated glow border · Crown badge · Shimmer label', color: '#f59e0b', icon: '👑' },
              ].map(({ tier, price, perks, color, icon }) => (
                <div
                  key={tier}
                  style={{
                    background: '#1a1a2e', border: `1px solid ${color}40`,
                    borderRadius: '14px', padding: '18px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ fontSize: '28px' }}>{icon}</span>
                    <div>
                      <div style={{ color, fontWeight: 800, fontSize: '16px' }}>{tier}</div>
                      <div style={{ color: '#94a3b8', fontSize: '13px' }}>{perks}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: '18px' }}>{price}</div>
                    <button style={{
                      marginTop: '6px', padding: '6px 14px', borderRadius: '20px',
                      background: `${color}20`, border: `1px solid ${color}40`,
                      color, cursor: 'pointer', fontSize: '12px', fontWeight: 700,
                    }}>
                      Select
                    </button>
                  </div>
                </div>
              ))}

              {/* FB Ads Section */}
              <div style={{ background: '#1a1a2e', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '14px', padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '24px' }}>📘</span>
                  <div>
                    <div style={{ color: '#06b6d4', fontWeight: 800, fontSize: '16px' }}>Run Facebook Ads</div>
                    <div style={{ color: '#94a3b8', fontSize: '13px' }}>Retarget motivated sellers & cash buyers</div>
                  </div>
                </div>
                <FBAdCalculator />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FBAdCalculator() {
  const [budget, setBudget] = useState(20);
  const fee = (budget * 0.15).toFixed(2);
  const total = (budget + parseFloat(fee)).toFixed(2);

  return (
    <div>
      <div style={{ marginBottom: '12px' }}>
        <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
          DAILY AD BUDGET
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: '#f8fafc', fontWeight: 700, fontSize: '16px' }}>$</span>
          <input
            type="number"
            min={5}
            max={1000}
            value={budget}
            onChange={e => setBudget(Math.max(5, parseInt(e.target.value) || 5))}
            className="input-dark"
            style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', fontSize: '14px' }}
          />
        </div>
      </div>
      <div style={{ background: '#12121e', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#94a3b8', fontSize: '13px' }}>Ad spend</span>
          <span style={{ color: '#f8fafc', fontWeight: 600 }}>${budget}/day</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#94a3b8', fontSize: '13px' }}>Platform fee (15%)</span>
          <span style={{ color: '#f59e0b', fontWeight: 600 }}>+${fee}/day</span>
        </div>
        <div style={{ borderTop: '1px solid #1e1e2e', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#f8fafc', fontWeight: 700 }}>Total per day</span>
          <span style={{ color: '#10b981', fontWeight: 800, fontSize: '16px' }}>${total}/day</span>
        </div>
      </div>
      <button className="gradient-btn" style={{
        width: '100%', marginTop: '12px', padding: '12px',
        borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '14px',
      }}>
        Launch Facebook Ads · ${total}/day
      </button>
    </div>
  );
}
