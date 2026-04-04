import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown, TrendingUp } from 'lucide-react';
import DealCard from '../components/DealCard';
import { deals, dealTypes } from '../data/deals';

const cities = ['All Cities', 'Atlanta, GA', 'Phoenix, AZ', 'Dallas, TX', 'Houston, TX', 'Memphis, TN', 'Indianapolis, IN', 'Kansas City, MO', 'Birmingham, AL', 'Jacksonville, FL', 'Tampa, FL', 'Orlando, FL', 'Charlotte, NC', 'Detroit, MI', 'Cleveland, OH', 'Cincinnati, OH', 'St. Louis, MO', 'Baltimore, MD', 'Philadelphia, PA', 'Las Vegas, NV', 'Columbus, OH'];

export default function Marketplace() {
  const [activeType, setActiveType] = useState('all');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [city, setCity] = useState('All Cities');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [minBeds, setMinBeds] = useState(0);

  const filtered = useMemo(() => {
    return deals.filter(d => {
      if (activeType !== 'all' && d.dealType !== activeType) return false;
      if (city !== 'All Cities') {
        const [c, s] = city.split(', ');
        if (d.city !== c || d.state !== s) return false;
      }
      if (d.price < priceRange[0] || d.price > priceRange[1]) return false;
      if (minBeds > 0 && d.beds < minBeds) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!d.title.toLowerCase().includes(q) && !d.city.toLowerCase().includes(q) && !d.address.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [activeType, search, city, priceRange, minBeds]);

  // Sponsored first
  const sorted = useMemo(() => {
    const sponsored = filtered.filter(d => d.isSponsored);
    const regular = filtered.filter(d => !d.isSponsored);
    return [...sponsored, ...regular];
  }, [filtered]);

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
              {(priceRange[1] < 100000 || minBeds > 0) && (
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
                <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '10px' }}>
                  MAX PRICE (Assignment Fee)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="range"
                    min={0}
                    max={100000}
                    step={1000}
                    value={priceRange[1]}
                    onChange={e => setPriceRange([0, parseInt(e.target.value)])}
                    style={{ flex: 1, accentColor: '#8b5cf6' }}
                  />
                  <span style={{ color: '#f8fafc', fontWeight: 700, minWidth: '70px', fontSize: '14px' }}>
                    ${priceRange[1].toLocaleString()}
                  </span>
                </div>
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
                  onClick={() => { setPriceRange([0, 100000]); setMinBeds(0); setCity('All Cities'); setSearch(''); }}
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

      {/* Deals Grid */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 20px' }}>
        {sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏚️</div>
            <h3 style={{ color: '#f8fafc', fontWeight: 700, marginBottom: '8px' }}>No deals found</h3>
            <p style={{ color: '#475569', fontSize: '14px' }}>Try adjusting your filters or search terms</p>
            <button
              onClick={() => { setActiveType('all'); setSearch(''); setCity('All Cities'); setPriceRange([0, 100000]); setMinBeds(0); }}
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
