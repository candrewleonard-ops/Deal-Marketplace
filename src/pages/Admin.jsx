import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Shield, Users, Flag, FileText, MessageSquare, ShoppingBag, Wrench, Zap, Ban, Search, Eye, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { users } from '../data/users';
import { deals } from '../data/deals';

const adminTabs = [
  { id: 'dashboard', label: 'Dashboard', icon: Shield },
  { id: 'reports', label: 'Reports', icon: Flag },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'listings', label: 'Listings', icon: FileText },
  { id: 'dms', label: 'DMs', icon: MessageSquare },
  { id: 'posts', label: 'Posts', icon: FileText },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'contractors', label: 'Contractor Orders', icon: Wrench },
  { id: 'sponsored', label: 'Sponsored Ads', icon: Zap },
  { id: 'fbads', label: 'Facebook Ads', icon: Zap },
  { id: 'banned', label: 'Banned Accounts', icon: Ban },
];

const mockReports = [
  { id: 1, type: 'Listing', reporter: 'Diana Cruz', reason: 'Suspicious pricing', date: '2026-04-04', content: 'Phoenix Fixer - $18k' },
  { id: 2, type: 'Post', reporter: 'Marcus Johnson', reason: 'Spam', date: '2026-04-04', content: '"Earn $10k a week with this trick"' },
  { id: 3, type: 'User', reporter: 'Sarah Mitchell', reason: 'Harassment', date: '2026-04-03', content: '@spammer123' },
];

const mockOrders = [
  { id: 'ORD-1001', type: 'Sponsored Listing', user: 'Marcus Johnson', amount: '$20/day', date: '2026-04-04', status: 'Active' },
  { id: 'ORD-1002', type: 'Contractor Purchase', user: 'Diana Cruz', amount: '$149', date: '2026-04-03', status: 'Completed' },
  { id: 'ORD-1003', type: 'FB Ads', user: 'Trevor Banks', amount: '$50/day + $7.50 fee', date: '2026-04-02', status: 'Active' },
];

export default function Admin() {
  const { currentUser } = useAuth();
  const [tab, setTab] = useState('dashboard');
  const [userSearch, setUserSearch] = useState('');
  const [activityUser, setActivityUser] = useState(null);
  const [bannedIds, setBannedIds] = useState(new Set());
  const [orderTab, setOrderTab] = useState('all');

  if (!currentUser?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.username?.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #ef4444, #7f1d1d)', padding: '16px 20px', borderBottom: '1px solid #1e1e2e' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield size={22} style={{ color: '#fff' }} />
          <h1 style={{ color: '#fff', fontWeight: 900, fontSize: '20px', margin: 0 }}>Admin Control Panel</h1>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginLeft: 'auto' }}>Logged in as {currentUser.name}</span>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '220px 1fr', gap: '20px', padding: '20px' }}>
        {/* Sidebar */}
        <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '12px', padding: '8px', height: 'fit-content', position: 'sticky', top: '84px' }}>
          {adminTabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                width: '100%', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px',
                background: tab === id ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                border: 'none', borderRadius: '8px', cursor: 'pointer',
                color: tab === id ? '#8b5cf6' : '#94a3b8',
                fontSize: '13px', fontWeight: 600, textAlign: 'left', marginBottom: '2px',
              }}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {tab === 'dashboard' && (
            <div>
              <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '22px', marginBottom: '16px' }}>Dashboard</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                {[
                  { label: 'Total Users', value: users.length.toLocaleString(), color: '#8b5cf6' },
                  { label: 'Active Listings', value: deals.length, color: '#10b981' },
                  { label: 'Revenue MTD', value: '$18,420', color: '#f59e0b' },
                  { label: 'Reports Pending', value: mockReports.length, color: '#ef4444' },
                ].map(s => (
                  <div key={s.label} style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '12px', padding: '18px' }}>
                    <div style={{ color: '#475569', fontSize: '12px', fontWeight: 600 }}>{s.label}</div>
                    <div style={{ color: s.color, fontWeight: 800, fontSize: '28px', marginTop: '4px' }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'reports' && (
            <div>
              <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '22px', marginBottom: '16px' }}>Reported Content</h2>
              <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '12px', overflow: 'hidden' }}>
                {mockReports.map(r => (
                  <div key={r.id} style={{ padding: '14px 16px', borderBottom: '1px solid #1e1e2e', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontSize: '11px', fontWeight: 700 }}>{r.type}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 600 }}>{r.content}</div>
                      <div style={{ color: '#475569', fontSize: '11px' }}>Reported by {r.reporter} · {r.reason} · {r.date}</div>
                    </div>
                    <button style={{ padding: '6px 12px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Approve</button>
                    <button style={{ padding: '6px 12px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Remove</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'users' && (
            <div>
              <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '22px', marginBottom: '16px' }}>Users</h2>
              <div style={{ position: 'relative', marginBottom: '12px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search users..." className="input-dark" style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', fontSize: '14px' }} />
              </div>
              <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '12px', overflow: 'hidden' }}>
                {filteredUsers.map(u => (
                  <div key={u.id} style={{ padding: '12px 14px', borderBottom: '1px solid #1e1e2e', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={u.avatar} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 600 }}>{u.name} <span style={{ color: '#475569', fontWeight: 400 }}>@{u.username}</span></div>
                      <div style={{ color: '#475569', fontSize: '11px' }}>Last login: 2h ago · {Math.floor(Math.random() * 200)} listings viewed · {Math.floor(Math.random() * 30)} DMs</div>
                    </div>
                    {bannedIds.has(u.id) && <span style={{ padding: '3px 8px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', fontSize: '10px', fontWeight: 700 }}>BANNED</span>}
                    <button onClick={() => setActivityUser(u)} style={{ padding: '6px 10px', background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#8b5cf6', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={11} /> Activity
                    </button>
                    {u.isAdmin ? null : (
                      <button onClick={() => { const n = new Set(bannedIds); n.has(u.id) ? n.delete(u.id) : n.add(u.id); setBannedIds(n); }} style={{ padding: '6px 10px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                        {bannedIds.has(u.id) ? 'Unban' : 'Ban'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'orders' && (
            <div>
              <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '22px', marginBottom: '16px' }}>Orders</h2>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
                {['all', 'contractors', 'sponsored', 'fbads'].map(t => (
                  <button key={t} onClick={() => setOrderTab(t)} style={{ padding: '6px 14px', borderRadius: '20px', background: orderTab === t ? 'rgba(139, 92, 246, 0.2)' : '#1a1a2e', border: `1px solid ${orderTab === t ? '#8b5cf6' : '#1e1e2e'}`, color: orderTab === t ? '#8b5cf6' : '#94a3b8', cursor: 'pointer', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' }}>{t}</button>
                ))}
              </div>
              <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '12px', overflow: 'hidden' }}>
                {mockOrders.map(o => (
                  <div key={o.id} style={{ padding: '12px 14px', borderBottom: '1px solid #1e1e2e', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <code style={{ color: '#8b5cf6', fontSize: '12px' }}>{o.id}</code>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 600 }}>{o.type}</div>
                      <div style={{ color: '#475569', fontSize: '11px' }}>{o.user} · {o.date}</div>
                    </div>
                    <div style={{ color: '#10b981', fontWeight: 700, fontSize: '13px' }}>{o.amount}</div>
                    <span style={{ padding: '3px 10px', borderRadius: '12px', background: o.status === 'Active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(139, 92, 246, 0.15)', color: o.status === 'Active' ? '#10b981' : '#8b5cf6', fontSize: '10px', fontWeight: 700 }}>{o.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(tab === 'banned' || tab === 'listings' || tab === 'dms' || tab === 'posts' || tab === 'contractors' || tab === 'sponsored' || tab === 'fbads') && (
            <div>
              <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '22px', marginBottom: '16px', textTransform: 'capitalize' }}>{adminTabs.find(t => t.id === tab)?.label}</h2>
              <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#475569' }}>
                {tab === 'banned' && bannedIds.size > 0
                  ? `${bannedIds.size} account(s) currently banned`
                  : `${adminTabs.find(t => t.id === tab)?.label} management coming soon.`}
              </div>
            </div>
          )}
        </div>
      </div>

      {activityUser && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setActivityUser(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '16px', width: '100%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ padding: '18px', borderBottom: '1px solid #1e1e2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: '#f8fafc', fontSize: '17px', fontWeight: 800, margin: 0 }}>Activity Log: {activityUser.name}</h3>
              <button onClick={() => setActivityUser(null)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ padding: '18px' }}>
              <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '12px' }}>Recent DMs:</div>
              <div style={{ background: '#1a1a2e', borderRadius: '8px', padding: '12px', fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>
                → "Hey, is your Atlanta deal still available?" (2h ago)<br />
                → "Can you send over the comps?" (5h ago)<br />
                → "Thanks for the referral!" (1d ago)
              </div>
              <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>Viewed listings: 47</div>
              <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>Offers made: 3</div>
              <div style={{ color: '#94a3b8', fontSize: '13px' }}>Account tier: {activityUser.accountTier || 'Basic'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
