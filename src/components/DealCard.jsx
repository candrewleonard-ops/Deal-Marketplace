import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Crown, Eye, Bed, Bath, Maximize2, Calendar, Lock, MapPin, TrendingUp } from 'lucide-react';
import { useSavedDeals } from '../hooks/useSavedDeals';
import { toggleHeart } from '../lib/engagement';
import { useAuth } from '../context/AuthContext';
import { dealPath } from '../utils/slug';
import { useIsMobile } from '../hooks/useIsMobile';

const DEAL_TYPE_LABELS = {
  'fix-flip': 'Fix & Flip',
  'rental': 'Rental',
  'creative': 'Creative',
  'commercial': 'Commercial',
  'land': 'Land',
};

const DEAL_TYPE_COLORS = {
  'fix-flip':   { bg: 'rgba(239,68,68,0.95)',   text: '#fff' },
  'rental':     { bg: 'rgba(16,185,129,0.95)',  text: '#fff' },
  'creative':   { bg: 'rgba(245,158,11,0.95)',  text: '#fff' },
  'commercial': { bg: 'rgba(0, 229, 160,0.95)',   text: '#fff' },
  'land':       { bg: 'rgba(0, 200, 5,0.95)',  text: '#fff' },
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

export default function DealCard({ deal, stats }) {
  const [hovered, setHovered] = useState(false);
  const { isSaved, toggle: toggleSaved } = useSavedDeals();
  const { isAuthenticated, requireAuth, currentUser } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const saved = isSaved(deal.id);
  const typeColor = DEAL_TYPE_COLORS[deal.dealType] || DEAL_TYPE_COLORS['fix-flip'];

  function openDeal(e) {
    if (e) e.preventDefault();
    if (!requireAuth(`view this property in ${deal.city || 'the marketplace'}`, 'open-deal', dealPath(deal))) {
      return;
    }
    navigate(dealPath(deal));
  }

  function handleSaveClick(e) {
    e.stopPropagation();
    if (!requireAuth('save deals to your collection', 'save', dealPath(deal))) return;
    toggleSaved(deal.id);
    // Also record it as a public heart so sellers see real demand.
    toggleHeart(deal.id, currentUser).catch(() => {});
  }

  // ─── Mobile layout: bigger image, profit-first card ───
  if (isMobile) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={openDeal}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openDeal(e); }}
        style={{
          background: '#131614',
          border: '1px solid #232925',
          borderRadius: 18,
          overflow: 'hidden',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
          transition: 'transform 0.12s ease, box-shadow 0.2s ease',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        }}
        onTouchStart={(e) => { e.currentTarget.style.transform = 'scale(0.985)'; }}
        onTouchEnd={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        {/* Big edge-to-edge photo */}
        <div style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
          <img
            src={deal.images?.[0]}
            alt="Property"
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.target.src = `https://picsum.photos/seed/fb${deal.id}/800/600`; }}
          />

          {/* Top gradient for chips */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 80,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.45), transparent)',
            pointerEvents: 'none',
          }} />

          {/* Deal type chip */}
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: typeColor.bg, color: typeColor.text,
            borderRadius: 8, padding: '5px 10px',
            fontSize: 11, fontWeight: 800, letterSpacing: 0.3,
            backdropFilter: 'blur(8px)',
          }}>
            {DEAL_TYPE_LABELS[deal.dealType]}
          </div>

          {deal.isFeatured && (
            <div style={{
              position: 'absolute', top: 12, left: 100,
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'rgba(0,0,0,0.7)', borderRadius: 20,
              padding: '4px 10px', backdropFilter: 'blur(8px)',
            }}>
              <Crown size={12} style={{ color: '#f59e0b' }} />
              <span className="shimmer-badge" style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.5 }}>FEATURED</span>
            </div>
          )}

          {/* Save heart */}
          <button
            onClick={handleSaveClick}
            aria-label={saved ? 'Unsave deal' : 'Save deal'}
            style={{
              position: 'absolute', top: 10, right: 10,
              width: 42, height: 42, borderRadius: '50%',
              background: 'rgba(10, 11, 10,0.7)', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', backdropFilter: 'blur(8px)',
            }}
          >
            <Heart size={18} fill={saved ? '#ef4444' : 'none'} style={{ color: saved ? '#ef4444' : '#f8fafc' }} />
          </button>


          {stats && (stats.views > 0 || stats.hearts > 0) && (
            <div style={{
              position: 'absolute', bottom: 10, left: 10,
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(6,8,6,0.72)', backdropFilter: 'blur(6px)',
              borderRadius: 999, padding: '4px 11px',
              color: '#e4eae6', fontSize: 11, fontWeight: 800,
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Eye size={11} style={{ color: '#00e5a0' }} /> {stats.views || 0}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Heart size={11} fill="#ef4444" style={{ color: '#ef4444' }} /> {stats.hearts || 0}
              </span>
            </div>
          )}

          {/* Sign-up overlay for guests */}
          {!isAuthenticated && (
            <div
              style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(to top, rgba(0, 200, 5,0.85), rgba(0, 200, 5,0))',
                padding: '24px 12px 10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                pointerEvents: 'none',
              }}
            >
              <Lock size={12} color="#fff" />
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: 0.3 }}>
                Tap to sign up & view
              </span>
            </div>
          )}

          {deal.status === 'under contract' && (
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'rgba(239,68,68,0.92)', textAlign: 'center',
              padding: 6, fontSize: 11, fontWeight: 800, color: '#fff',
              letterSpacing: 0.6,
            }}>
              UNDER CONTRACT
            </div>
          )}
        </div>

        {/* Info block */}
        <div style={{ padding: 16 }}>
          {/* Price + ARV row */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
            <div>
              <div style={{ color: '#707d75', fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>Ask</div>
              <div style={{ color: '#f8fafc', fontWeight: 900, fontSize: 24, lineHeight: 1, letterSpacing: '-0.5px' }}>
                {fmt(deal.listingPrice || deal.price)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#707d75', fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>ARV</div>
              <div style={{ color: '#10b981', fontWeight: 800, fontSize: 18, lineHeight: 1 }}>{fmt(deal.arv)}</div>
            </div>
          </div>

          {/* Address */}
          <div style={{ marginTop: 10, marginBottom: 12 }}>
            <div style={{ color: '#707d75', fontSize: 12, fontFamily: 'monospace' }}>
              {blurStreetNumber(deal.address)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#cdd6d0', fontSize: 14, fontWeight: 600, marginTop: 2 }}>
              <MapPin size={12} style={{ color: '#00c805' }} />
              {deal.city}, {deal.state}
            </div>
          </div>

          {/* ARV / repairs factual strip (no profit claims) */}
          {(deal.arv > 0 || deal.repairCost > 0) && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.10), rgba(16,185,129,0.03))',
              border: '1px solid rgba(16,185,129,0.22)',
              borderRadius: 12,
              padding: '10px 12px',
              display: 'flex', alignItems: 'center', gap: 10,
              marginBottom: 12,
            }}>
              <TrendingUp size={18} style={{ color: '#10b981' }} />
              <div style={{ flex: 1 }}>
                <div style={{ color: '#707d75', fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>ARV (seller-reported)</div>
                <div style={{ color: '#10b981', fontWeight: 900, fontSize: 18, lineHeight: 1.1 }}>{fmt(deal.arv)}</div>
              </div>
              {deal.repairCost > 0 && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#707d75', fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>Est. repairs</div>
                  <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: 13 }}>{fmt(deal.repairCost)}</div>
                </div>
              )}
            </div>
          )}

          {/* Beds/baths/sqft */}
          {deal.dealType !== 'land' && deal.dealType !== 'commercial' && (
            <div style={{
              display: 'flex',
              background: '#0f0f18', borderRadius: 10,
              border: '1px solid #232925',
              overflow: 'hidden',
              marginBottom: 12,
            }}>
              {[
                { icon: Bed, val: `${deal.beds || 0} bd` },
                { icon: Bath, val: `${deal.baths || 0} ba` },
                { icon: Maximize2, val: `${(deal.sqft || 0).toLocaleString()} ft²` },
                ...(deal.yearBuilt ? [{ icon: Calendar, val: `${deal.yearBuilt}` }] : []),
              ].map(({ icon: Icon, val }, i, arr) => (
                <div key={i} style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 5, padding: '9px 4px',
                  borderRight: i < arr.length - 1 ? '1px solid #232925' : 'none',
                }}>
                  <Icon size={12} style={{ color: '#00c805' }} />
                  <span style={{ color: '#e4eae6', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>{val}</span>
                </div>
              ))}
            </div>
          )}

          {/* Seller + days listed */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img
              src={deal.sellerAvatar}
              alt={deal.sellerName}
              style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #232925' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#f8fafc', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {deal.sellerName}
              </div>
              <div style={{ color: '#707d75', fontSize: 11 }}>
                {deal.daysListed}d listed
              </div>
            </div>
            <div style={{
              padding: '9px 15px', borderRadius: 10,
              background: 'linear-gradient(135deg, #0b8a3c, #15a24b)',
              border: '1px solid rgba(255,255,255,0.14)',
              color: '#eafff2', fontWeight: 800, fontSize: 12,
              boxShadow: '0 4px 14px rgba(11, 138, 60, 0.45)',
              display: 'flex', alignItems: 'center', gap: 5,
              whiteSpace: 'nowrap',
            }}>
              {isAuthenticated ? <Eye size={12} /> : <Lock size={12} />}
              {isAuthenticated ? 'See All Details' : 'Sign Up'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Desktop layout (unchanged from before) ───
  const cardStyle = {
    background: '#131614',
    border: deal.isFeatured
      ? 'none'
      : deal.isSponsored
        ? '1px solid rgba(0, 200, 5,0.25)'
        : '1px solid #232925',
    borderRadius: '16px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.25s cubic-bezier(.2,.9,.3,1), box-shadow 0.25s ease, border-color 0.2s ease',
    transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
    boxShadow: hovered
      ? '0 16px 50px rgba(0,0,0,0.55), 0 0 0 1px rgba(0, 200, 5,0.18)'
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
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10, 11, 10,0.78) 0%, transparent 55%)', pointerEvents: 'none' }} />
        {!isAuthenticated && hovered && (
          <div
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 8,
              background: 'linear-gradient(180deg, rgba(10, 11, 10,0.55) 0%, rgba(10, 11, 10,0.75) 100%)',
              backdropFilter: 'blur(2px)',
              pointerEvents: 'none',
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'rgba(0, 200, 5,0.95)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(0, 200, 5,0.5)',
            }}>
              <Lock size={20} color="#fff" />
            </div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 14, letterSpacing: 0.2 }}>Sign up to view</div>
          </div>
        )}
        <div style={{ position: 'absolute', top: '12px', left: '12px', background: typeColor.bg, color: typeColor.text, borderRadius: '6px', padding: '3px 9px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.3px', backdropFilter: 'blur(4px)' }}>
          {DEAL_TYPE_LABELS[deal.dealType]}
        </div>
        {deal.isFeatured && (
          <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(0,0,0,0.75)', borderRadius: '20px', padding: '4px 10px', backdropFilter: 'blur(8px)' }}>
            <Crown size={13} style={{ color: '#f59e0b' }} />
            <span className="shimmer-badge" style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px' }}>FEATURED</span>
          </div>
        )}
        <button onClick={handleSaveClick} style={{ position: 'absolute', top: '10px', right: '10px', width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(10, 11, 10,0.7)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(6px)' }}>
          <Heart size={16} fill={saved ? '#ef4444' : 'none'} style={{ color: saved ? '#ef4444' : '#f8fafc' }} />
        </button>

          {stats && (stats.views > 0 || stats.hearts > 0) && (
            <div style={{
              position: 'absolute', bottom: 10, left: 10,
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(6,8,6,0.72)', backdropFilter: 'blur(6px)',
              borderRadius: 999, padding: '4px 11px',
              color: '#e4eae6', fontSize: 11, fontWeight: 800,
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Eye size={11} style={{ color: '#00e5a0' }} /> {stats.views || 0}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Heart size={11} fill="#ef4444" style={{ color: '#ef4444' }} /> {stats.hearts || 0}
              </span>
            </div>
          )}
        {deal.status === 'under contract' && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(239,68,68,0.9)', textAlign: 'center', padding: '5px', fontSize: '11px', fontWeight: 700, color: '#fff', letterSpacing: '0.5px' }}>UNDER CONTRACT</div>
        )}
      </div>
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: '22px', lineHeight: 1, letterSpacing: '-0.5px' }}>{fmt(deal.listingPrice || deal.price)}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ color: '#5a675f', fontSize: '11px' }}>ARV</span>
            <span style={{ color: '#10b981', fontWeight: 700, fontSize: '13px' }}>{fmt(deal.arv)}</span>
          </div>
        </div>
        <div style={{ color: '#707d75', fontSize: '12px', fontFamily: 'monospace', marginBottom: '2px' }}>{blurStreetNumber(deal.address)}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#95a29b', fontSize: '13px', fontWeight: 600, marginBottom: '10px' }}>
          <MapPin size={11} style={{ color: '#00c805' }} />
          {deal.city}, {deal.state}
        </div>
        {deal.arv > 0 && (
          <div style={{
            background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.18)',
            borderRadius: 10, padding: '8px 12px', marginBottom: 12,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <TrendingUp size={14} style={{ color: '#10b981' }} />
            <span style={{ color: '#10b981', fontWeight: 800, fontSize: 14 }}>{fmt(deal.arv)} ARV</span>
            <span style={{ color: '#707d75', fontSize: 12 }}>· seller-reported</span>
          </div>
        )}
        {deal.dealType !== 'land' && deal.dealType !== 'commercial' && (
          <div style={{ display: 'flex', gap: '0', marginBottom: '12px', background: '#0f0f18', borderRadius: '8px', overflow: 'hidden', border: '1px solid #232925' }}>
            {[
              { icon: Bed, val: `${deal.beds} bd` },
              { icon: Bath, val: `${deal.baths} ba` },
              { icon: Maximize2, val: `${(deal.sqft || 0).toLocaleString()} ft²` },
              ...(deal.yearBuilt ? [{ icon: Calendar, val: `${deal.yearBuilt}` }] : []),
            ].map(({ icon: Icon, val }, i, arr) => (
              <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '8px 4px', borderRight: i < arr.length - 1 ? '1px solid #232925' : 'none' }}>
                <Icon size={11} style={{ color: '#00c805' }} />
                <span style={{ color: '#cdd6d0', fontSize: '11px', fontWeight: 600 }}>{val}</span>
              </div>
            ))}
          </div>
        )}
        <div style={{ height: '1px', background: '#232925', marginBottom: '12px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={deal.sellerAvatar} alt={deal.sellerName} style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1.5px solid #232925' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#f8fafc', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{deal.sellerName}</div>
            <div style={{ color: '#707d75', fontSize: 11 }}>{deal.daysListed}d listed</div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); openDeal(e); }} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '9px 14px', borderRadius: '9px', background: 'linear-gradient(135deg, #0b8a3c, #15a24b)', border: '1px solid rgba(255,255,255,0.14)', color: '#eafff2', fontWeight: 800, fontSize: '12px', cursor: 'pointer', flexShrink: 0, boxShadow: '0 4px 14px rgba(11, 138, 60, 0.45)', whiteSpace: 'nowrap' }}>
            {isAuthenticated ? <Eye size={12} /> : <Lock size={12} />}
            {isAuthenticated ? 'See All Details' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}
