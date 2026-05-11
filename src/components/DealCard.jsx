import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Crown, Eye, Bed, Bath, Maximize2, Calendar, Lock, MapPin } from 'lucide-react';
import { useSavedDeals } from '../hooks/useSavedDeals';
import { useAuth } from '../context/AuthContext';

const DEAL_TYPE_LABELS = {
  'fix-flip': 'Fix & Flip',
  'rental': 'Rental',
  'creative': 'Creative Finance',
  'commercial': 'Commercial',
  'land': 'Land',
};

const DEAL_TYPE_COLORS = {
  'fix-flip':   { bg: 'rgba(239,68,68,0.92)',   text: '#fff' },
  'rental':     { bg: 'rgba(16,185,129,0.92)',  text: '#fff' },
  'creative':   { bg: 'rgba(245,158,11,0.92)',  text: '#fff' },
  'commercial': { bg: 'rgba(6,182,212,0.92)',   text: '#fff' },
  'land':       { bg: 'rgba(139,92,246,0.92)',  text: '#fff' },
};

function fmt(n) {
  if (!n) return '$0';
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}k`;
  return `$${n}`;
}

function blurStreetNumber(address) {
  if (!address) return '****';
  return address.replace(/^\d+\s*/, '**** ').trim();
}

export default function DealCard({ deal }) {
  const [hovered, setHovered] = useState(false);
  const { isSaved, toggle: toggleSaved } = useSavedDeals();
  const { isAuthenticated, requireAuth } = useAuth();
  const navigate = useNavigate();
  const saved = isSaved(deal.id);
  const typeColor = DEAL_TYPE_COLORS[deal.dealType] || DEAL_TYPE_COLORS['fix-flip'];

  function openDeal(e) {
    if (e) e.preventDefault();
    if (!requireAuth(`view this property in ${deal.city || 'the marketplace'}`, 'open-deal', `/marketplace/${deal.id}`)) {
      return; // auth modal will show
    }
    navigate(`/marketplace/${deal.id}`);
  }

  function handleSaveClick(e) {
    e.stopPropagation();
    if (!requireAuth('save deals to your collection', 'save', `/marketplace/${deal.id}`)) return;
    toggleSaved(deal.id);
  }

  const cardStyle = {
    background: '#12121e',
    border: deal.isFeatured
      ? 'none'
      : deal.isSponsored
        ? '1px solid rgba(139,92,246,0.25)'
        : '1px solid #1e1e2e',
    borderRadius: '16px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.25s cubic-bezier(.2,.9,.3,1), box-shadow 0.25s ease, border-color 0.2s ease',
    transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
    boxShadow: hovered
      ? '0 16px 50px rgba(0,0,0,0.55), 0 0 0 1px rgba(139,92,246,0.18)'
      : '0 2px 12px rgba(0,0,0,0.25)',
    position: 'relative',
    WebkitTapHighlightColor: 'transparent',
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`View ${deal.city} deal — ${fmt(deal.listingPrice || deal.price)}`}
      onClick={openDeal}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openDeal(e); }}
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Photo ── */}
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        <img
          src={deal.images?.[0]}
          alt="Property"
          loading="lazy"
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.5s cubic-bezier(.2,.9,.3,1)',
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
          }}
          onError={e => { e.target.src = `https://picsum.photos/seed/fb${deal.id}/800/600`; }}
        />

        {/* bottom gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,15,0.78) 0%, transparent 55%)', pointerEvents: 'none' }} />

        {/* Sign-up overlay shown to guests on hover (desktop) — gives a hint that clicking will prompt */}
        {!isAuthenticated && hovered && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 8,
              background: 'linear-gradient(180deg, rgba(10,10,15,0.55) 0%, rgba(10,10,15,0.75) 100%)',
              backdropFilter: 'blur(2px)',
              transition: 'opacity 0.2s ease',
              pointerEvents: 'none',
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'rgba(139,92,246,0.95)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(139,92,246,0.5)',
            }}>
              <Lock size={20} color="#fff" />
            </div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 14, letterSpacing: 0.2 }}>
              Sign up to view
            </div>
          </div>
        )}

        {/* Deal type chip — top left */}
        <div style={{
          position: 'absolute', top: '12px', left: '12px',
          background: typeColor.bg, color: typeColor.text,
          borderRadius: '6px', padding: '3px 9px',
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.3px',
          backdropFilter: 'blur(4px)',
        }}>
          {DEAL_TYPE_LABELS[deal.dealType]}
        </div>

        {/* Featured crown — top left, alongside deal type if present */}
        {deal.isFeatured && (
          <div style={{
            position: 'absolute', top: '12px', left: '12px',
            display: 'flex', alignItems: 'center', gap: '5px',
            background: 'rgba(0,0,0,0.75)', borderRadius: '20px',
            padding: '4px 10px', backdropFilter: 'blur(8px)',
          }}>
            <Crown size={13} style={{ color: '#f59e0b' }} />
            <span className="shimmer-badge" style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px' }}>FEATURED</span>
          </div>
        )}

        {/* Sponsored chip — below featured or deal type */}
        {deal.isSponsored && !deal.isFeatured && (
          <div className="sponsored-badge" style={{
            position: 'absolute', top: '12px', left: '90px',
            background: 'rgba(139,92,246,0.85)', borderRadius: '6px',
            padding: '3px 9px', backdropFilter: 'blur(4px)',
          }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#fff' }}>Sponsored</span>
          </div>
        )}

        {/* Save heart — top right */}
        <button
          onClick={handleSaveClick}
          aria-label={saved ? 'Unsave deal' : 'Save deal'}
          style={{
            position: 'absolute', top: '10px', right: '10px',
            width: '38px', height: '38px', borderRadius: '50%',
            background: 'rgba(10,10,15,0.7)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', backdropFilter: 'blur(6px)',
            transition: 'background 0.15s, transform 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <Heart
            size={16}
            fill={saved ? '#ef4444' : 'none'}
            style={{ color: saved ? '#ef4444' : '#f8fafc' }}
          />
        </button>

        {/* Under contract ribbon */}
        {deal.status === 'under contract' && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'rgba(239,68,68,0.9)', textAlign: 'center',
            padding: '5px', fontSize: '11px', fontWeight: 700, color: '#fff',
            letterSpacing: '0.5px',
          }}>
            UNDER CONTRACT
          </div>
        )}

        {/* Days listed — bottom right */}
        {deal.status !== 'under contract' && (
          <div style={{
            position: 'absolute', bottom: '10px', right: '10px',
            background: 'rgba(10,10,15,0.72)', borderRadius: '5px',
            padding: '2px 8px', fontSize: '11px', color: '#cbd5e1', backdropFilter: 'blur(4px)',
          }}>
            {deal.daysListed}d listed
          </div>
        )}
      </div>

      {/* ── Info panel ── */}
      <div style={{ padding: '14px 16px 16px' }}>
        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: '22px', lineHeight: 1, letterSpacing: '-0.5px' }}>
            {fmt(deal.listingPrice || deal.price)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ color: '#475569', fontSize: '11px' }}>ARV</span>
            <span style={{ color: '#10b981', fontWeight: 700, fontSize: '13px' }}>{fmt(deal.arv)}</span>
          </div>
        </div>

        {/* Blurred address line */}
        <div style={{ color: '#64748b', fontSize: '12px', fontFamily: 'monospace', marginBottom: '2px' }}>
          {blurStreetNumber(deal.address)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#94a3b8', fontSize: '13px', fontWeight: 600, marginBottom: '10px' }}>
          <MapPin size={11} style={{ color: '#8b5cf6' }} />
          {deal.city}, {deal.state}
        </div>

        {/* Beds / Baths / Sqft / Year */}
        {deal.dealType !== 'land' && deal.dealType !== 'commercial' && (
          <div style={{
            display: 'flex', gap: '0', marginBottom: '12px',
            background: '#0f0f18', borderRadius: '8px', overflow: 'hidden',
            border: '1px solid #1e1e2e',
          }}>
            {[
              { icon: Bed, val: `${deal.beds} bd` },
              { icon: Bath, val: `${deal.baths} ba` },
              { icon: Maximize2, val: `${(deal.sqft || 0).toLocaleString()} ft²` },
              ...(deal.yearBuilt ? [{ icon: Calendar, val: `${deal.yearBuilt}` }] : []),
            ].map(({ icon: Icon, val }, i, arr) => (
              <div key={i} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '4px', padding: '8px 4px',
                borderRight: i < arr.length - 1 ? '1px solid #1e1e2e' : 'none',
              }}>
                <Icon size={11} style={{ color: '#8b5cf6', flexShrink: 0 }} />
                <span style={{ color: '#cbd5e1', fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap' }}>{val}</span>
              </div>
            ))}
          </div>
        )}

        {/* Repair cost chip (only if relevant) */}
        {deal.repairCost > 0 && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span style={{
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
              borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: 600,
              color: '#ef4444',
            }}>
              Est. Repairs: {fmt(deal.repairCost)}
            </span>
            {deal.potentialProfit > 0 && (
              <span style={{
                background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)',
                borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: 600,
                color: '#10b981',
              }}>
                +{fmt(deal.potentialProfit)} profit
              </span>
            )}
          </div>
        )}

        {/* Divider */}
        <div style={{ height: '1px', background: '#1e1e2e', marginBottom: '12px' }} />

        {/* Seller + View */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src={deal.sellerAvatar}
            alt={deal.sellerName}
            style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1.5px solid #1e1e2e' }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#f8fafc', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {deal.sellerName}
            </div>
            <div style={{ display: 'flex', gap: '3px' }}>
              {deal.tags?.slice(0, 2).map(t => (
                <span key={t} style={{ color: '#8b5cf6', fontSize: '10px', fontWeight: 600 }}>#{t.replace(/\s/g,'')}</span>
              ))}
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); openDeal(e); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '8px 14px', borderRadius: '9px',
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              border: 'none', color: '#fff', fontWeight: 700, fontSize: '12px',
              cursor: 'pointer', flexShrink: 0,
              transition: 'opacity 0.15s, transform 0.15s',
              boxShadow: '0 4px 14px rgba(139,92,246,0.35)',
            }}
          >
            {isAuthenticated ? <Eye size={12} /> : <Lock size={12} />}
            {isAuthenticated ? 'View' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}
