import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Users, Plus, X, Check, Search } from 'lucide-react';
import { groups, pendingInvites } from '../data/groups';
import { users } from '../data/users';
import { useAuth } from '../context/AuthContext';

export default function Groups() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('mine');
  const [showCreate, setShowCreate] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '', isPrivate: false, category: 'Networking' });
  const [invites, setInvites] = useState(pendingInvites);
  const [joinedGroups, setJoinedGroups] = useState({});
  const [requestedGroups, setRequestedGroups] = useState({});
  const [createdGroups, setCreatedGroups] = useState([]);
  const [searchVal, setSearchVal] = useState('');
  const [toast, setToast] = useState(null);

  const myGroupsList = groups.filter(g => g.memberIds.includes(currentUser.id));
  const discoverGroupsList = groups.filter(g => !g.memberIds.includes(currentUser.id));
  const INVITE_LIMIT = 20;
  const invitesUsed = 3;

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  const myGroupsAll = [...myGroupsList, ...createdGroups, ...Object.keys(joinedGroups).filter(id => joinedGroups[id]).map(id => discoverGroupsList.find(g => g.id === id)).filter(Boolean)];
  const discoverFiltered = discoverGroupsList.filter(g => !joinedGroups[g.id]);

  const filterGroups = list =>
    searchVal ? list.filter(g => g.name.toLowerCase().includes(searchVal.toLowerCase()) || g.category.toLowerCase().includes(searchVal.toLowerCase())) : list;

  function handleJoin(group) {
    if (group.isPrivate) {
      setRequestedGroups(prev => ({ ...prev, [group.id]: true }));
      showToast(`Request sent to join "${group.name}"`);
    } else {
      setJoinedGroups(prev => ({ ...prev, [group.id]: true }));
      showToast(`You joined "${group.name}"! Welcome aboard.`);
    }
  }

  function handleLeave(groupId, groupName) {
    setJoinedGroups(prev => ({ ...prev, [groupId]: false }));
    showToast(`Left "${groupName}"`);
  }

  function handleCreateGroup() {
    if (!newGroup.name.trim()) return;
    const created = {
      id: `created-${Date.now()}`,
      name: newGroup.name,
      description: newGroup.description,
      isPrivate: newGroup.isPrivate,
      category: newGroup.category,
      memberCount: 1,
      memberIds: [currentUser.id],
      ownerId: currentUser.id,
      bannerImage: `https://picsum.photos/seed/newgroup${Date.now()}/600/200`,
      createdAt: new Date().toISOString(),
    };
    setCreatedGroups(prev => [...prev, created]);
    setShowCreate(false);
    setNewGroup({ name: '', description: '', isPrivate: false, category: 'Networking' });
    showToast(`Group "${created.name}" created! You're the first member.`);
    setActiveTab('mine');
  }

  const currentList = activeTab === 'mine' ? filterGroups(myGroupsAll) : filterGroups(discoverFiltered);

  return (
    <div style={{ background: '#0a0b0a', minHeight: '100vh', paddingBottom: '60px' }}>
      <div style={{ background: '#0e100e', borderBottom: '1px solid #232925', padding: '24px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '28px', margin: 0 }}>REI Groups</h1>
              <p style={{ color: '#5a675f', margin: '4px 0 0', fontSize: '14px' }}>Join communities of like-minded investors</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ color: '#95a29b', fontSize: '13px' }}>
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

        {/* Business CTA */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(0, 200, 5,0.08), rgba(0, 229, 160,0.05))',
          border: '1px solid rgba(0, 200, 5,0.2)',
          borderRadius: '14px', padding: '16px 20px',
          marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>
              The best deals get done in tight networks.
            </div>
            <div style={{ color: '#95a29b', fontSize: '13px' }}>
              Groups with 50+ members close 40% more deals. Create your private deal-sharing group today.
            </div>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="gradient-btn"
            style={{ padding: '10px 20px', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer', flexShrink: 0 }}
          >
            Create Private Group →
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: '400px', marginBottom: '16px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5a675f' }} />
          <input
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            placeholder="Search groups by name or category..."
            className="input-dark"
            style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '10px', fontSize: '14px' }}
          />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '1px solid #232925' }}>
          {[
            { id: 'mine', label: `My Groups (${myGroupsAll.length})` },
            { id: 'discover', label: `Discover (${discoverFiltered.length})` },
            { id: 'invites', label: `Invites (${invites.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
                color: activeTab === tab.id ? '#00c805' : '#95a29b',
                fontWeight: 600, fontSize: '14px',
                borderBottom: `2px solid ${activeTab === tab.id ? '#00c805' : 'transparent'}`,
                marginBottom: '-1px',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'invites' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {invites.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#131614', border: '1px solid #232925', borderRadius: '16px' }}>
                <Users size={48} style={{ color: '#00c805', marginBottom: '16px', opacity: 0.4 }} />
                <h3 style={{ color: '#f8fafc', fontWeight: 700, marginBottom: '8px' }}>No pending invites</h3>
                <p style={{ color: '#5a675f', fontSize: '14px' }}>When someone invites you to a group, it'll show up here</p>
              </div>
            )}
            {invites.map((inv, i) => {
              const g = groups.find(g => g.id === inv.groupId);
              const u = users.find(u => u.id === inv.invitedBy);
              if (!g) return null;
              return (
                <div key={i} style={{ background: '#131614', border: '1px solid #232925', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img src={g.bannerImage} alt="" style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '15px' }}>{g.name}</div>
                    <div style={{ color: '#95a29b', fontSize: '12px' }}>Invited by {u?.name} · {g.memberCount} members</div>
                  </div>
                  <button
                    onClick={() => {
                      setJoinedGroups(prev => ({ ...prev, [g.id]: true }));
                      setInvites(invites.filter((_, idx) => idx !== i));
                      showToast(`Accepted! Welcome to "${g.name}"`);
                      setActiveTab('mine');
                    }}
                    style={{ padding: '8px 14px', borderRadius: '8px', background: 'linear-gradient(135deg, #00c805, #00e5a0)', border: 'none', color: '#fff', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                  >
                    <Check size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Accept
                  </button>
                  <button
                    onClick={() => {
                      setInvites(invites.filter((_, idx) => idx !== i));
                      showToast(`Declined invite to "${g.name}"`, 'info');
                    }}
                    style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                  >
                    Decline
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <>
            {currentList.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#131614', border: '1px solid #232925', borderRadius: '16px' }}>
                <Users size={48} style={{ color: '#00c805', marginBottom: '16px', opacity: 0.4 }} />
                <h3 style={{ color: '#f8fafc', fontWeight: 700, marginBottom: '8px' }}>
                  {searchVal ? `No groups matching "${searchVal}"` : activeTab === 'mine' ? 'No groups yet' : 'No groups to discover'}
                </h3>
                <p style={{ color: '#5a675f', fontSize: '14px', marginBottom: '16px' }}>
                  {activeTab === 'mine' ? 'Join or create your first group to build your network' : 'All available groups have been joined'}
                </p>
                {activeTab === 'mine' && (
                  <button onClick={() => setShowCreate(true)} className="gradient-btn" style={{ padding: '10px 20px', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer' }}>
                    Create Your First Group
                  </button>
                )}
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {currentList.map(g => {
                const isJoined = activeTab === 'mine' || joinedGroups[g.id];
                const isRequested = requestedGroups[g.id];
                return (
                  <div key={g.id} style={{ background: '#131614', border: '1px solid #232925', borderRadius: '12px', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                  >
                    <div style={{ height: '100px', background: `url(${g.bannerImage}) center / cover` }} />
                    <div style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        {g.isPrivate && <Lock size={14} style={{ color: '#f59e0b' }} />}
                        <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '15px' }}>{g.name}</div>
                      </div>
                      <div style={{ color: '#5a675f', fontSize: '11px', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{g.category}</div>
                      <p style={{ color: '#95a29b', fontSize: '12px', margin: '0 0 12px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {g.description}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#5a675f', fontSize: '12px' }}>
                          <Users size={12} /> {g.memberCount.toLocaleString()} members
                        </div>
                        {activeTab === 'mine' ? (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <Link
                              to={`/groups/${g.id}`}
                              style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(0, 200, 5, 0.1)', border: '1px solid rgba(0, 200, 5, 0.3)', color: '#00c805', fontWeight: 700, fontSize: '12px', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}
                            >
                              View
                            </Link>
                            {joinedGroups[g.id] && (
                              <button
                                onClick={() => handleLeave(g.id, g.name)}
                                style={{ padding: '6px 10px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontWeight: 600, fontSize: '11px', cursor: 'pointer' }}
                              >
                                Leave
                              </button>
                            )}
                          </div>
                        ) : isRequested ? (
                          <span style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b', fontSize: '12px', fontWeight: 700 }}>
                            Requested
                          </span>
                        ) : (
                          <button
                            onClick={() => handleJoin(g)}
                            style={{ padding: '6px 12px', borderRadius: '8px', background: 'linear-gradient(135deg, #00c805, #00e5a0)', border: 'none', color: '#fff', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                          >
                            {g.isPrivate ? 'Request to Join' : 'Join'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowCreate(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#131614', border: '1px solid #232925', borderRadius: '20px', width: '100%', maxWidth: '500px' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #232925', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '18px', margin: 0 }}>Create Group</h2>
              <button onClick={() => setShowCreate(false)} style={{ background: 'none', border: 'none', color: '#5a675f', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ color: '#95a29b', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Group Name *</label>
                <input
                  value={newGroup.name}
                  onChange={e => setNewGroup({ ...newGroup, name: e.target.value })}
                  placeholder="e.g. Atlanta Wholesalers Network"
                  className="input-dark"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', fontSize: '14px' }}
                />
              </div>
              <div>
                <label style={{ color: '#95a29b', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Description</label>
                <textarea
                  value={newGroup.description}
                  onChange={e => setNewGroup({ ...newGroup, description: e.target.value })}
                  placeholder="What is this group about? Who should join?"
                  className="input-dark"
                  rows={3}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', fontSize: '14px', resize: 'vertical' }}
                />
              </div>
              <div>
                <label style={{ color: '#95a29b', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Category</label>
                <select
                  value={newGroup.category}
                  onChange={e => setNewGroup({ ...newGroup, category: e.target.value })}
                  className="input-dark"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', fontSize: '14px' }}
                >
                  {['Networking', 'Education', 'Regional', 'Strategy', 'Buyers', 'Services', 'Capital'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <label style={{ display: 'flex', gap: '10px', cursor: 'pointer', padding: '12px', background: '#1a1f1b', borderRadius: '8px', border: '1px solid #232925' }}>
                <input
                  type="checkbox"
                  checked={newGroup.isPrivate}
                  onChange={e => setNewGroup({ ...newGroup, isPrivate: e.target.checked })}
                  style={{ accentColor: '#00c805', width: '16px', height: '16px', marginTop: '2px' }}
                />
                <div>
                  <div style={{ color: '#f8fafc', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Lock size={13} style={{ color: '#f59e0b' }} />
                    Private Group
                  </div>
                  <div style={{ color: '#5a675f', fontSize: '12px', marginTop: '2px' }}>Members must be approved to join. Great for deal-sharing networks.</div>
                </div>
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setShowCreate(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid #232925', color: '#95a29b', cursor: 'pointer', fontWeight: 600 }}>
                  Cancel
                </button>
                <button
                  onClick={handleCreateGroup}
                  className="gradient-btn"
                  style={{ flex: 2, padding: '12px', borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer', opacity: newGroup.name.trim() ? 1 : 0.5 }}
                >
                  Create Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
          background: '#131614', border: '1px solid rgba(16,185,129,0.3)',
          borderRadius: '12px', padding: '14px 18px',
          display: 'flex', alignItems: 'center', gap: '10px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          animation: 'fadeIn 0.3s ease',
        }}>
          <Check size={16} style={{ color: '#10b981', flexShrink: 0 }} />
          <span style={{ color: '#f8fafc', fontSize: '14px', fontWeight: 500 }}>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
