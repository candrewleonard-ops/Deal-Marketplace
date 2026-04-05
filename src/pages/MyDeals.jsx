import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, MessageSquare, MapPin, ChevronDown, ChevronUp, Check, X as XIcon, TrendingUp, Zap, Rocket } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { deals } from '../data/deals';
import { users } from '../data/users';

function fmt(n) {
  if (!n) return '$0';
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}k`;
  return `$${n.toLocaleString()}`;
}

const mockAddressRequests = {
  1001: [
    { id: 1, userId: 2, timestamp: '2 hours ago' },
    { id: 2, userId: 5, timestamp: '5 hours ago' },
    { id: 3, userId: 8, timestamp: '1 day ago' },
  ],
  1002: [
    { id: 4, userId: 4, timestamp: '30 min ago' },
    { id: 5, userId: 9, timestamp: '3 hours ago' },
  ],
  1003: [
    { id: 6, userId: 1, timestamp: '1 hour ago' },
  ],
};

const dealTypes = ['Wholesale', 'Fix & Flip', 'Subject-To', 'Creative Finance', 'BRRRR', 'Land', 'Commercial', 'Multi-Family'];

const promoTiers = [
  { name: 'Basic Boost', price: '$2/day', desc: '2x more visibility in search results', color: '#8b5cf6' },
  { name: 'Featured', price: '$5/day', desc: '5x views, badge on listing, top placement', color: '#06b6d4' },
  { name: 'Premium Spotlight', price: '$10/day', desc: 'Homepage feature, email blast to 1k+ buyers', color: '#f59e0b' },
];

export default function MyDeals() {
  const { currentUser } = useAuth();
  const [myDealsList, setMyDealsList] = useState(deals.filter(d => d.sellerId === currentUser.id));
  const [activeTab, setActiveTab] = useState('active');
  const [expanded, setExpanded] = useState(null);
  const [autoApprove, setAutoApprove] = useState(false);
  const [requestActions, setRequestActions] = useState({});
  const [showNewDeal, setShowNewDeal] = useState(false);
  const [showPromo, setShowPromo] = useState(null);
  const [toast, setToast] = useState(null);
  const [newDeal, setNewDeal] = useState({
    title: '', type: 'Wholesale', contractedPrice: '', listingPrice: '',
    beds: '', baths: '', sqft: '', yearBuilt: '', city: '', state: '',
    description: '', youtubeUrl: '',
  });

  function showToastMsg(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  const tabsCounts = {
    active: myDealsList.filter(d => d.status === 'available').length,
    'under contract': myDealsList.filter(d => d.status === 'under contract').length,
    sold: 0, drafts: 0,
  };

  const filtered = myDealsList.filter(d => {
    if (activeTab === 'active') return d.status === 'available';
    if (activeTab === 'under contract') return d.status === 'under contract';
    return false;
  });

  const totalViews = myDealsList.reduce((sum, d) => sum + (d.views || 0), 0);
  const totalInquiries = myDealsList.reduce((sum, d) => sum + (d.inquiries || 0), 0);

  const handleAction = (requestId, action) => {
    setRequestActions(prev => ({ ...prev, [requestId]: action }));
    showToastMsg(action === 'approved' ? 'Address granted! They\'ll be notified.' : 'Request denied.');
  };

  function handlePostDeal(e) {
    e.preventDefault();
    if (!newDeal.title.trim() || !newDeal.city.trim()) return;
    const deal = {
      id: Date.now(),
      sellerId: currentUser.id,
      title: newDeal.title,
      city: newDeal.city,
      state: newDeal.state,
      price: parseInt(newDeal.contractedPrice) || 0,
      listingPrice: parseInt(newDeal.listingPrice) || 0,
      beds: parseInt(newDeal.beds) || 0,
      baths: parseFloat(newDeal.baths) || 0,
      sqft: parseInt(newDeal.sqft) || 0,
      yearBuilt: parseInt(newDeal.yearBuilt) || 0,
      description: newDeal.description,
      type: newDeal.type,
      status: 'available',
      views: 0,
      inquiries: 0,
      images: [`https://picsum.photos/seed/newdeal${Date.now()}/800/600`],
    };
    setMyDealsList(prev => [deal, ...prev]);
    setShowNewDeal(false);
    setNewDeal({ title: '', type: 'Wholesale', contractedPrice: '', listingPrice: '', beds: '', baths: '', sqft: '', yearBuilt: '', city: '', state: '', description: '', youtubeUrl: '' });
    showToastMsg('Deal posted! You should start receiving address requests soon.');
    setActiveTab('active');
  }

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', paddingBottom: '60px' }}>
      <div style={{ background: '#0d0d1a', borderBottom: '1px solid #1e1e2e', padding: '24px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '28px', margin: 0 }}>My Deals</h1>
              <p style={{ color: '#475569', margin: '4px 0 0', fontSize: '14px' }}>Manage your listings and address requests</p>
            </div>
            <button
              onClick={() => setShowNewDeal(true)}
              className="gradient-btn"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '11px 18px', borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer' }}
            >
              <Plus size={16} /> Post New Deal
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px' }}>
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'Total Deals', value: myDealsList.length, color: '#8b5cf6' },
            { label: 'Active', value: tabsCounts.active, color: '#10b981' },
            { label: 'Under Contract', value: tabsCounts['under contract'], color: '#f59e0b' },
            { label: 'Total Views', value: totalViews, color: '#06b6d4' },
            { label: 'Total Inquiries', value: totalInquiries, color: '#ec4899' },
          ].map(s => (
            <div key={s.label} style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '12px', padding: '16px', transition: 'border-color 0.2s' }}>
              <div style={{ color: '#475569', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{s.label}</div>
              <div style={{ color: s.color, fontWeight: 800, fontSize: '28px', marginTop: '4px' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Promo CTA tip */}
        <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '12px', padding: '14px 18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Rocket size={18} style={{ color: '#f59e0b', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <span style={{ color: '#f8fafc', fontWeight: 600, fontSize: '14px' }}>
              Promoted deals get 3x more address requests.
            </span>
            <span style={{ color: '#94a3b8', fontSize: '13px' }}> Upgrade your listing for $2/day and reach more buyers today.</span>
          </div>
          <button
            onClick={() => filtered[0] && setShowPromo(filtered[0].id)}
            className="gradient-btn"
            style={{ padding: '7px 14px', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '12px', border: 'none', cursor: 'pointer', flexShrink: 0 }}
          >
            Promote a Deal
          </button>
        </div>

        {/* Auto-approve toggle */}
        <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '12px', padding: '14px 18px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '14px' }}>Auto-approve address requests</div>
            <div style={{ color: '#475569', fontSize: '12px' }}>Instantly grant address to all verified users — great for high-volume wholesalers</div>
          </div>
          <button
            onClick={() => { setAutoApprove(!autoApprove); showToastMsg(autoApprove ? 'Manual approval mode on' : 'Auto-approve enabled!'); }}
            style={{
              width: '46px', height: '26px', borderRadius: '13px',
              background: autoApprove ? '#8b5cf6' : '#1e1e2e',
              border: 'none', cursor: 'pointer', position: 'relative', transition: 'all 0.2s',
            }}
          >
            <span style={{
              position: 'absolute', top: '3px', left: autoApprove ? '23px' : '3px',
              width: '20px', height: '20px', borderRadius: '50%', background: '#fff', transition: 'all 0.2s',
            }} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #1e1e2e' }}>
          {['active', 'under contract', 'sold', 'drafts'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
                color: activeTab === tab ? '#8b5cf6' : '#94a3b8',
                fontWeight: 600, fontSize: '14px', textTransform: 'capitalize',
                borderBottom: `2px solid ${activeTab === tab ? '#8b5cf6' : 'transparent'}`,
                marginBottom: '-1px',
              }}
            >
              {tab} ({tabsCounts[tab] || 0})
            </button>
          ))}
        </div>

        {/* Deals List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(deal => {
            const requests = mockAddressRequests[deal.id] || [];
            const isExpanded = expanded === deal.id;
            const viewBars = [6, 8, 5, 9, 7, 10, 8];
            return (
              <div key={deal.id} style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '12px', overflow: 'hidden', transition: 'border-color 0.2s' }}>
                <div
                  onClick={() => setExpanded(isExpanded ? null : deal.id)}
                  style={{ padding: '14px', display: 'flex', gap: '14px', cursor: 'pointer', alignItems: 'center' }}
                >
                  <img src={deal.images[0]} alt="" style={{ width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '15px' }}>{deal.title}</div>
                    <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '2px' }}>{deal.city}, {deal.state}</div>
                    {/* Mini sparkline bars */}
                    <div style={{ display: 'flex', gap: '2px', marginTop: '8px', alignItems: 'flex-end', height: '16px' }}>
                      {viewBars.map((h, i) => (
                        <div key={i} style={{ width: '6px', background: `rgba(139,92,246,${0.3 + (h / 10) * 0.7})`, borderRadius: '2px', height: `${h * 1.5}px` }} />
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '15px' }}>{fmt(deal.listingPrice || deal.price)}</div>
                      <div style={{ color: '#475569', fontSize: '11px' }}>Listing</div>
                    </div>
                    <div style={{ textAlign: 'center', minWidth: '50px' }}>
                      <div style={{ color: '#06b6d4', fontWeight: 700, fontSize: '15px' }}>{deal.views}</div>
                      <div style={{ color: '#475569', fontSize: '11px' }}>Views</div>
                    </div>
                    <div style={{ textAlign: 'center', minWidth: '50px' }}>
                      <div style={{ color: '#ec4899', fontWeight: 700, fontSize: '15px' }}>{deal.inquiries}</div>
                      <div style={{ color: '#475569', fontSize: '11px' }}>Inquiries</div>
                    </div>
                    <div style={{ textAlign: 'center', minWidth: '60px' }}>
                      <div style={{ color: '#8b5cf6', fontWeight: 700, fontSize: '15px' }}>{requests.length}</div>
                      <div style={{ color: '#475569', fontSize: '11px' }}>Requests</div>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); setShowPromo(deal.id); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', borderRadius: '8px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}
                    >
                      <Zap size={12} />
                      Promote
                    </button>
                    {isExpanded ? <ChevronUp size={18} style={{ color: '#94a3b8' }} /> : <ChevronDown size={18} style={{ color: '#94a3b8' }} />}
                  </div>
                </div>
                {isExpanded && (
                  <div style={{ padding: '16px', borderTop: '1px solid #1e1e2e', background: '#0d0d1a' }}>
                    <h4 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '14px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} style={{ color: '#8b5cf6' }} /> Address Requests ({requests.length})
                    </h4>
                    {requests.length === 0 ? (
                      <p style={{ color: '#475569', fontSize: '13px' }}>No requests yet. Promote this deal to get more eyes on it!</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {requests.map(req => {
                          const u = users.find(u => u.id === req.userId) || {};
                          const action = requestActions[req.id];
                          return (
                            <div key={req.id} style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '10px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <img src={u.avatar} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                              <div style={{ flex: 1 }}>
                                <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '13px' }}>{u.name}</div>
                                <div style={{ color: '#94a3b8', fontSize: '11px' }}>
                                  {u.tags?.slice(0, 2).join(' · ')} · {req.timestamp}
                                </div>
                              </div>
                              {action ? (
                                <span style={{
                                  padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 700,
                                  background: action === 'approved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                  color: action === 'approved' ? '#10b981' : '#ef4444',
                                }}>
                                  {action === 'approved' ? '✓ Address Sent' : '✗ Denied'}
                                </span>
                              ) : (
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <button
                                    onClick={() => handleAction(req.id, 'approved')}
                                    style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', cursor: 'pointer', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
                                  >
                                    <Check size={12} /> Give Address
                                  </button>
                                  <button
                                    onClick={() => handleAction(req.id, 'denied')}
                                    style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', cursor: 'pointer', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
                                  >
                                    <XIcon size={12} /> Deny
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                      <Link to={`/marketplace/${deal.id}`} style={{ color: '#8b5cf6', fontSize: '13px', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        View Public Listing →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '16px' }}>
              <TrendingUp size={48} style={{ color: '#8b5cf6', marginBottom: '16px', opacity: 0.3 }} />
              <h3 style={{ color: '#f8fafc', fontWeight: 700, marginBottom: '8px' }}>No deals here yet</h3>
              <p style={{ color: '#475569', fontSize: '14px', marginBottom: '16px' }}>
                {activeTab === 'active' ? 'Post your first deal and start collecting address requests from buyers.' : `No deals in ${activeTab} status.`}
              </p>
              {activeTab === 'active' && (
                <button onClick={() => setShowNewDeal(true)} className="gradient-btn" style={{ padding: '11px 24px', borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer' }}>
                  Post Your First Deal
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post New Deal Modal */}
      {showNewDeal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowNewDeal(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '20px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.8)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #1e1e2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#12121e', zIndex: 1 }}>
              <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '19px', margin: 0 }}>Post New Deal</h2>
              <button onClick={() => setShowNewDeal(false)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}><XIcon size={20} /></button>
            </div>
            <form onSubmit={handlePostDeal} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Deal Title *</label>
                <input value={newDeal.title} onChange={e => setNewDeal({ ...newDeal, title: e.target.value })} placeholder="e.g. 3/2 Brick Ranch - Atlanta, GA — Assignment" className="input-dark" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', fontSize: '14px' }} required />
              </div>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Deal Type</label>
                <select value={newDeal.type} onChange={e => setNewDeal({ ...newDeal, type: e.target.value })} className="input-dark" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', fontSize: '14px' }}>
                  {dealTypes.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Contracted Price ($)</label>
                  <input value={newDeal.contractedPrice} onChange={e => setNewDeal({ ...newDeal, contractedPrice: e.target.value })} placeholder="125000" type="number" className="input-dark" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Listing / Asking Price ($)</label>
                  <input value={newDeal.listingPrice} onChange={e => setNewDeal({ ...newDeal, listingPrice: e.target.value })} placeholder="150000" type="number" className="input-dark" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', fontSize: '14px' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {[
                  { label: 'Beds', key: 'beds', placeholder: '3' },
                  { label: 'Baths', key: 'baths', placeholder: '2' },
                  { label: 'Sq Ft', key: 'sqft', placeholder: '1400' },
                  { label: 'Year Built', key: 'yearBuilt', placeholder: '1985' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>{f.label}</label>
                    <input value={newDeal[f.key]} onChange={e => setNewDeal({ ...newDeal, [f.key]: e.target.value })} placeholder={f.placeholder} type="number" className="input-dark" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', fontSize: '14px' }} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px' }}>
                <div>
                  <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>City *</label>
                  <input value={newDeal.city} onChange={e => setNewDeal({ ...newDeal, city: e.target.value })} placeholder="Atlanta" className="input-dark" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', fontSize: '14px' }} required />
                </div>
                <div>
                  <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>State</label>
                  <input value={newDeal.state} onChange={e => setNewDeal({ ...newDeal, state: e.target.value })} placeholder="GA" maxLength={2} className="input-dark" style={{ width: '70px', padding: '10px 14px', borderRadius: '8px', fontSize: '14px' }} />
                </div>
              </div>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Description</label>
                <textarea value={newDeal.description} onChange={e => setNewDeal({ ...newDeal, description: e.target.value })} placeholder="ARV, repairs needed, deal highlights, timeline..." className="input-dark" rows={4} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', resize: 'vertical' }} />
              </div>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>YouTube Walkthrough URL (optional)</label>
                <input value={newDeal.youtubeUrl} onChange={e => setNewDeal({ ...newDeal, youtubeUrl: e.target.value })} placeholder="https://youtube.com/watch?v=..." className="input-dark" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', fontSize: '14px' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
                <button type="button" onClick={() => setShowNewDeal(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid #1e1e2e', color: '#94a3b8', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button type="submit" className="gradient-btn" style={{ flex: 2, padding: '12px', borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer' }}>Post Deal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Promo Modal */}
      {showPromo && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowPromo(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '20px', width: '100%', maxWidth: '480px', boxShadow: '0 25px 60px rgba(0,0,0,0.8)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #1e1e2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '19px', margin: 0 }}>Promote This Deal</h2>
              <button onClick={() => setShowPromo(null)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}><XIcon size={20} /></button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Boost your deal's visibility and reach more active buyers on TREIM.</p>
              {promoTiers.map(tier => (
                <div key={tier.name} style={{ background: '#1a1a2e', border: `1px solid ${tier.color}30`, borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = tier.color}
                  onMouseLeave={e => e.currentTarget.style.borderColor = `${tier.color}30`}
                  onClick={() => { setShowPromo(null); showToastMsg(`"${tier.name}" promotion activated! Your deal is now boosted.`); }}
                >
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: tier.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '14px' }}>{tier.name}</div>
                    <div style={{ color: '#94a3b8', fontSize: '13px' }}>{tier.desc}</div>
                  </div>
                  <div style={{ color: tier.color, fontWeight: 800, fontSize: '15px', flexShrink: 0 }}>{tier.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
          background: '#12121e', border: '1px solid rgba(16,185,129,0.3)',
          borderRadius: '12px', padding: '14px 18px',
          display: 'flex', alignItems: 'center', gap: '10px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        }}>
          <Check size={16} style={{ color: '#10b981', flexShrink: 0 }} />
          <span style={{ color: '#f8fafc', fontSize: '14px', fontWeight: 500 }}>{toast}</span>
        </div>
      )}
    </div>
  );
}
