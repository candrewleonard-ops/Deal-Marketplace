import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search, Wrench, MapPin, Star, Phone, Shield, X, ChevronRight,
} from 'lucide-react';
import { contractorCities, tradeTypes } from '../data/contractors';
import { useIsMobile } from '../hooks/useIsMobile';
import { getDealById } from '../data/deals';

const tradeColors = {
  'HVAC': '#06b6d4',
  'Plumbing': '#3b82f6',
  'Electrical': '#f59e0b',
  'Painting/Cosmetic': '#ec4899',
  'Flooring': '#8b5cf6',
  'Roofing': '#ef4444',
  'Foundation/Structural': '#10b981',
};

export default function Contractors() {
  const isMobile = useIsMobile();
  const [params] = useSearchParams();

  // Deal context: if user came from a deal page we filter to that city
  const dealId = params.get('dealId');
  const cityParam = params.get('city');
  const stateParam = params.get('state');
  const deal = dealId ? getDealById(dealId) : null;
  const contextCity = cityParam || deal?.city || '';
  const contextState = stateParam || deal?.state || '';

  const [search, setSearch] = useState('');
  const [tradeFilter, setTradeFilter] = useState('All');
  const [cityFilter, setCityFilter] = useState(contextCity);

  // Build the flat searchable list of all contractors
  const allContractors = useMemo(() => {
    const out = [];
    for (const c of contractorCities) {
      for (const con of c.contractors) {
        out.push({ ...con, city: c.city, state: c.state });
      }
    }
    return out;
  }, []);

  const filteredContractors = useMemo(() => {
    return allContractors.filter(c => {
      if (tradeFilter !== 'All' && c.trade !== tradeFilter) return false;
      if (cityFilter && c.city.toLowerCase() !== cityFilter.toLowerCase()) return false;
      if (search) {
        const q = search.toLowerCase();
        const hit =
          c.name.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q) ||
          c.trade.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.state.toLowerCase().includes(q);
        if (!hit) return false;
      }
      return true;
    });
  }, [allContractors, tradeFilter, cityFilter, search]);

  // Group contractors by city for cleaner display when no specific city is selected
  const grouped = useMemo(() => {
    if (cityFilter) return null;
    const map = new Map();
    for (const c of filteredContractors) {
      const key = `${c.city}, ${c.state}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(c);
    }
    return [...map.entries()].sort((a, b) => b[1].length - a[1].length);
  }, [filteredContractors, cityFilter]);

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', paddingBottom: isMobile ? 24 : 60 }}>
      {/* ── Hero ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139,92,246,0.18), rgba(6,182,212,0.10)), #0d0d1a',
        borderBottom: '1px solid #1e1e2e',
        padding: isMobile ? '24px 16px 20px' : '48px 24px 32px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative orb */}
        <div style={{
          position: 'absolute', top: '-30%', right: '-10%',
          width: 360, height: 360, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
          {contextCity && (
            <Link
              to="/contractors"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,0.04)', border: '1px solid #1e1e2e',
                borderRadius: 20, padding: '5px 12px 5px 8px',
                color: '#94a3b8', textDecoration: 'none', fontSize: 12, fontWeight: 700,
                marginBottom: 14,
              }}
            >
              <X size={12} /> Showing contractors near {contextCity}{contextState ? `, ${contextState}` : ''}
            </Link>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{
              width: isMobile ? 44 : 56, height: isMobile ? 44 : 56, borderRadius: 14,
              background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 12px 28px rgba(139,92,246,0.4)',
            }}>
              <Wrench size={isMobile ? 22 : 28} color="#fff" />
            </div>
            <div>
              <h1 style={{
                color: '#f8fafc', fontWeight: 900,
                fontSize: isMobile ? 22 : 32,
                margin: 0, letterSpacing: '-0.5px',
              }}>
                <span className="gradient-text">Contractor</span> Marketplace
              </h1>
              <p style={{ color: '#94a3b8', margin: '2px 0 0', fontSize: isMobile ? 13 : 14 }}>
                Vetted local contractors — call or message directly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search + filters ── */}
      <div style={{
        position: 'sticky',
        top: isMobile ? 56 : 64,
        zIndex: 20,
        background: 'rgba(10,10,15,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid #1e1e2e',
        padding: isMobile ? '12px 14px' : '16px 24px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ position: 'relative', marginBottom: 10 }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8b5cf6' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by trade, company, name, or city…"
              className="input-dark"
              style={{
                width: '100%', padding: '11px 14px 11px 38px',
                borderRadius: 12, fontSize: 14,
              }}
            />
          </div>
          {/* Trade filter chips — horizontal scroll on mobile */}
          <div style={{
            display: 'flex', gap: 6, overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            paddingBottom: 2,
          }}>
            <Chip
              active={tradeFilter === 'All'}
              onClick={() => setTradeFilter('All')}
              color="#a78bfa"
            >
              All trades
            </Chip>
            {tradeTypes.map(trade => (
              <Chip
                key={trade}
                active={tradeFilter === trade}
                onClick={() => setTradeFilter(tradeFilter === trade ? 'All' : trade)}
                color={tradeColors[trade] || '#8b5cf6'}
              >
                {trade}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '16px 14px 0' : '24px 24px 0' }}>
        <div style={{ color: '#94a3b8', fontSize: 13, marginBottom: 14 }}>
          <span style={{ color: '#a78bfa', fontWeight: 700 }}>{filteredContractors.length}</span> contractor{filteredContractors.length !== 1 ? 's' : ''}
          {cityFilter && <span> in {cityFilter}</span>}
          {tradeFilter !== 'All' && <span> · {tradeFilter}</span>}
        </div>

        {filteredContractors.length === 0 ? (
          <EmptyState />
        ) : grouped ? (
          // No specific city: show by city, biggest markets first
          grouped.map(([cityKey, list]) => (
            <CitySection
              key={cityKey}
              cityKey={cityKey}
              contractors={list}
              isMobile={isMobile}
              onShowCity={() => setCityFilter(cityKey.split(',')[0].trim())}
            />
          ))
        ) : (
          // Specific city selected: flat grid
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: isMobile ? 12 : 16,
          }}>
            {filteredContractors.map(c => (
              <ContractorRow key={c.id} c={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ active, onClick, color, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '7px 14px',
        borderRadius: 999,
        background: active ? `${color}20` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${active ? color : '#1e1e2e'}`,
        color: active ? color : '#94a3b8',
        cursor: 'pointer',
        fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
        flexShrink: 0,
        transition: 'all 0.15s',
      }}
    >
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
      {children}
    </button>
  );
}

function CitySection({ cityKey, contractors, isMobile, onShowCity }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 12,
      }}>
        <h2 style={{
          color: '#f8fafc', fontWeight: 800, fontSize: isMobile ? 18 : 20,
          margin: 0, letterSpacing: '-0.3px',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <MapPin size={16} style={{ color: '#8b5cf6' }} />
          {cityKey}
          <span style={{
            background: 'rgba(139,92,246,0.12)', color: '#a78bfa',
            borderRadius: 999, padding: '2px 10px', fontSize: 11, fontWeight: 800,
            letterSpacing: 0.3,
          }}>
            {contractors.length}
          </span>
        </h2>
        <button
          onClick={onShowCity}
          style={{
            background: 'none', border: 'none', color: '#a78bfa',
            cursor: 'pointer', fontWeight: 700, fontSize: 13,
            display: 'flex', alignItems: 'center', gap: 3,
          }}
        >
          View all <ChevronRight size={14} />
        </button>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: isMobile ? 12 : 16,
      }}>
        {contractors.slice(0, isMobile ? 4 : 6).map(c => (
          <ContractorRow key={c.id} c={c} />
        ))}
      </div>
    </section>
  );
}

function ContractorRow({ c }) {
  const color = tradeColors[c.trade] || '#8b5cf6';
  const initials = c.company
    ? c.company.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
    : c.name.split(' ').map(w => w[0]).slice(0, 2).join('');

  return (
    <div style={{
      background: '#12121e', border: '1px solid #1e1e2e',
      borderRadius: 14, padding: 14,
      transition: 'border-color 0.15s, transform 0.15s',
      WebkitTapHighlightColor: 'transparent',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        {/* Avatar/initials */}
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: `linear-gradient(135deg, ${color}, ${color}aa)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 900, fontSize: 16,
          flexShrink: 0,
          boxShadow: `0 6px 16px ${color}30`,
        }}>
          {initials}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: 15, lineHeight: 1.2, marginBottom: 2 }}>
            {c.company || c.name}
          </div>
          {c.company && c.name && (
            <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 4 }}>{c.name}</div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
            <span style={{
              background: `${color}15`, color, border: `1px solid ${color}35`,
              borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700,
            }}>{c.trade}</span>
            <span style={{
              background: 'rgba(255,255,255,0.04)', color: '#94a3b8',
              border: '1px solid #1e1e2e', borderRadius: 6,
              padding: '2px 8px', fontSize: 11, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 3,
            }}>
              <MapPin size={10} />{c.city}, {c.state}
            </span>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex', gap: 12, marginTop: 10, alignItems: 'center',
            color: '#94a3b8', fontSize: 12,
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Star size={11} fill="#f59e0b" style={{ color: '#f59e0b' }} />
              <strong style={{ color: '#f8fafc' }}>{c.rating}</strong> ({c.reviewCount})
            </span>
            <span style={{ color: '#475569' }}>·</span>
            <span>{c.yearsExp} yrs exp</span>
            {(c.licensed || c.insured) && (
              <>
                <span style={{ color: '#475569' }}>·</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#10b981' }}>
                  <Shield size={11} />
                  {[c.licensed && 'Lic', c.insured && 'Ins'].filter(Boolean).join('/')}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <a
          href={`tel:${c.phone.replace(/\D/g, '')}`}
          className="gradient-btn"
          style={{
            flex: 1, padding: '10px', borderRadius: 9,
            color: '#fff', fontWeight: 800, fontSize: 13,
            textDecoration: 'none', textAlign: 'center',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          <Phone size={14} /> Call {c.phone}
        </a>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{
      background: '#12121e', border: '1px solid #1e1e2e',
      borderRadius: 16, padding: '40px 20px', textAlign: 'center',
    }}>
      <Wrench size={36} style={{ color: '#475569', opacity: 0.6, marginBottom: 14 }} />
      <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>
        No contractors match those filters
      </div>
      <div style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>
        Try clearing the trade filter or searching a different city.
      </div>
    </div>
  );
}
