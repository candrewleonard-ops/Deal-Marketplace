import { useState } from 'react';
import { Heart, Crown, Eye, Home, Maximize2, Calendar } from 'lucide-react';

const dealTypeLabels = {
  'fix-flip': 'Fix & Flip',
  'rental': 'Rental',
  'creative': 'Creative',
  'commercial': 'Commercial',
  'land': 'Land',
};

const dealTypeBadgeClass = {
  'fix-flip': 'badge-fix-flip',
  'rental': 'badge-rental',
  'creative': 'badge-creative',
  'commercial': 'badge-commercial',
  'land': 'badge-land',
};

function formatCurrency(n) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}k`;
  return `$${n}`;
}

// Blur house number / any leading digits — leave descriptor words visible
function blurTitle(title) {
  if (!title) return '****';
  // Replace leading numbers (e.g. "2847 Peachtree Rd" → "**** Peachtree Rd")
  return title.replace(/^\d+\s*/, '**** ').trim();
}

function CardContent({ deal, saved, setSaved }) {
  function openDeal(e) {
    e.preventDefault();
    window.open(`/marketplace/${deal.id}`, '_blank', 'noopener,noreferrer');
  }

  return (
    <>
      {/* Clickable image → opens deal in new tab */}
      <div
        onClick={openDeal}
        style={{ position: 'relative', overflow: 'hidden', height: '200px', cursor: 'pointer' }}
      >
        <img
          src={deal.images[0]}
          alt={deal.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.35s ease' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          onError={e => { e.target.src = `https://picsum.photos/seed/fallback${deal.id}/800/600`; }}
        />

        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,15,0.8) 0%, transparent 60%)', pointerEvents: 'none' }} />

        {/* Featured badge */}
        {deal.isFeatured && (
          <div style={{
            position: 'absolute', top: '12px', left: '12px',
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'rgba(0,0,0,0.8)', borderRadius: '20px',
            padding: '4px 10px', backdropFilter: 'blur(8px)',
          }}>
            <Crown size={14} style={{ color: '#f59e0b' }} />
            <span className="shimmer-badge" style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.5px' }}>
              FEATURED
            </span>
          </div>
        )}

        {/* Sponsored badge */}
        {deal.isSponsored && !deal.isFeatured && (
          <div className="sponsored-badge" style={{
            position: 'absolute', top: '12px', left: '12px',
            background: 'rgba(139, 92, 246, 0.85)', borderRadius: '20px',
            padding: '3px 10px', backdropFilter: 'blur(8px)',
          }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#fff', letterSpacing: '0.5px' }}>SPONSORED</span>
          </div>
        )}

        {/* Under contract badge */}
        {deal.status === 'under contract' && (
          <div style={{
            position: 'absolute', top: '12px', right: deal.isSponsored ? '44px' : '12px',
            background: 'rgba(239, 68, 68, 0.85)', borderRadius: '20px', padding: '3px 10px',
          }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#fff' }}>UNDER CONTRACT</span>
          </div>
        )}

        {/* Heart button — stops propagation so click doesn't open deal page */}
        <button
          onClick={e => { e.stopPropagation(); setSaved(!saved); }}
          style={{
            position: 'absolute', top: '12px', right: '12px',
            background: saved ? 'rgba(239,68,68,0.9)' : 'rgba(0,0,0,0.6)',
            border: 'none', borderRadius: '50%', width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'all 0.2s',
            zIndex: 2,
          }}
        >
          <Heart size={14} fill={saved ? '#fff' : 'none'} style={{ color: saved ? '#fff' : '#f8fafc' }} />
        </button>

        {/* Deal type badge */}
        <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
          <span className={dealTypeBadgeClass[deal.dealType]} style={{ borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: 700 }}>
            {dealTypeLabels[deal.dealType]}
          </span>
        </div>

        {/* Days listed */}
        <div style={{ position: 'absolute', bottom: '12px', right: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Calendar size={11} style={{ color: '#94a3b8' }} />
          <span style={{ color: '#94a3b8', fontSize: '11px' }}>{deal.daysListed}d listed</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div>
            <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 500 }}>LISTING PRICE</span>
            <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: '24px', lineHeight: 1 }}>
              {formatCurrency(deal.listingPrice || deal.price)}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 500 }}>POTENTIAL PROFIT</span>
            <div style={{ color: '#10b981', fontWeight: 700, fontSize: '16px', lineHeight: 1.2 }}>
              +{formatCurrency(deal.potentialProfit)}
            </div>
          </div>
        </div>

        {/* Blurred title + city/state (no zip) */}
        <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 2px', fontFamily: 'monospace', letterSpacing: '0.5px' }}>
          {blurTitle(deal.address)}
        </p>
        <p style={{ color: '#f8fafc', fontWeight: 700, fontSize: '14px', margin: '0 0 12px' }} className="line-clamp-1">
          {deal.city}, {deal.state}
        </p>

        {/* Stats row */}
        {deal.dealType !== 'land' && deal.dealType !== 'commercial' && (
          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Home size={13} style={{ color: '#94a3b8' }} />
              <span style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 500 }}>{deal.beds}bd</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>🛁</span>
              <span style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 500 }}>{deal.baths}ba</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Maximize2 size={13} style={{ color: '#94a3b8' }} />
              <span style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 500 }}>{deal.sqft?.toLocaleString()} sqft</span>
            </div>
            {deal.yearBuilt && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={13} style={{ color: '#94a3b8' }} />
                <span style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 500 }}>{deal.yearBuilt}</span>
              </div>
            )}
          </div>
        )}

        {/* ARV / Repair Cost */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
          <div style={{
            flex: 1, background: 'rgba(16, 185, 129, 0.08)', borderRadius: '8px',
            padding: '8px', border: '1px solid rgba(16, 185, 129, 0.15)',
          }}>
            <div style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 600, marginBottom: '2px' }}>ARV</div>
            <div style={{ color: '#10b981', fontWeight: 700, fontSize: '14px' }}>{formatCurrency(deal.arv)}</div>
          </div>
          {deal.repairCost > 0 && (
            <div style={{
              flex: 1, background: 'rgba(239, 68, 68, 0.08)', borderRadius: '8px',
              padding: '8px', border: '1px solid rgba(239, 68, 68, 0.15)',
            }}>
              <div style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 600, marginBottom: '2px' }}>REPAIRS</div>
              <div style={{ color: '#ef4444', fontWeight: 700, fontSize: '14px' }}>{formatCurrency(deal.repairCost)}</div>
            </div>
          )}
        </div>

        {/* Seller */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '12px', borderTop: '1px solid #1e1e2e' }}>
          <img
            src={deal.sellerAvatar}
            alt={deal.sellerName}
            style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: '#f8fafc', fontSize: '12px', fontWeight: 600, margin: 0 }}>{deal.sellerName}</p>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {deal.tags.slice(0, 2).map(tag => (
                <span key={tag} style={{
                  background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6',
                  borderRadius: '20px', padding: '1px 6px', fontSize: '10px', fontWeight: 600,
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          {/* View Deal button only */}
          <button
            onClick={openDeal}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 12px',
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              border: 'none', borderRadius: '8px',
              color: '#fff', fontWeight: 600, fontSize: '13px',
              cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}
          >
            <Eye size={13} />
            View Deal
          </button>
        </div>
      </div>
    </>
  );
}

export default function DealCard({ deal }) {
  const [saved, setSaved] = useState(false);

  if (deal.isFeatured) {
    return (
      <div className="featured-card" style={{ borderRadius: '14px' }}>
        <div className="featured-card-inner card-hover" style={{ height: '100%' }}>
          <CardContent deal={deal} saved={saved} setSaved={setSaved} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="card-hover"
      style={{
        background: '#12121e',
        border: deal.isSponsored ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid #1e1e2e',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'all 0.2s',
      }}
    >
      <CardContent deal={deal} saved={saved} setSaved={setSaved} />
    </div>
  );
}
