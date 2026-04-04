import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Heart, Share2, MapPin, Calendar, Home, Maximize2,
  ChevronLeft, ChevronRight, MessageSquare, TrendingUp, Crown,
  Shield, CheckCircle, X, Zap, Eye
} from 'lucide-react';
import { getDealById, getSimilarDeals } from '../data/deals';
import { getUserById } from '../data/users';
import DealCard from '../components/DealCard';

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
  const deal = getDealById(id);
  const [imgIdx, setImgIdx] = useState(0);
  const [saved, setSaved] = useState(false);
  const [showPromote, setShowPromote] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [budget, setBudget] = useState(20);

  if (!deal) {
    return (
      <div style={{ background: '#0a0a0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#f8fafc', fontWeight: 700 }}>Deal not found</h2>
          <Link to="/marketplace" style={{ color: '#8b5cf6', textDecoration: 'none' }}>← Back to Marketplace</Link>
        </div>
      </div>
    );
  }

  const seller = getUserById(deal.sellerId) || {};
  const similar = getSimilarDeals(deal, 3);
  const fee = (budget * 0.15).toFixed(2);
  const total = (budget + parseFloat(fee)).toFixed(2);

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>
      {/* Back nav */}
      <div style={{ background: '#0d0d1a', borderBottom: '1px solid #1e1e2e', padding: '14px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
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

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'flex-start' }}>
          {/* Left column */}
          <div>
            {/* Image Gallery */}
            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px', background: '#12121e' }}>
              <img
                src={deal.images[imgIdx]}
                alt={`Property ${imgIdx + 1}`}
                style={{ width: '100%', height: '480px', objectFit: 'cover' }}
              />

              {/* Featured overlay */}
              {deal.isFeatured && (
                <div style={{
                  position: 'absolute', top: '20px', left: '20px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(0,0,0,0.85)', borderRadius: '24px',
                  padding: '8px 16px', backdropFilter: 'blur(8px)',
                }}>
                  <Crown size={18} style={{ color: '#f59e0b' }} />
                  <span className="shimmer-badge" style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '0.5px' }}>
                    FEATURED DEAL
                  </span>
                </div>
              )}

              {/* Gallery nav */}
              {deal.images.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIdx(Math.max(0, imgIdx - 1))}
                    style={{
                      position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%',
                      width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: '#fff', backdropFilter: 'blur(8px)',
                      opacity: imgIdx === 0 ? 0.3 : 1,
                    }}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setImgIdx(Math.min(deal.images.length - 1, imgIdx + 1))}
                    style={{
                      position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%',
                      width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: '#fff', backdropFilter: 'blur(8px)',
                      opacity: imgIdx === deal.images.length - 1 ? 0.3 : 1,
                    }}
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Image counter */}
              <div style={{
                position: 'absolute', bottom: '16px', right: '16px',
                background: 'rgba(0,0,0,0.7)', borderRadius: '20px',
                padding: '4px 12px', backdropFilter: 'blur(8px)',
                color: '#f8fafc', fontSize: '13px', fontWeight: 600,
              }}>
                {imgIdx + 1} / {deal.images.length}
              </div>
            </div>

            {/* Thumbnails */}
            {deal.images.length > 1 && (
              <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', overflowX: 'auto' }}>
                {deal.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Thumb ${i + 1}`}
                    onClick={() => setImgIdx(i)}
                    style={{
                      width: '100px', height: '70px', objectFit: 'cover',
                      borderRadius: '8px', cursor: 'pointer', flexShrink: 0,
                      border: `2px solid ${imgIdx === i ? '#8b5cf6' : 'transparent'}`,
                      transition: 'all 0.2s',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Title & Address */}
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ color: '#f8fafc', fontWeight: 900, fontSize: '28px', marginBottom: '8px', lineHeight: 1.2 }}>
                {deal.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8' }}>
                <MapPin size={16} />
                <span style={{ fontSize: '16px' }}>{deal.address}, {deal.city}, {deal.state} {deal.zip}</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginBottom: '24px' }}>
              {[
                { label: 'Assignment Fee', value: formatCurrency(deal.price), color: '#f8fafc', bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.2)' },
                { label: 'After Repair Value', value: formatCurrency(deal.arv), color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.2)' },
                { label: 'Repair Cost', value: formatCurrency(deal.repairCost), color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)' },
                { label: 'Potential Profit', value: formatCurrency(deal.potentialProfit), color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.2)' },
              ].map(({ label, value, color, bg, border }) => (
                <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 700, marginBottom: '6px', letterSpacing: '0.5px' }}>
                    {label.toUpperCase()}
                  </div>
                  <div style={{ color, fontWeight: 800, fontSize: '22px', lineHeight: 1 }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Property Details */}
            <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '18px', marginBottom: '16px' }}>Property Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
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

            {/* Description */}
            <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '18px', marginBottom: '14px' }}>Deal Description</h3>
              <p style={{ color: '#e2e8f0', lineHeight: 1.8, fontSize: '15px', margin: 0 }}>{deal.description}</p>
            </div>

            {/* Map Placeholder */}
            <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '16px', overflow: 'hidden', marginBottom: '32px' }}>
              <div style={{
                height: '300px',
                background: 'linear-gradient(135deg, #1a1a2e, #12121e)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                {/* Grid pattern */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: 'linear-gradient(rgba(30,30,46,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(30,30,46,0.5) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }} />
                <MapPin size={48} style={{ color: '#8b5cf6', marginBottom: '12px', position: 'relative' }} />
                <p style={{ color: '#f8fafc', fontWeight: 700, fontSize: '18px', margin: 0, position: 'relative' }}>{deal.city}, {deal.state}</p>
                <p style={{ color: '#475569', fontSize: '14px', margin: '4px 0 0', position: 'relative' }}>{deal.address}</p>
              </div>
            </div>

            {/* Promote Section */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(139, 92, 246, 0.08))',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: '16px', padding: '24px', marginBottom: '32px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '18px', margin: 0 }}>Promote This Deal</h3>
                  <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0' }}>Get more buyers to see this listing</p>
                </div>
                <Zap size={24} style={{ color: '#f59e0b' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
                {[
                  { tier: 'Starter', price: '$2/day', desc: 'Top 20 placement', color: '#94a3b8' },
                  { tier: 'Growth', price: '$5/day', desc: 'Top 10 placement', color: '#06b6d4' },
                  { tier: 'Pro', price: '$10/day', desc: 'Top 5 + Sponsored', color: '#8b5cf6' },
                  { tier: 'Featured', price: '$20/day', desc: '#1 + Glow Effect', color: '#f59e0b' },
                ].map(({ tier, price, desc, color }) => (
                  <button
                    key={tier}
                    onClick={() => setShowPromote(true)}
                    style={{
                      background: '#12121e', border: `1px solid ${color}40`,
                      borderRadius: '10px', padding: '14px', cursor: 'pointer',
                      textAlign: 'left', transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ color, fontWeight: 800, fontSize: '14px' }}>{tier}</div>
                    <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '18px' }}>{price}</div>
                    <div style={{ color: '#475569', fontSize: '12px' }}>{desc}</div>
                  </button>
                ))}
              </div>

              {/* FB Ads */}
              <div style={{ background: '#12121e', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '20px' }}>📘</span>
                  <span style={{ color: '#06b6d4', fontWeight: 700, fontSize: '15px' }}>Facebook Ads Integration</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '120px' }}>
                    <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Daily Budget</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#f8fafc', fontWeight: 700 }}>$</span>
                      <input
                        type="number"
                        value={budget}
                        onChange={e => setBudget(Math.max(5, parseInt(e.target.value) || 5))}
                        className="input-dark"
                        style={{ width: '100%', padding: '10px 14px 10px 28px', borderRadius: '8px', fontSize: '14px' }}
                      />
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: '120px' }}>
                    <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>Your Cost</div>
                    <div style={{ background: '#1a1a2e', border: '1px solid #1e1e2e', borderRadius: '8px', padding: '10px 14px' }}>
                      <span style={{ color: '#f8fafc' }}>${budget}</span>
                      <span style={{ color: '#475569' }}> + </span>
                      <span style={{ color: '#f59e0b' }}>${fee}</span>
                      <span style={{ color: '#475569' }}> = </span>
                      <span style={{ color: '#10b981', fontWeight: 800 }}>${total}/day</span>
                    </div>
                  </div>
                  <button className="gradient-btn" style={{ padding: '10px 18px', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '13px', whiteSpace: 'nowrap' }}>
                    Launch Ads
                  </button>
                </div>
              </div>
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
                <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '4px' }}>ASSIGNMENT FEE</div>
                <div style={{ color: '#f8fafc', fontWeight: 900, fontSize: '40px', lineHeight: 1 }}>{formatCurrency(deal.price)}</div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <div style={{ flex: 1, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                  <div style={{ color: '#475569', fontSize: '10px', fontWeight: 700 }}>ARV</div>
                  <div style={{ color: '#10b981', fontWeight: 800, fontSize: '16px' }}>{formatCurrency(deal.arv)}</div>
                </div>
                <div style={{ flex: 1, background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                  <div style={{ color: '#475569', fontSize: '10px', fontWeight: 700 }}>PROFIT</div>
                  <div style={{ color: '#f59e0b', fontWeight: 800, fontSize: '16px' }}>{formatCurrency(deal.potentialProfit)}</div>
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
                <button
                  onClick={() => setShowRequest(true)}
                  className="gradient-btn"
                  style={{
                    width: '100%', padding: '14px', borderRadius: '12px',
                    color: '#fff', fontWeight: 800, fontSize: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  }}
                >
                  <CheckCircle size={18} />
                  Request Assignment
                </button>

                <Link
                  to="/messages"
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
                    onClick={() => setSaved(!saved)}
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
                  src={deal.sellerAvatar}
                  alt={deal.sellerName}
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #1e1e2e' }}
                />
                <div>
                  <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '16px' }}>{deal.sellerName}</div>
                  <div style={{ color: '#475569', fontSize: '13px' }}>{seller.location || `${deal.city}, ${deal.state}`}</div>
                  <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                    {deal.tags.map(tag => (
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
                <span style={{ color: '#10b981', fontWeight: 700, fontSize: '14px' }}>TREIM Buyer Protection</span>
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

      {/* Request Assignment Modal */}
      {showRequest && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            background: '#12121e', border: '1px solid #1e1e2e',
            borderRadius: '20px', width: '100%', maxWidth: '480px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
          }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #1e1e2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '20px', margin: 0 }}>Request Assignment</h2>
              <button onClick={() => setShowRequest(false)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>DEAL SUMMARY</div>
                <div style={{ color: '#f8fafc', fontWeight: 700, marginBottom: '4px' }}>{deal.title}</div>
                <div style={{ color: '#475569', fontSize: '13px', marginBottom: '12px' }}>{deal.address}, {deal.city}, {deal.state}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>Assignment Fee</span>
                  <span style={{ color: '#8b5cf6', fontWeight: 800, fontSize: '18px' }}>{formatCurrency(deal.price)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Your Full Name</label>
                  <input defaultValue="Marcus Johnson" className="input-dark" style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Phone Number</label>
                  <input defaultValue="(404) 555-0128" className="input-dark" style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Message to Seller (optional)</label>
                  <textarea
                    defaultValue="Hi! I'm interested in this deal. I'm a cash buyer and can close quickly. Please send me the contract details."
                    className="input-dark"
                    rows={3}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '14px', resize: 'vertical' }}
                  />
                </div>
                <button
                  onClick={() => { setShowRequest(false); }}
                  className="gradient-btn"
                  style={{ padding: '14px', borderRadius: '12px', color: '#fff', fontWeight: 700, fontSize: '15px' }}
                >
                  Send Assignment Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
