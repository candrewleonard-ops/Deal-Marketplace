import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, MessageSquare, MapPin, ChevronDown, ChevronUp, Check, X as XIcon, TrendingUp } from 'lucide-react';
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

export default function MyDeals() {
  const { currentUser } = useAuth();
  const myDeals = deals.filter(d => d.sellerId === currentUser.id);
  const [activeTab, setActiveTab] = useState('active');
  const [expanded, setExpanded] = useState(null);
  const [autoApprove, setAutoApprove] = useState(false);
  const [requestActions, setRequestActions] = useState({});

  const tabsCounts = {
    active: myDeals.filter(d => d.status === 'available').length,
    'under contract': myDeals.filter(d => d.status === 'under contract').length,
    sold: 0, drafts: 0,
  };

  const filtered = myDeals.filter(d => {
    if (activeTab === 'active') return d.status === 'available';
    if (activeTab === 'under contract') return d.status === 'under contract';
    return false;
  });

  const totalViews = myDeals.reduce((sum, d) => sum + (d.views || 0), 0);
  const totalInquiries = myDeals.reduce((sum, d) => sum + (d.inquiries || 0), 0);
  const totalRequests = Object.values(mockAddressRequests).reduce((sum, arr) => sum + arr.length, 0);

  const handleAction = (requestId, action) => {
    setRequestActions(prev => ({ ...prev, [requestId]: action }));
  };

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', paddingBottom: '60px' }}>
      <div style={{ background: '#0d0d1a', borderBottom: '1px solid #1e1e2e', padding: '24px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '28px', margin: 0 }}>My Deals</h1>
              <p style={{ color: '#475569', margin: '4px 0 0', fontSize: '14px' }}>Manage your listings and address requests</p>
            </div>
            <button className="gradient-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '11px 18px', borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer' }}>
              <Plus size={16} /> Post New Deal
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px' }}>
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'Total Deals', value: myDeals.length, color: '#8b5cf6' },
            { label: 'Active', value: tabsCounts.active, color: '#10b981' },
            { label: 'Under Contract', value: tabsCounts['under contract'], color: '#f59e0b' },
            { label: 'Total Views', value: totalViews, color: '#06b6d4' },
            { label: 'Total Inquiries', value: totalInquiries, color: '#ec4899' },
          ].map(s => (
            <div key={s.label} style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '12px', padding: '16px' }}>
              <div style={{ color: '#475569', fontSize: '12px', fontWeight: 600 }}>{s.label}</div>
              <div style={{ color: s.color, fontWeight: 800, fontSize: '28px', marginTop: '4px' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Auto-approve toggle */}
        <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '12px', padding: '14px 18px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '14px' }}>Auto-approve address requests</div>
            <div style={{ color: '#475569', fontSize: '12px' }}>Instantly grant address to verified users</div>
          </div>
          <button
            onClick={() => setAutoApprove(!autoApprove)}
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
            return (
              <div key={deal.id} style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '12px', overflow: 'hidden' }}>
                <div
                  onClick={() => setExpanded(isExpanded ? null : deal.id)}
                  style={{ padding: '14px', display: 'flex', gap: '14px', cursor: 'pointer', alignItems: 'center' }}
                >
                  <img src={deal.images[0]} alt="" style={{ width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '15px' }}>{deal.title}</div>
                    <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '2px' }}>{deal.city}, {deal.state}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '15px' }}>{fmt(deal.listingPrice || deal.price)}</div>
                      <div style={{ color: '#475569', fontSize: '11px' }}>Listing Price</div>
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
                    {isExpanded ? <ChevronUp size={18} style={{ color: '#94a3b8' }} /> : <ChevronDown size={18} style={{ color: '#94a3b8' }} />}
                  </div>
                </div>
                {isExpanded && (
                  <div style={{ padding: '16px', borderTop: '1px solid #1e1e2e', background: '#0d0d1a' }}>
                    <h4 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '14px', marginBottom: '12px' }}>
                      <MapPin size={14} style={{ display: 'inline', marginRight: '6px' }} /> Address Requests ({requests.length})
                    </h4>
                    {requests.length === 0 ? (
                      <p style={{ color: '#475569', fontSize: '13px' }}>No requests yet.</p>
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
                                  {action === 'approved' ? 'Granted' : 'Denied'}
                                </span>
                              ) : (
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <button
                                    onClick={() => handleAction(req.id, 'approved')}
                                    style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', cursor: 'pointer', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
                                  >
                                    <Check size={12} /> Give
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
                    <Link to={`/marketplace/${deal.id}`} style={{ color: '#8b5cf6', fontSize: '13px', fontWeight: 600, textDecoration: 'none', marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      View Public Listing →
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#475569' }}>
              No deals in this category yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
