import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Users, Plus, X, Check } from 'lucide-react';
import { groups, pendingInvites } from '../data/groups';
import { users } from '../data/users';
import { useAuth } from '../context/AuthContext';

export default function Groups() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('mine');
  const [showCreate, setShowCreate] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '', isPrivate: false, category: 'Networking' });
  const [invites, setInvites] = useState(pendingInvites);

  const myGroups = groups.filter(g => g.memberIds.includes(currentUser.id));
  const discoverGroups = groups.filter(g => !g.memberIds.includes(currentUser.id));
  const INVITE_LIMIT = 20;
  const invitesUsed = 3;

  const currentList = activeTab === 'mine' ? myGroups : discoverGroups;

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', paddingBottom: '60px' }}>
      <div style={{ background: '#0d0d1a', borderBottom: '1px solid #1e1e2e', padding: '24px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '28px', margin: 0 }}>REI Groups</h1>
              <p style={{ color: '#475569', margin: '4px 0 0', fontSize: '14px' }}>Join communities of like-minded investors</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ color: '#94a3b8', fontSize: '13px' }}>
                You have <strong style={{ color: '#f8fafc' }}>{INVITE_LIMIT - invitesUsed} / {INVITE_LIMIT}</strong> daily invites remaining
              </div>
              <button
                onClick={() => setShowCreate(true)}
                className="gradient-btn"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer' }}
              >
                <Plus size={16} /> Create Group
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '1px solid #1e1e2e' }}>
          {[
            { id: 'mine', label: `My Groups (${myGroups.length})` },
            { id: 'discover', label: `Discover (${discoverGroups.length})` },
            { id: 'invites', label: `Invites (${invites.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
                color: activeTab === tab.id ? '#8b5cf6' : '#94a3b8',
                fontWeight: 600, fontSize: '14px',
                borderBottom: `2px solid ${activeTab === tab.id ? '#8b5cf6' : 'transparent'}`,
                marginBottom: '-1px',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'invites' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {invites.length === 0 && <div style={{ color: '#475569', textAlign: 'center', padding: '40px' }}>No pending invites.</div>}
            {invites.map((inv, i) => {
              const g = groups.find(g => g.id === inv.groupId);
              const u = users.find(u => u.id === inv.invitedBy);
              if (!g) return null;
              return (
                <div key={i} style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img src={g.bannerImage} alt="" style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '15px' }}>{g.name}</div>
                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>Invited by {u?.name} · {g.memberCount} members</div>
                  </div>
                  <button onClick={() => setInvites(invites.filter((_, idx) => idx !== i))} style={{ padding: '8px 14px', borderRadius: '8px', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', border: 'none', color: '#fff', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                    Accept
                  </button>
                  <button onClick={() => setInvites(invites.filter((_, idx) => idx !== i))} style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                    Decline
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {currentList.map(g => (
              <div key={g.id} style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ height: '100px', background: `url(${g.bannerImage}) center / cover` }} />
                <div style={{ padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    {g.isPrivate && <Lock size={14} style={{ color: '#f59e0b' }} />}
                    <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '15px' }}>{g.name}</div>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 12px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {g.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#475569', fontSize: '12px' }}>
                      <Users size={12} /> {g.memberCount.toLocaleString()} members
                    </div>
                    {activeTab === 'mine' ? (
                      <Link
                        to={`/groups/${g.id}`}
                        style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#8b5cf6', fontWeight: 700, fontSize: '12px', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}
                      >
                        View
                      </Link>
                    ) : (
                      <button style={{ padding: '6px 12px', borderRadius: '8px', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', border: 'none', color: '#fff', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>
                        {g.isPrivate ? 'Request' : 'Join'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '20px', width: '100%', maxWidth: '500px' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #1e1e2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '18px', margin: 0 }}>Create Group</h2>
              <button onClick={() => setShowCreate(false)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Group Name</label>
                <input value={newGroup.name} onChange={e => setNewGroup({ ...newGroup, name: e.target.value })} className="input-dark" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', fontSize: '14px' }} />
              </div>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Description</label>
                <textarea value={newGroup.description} onChange={e => setNewGroup({ ...newGroup, description: e.target.value })} className="input-dark" rows={3} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', fontSize: '14px', resize: 'vertical' }} />
              </div>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Category</label>
                <select value={newGroup.category} onChange={e => setNewGroup({ ...newGroup, category: e.target.value })} className="input-dark" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', fontSize: '14px' }}>
                  {['Networking', 'Education', 'Regional', 'Strategy', 'Buyers', 'Services', 'Capital'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <label style={{ display: 'flex', gap: '10px', cursor: 'pointer', padding: '10px', background: '#1a1a2e', borderRadius: '8px' }}>
                <input type="checkbox" checked={newGroup.isPrivate} onChange={e => setNewGroup({ ...newGroup, isPrivate: e.target.checked })} style={{ accentColor: '#8b5cf6' }} />
                <div>
                  <div style={{ color: '#f8fafc', fontSize: '14px', fontWeight: 600 }}>Private Group</div>
                  <div style={{ color: '#475569', fontSize: '12px' }}>Members must be approved to join</div>
                </div>
              </label>
              <button onClick={() => { setShowCreate(false); alert('Group created!'); }} className="gradient-btn" style={{ padding: '12px', borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer' }}>
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
