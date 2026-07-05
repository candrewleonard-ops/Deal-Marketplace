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
    <div style={{ background: '#0a0b0a', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #ef4444, #7f1d1d)', padding: '16px 20px', borderBottom: '1px solid #232925' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield size={22} style={{ color: '#fff' }} />
          <h1 style={{ color: '#fff', fontWeight: 900, fontSize: '20px', margin: 0 }}>Admin Control Panel</h1>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginLeft: 'auto' }}>Logged in as {currentUser.name}</span>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '220px 1fr', gap: '20px', padding: '20px' }}>
        {/* Sidebar */}
        <div style={{ background: '#131614', border: '1px solid #232925', borderRadius: '12px', padding: '8px', height: 'fit-content', position: 'sticky', top: '84px' }}>
          {adminTabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                width: '100%', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px',
                background: tab === id ? 'rgba(0, 200, 5, 0.15)' : 'transparent',
                border: 'none', borderRadius: '8px', cursor: 'pointer',
                color: tab === id ? '#00c805' : '#95a29b',
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '18px' }}>
                {[
                  { label: 'Total Users', value: users.length.toLocaleString(), color: '#00c805', delta: '+12 this week' },
                  { label: 'Active Listings', value: deals.length, color: '#10b981', delta: '+3 today' },
                  { label: 'Revenue MTD', value: '$18,420', color: '#f59e0b', delta: '+23% vs last month' },
                  { label: 'Reports Pending', value: mockReports.length, color: '#ef4444', delta: 'Needs review' },
                  { label: 'Daily Active', value: '2,840', color: '#00e5a0', delta: '+8% 7-day avg' },
                ].map(s => (
                  <div key={s.label} style={{ background: '#131614', border: '1px solid #232925', borderRadius: '12px', padding: '14px' }}>
                    <div style={{ color: '#5a675f', fontSize: '11px', fontWeight: 600 }}>{s.label}</div>
                    <div style={{ color: s.color, fontWeight: 800, fontSize: '24px', marginTop: '2px' }}>{s.value}</div>
                    <div style={{ color: '#95a29b', fontSize: '11px', marginTop: '2px' }}>{s.delta}</div>
                  </div>
                ))}
              </div>

              {/* Revenue breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ background: '#131614', border: '1px solid #232925', borderRadius: '12px', padding: '16px' }}>
                  <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '14px', marginBottom: '12px' }}>Revenue by Source (MTD)</h3>
                  {[
                    { name: 'Sponsored Listings', amount: 8420, color: '#00c805' },
                    { name: 'Facebook Ads (15%)', amount: 1248, color: '#00e5a0' },
                    { name: 'Premium Subscriptions', amount: 7940, color: '#f59e0b' },
                    { name: 'Contractor Lists', amount: 812, color: '#10b981' },
                  ].map(src => {
                    const pct = (src.amount / 18420) * 100;
                    return (
                      <div key={src.name} style={{ marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ color: '#95a29b', fontSize: '12px' }}>{src.name}</span>
                          <span style={{ color: src.color, fontSize: '12px', fontWeight: 700 }}>${src.amount.toLocaleString()}</span>
                        </div>
                        <div style={{ height: '6px', background: '#232925', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: src.color, borderRadius: '3px' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ background: '#131614', border: '1px solid #232925', borderRadius: '12px', padding: '16px' }}>
                  <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '14px', marginBottom: '12px' }}>Recent Admin Activity</h3>
                  {[
                    { action: 'Banned @spammer123', time: '12m ago', color: '#ef4444' },
                    { action: 'Removed 3 spam posts', time: '48m ago', color: '#f59e0b' },
                    { action: 'Approved listing SPN-501', time: '2h ago', color: '#10b981' },
                    { action: 'Reviewed report #4821', time: '3h ago', color: '#00e5a0' },
                    { action: 'Processed refund', time: '5h ago', color: '#00c805' },
                  ].map((a, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: i < 4 ? '1px solid #232925' : 'none' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: a.color, flexShrink: 0 }} />
                      <span style={{ flex: 1, color: '#f8fafc', fontSize: '12px' }}>{a.action}</span>
                      <span style={{ color: '#5a675f', fontSize: '11px' }}>{a.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'reports' && (
            <div>
              <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '22px', marginBottom: '16px' }}>Reported Content</h2>
              <div style={{ background: '#131614', border: '1px solid #232925', borderRadius: '12px', overflow: 'hidden' }}>
                {mockReports.map(r => (
                  <div key={r.id} style={{ padding: '14px 16px', borderBottom: '1px solid #232925', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontSize: '11px', fontWeight: 700 }}>{r.type}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 600 }}>{r.content}</div>
                      <div style={{ color: '#5a675f', fontSize: '11px' }}>Reported by {r.reporter} · {r.reason} · {r.date}</div>
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
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5a675f' }} />
                <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search users..." className="input-dark" style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', fontSize: '14px' }} />
              </div>
              <div style={{ background: '#131614', border: '1px solid #232925', borderRadius: '12px', overflow: 'hidden' }}>
                {filteredUsers.map(u => (
                  <div key={u.id} style={{ padding: '12px 14px', borderBottom: '1px solid #232925', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={u.avatar} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 600 }}>{u.name} <span style={{ color: '#5a675f', fontWeight: 400 }}>@{u.username}</span></div>
                      <div style={{ color: '#5a675f', fontSize: '11px' }}>Last login: 2h ago · {Math.floor(Math.random() * 200)} listings viewed · {Math.floor(Math.random() * 30)} DMs</div>
                    </div>
                    {bannedIds.has(u.id) && <span style={{ padding: '3px 8px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', fontSize: '10px', fontWeight: 700 }}>BANNED</span>}
                    <button onClick={() => setActivityUser(u)} style={{ padding: '6px 10px', background: 'rgba(0, 200, 5, 0.15)', border: '1px solid rgba(0, 200, 5, 0.3)', color: '#00c805', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
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
                  <button key={t} onClick={() => setOrderTab(t)} style={{ padding: '6px 14px', borderRadius: '20px', background: orderTab === t ? 'rgba(0, 200, 5, 0.2)' : '#1a1f1b', border: `1px solid ${orderTab === t ? '#00c805' : '#232925'}`, color: orderTab === t ? '#00c805' : '#95a29b', cursor: 'pointer', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' }}>{t}</button>
                ))}
              </div>
              <div style={{ background: '#131614', border: '1px solid #232925', borderRadius: '12px', overflow: 'hidden' }}>
                {mockOrders.map(o => (
                  <div key={o.id} style={{ padding: '12px 14px', borderBottom: '1px solid #232925', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <code style={{ color: '#00c805', fontSize: '12px' }}>{o.id}</code>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 600 }}>{o.type}</div>
                      <div style={{ color: '#5a675f', fontSize: '11px' }}>{o.user} · {o.date}</div>
                    </div>
                    <div style={{ color: '#10b981', fontWeight: 700, fontSize: '13px' }}>{o.amount}</div>
                    <span style={{ padding: '3px 10px', borderRadius: '12px', background: o.status === 'Active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0, 200, 5, 0.15)', color: o.status === 'Active' ? '#10b981' : '#00c805', fontSize: '10px', fontWeight: 700 }}>{o.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'listings' && (
            <div>
              <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '22px', marginBottom: '16px' }}>Listings</h2>
              <div style={{ background: '#131614', border: '1px solid #232925', borderRadius: '12px', overflow: 'hidden' }}>
                {deals.slice(0, 12).map(d => (
                  <div key={d.id} style={{ padding: '12px 14px', borderBottom: '1px solid #232925', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={d.images?.[0]} alt="" style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.title}</div>
                      <div style={{ color: '#5a675f', fontSize: '11px' }}>{d.city}, {d.state} · ${(d.listingPrice || d.price).toLocaleString()} · {d.sellerName}</div>
                    </div>
                    {d.isSponsored && <span style={{ padding: '3px 8px', borderRadius: '12px', background: 'rgba(0, 200, 5,0.15)', color: '#00c805', fontSize: '10px', fontWeight: 700 }}>SPONSORED</span>}
                    <span style={{ padding: '3px 10px', borderRadius: '12px', background: d.status === 'available' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: d.status === 'available' ? '#10b981' : '#ef4444', fontSize: '10px', fontWeight: 700 }}>{d.status.toUpperCase()}</span>
                    <button style={{ padding: '6px 10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Remove</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'dms' && (
            <div>
              <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '22px', marginBottom: '16px' }}>Flagged DMs</h2>
              <div style={{ background: '#131614', border: '1px solid #232925', borderRadius: '12px', overflow: 'hidden' }}>
                {[
                  { from: 'spammer123', to: 'Marcus Johnson', preview: 'Hey, check out this investment opportunity...', flag: 'spam', date: '2h ago' },
                  { from: 'Diana Cruz', to: 'Sarah Mitchell', preview: 'Is this deal real? Numbers seem off.', flag: 'concern', date: '5h ago' },
                  { from: 'unknown_99', to: 'Trevor Banks', preview: 'Send me your contract info directly...', flag: 'interference', date: '1d ago' },
                  { from: 'Kevin Washington', to: 'Greg Mason', preview: "What's your asking price?", flag: 'review', date: '1d ago' },
                ].map((dm, i) => (
                  <div key={i} style={{ padding: '14px 16px', borderBottom: '1px solid #232925' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 600 }}>{dm.from}</span>
                      <span style={{ color: '#5a675f', fontSize: '11px' }}>→</span>
                      <span style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 600 }}>{dm.to}</span>
                      <span style={{ marginLeft: 'auto', padding: '2px 8px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>{dm.flag}</span>
                      <span style={{ color: '#5a675f', fontSize: '11px' }}>{dm.date}</span>
                    </div>
                    <div style={{ color: '#95a29b', fontSize: '12px', fontStyle: 'italic', marginBottom: '8px' }}>"{dm.preview}"</div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button style={{ padding: '4px 10px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Dismiss</button>
                      <button style={{ padding: '4px 10px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#f59e0b', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Warn user</button>
                      <button style={{ padding: '4px 10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Suspend</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'posts' && (
            <div>
              <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '22px', marginBottom: '16px' }}>Flagged Posts</h2>
              <div style={{ background: '#131614', border: '1px solid #232925', borderRadius: '12px', overflow: 'hidden' }}>
                {[
                  { user: 'moneymaker_99', content: 'Make $10k/week with no money down! DM me for secret strategy 🤑', reason: 'spam', likes: 2 },
                  { user: 'Diana Cruz', content: 'This market is crashing hard. Sell everything now!', reason: 'misinformation', likes: 12 },
                  { user: 'wholesale_pro', content: "Don't use @MarcusJohnson, total scammer", reason: 'harassment', likes: 4 },
                ].map((p, i) => (
                  <div key={i} style={{ padding: '14px 16px', borderBottom: '1px solid #232925' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 700 }}>@{p.user}</span>
                      <span style={{ padding: '2px 8px', borderRadius: '12px', background: 'rgba(239,68,68,0.12)', color: '#ef4444', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>{p.reason}</span>
                      <span style={{ marginLeft: 'auto', color: '#5a675f', fontSize: '11px' }}>{p.likes} likes</span>
                    </div>
                    <p style={{ color: '#95a29b', fontSize: '13px', margin: '0 0 10px', lineHeight: 1.5 }}>{p.content}</p>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button style={{ padding: '4px 10px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Keep</button>
                      <button style={{ padding: '4px 10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Delete Post</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'contractors' && (
            <div>
              <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '22px', marginBottom: '16px' }}>Contractor List Orders</h2>
              <div style={{ background: '#131614', border: '1px solid #232925', borderRadius: '12px', overflow: 'hidden' }}>
                {[
                  { id: 'CLO-2301', user: 'Diana Cruz', city: 'Phoenix, AZ', trades: 'Full Stack (14)', amount: '$14.00', date: '2026-04-04' },
                  { id: 'CLO-2302', user: 'Trevor Banks', city: 'Dallas, TX', trades: 'HVAC, Plumbing, Electric (6)', amount: '$6.00', date: '2026-04-04' },
                  { id: 'CLO-2303', user: 'Sarah Mitchell', city: 'Houston, TX', trades: 'Full Stack (14)', amount: '$14.00', date: '2026-04-03' },
                  { id: 'CLO-2304', user: 'Kevin Washington', city: 'Memphis, TN', trades: 'Painting, Flooring (4)', amount: '$4.00', date: '2026-04-03' },
                ].map(o => (
                  <div key={o.id} style={{ padding: '12px 14px', borderBottom: '1px solid #232925', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <code style={{ color: '#00e5a0', fontSize: '11px' }}>{o.id}</code>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 600 }}>{o.user}</div>
                      <div style={{ color: '#5a675f', fontSize: '11px' }}>{o.city} · {o.trades}</div>
                    </div>
                    <div style={{ color: '#10b981', fontWeight: 800, fontSize: '14px' }}>{o.amount}</div>
                    <div style={{ color: '#5a675f', fontSize: '11px' }}>{o.date}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '12px', padding: '14px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', fontSize: '13px', color: '#10b981' }}>
                Total contractor revenue MTD: <strong>$812.00</strong> · 58 lists sold
              </div>
            </div>
          )}

          {tab === 'sponsored' && (
            <div>
              <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '22px', marginBottom: '16px' }}>Sponsored Listing Orders</h2>
              <div style={{ background: '#131614', border: '1px solid #232925', borderRadius: '12px', overflow: 'hidden' }}>
                {[
                  { id: 'SPN-501', user: 'Marcus Johnson', deal: 'Atlanta Brick Ranch', tier: 'Featured', rate: '$20/day', spent: '$140', status: 'Active' },
                  { id: 'SPN-502', user: 'Sarah Mitchell', deal: 'Houston Subject-To', tier: 'Pro', rate: '$10/day', spent: '$70', status: 'Active' },
                  { id: 'SPN-503', user: 'Trevor Banks', deal: 'Dallas Duplex', tier: 'Growth', rate: '$5/day', spent: '$35', status: 'Active' },
                  { id: 'SPN-504', user: 'Robert Hill', deal: 'Kansas City Flip', tier: 'Starter', rate: '$2/day', spent: '$18', status: 'Paused' },
                ].map(o => (
                  <div key={o.id} style={{ padding: '12px 14px', borderBottom: '1px solid #232925', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <code style={{ color: '#00c805', fontSize: '11px' }}>{o.id}</code>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 600 }}>{o.deal}</div>
                      <div style={{ color: '#5a675f', fontSize: '11px' }}>{o.user} · {o.tier} · {o.rate}</div>
                    </div>
                    <div style={{ color: '#10b981', fontWeight: 800, fontSize: '14px' }}>{o.spent}</div>
                    <span style={{ padding: '3px 10px', borderRadius: '12px', background: o.status === 'Active' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: o.status === 'Active' ? '#10b981' : '#f59e0b', fontSize: '10px', fontWeight: 700 }}>{o.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'fbads' && (
            <div>
              <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '22px', marginBottom: '16px' }}>Facebook Ads Campaigns</h2>
              <div style={{ background: '#131614', border: '1px solid #232925', borderRadius: '12px', overflow: 'hidden' }}>
                {[
                  { id: 'FBA-101', user: 'Marcus Johnson', budget: 50, impressions: '12,400', clicks: 287, leads: 34, fee: 7.50 },
                  { id: 'FBA-102', user: 'Sarah Mitchell', budget: 20, impressions: '4,820', clicks: 93, leads: 12, fee: 3.00 },
                  { id: 'FBA-103', user: 'Diana Cruz', budget: 100, impressions: '28,100', clicks: 612, leads: 78, fee: 15.00 },
                ].map(o => (
                  <div key={o.id} style={{ padding: '14px 16px', borderBottom: '1px solid #232925' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <code style={{ color: '#00e5a0', fontSize: '11px' }}>{o.id}</code>
                      <span style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 600 }}>{o.user}</span>
                      <span style={{ marginLeft: 'auto', color: '#10b981', fontWeight: 800, fontSize: '14px' }}>${o.fee}/day fee</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                      {[
                        ['Budget', `$${o.budget}/day`, '#f8fafc'],
                        ['Impressions', o.impressions, '#00e5a0'],
                        ['Clicks', o.clicks, '#00c805'],
                        ['Leads', o.leads, '#10b981'],
                      ].map(([l, v, c]) => (
                        <div key={l} style={{ background: '#1a1f1b', borderRadius: '8px', padding: '8px 10px' }}>
                          <div style={{ color: '#5a675f', fontSize: '10px', fontWeight: 700 }}>{l}</div>
                          <div style={{ color: c, fontWeight: 700, fontSize: '14px' }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '12px', padding: '14px', background: 'rgba(0, 229, 160,0.05)', border: '1px solid rgba(0, 229, 160,0.2)', borderRadius: '10px', fontSize: '13px', color: '#00e5a0' }}>
                15% platform fee revenue MTD: <strong>$1,247.50</strong>
              </div>
            </div>
          )}

          {tab === 'banned' && (
            <div>
              <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '22px', marginBottom: '16px' }}>Banned Accounts</h2>
              {bannedIds.size === 0 ? (
                <div style={{ background: '#131614', border: '1px solid #232925', borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
                  <Ban size={32} style={{ color: '#5a675f', marginBottom: '10px' }} />
                  <div style={{ color: '#95a29b', fontSize: '14px', fontWeight: 600 }}>No banned accounts</div>
                  <div style={{ color: '#5a675f', fontSize: '12px', marginTop: '4px' }}>Accounts you ban from the Users tab will appear here with IP ban info.</div>
                </div>
              ) : (
                <div style={{ background: '#131614', border: '1px solid #232925', borderRadius: '12px', overflow: 'hidden' }}>
                  {Array.from(bannedIds).map(uid => {
                    const u = users.find(x => x.id === uid);
                    if (!u) return null;
                    return (
                      <div key={uid} style={{ padding: '12px 14px', borderBottom: '1px solid #232925', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={u.avatar} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', opacity: 0.4 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 600 }}>{u.name} <span style={{ color: '#5a675f' }}>@{u.username}</span></div>
                          <div style={{ color: '#ef4444', fontSize: '11px' }}>IP 192.168.{Math.floor(Math.random() * 255)}.{Math.floor(Math.random() * 255)} · Banned 2h ago</div>
                        </div>
                        <button onClick={() => { const n = new Set(bannedIds); n.delete(uid); setBannedIds(n); }} style={{ padding: '6px 12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Unban</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {activityUser && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setActivityUser(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#131614', border: '1px solid #232925', borderRadius: '16px', width: '100%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ padding: '18px', borderBottom: '1px solid #232925', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: '#f8fafc', fontSize: '17px', fontWeight: 800, margin: 0 }}>Activity Log: {activityUser.name}</h3>
              <button onClick={() => setActivityUser(null)} style={{ background: 'none', border: 'none', color: '#5a675f', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ padding: '18px' }}>
              <div style={{ color: '#95a29b', fontSize: '13px', marginBottom: '12px' }}>Recent DMs:</div>
              <div style={{ background: '#1a1f1b', borderRadius: '8px', padding: '12px', fontSize: '12px', color: '#95a29b', marginBottom: '12px' }}>
                → "Hey, is your Atlanta deal still available?" (2h ago)<br />
                → "Can you send over the comps?" (5h ago)<br />
                → "Thanks for the referral!" (1d ago)
              </div>
              <div style={{ color: '#95a29b', fontSize: '13px', marginBottom: '8px' }}>Viewed listings: 47</div>
              <div style={{ color: '#95a29b', fontSize: '13px', marginBottom: '8px' }}>Offers made: 3</div>
              <div style={{ color: '#95a29b', fontSize: '13px' }}>Account tier: {activityUser.accountTier || 'Basic'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
