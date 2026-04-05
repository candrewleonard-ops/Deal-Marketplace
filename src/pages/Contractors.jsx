import { useState } from 'react';
import { Search, Wrench, CheckCircle, X, MapPin, Star, DollarSign } from 'lucide-react';
import { contractorCities, tradeTypes, getContractorsByCity } from '../data/contractors';
import ContractorCard from '../components/ContractorCard';

export default function Contractors() {
  const [selectedCity, setSelectedCity] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalCity, setModalCity] = useState(null);
  const [revealed, setRevealed] = useState({});
  const [search, setSearch] = useState('');
  const [purchased, setPurchased] = useState({});
  const [tradeFilter, setTradeFilter] = useState('All');

  const filteredCities = contractorCities.filter(c =>
    search === '' ||
    c.city.toLowerCase().includes(search.toLowerCase()) ||
    c.state.toLowerCase().includes(search.toLowerCase())
  );

  function openModal(cityData) {
    setModalCity(cityData);
    setShowModal(true);
  }

  function handlePurchase(cityName) {
    setPurchased(prev => ({ ...prev, [cityName]: true }));
    setRevealed(prev => ({ ...prev, [cityName]: true }));
  }

  const tradeColors = {
    'HVAC': '#06b6d4',
    'Plumbing': '#3b82f6',
    'Electrical': '#f59e0b',
    'Painting/Cosmetic': '#ec4899',
    'Flooring': '#8b5cf6',
    'Roofing': '#ef4444',
    'Foundation/Structural': '#10b981',
  };

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.1)), #0d0d1a',
        borderBottom: '1px solid #1e1e2e',
        padding: '60px 20px 40px',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '20px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Wrench size={28} style={{ color: '#fff' }} />
          </div>
          <h1 style={{ color: '#f8fafc', fontWeight: 900, fontSize: 'clamp(24px, 4vw, 40px)', margin: 0, letterSpacing: '-0.5px' }}>
            Contractor Marketplace
          </h1>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '8px', fontWeight: 600 }}>
          Find Trusted Contractors in Your Market
        </p>
        <p className="gradient-text" style={{ fontSize: 'clamp(14px, 2vw, 18px)', fontWeight: 800, marginBottom: '32px' }}>
          Full Stack Contractor Lists — Everything You Need in One Click
        </p>

        {/* What's in a Full Stack */}
        <div style={{
          display: 'inline-grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '12px',
          background: '#12121e',
          border: '1px solid #1e1e2e',
          borderRadius: '16px',
          padding: '20px 28px',
          maxWidth: '900px',
          margin: '0 auto 32px',
        }}>
          {tradeTypes.map((trade, i) => (
            <div key={trade} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: Object.values(tradeColors)[i] || '#8b5cf6',
                flexShrink: 0,
              }} />
              <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 500 }}>{trade}</span>
              <span style={{ color: '#475569', fontSize: '12px' }}>×2</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', gridColumn: '1 / -1' }}>
            <span style={{ color: '#f8fafc', fontSize: '14px', fontWeight: 700 }}>Total: 14 vetted contractors per city</span>
            <span style={{ color: '#10b981', fontWeight: 800, fontSize: '18px', marginLeft: 'auto' }}>= $14</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { value: '280+', label: 'Vetted Contractors' },
            { value: '20', label: 'Cities Covered' },
            { value: '$1/lead', label: 'Per Contractor' },
            { value: '$14', label: 'Full Stack List' },
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div className="gradient-text" style={{ fontWeight: 900, fontSize: '24px' }}>{value}</div>
              <div style={{ color: '#475569', fontSize: '13px' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* City Search */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ position: 'relative', maxWidth: '480px', margin: '0 auto 40px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by city or state..."
            className="input-dark"
            style={{ width: '100%', padding: '14px 14px 14px 44px', borderRadius: '12px', fontSize: '16px' }}
          />
        </div>

        {/* Trade Filter */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px', justifyContent: 'center' }}>
          <button
            onClick={() => setTradeFilter('All')}
            style={{ padding: '6px 16px', borderRadius: '20px', background: tradeFilter === 'All' ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)' : 'rgba(255,255,255,0.04)', border: tradeFilter === 'All' ? 'none' : '1px solid #1e1e2e', color: tradeFilter === 'All' ? '#fff' : '#94a3b8', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
          >
            All Trades
          </button>
          {tradeTypes.map((trade, i) => {
            const color = Object.values(tradeColors)[i];
            const isActive = tradeFilter === trade;
            return (
              <button
                key={trade}
                onClick={() => setTradeFilter(isActive ? 'All' : trade)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: isActive ? `${color}20` : `${color}0a`,
                  border: `1px solid ${isActive ? color : color + '30'}`,
                  borderRadius: '20px', padding: '5px 14px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: color }} />
                <span style={{ color: color, fontSize: '12px', fontWeight: 600 }}>{trade}</span>
              </button>
            );
          })}
        </div>

        {/* City Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredCities.map(cityData => (
            <div
              key={`${cityData.city}-${cityData.state}`}
              className="card-hover"
              style={{
                background: '#12121e', border: '1px solid #1e1e2e',
                borderRadius: '16px', padding: '20px',
                overflow: 'hidden', position: 'relative',
              }}
            >
              {/* Purchased badge */}
              {purchased[cityData.city] && (
                <div style={{
                  position: 'absolute', top: '14px', right: '14px',
                  background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '20px', padding: '3px 10px',
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}>
                  <CheckCircle size={12} style={{ color: '#10b981' }} />
                  <span style={{ color: '#10b981', fontSize: '11px', fontWeight: 700 }}>PURCHASED</span>
                </div>
              )}

              {/* City Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <MapPin size={22} style={{ color: '#fff' }} />
                </div>
                <div>
                  <h3 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '20px', margin: 0 }}>{cityData.city}</h3>
                  <p style={{ color: '#94a3b8', fontSize: '14px', margin: '2px 0 0' }}>{cityData.state}</p>
                </div>
              </div>

              {/* Trade breakdown */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                {tradeTypes.map((trade, i) => (
                  <span
                    key={trade}
                    style={{
                      background: `${Object.values(tradeColors)[i]}14`,
                      border: `1px solid ${Object.values(tradeColors)[i]}30`,
                      color: Object.values(tradeColors)[i],
                      borderRadius: '20px', padding: '2px 8px', fontSize: '11px', fontWeight: 600,
                    }}
                  >
                    {trade.split('/')[0]} ×2
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingTop: '14px', borderTop: '1px solid #1e1e2e' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: '20px' }}>{cityData.contractorCount}</div>
                    <div style={{ color: '#475569', fontSize: '11px' }}>Contractors</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: '20px' }}>$1</div>
                    <div style={{ color: '#475569', fontSize: '11px' }}>Per Lead</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#10b981', fontWeight: 800, fontSize: '20px' }}>$14</div>
                    <div style={{ color: '#475569', fontSize: '11px' }}>Full Stack</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={12} fill="#f59e0b" style={{ color: '#f59e0b' }} />)}
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => openModal(cityData)}
                  className="gradient-btn"
                  style={{
                    flex: 2, padding: '11px', borderRadius: '10px',
                    color: '#fff', fontWeight: 700, fontSize: '14px',
                  }}
                >
                  {purchased[cityData.city] ? 'View Full List' : 'Buy Full Stack — $14'}
                </button>
                <button
                  style={{
                    flex: 1, padding: '11px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid #1e1e2e',
                    color: '#94a3b8', cursor: 'pointer', fontWeight: 600, fontSize: '13px',
                    transition: 'all 0.2s',
                  }}
                >
                  Custom
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Business CTAs */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(6,182,212,0.07))', border: '1px solid rgba(139,92,246,0.25)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>💼</div>
            <h3 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '16px', margin: '0 0 8px' }}>Need a full renovation team?</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, margin: '0 0 16px' }}>
              Our curated contractor lists save you 10+ hours of calling around. One purchase, 14 vetted pros ready to go.
            </p>
            <button onClick={() => { const first = filteredCities[0]; if (first) openModal(first); }} className="gradient-btn" style={{ padding: '10px 20px', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer' }}>
              Get My City's List →
            </button>
          </div>
          <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '16px', padding: '24px' }}>
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>🏗️</div>
            <h3 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '16px', margin: '0 0 8px' }}>Are you a contractor?</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, margin: '0 0 16px' }}>
              Get in front of active real estate investors in your area. List your services free and get direct leads.
            </p>
            <button style={{ padding: '10px 20px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid #1e1e2e', color: '#94a3b8', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
              List Your Services Free →
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && modalCity && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            background: '#12121e', border: '1px solid #1e1e2e',
            borderRadius: '20px', width: '100%', maxWidth: '700px',
            maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
          }}>
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #1e1e2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div>
                <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '20px', margin: 0 }}>
                  Full Stack List — {modalCity.city}, {modalCity.state}
                </h2>
                <p style={{ color: '#94a3b8', margin: '4px 0 0', fontSize: '14px' }}>
                  {modalCity.contractorCount} vetted contractors across 7 trades
                </p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
              {modalCity.contractors && modalCity.contractors.length > 0 ? (
                <div>
                  {/* Purchase CTA if not purchased */}
                  {!purchased[modalCity.city] && (
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(6, 182, 212, 0.08))',
                      border: '1px solid rgba(139, 92, 246, 0.25)',
                      borderRadius: '14px', padding: '20px',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      marginBottom: '24px', flexWrap: 'wrap', gap: '16px',
                    }}>
                      <div>
                        <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: '18px', marginBottom: '4px' }}>
                          Unlock Full List — $14.00
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '14px' }}>
                          14 contractors • All trades • Phone numbers revealed
                        </div>
                      </div>
                      <button
                        onClick={() => handlePurchase(modalCity.city)}
                        className="gradient-btn"
                        style={{
                          padding: '12px 24px', borderRadius: '12px',
                          color: '#fff', fontWeight: 800, fontSize: '16px',
                          display: 'flex', alignItems: 'center', gap: '8px',
                        }}
                      >
                        <DollarSign size={18} />
                        Unlock Full List — $14
                      </button>
                    </div>
                  )}

                  {purchased[modalCity.city] && (
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)',
                      borderRadius: '12px', padding: '14px 18px',
                      display: 'flex', alignItems: 'center', gap: '10px',
                      marginBottom: '20px',
                    }}>
                      <CheckCircle size={20} style={{ color: '#10b981' }} />
                      <div>
                        <div style={{ color: '#10b981', fontWeight: 700 }}>Access Granted!</div>
                        <div style={{ color: '#94a3b8', fontSize: '13px' }}>All phone numbers are now revealed for {modalCity.city}</div>
                      </div>
                    </div>
                  )}

                  {/* Group by trade */}
                  {tradeTypes.map((trade, tradeIdx) => {
                    const tradeContractors = modalCity.contractors.filter(c => c.trade === trade);
                    if (!tradeContractors.length) return null;
                    return (
                      <div key={trade} style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: Object.values({ 'HVAC': '#06b6d4', 'Plumbing': '#3b82f6', 'Electrical': '#f59e0b', 'Painting/Cosmetic': '#ec4899', 'Flooring': '#8b5cf6', 'Roofing': '#ef4444', 'Foundation/Structural': '#10b981' })[tradeIdx] }} />
                          <h4 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '15px', margin: 0 }}>{trade}</h4>
                          <span style={{ color: '#475569', fontSize: '13px' }}>({tradeContractors.length} contractors)</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {tradeContractors.map(c => (
                            <ContractorCard key={c.id} contractor={c} revealed={revealed[modalCity.city] || false} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <Wrench size={48} style={{ color: '#8b5cf6', marginBottom: '16px' }} />
                  <h3 style={{ color: '#f8fafc', fontWeight: 700, marginBottom: '8px' }}>
                    Contractor List Coming Soon
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>
                    We're currently vetting contractors in {modalCity.city}. Join our waitlist to be notified when this market launches.
                  </p>
                  <button className="gradient-btn" style={{ padding: '12px 24px', borderRadius: '10px', color: '#fff', fontWeight: 700 }}>
                    Join Waitlist — Notify Me
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
