import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Heart, Share2, MapPin, Calendar, Home, Maximize2,
  ChevronLeft, ChevronRight, MessageSquare, TrendingUp, Crown,
  Shield, CheckCircle, X, Zap, Eye
} from 'lucide-react';
import { getDealById, getSimilarDeals } from '../data/deals';
import { getLiveDeal, isLiveDealId } from '../lib/deals';
import { getUserById } from '../data/users';
import DealCard from '../components/DealCard';
import ImageCarousel from '../components/ImageCarousel';
import AddressRequestModal from '../components/AddressRequestModal';
import CarsonFirstAddressModal, { hasSeenCarsonNote, markCarsonNoteSeen } from '../components/CarsonFirstAddressModal';
import AddressSignupSlider from '../components/AddressSignupSlider';
import AddressRequestOwnerModal from '../components/AddressRequestOwnerModal';
import StreetView from '../components/StreetView';
import { hasDMd } from '../lib/dmHistory';
import { logActivity } from '../lib/activityLog';
import ProfitCalculator from '../components/ProfitCalculator';
import { getDisplayAddress } from '../utils/address';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useSavedDeals } from '../hooks/useSavedDeals';
import { useIsMobile } from '../hooks/useIsMobile';
import { useSEO } from '../hooks/useSEO';

const dealTypeLabels = {
  'fix-flip': 'Fix & Flip',
  'rental': 'Landlord/Rental',
  'creative': 'Creative Financing',
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
  if (!n) return '$0';
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}k`;
  return `$${n.toLocaleString()}`;
}

export default function DealDetail() {
  const { id } = useParams();
  const mockDeal = getDealById(id);
  const [liveDeal, setLiveDeal] = useState(null);
  const [liveChecked, setLiveChecked] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!mockDeal && isLiveDealId(id)) {
      getLiveDeal(id)
        .then(d => { if (alive) { setLiveDeal(d); setLiveChecked(true); } })
        .catch(() => { if (alive) setLiveChecked(true); });
    } else {
      setLiveChecked(true);
    }
    return () => { alive = false; };
  }, [id, mockDeal]);

  const deal = mockDeal || liveDeal;
  const { currentUser, isLoggedIn, isAuthenticated, requireAuth, requireAuthForDM } = useAuth();

  // Guests CAN browse the masked listing — they're only gated (with the
  // animated signup slider) when they try to request the exact address.
  const { toast } = useToast();
  const { isSaved, toggle: toggleSaved } = useSavedDeals();
  const isMobile = useIsMobile();
  const [showAddressReq, setShowAddressReq] = useState(false);
  const [showCarsonNote, setShowCarsonNote] = useState(false);

  // First-time guard: when the user clicks any "Request Address" button,
  const [showShare, setShowShare] = useState(false);
  const [addressGranted, setAddressGranted] = useState(false);
  const [showSignupSlider, setShowSignupSlider] = useState(false);
  const [showOwnerModal, setShowOwnerModal] = useState(false);

  // Address visibility policy set by the seller on the post page.
  const addressPolicy = deal?.addressVisibility || 'request';

  // Kicks off the address flow with the right behaviour for the policy.
  function startAddressRequest() {
    // Guests can't request — sell them on signing up.
    if (!isAuthenticated) {
      setShowSignupSlider(true);
      return;
    }
    if (addressPolicy === 'public') return; // already visible

    const sellerId = deal?.sellerId;
    // "Buyers I've DM'd before" → instant unlock if the seller messaged them.
    if (addressPolicy === 'dmd' && sellerId && hasDMd(sellerId, currentUser?.id)) {
      grantAddress('Auto-shared — you and the seller have messaged before.');
      return;
    }
    // Otherwise require the request form (Carson note first time).
    if (!hasSeenCarsonNote()) {
      setShowCarsonNote(true);
    } else {
      setShowAddressReq(true);
    }
  }

  function grantAddress(msg) {
    setAddressGranted(true);
    logActivity({
      actorId: currentUser?.id, actorName: currentUser?.name,
      type: 'address_approved',
      detail: `${deal?.title} — ${deal?.city}, ${deal?.state}`,
      targetId: deal?.sellerId,
    });
    toast(msg || 'Address unlocked.', 'success', 4000);
  }
  const saved = deal ? isSaved(deal.id) : false;

  useSEO({
    title: deal ? `${deal.city || 'Off-market'} ${dealTypeLabels[deal.dealType] || 'deal'} — ${formatCurrency(deal.listingPrice || deal.price)}` : 'Deal',
    description: deal ? `${deal.beds || 0} bed / ${deal.baths || 0} bath • ${deal.sqft ? deal.sqft.toLocaleString() + ' sqft' : ''} • ARV ${formatCurrency(deal.arv)} • ${deal.city}, ${deal.state}` : '',
    image: deal?.images?.[0] || deal?.image,
  });

  if (!deal) {
    return (
      <div style={{ background: '#0a0a0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#f8fafc', fontWeight: 700 }}>
            {liveChecked ? 'Deal not found' : 'Loading deal…'}
          </h2>
          {liveChecked && (
            <Link to="/marketplace" style={{ color: '#8b5cf6', textDecoration: 'none' }}>← Back to Marketplace</Link>
          )}
        </div>
      </div>
    );
  }

  const seller = getUserById(deal.sellerId) || {};
  const similar = getSimilarDeals(deal, 3);
  // Only the deal owner sees edit tools
  const isOwner = isLoggedIn && currentUser && String(currentUser.id) === String(deal.sellerId);

  // The exact address is visible to: the owner, anyone once approved, or
  // everyone if the seller chose the "public" policy.
  const addressVisible = isOwner || addressGranted || addressPolicy === 'public';

  return (
    <div className="page-enter" style={{ background: '#0a0a0f', minHeight: '100vh' }}>
      {/* Back nav */}
      <div style={{ background: '#0d0d1a', borderBottom: '1px solid #1e1e2e', padding: '14px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <Link
            to="/marketplace"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              color: '#94a3b8', textDecoration: 'none', fontSize: '14px', fontWeight: 500,
              transition: 'color 0.2s',
            }}
          >
            <ArrowLeft size={16} />
            Back to Marketplace
          </Link>
          <span style={{ color: '#1e1e2e' }}>•</span>
          <span style={{ color: '#475569', fontSize: '14px' }}>{deal.city}, {deal.state}</span>
          <span style={{ color: '#1e1e2e' }}>•</span>
          <span className={dealTypeBadgeClass[deal.dealType]} style={{ borderRadius: '20px', padding: '2px 10px', fontSize: '12px', fontWeight: 700 }}>
            {dealTypeLabels[deal.dealType]}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 14px' }} className="deal-detail-wrap">
        <style>{`
          .deal-detail-wrap > .deal-detail-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
            align-items: flex-start;
          }
          @media (min-width: 900px) {
            .deal-detail-wrap { padding: 32px 20px; }
            .deal-detail-wrap > .deal-detail-grid {
              grid-template-columns: 1fr 380px;
              gap: 32px;
            }
          }
        `}</style>
        <div className="deal-detail-grid">
          {/* Left column */}
          <div>
            {/* Image Gallery with YouTube support */}
            <div style={{ marginBottom: '16px' }}>
              <ImageCarousel images={deal.images} youtubeId={deal.youtubeId} height={isMobile ? 320 : 480} />
            </div>

            {/* Street View — directly under photos, lazy-loaded (no tokens used until tapped) */}
            {addressVisible && (
              <StreetView
                address={deal.address}
                city={deal.city}
                state={deal.state}
                zip={deal.zip}
              />
            )}

            {/* Title & Address */}
            <div style={{ marginBottom: '20px' }}>
              <h1 style={{ color: '#f8fafc', fontWeight: 900, fontSize: '28px', marginBottom: '8px', lineHeight: 1.2, letterSpacing: '-0.5px' }}>
                {deal.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', flexWrap: 'wrap' }}>
                <MapPin size={16} />
                <span style={{ fontSize: '16px', fontFamily: addressVisible ? 'inherit' : 'monospace' }}>
                  {getDisplayAddress(deal, addressVisible)}, {deal.city}, {deal.state} {deal.zip}
                </span>
                {!addressVisible && (
                  <button
                    onClick={startAddressRequest}
                    style={{
                      marginLeft: '8px', padding: '4px 12px', borderRadius: '16px',
                      background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.4)',
                      color: '#8b5cf6', cursor: 'pointer', fontSize: '12px', fontWeight: 700,
                    }}
                  >
                    Request Address
                  </button>
                )}
              </div>
            </div>

            {/* ── Deal Numbers Card (mobile: compact 2x2; desktop: 4 in a row) ── */}
            {isMobile ? (
              <div style={{
                background: '#12121e',
                border: '1px solid #1e1e2e',
                borderRadius: 16,
                overflow: 'hidden',
                marginBottom: 20,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
              }}>
                {[
                  { label: 'List Price', value: formatCurrency(deal.price),      color: '#f8fafc', accent: '#8b5cf6' },
                  { label: 'ARV',        value: formatCurrency(deal.arv),         color: '#10b981', accent: '#10b981' },
                  { label: 'Est. Repairs', value: formatCurrency(deal.repairCost), color: '#f59e0b', accent: '#ef4444' },
                  { label: 'Deal Type',  value: dealTypeLabels[deal.dealType] || '—', color: '#06b6d4', accent: '#06b6d4' },
                ].map(({ label, value, color, accent }, i) => (
                  <div key={label} style={{
                    padding: '14px 14px',
                    borderRight: i % 2 === 0 ? '1px solid #1e1e2e' : 'none',
                    borderBottom: i < 2 ? '1px solid #1e1e2e' : 'none',
                  }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4,
                    }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: accent }} />
                      <span style={{
                        color: '#94a3b8', fontSize: 10, fontWeight: 700,
                        letterSpacing: 0.5, textTransform: 'uppercase',
                      }}>{label}</span>
                    </div>
                    <div style={{ color, fontWeight: 800, fontSize: 19, lineHeight: 1.1, letterSpacing: '-0.3px' }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                {[
                  { label: 'Listing Price', value: formatCurrency(deal.price), color: '#f8fafc', bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.2)' },
                  { label: 'After Repair Value', value: formatCurrency(deal.arv), color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.2)' },
                  { label: 'Est. Repair Cost', value: formatCurrency(deal.repairCost), color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)' },
                  { label: 'Deal Type', value: dealTypeLabels[deal.dealType] || '—', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)', border: 'rgba(6, 182, 212, 0.2)' },
                ].map(({ label, value, color, bg, border }) => (
                  <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                    <div style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 700, marginBottom: '6px', letterSpacing: '0.5px' }}>
                      {label.toUpperCase()}
                    </div>
                    <div style={{ color, fontWeight: 800, fontSize: '22px', lineHeight: 1 }}>{value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Deal Calculator (replaces any static profit figure) ── */}
            <ProfitCalculator
              listingPrice={deal.price || deal.listingPrice || 0}
              arv={deal.arv || 0}
              rehabDefault={
                deal.rehabLow != null && deal.rehabHigh != null
                  ? Math.round((deal.rehabLow + deal.rehabHigh) / 2)
                  : (deal.repairCost || 0)
              }
              isMobile={isMobile}
            />

            {/* Property Details */}
            <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '16px', padding: isMobile ? '18px' : '24px', marginBottom: '20px' }}>
              <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '18px', marginBottom: '16px' }}>Property Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(150px, 1fr))', gap: isMobile ? '14px 12px' : '16px' }}>
                {[
                  { label: 'Bedrooms', value: deal.beds || 'N/A', icon: '🛏' },
                  { label: 'Bathrooms', value: deal.baths || 'N/A', icon: '🛁' },
                  { label: 'Square Feet', value: deal.sqft ? deal.sqft.toLocaleString() : 'N/A', icon: '📐' },
                  { label: 'Year Built', value: deal.yearBuilt || 'N/A', icon: '📅' },
                  { label: 'Lot Size', value: deal.lotSize || 'N/A', icon: '🗺' },
                  { label: 'Status', value: deal.status === 'under contract' ? 'Under Contract' : 'Available', icon: '✅' },
                  { label: 'Days Listed', value: `${deal.daysListed} days`, icon: '⏱' },
                  { label: 'Deal Type', value: dealTypeLabels[deal.dealType], icon: '🏷' },
                ].map(({ label, value, icon }) => (
                  <div key={label}>
                    <div style={{ color: '#475569', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>{icon} {label}</div>
                    <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '15px' }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Contact the Wholesaler CTA (right under Property Details) ── */}
            {!isOwner && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(139,92,246,0.10), rgba(6,182,212,0.06))',
                border: '1px solid rgba(139,92,246,0.30)',
                borderRadius: 16,
                padding: isMobile ? '16px' : '20px',
                marginBottom: 20,
                display: 'flex', alignItems: 'center', gap: 14,
                flexWrap: 'wrap',
              }}>
                <img
                  src={seller.avatar || deal.sellerAvatar}
                  alt={seller.name || deal.sellerName}
                  style={{
                    width: 52, height: 52, borderRadius: '50%',
                    objectFit: 'cover', flexShrink: 0,
                    border: '2px solid rgba(139,92,246,0.4)',
                  }}
                />
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 2 }}>
                    Wholesaler
                  </div>
                  <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: 16, letterSpacing: '-0.2px' }}>
                    {seller.name || deal.sellerName}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>
                    Have questions? Reach out for details, access, or an offer.
                  </div>
                </div>
                <Link
                  to="/messages"
                  onClick={(e) => {
                    if (!isLoggedIn) {
                      e.preventDefault();
                      requireAuthForDM('deal-detail-seller-card');
                    }
                  }}
                  className="gradient-btn"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '11px 18px', borderRadius: 11,
                    color: '#fff', textDecoration: 'none', fontWeight: 800, fontSize: 14,
                    boxShadow: '0 6px 18px rgba(139,92,246,0.35)',
                    flexShrink: 0,
                  }}
                >
                  <MessageSquare size={15} />
                  Send Message
                </Link>
              </div>
            )}

            {/* Description */}
            <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '16px', padding: isMobile ? '18px' : '24px', marginBottom: '24px' }}>
              <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '18px', marginBottom: '14px' }}>Deal Description</h3>
              <p style={{ color: '#e2e8f0', lineHeight: 1.8, fontSize: '15px', margin: 0 }}>{deal.description}</p>
            </div>

            {/* Similar Deals */}
            {similar.length > 0 && (
              <div>
                <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '20px', marginBottom: '20px' }}>Similar Deals</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                  {similar.map(d => <DealCard key={d.id} deal={d} />)}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div style={{ position: 'sticky', top: '84px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Price Card */}
            <div style={{
              background: '#12121e', border: '1px solid #1e1e2e',
              borderRadius: '20px', padding: '24px',
              boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
            }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '4px' }}>LISTING PRICE</div>
                <div style={{ color: '#f8fafc', fontWeight: 900, fontSize: '40px', lineHeight: 1 }}>{formatCurrency(deal.price)}</div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <div style={{ flex: 1, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                  <div style={{ color: '#475569', fontSize: '10px', fontWeight: 700 }}>ARV</div>
                  <div style={{ color: '#10b981', fontWeight: 800, fontSize: '16px' }}>{formatCurrency(deal.arv)}</div>
                </div>
                <div style={{ flex: 1, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                  <div style={{ color: '#475569', fontSize: '10px', fontWeight: 700 }}>EST. REPAIRS</div>
                  <div style={{ color: '#f59e0b', fontWeight: 800, fontSize: '16px' }}>{formatCurrency(deal.repairCost)}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <Calendar size={14} style={{ color: '#475569' }} />
                <span style={{ color: '#475569', fontSize: '13px' }}>Listed {deal.daysListed} day{deal.daysListed !== 1 ? 's' : ''} ago</span>
                <span style={{
                  marginLeft: 'auto',
                  padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                  background: deal.status === 'available' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: deal.status === 'available' ? '#10b981' : '#ef4444',
                  border: `1px solid ${deal.status === 'available' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                }}>
                  {deal.status === 'available' ? 'Available' : 'Under Contract'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {addressVisible ? (
                  <div style={{
                    width: '100%', padding: '14px', borderRadius: '12px',
                    background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                    color: '#10b981', fontWeight: 800, fontSize: '15px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  }}>
                    <CheckCircle size={18} />
                    {addressPolicy === 'public' && !addressGranted && !isOwner ? 'Address Visible' : 'Address Unlocked'}
                  </div>
                ) : (
                  <button
                    onClick={startAddressRequest}
                    className="gradient-btn"
                    style={{
                      width: '100%', padding: '14px', borderRadius: '12px',
                      color: '#fff', fontWeight: 800, fontSize: '16px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    }}
                  >
                    <CheckCircle size={18} />
                    Send Address Request
                  </button>
                )}

                <Link
                  to="/messages"
                  onClick={(e) => {
                    if (!isLoggedIn) {
                      e.preventDefault();
                      requireAuthForDM('deal-detail-message-seller');
                    }
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '13px', borderRadius: '12px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid #1e1e2e',
                    color: '#f8fafc', textDecoration: 'none', fontWeight: 600, fontSize: '15px',
                    transition: 'all 0.2s',
                  }}
                >
                  <MessageSquare size={18} />
                  Message Seller
                </Link>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => { const nowSaved = toggleSaved(deal.id); toast(nowSaved ? 'Saved to your list' : 'Removed from saved', nowSaved ? 'success' : 'info'); }}
                    style={{
                      flex: 1, padding: '11px', borderRadius: '10px',
                      background: saved ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${saved ? 'rgba(239, 68, 68, 0.3)' : '#1e1e2e'}`,
                      color: saved ? '#ef4444' : '#94a3b8', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      fontWeight: 600, fontSize: '13px', transition: 'all 0.2s',
                    }}
                  >
                    <Heart size={15} fill={saved ? '#ef4444' : 'none'} />
                    {saved ? 'Saved' : 'Save'}
                  </button>
                  <button
                    onClick={async () => {
                      const url = `${window.location.origin}/marketplace/${deal.id}`;
                      const shareData = {
                        title: deal.title || `${deal.city}, ${deal.state} deal`,
                        text: `${deal.title} — ${formatCurrency(deal.listingPrice || deal.price)} in ${deal.city}, ${deal.state}`,
                        url,
                      };
                      if (typeof navigator !== 'undefined' && navigator.share) {
                        try { await navigator.share(shareData); return; } catch { /* user canceled */ }
                      }
                      setShowShare(true);
                    }}
                    style={{
                      flex: 1, padding: '11px', borderRadius: '10px',
                      background: 'rgba(255,255,255,0.05)', border: '1px solid #1e1e2e',
                      color: '#94a3b8', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      fontWeight: 600, fontSize: '13px', transition: 'all 0.2s',
                    }}
                  >
                    <Share2 size={15} />
                    Share
                  </button>
                </div>
              </div>
            </div>

            {/* Seller Card */}
            <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '20px', padding: '24px' }}>
              <h4 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '16px', marginBottom: '16px' }}>About the Seller</h4>

              <Link to={`/profile/${deal.sellerId}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <img
                  src={deal.sellerAvatar || seller.avatar}
                  alt={deal.sellerName}
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #1e1e2e' }}
                />
                <div>
                  <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '16px' }}>{deal.sellerName}</div>
                  <div style={{ color: '#475569', fontSize: '13px' }}>{seller.location || `${deal.city}, ${deal.state}`}</div>
                  <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                    {(deal.tags || seller.tags || []).map(tag => (
                      <span key={tag} style={{
                        background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        borderRadius: '20px', padding: '1px 8px', fontSize: '11px', fontWeight: 600,
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>

              {seller.dealsPosted && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ background: '#1a1a2e', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ color: '#8b5cf6', fontWeight: 800, fontSize: '22px' }}>{seller.dealsPosted}</div>
                    <div style={{ color: '#475569', fontSize: '12px' }}>Deals Posted</div>
                  </div>
                  <div style={{ background: '#1a1a2e', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ color: '#10b981', fontWeight: 800, fontSize: '22px' }}>{seller.dealsClosed}</div>
                    <div style={{ color: '#475569', fontSize: '12px' }}>Deals Closed</div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px' }}>
                <Link
                  to={`/profile/${deal.sellerId}`}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '10px', textAlign: 'center',
                    background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)',
                    color: '#8b5cf6', textDecoration: 'none', fontWeight: 600, fontSize: '13px',
                    transition: 'all 0.2s',
                  }}
                >
                  View Profile
                </Link>
                <Link
                  to="/messages"
                  style={{
                    flex: 1, padding: '10px', borderRadius: '10px', textAlign: 'center',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid #1e1e2e',
                    color: '#94a3b8', textDecoration: 'none', fontWeight: 600, fontSize: '13px',
                    transition: 'all 0.2s',
                  }}
                >
                  Message
                </Link>
              </div>
            </div>

            {/* Safety */}
            <div style={{ background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: '16px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Shield size={18} style={{ color: '#10b981' }} />
                <span style={{ color: '#10b981', fontWeight: 700, fontSize: '14px' }}>All Street Live Buyer Protection</span>
              </div>
              <ul style={{ color: '#94a3b8', fontSize: '13px', margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>Verified seller profile</li>
                <li>Community reputation score</li>
                <li>Dispute resolution support</li>
                <li>Deal documentation assistance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* First-time Carson note (localStorage-gated). Opens AddressRequestModal once acknowledged. */}
      <CarsonFirstAddressModal
        open={showCarsonNote}
        onClose={() => setShowCarsonNote(false)}
        onContinue={() => {
          markCarsonNoteSeen();
          setShowCarsonNote(false);
          setShowAddressReq(true);
        }}
      />

      {/* Buyer fills the request — no longer auto-grants. */}
      {showAddressReq && (
        <AddressRequestModal
          deal={deal}
          sellerName={deal.sellerName}
          onClose={() => setShowAddressReq(false)}
          onSubmit={() => {
            setShowAddressReq(false);
            logActivity({
              actorId: currentUser?.id, actorName: currentUser?.name,
              type: 'address_request',
              detail: `${deal.title} — ${deal.city}, ${deal.state}`,
              targetId: deal.sellerId,
            });
            toast(`Request sent to ${deal.sellerName}. They'll review it.`, 'success', 3500);
            // Surface the seller's side so the approve/deny/DM flow is usable.
            setShowOwnerModal(true);
          }}
        />
      )}

      {/* Guest hits "Request Address" → animated signup sell. */}
      <AddressSignupSlider
        open={showSignupSlider}
        onClose={() => setShowSignupSlider(false)}
        redirectTo={`/marketplace/${deal.id}`}
      />

      {/* Seller-side: approve / deny / DM the requester. */}
      <AddressRequestOwnerModal
        open={showOwnerModal}
        deal={deal}
        owner={seller && seller.id ? seller : { id: deal.sellerId, name: deal.sellerName, avatar: deal.sellerAvatar }}
        requester={currentUser}
        onClose={() => setShowOwnerModal(false)}
        onApprove={() => {
          setShowOwnerModal(false);
          grantAddress(`Address approved — unlocked for ${deal.city}, ${deal.state}.`);
        }}
        onDeny={() => {
          setShowOwnerModal(false);
          logActivity({
            actorId: currentUser?.id, actorName: currentUser?.name,
            type: 'address_denied',
            detail: `${deal.title} — ${deal.city}, ${deal.state}`,
            targetId: deal.sellerId,
          });
          toast('Request denied. The buyer was not given the address.', 'info', 3500);
        }}
      />

      {/* Share to Feed Modal */}
      {showShare && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        }}>
          <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '20px', width: '100%', maxWidth: '520px' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #1e1e2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '18px', margin: 0 }}>Share to Feed</h2>
              <button onClick={() => setShowShare(false)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: '20px' }}>
              <textarea
                defaultValue={`Check out this deal in ${deal.city}, ${deal.state}!\n\n${deal.title}\n\nListing Price: ${formatCurrency(deal.listingPrice || deal.price)}\nARV: ${formatCurrency(deal.arv)}\n\nhttps://allstreetlive.com/marketplace/${deal.id}`}
                className="input-dark"
                rows={6}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', fontSize: '14px', resize: 'vertical', marginBottom: '12px' }}
              />
              <div style={{ background: '#1a1a2e', borderRadius: '10px', padding: '12px', marginBottom: '16px', display: 'flex', gap: '10px' }}>
                <img src={deal.images[0]} alt="" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                <div>
                  <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '14px' }}>{deal.title}</div>
                  <div style={{ color: '#94a3b8', fontSize: '12px' }}>{deal.city}, {deal.state}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => { setShowShare(false); toast('Posted to your feed!', 'success'); }}
                  className="gradient-btn"
                  style={{ flex: 1, padding: '12px', borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '14px' }}
                >
                  Post to Feed
                </button>
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/marketplace/${deal.id}`;
                    try { navigator.clipboard.writeText(url); } catch {}
                    toast('Link copied to clipboard', 'info');
                  }}
                  style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid #1e1e2e', color: '#94a3b8', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
