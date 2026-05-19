import { useState, useEffect, useMemo } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Shield, Search, Ban, Clock, RotateCcw, ChevronRight, Pencil,
  Users as UsersIcon, FileText, X, Check, AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSEO } from '../hooks/useSEO';
import { users } from '../data/users';
import { deals as mockDeals } from '../data/deals';
import { getStatus, banUser, timeoutUser, clearUser } from '../lib/moderation';
import { listLiveDeals, updateLiveDeal } from '../lib/deals';
import { logActivity } from '../lib/activityLog';

export default function SuperAdmin() {
  useSEO({ title: 'Super Admin' });
  const { isSuperAdmin, currentUser } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('users');
  const [q, setQ] = useState('');
  const [tick, setTick] = useState(0); // re-render when moderation changes
  const [liveDeals, setLiveDeals] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const bump = () => setTick(t => t + 1);
    window.addEventListener('asl-moderation-change', bump);
    return () => window.removeEventListener('asl-moderation-change', bump);
  }, []);

  useEffect(() => {
    listLiveDeals().then(setLiveDeals).catch(() => {});
  }, []);

  const filteredUsers = useMemo(() => {
    const t = q.trim().toLowerCase();
    return users.filter(u =>
      !t || u.name?.toLowerCase().includes(t) || u.email?.toLowerCase().includes(t) || u.username?.toLowerCase().includes(t)
    );
  }, [q, tick]); // eslint-disable-line react-hooks/exhaustive-deps

  const allDeals = useMemo(() => [...liveDeals, ...mockDeals], [liveDeals]);

  // Hooks above run every render; the access guard comes after them.
  if (!isSuperAdmin) return <Navigate to="/" replace />;

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: '#0d0d1a', borderBottom: '1px solid #1e1e2e', padding: '22px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'linear-gradient(135deg,#ef4444,#f59e0b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Shield size={20} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ color: '#f8fafc', fontWeight: 900, fontSize: 22, margin: 0 }}>Super Admin</h1>
            <div style={{ color: '#64748b', fontSize: 12 }}>God mode · {currentUser?.email}</div>
          </div>
          <span style={{
            padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 800,
            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', color: '#f87171',
          }}>
            RESTRICTED
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '18px 20px 0', display: 'flex', gap: 8 }}>
        {[
          { id: 'users', label: 'Users', icon: UsersIcon },
          { id: 'publisher', label: 'Publisher Control', icon: FileText },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '10px 16px', borderRadius: 10, cursor: 'pointer',
              background: tab === id ? 'rgba(239,68,68,0.14)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${tab === id ? 'rgba(239,68,68,0.4)' : '#1e1e2e'}`,
              color: tab === id ? '#f87171' : '#94a3b8', fontWeight: 700, fontSize: 13,
            }}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 20 }}>
        {tab === 'users' ? (
          <>
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: 12, color: '#475569' }} />
              <input
                value={q} onChange={e => setQ(e.target.value)}
                placeholder="Search users by name, email, username…"
                style={{
                  width: '100%', padding: '11px 14px 11px 36px', borderRadius: 10,
                  background: '#12121e', border: '1px solid #1e1e2e', color: '#f8fafc',
                  fontSize: 14, outline: 'none',
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredUsers.map(u => (
                <UserRow key={u.id} user={u} by={currentUser} onOpen={() => navigate(`/super-admin/user/${u.id}`)} />
              ))}
            </div>
          </>
        ) : (
          <PublisherControl deals={allDeals} onEdit={setEditing} />
        )}
      </div>

      {editing && (
        <EditDealModal
          deal={editing}
          by={currentUser}
          onClose={() => setEditing(null)}
          onSaved={(updated) => {
            setLiveDeals(list => list.map(d => d.id === updated.id ? updated : d));
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function UserRow({ user, by, onOpen }) {
  const s = getStatus(user.id);
  const [showTimeout, setShowTimeout] = useState(false);
  return (
    <div style={{
      background: '#12121e', border: '1px solid #1e1e2e', borderRadius: 12,
      padding: 14, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
    }}>
      <img src={user.avatar} alt="" style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 160, cursor: 'pointer' }} onClick={onOpen}>
        <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
          {user.name}
          {s.banned && <Tag color="#ef4444">BANNED</Tag>}
          {s.timedOut && <Tag color="#f59e0b">TIMED OUT</Tag>}
        </div>
        <div style={{ color: '#94a3b8', fontSize: 12 }}>{user.email} · @{user.username}</div>
      </div>

      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
        {s.restricted ? (
          <button onClick={() => clearUser(user.id, by)} style={godBtn('#10b981')}>
            <RotateCcw size={12} /> Lift
          </button>
        ) : (
          <>
            <button onClick={() => banUser(user.id, by, 'Banned by super admin')} style={godBtn('#ef4444')}>
              <Ban size={12} /> Ban
            </button>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowTimeout(v => !v)} style={godBtn('#f59e0b')}>
                <Clock size={12} /> Timeout
              </button>
              {showTimeout && (
                <div style={{
                  position: 'absolute', right: 0, top: '110%', zIndex: 5,
                  background: '#1a1a2e', border: '1px solid #1e1e2e', borderRadius: 10,
                  padding: 6, display: 'flex', flexDirection: 'column', gap: 4, minWidth: 110,
                  boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                }}>
                  {[1, 3, 7, 30].map(d => (
                    <button
                      key={d}
                      onClick={() => { timeoutUser(user.id, d, by, ''); setShowTimeout(false); }}
                      style={{
                        background: 'none', border: 'none', color: '#cbd5e1',
                        textAlign: 'left', padding: '7px 10px', borderRadius: 6,
                        cursor: 'pointer', fontSize: 12, fontWeight: 600,
                      }}
                    >
                      {d} day{d > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        <button onClick={onOpen} style={godBtn('#8b5cf6')}>
          Activity <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}

function PublisherControl({ deals, onEdit }) {
  return (
    <div>
      <div style={{
        background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)',
        borderRadius: 10, padding: '10px 14px', marginBottom: 14,
        color: '#fbbf24', fontSize: 12, display: 'flex', gap: 8,
      }}>
        <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
        You can edit any listing here. Live (user-posted) deals save to the database;
        sample/demo deals are session-only.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {deals.map(d => (
          <div key={d.id} style={{
            background: '#12121e', border: '1px solid #1e1e2e', borderRadius: 12,
            padding: 12, display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <img src={d.images?.[0]} alt="" style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: 14 }}>
                {d.title} {d.isLive && <Tag color="#10b981">LIVE</Tag>}
              </div>
              <div style={{ color: '#94a3b8', fontSize: 12 }}>
                {d.city}, {d.state} · ${(d.listingPrice || d.price || 0).toLocaleString()} · {d.sellerName || d.sellerId}
              </div>
            </div>
            <button onClick={() => onEdit(d)} style={godBtn('#8b5cf6')}>
              <Pencil size={12} /> Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditDealModal({ deal, by, onClose, onSaved }) {
  const [f, setF] = useState({
    title: deal.title || '', listingPrice: deal.listingPrice || deal.price || '',
    arv: deal.arv || '', city: deal.city || '', state: deal.state || '',
    description: deal.description || '', status: deal.status || 'available',
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const up = (k, val) => setF(s => ({ ...s, [k]: val }));

  async function save() {
    setSaving(true); setErr('');
    if (deal.isLive) {
      const res = await updateLiveDeal(deal.id, f);
      if (!res.ok) { setErr(res.reason); setSaving(false); return; }
      logActivity({
        actorId: by?.id || 'super-admin', actorName: by?.name || 'Super Admin',
        type: 'deal_edit',
        detail: `Publisher edit: ${f.title} (${f.city}, ${f.state})`,
        targetId: deal.sellerId,
      });
      onSaved(res.deal);
    } else {
      logActivity({
        actorId: by?.id || 'super-admin', actorName: by?.name || 'Super Admin',
        type: 'deal_edit',
        detail: `Publisher edit (sample/session): ${f.title}`,
        targetId: deal.sellerId,
      });
      onSaved({ ...deal, ...f });
    }
  }

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 700, background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 520, background: '#12121e', border: '1px solid #1e1e2e',
        borderRadius: 18, maxHeight: '92vh', overflowY: 'auto',
      }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #1e1e2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ color: '#f8fafc', fontWeight: 800, fontSize: 16, margin: 0 }}>Edit listing</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
        </div>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            ['Title', 'title', 'text'], ['Listing price', 'listingPrice', 'number'],
            ['ARV', 'arv', 'number'], ['City', 'city', 'text'], ['State', 'state', 'text'],
          ].map(([label, key, type]) => (
            <div key={key}>
              <label style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 5 }}>{label}</label>
              <input type={type} value={f[key]} onChange={e => up(key, e.target.value)} className="input-dark"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 9, fontSize: 13 }} />
            </div>
          ))}
          <div>
            <label style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 5 }}>Description</label>
            <textarea value={f.description} onChange={e => up('description', e.target.value)} rows={4} className="input-dark"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 9, fontSize: 13, resize: 'vertical' }} />
          </div>
          {err && <div style={{ color: '#f87171', fontSize: 12 }}>{err}</div>}
          <button onClick={save} disabled={saving} className="gradient-btn"
            style={{ padding: 12, borderRadius: 10, color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Check size={16} /> {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Tag({ children, color }) {
  return (
    <span style={{
      padding: '2px 7px', borderRadius: 999, fontSize: 9, fontWeight: 800,
      background: `${color}22`, color, border: `1px solid ${color}44`, letterSpacing: 0.3,
    }}>
      {children}
    </span>
  );
}

function godBtn(color) {
  return {
    display: 'flex', alignItems: 'center', gap: 5,
    padding: '7px 11px', borderRadius: 8, cursor: 'pointer',
    background: `${color}18`, border: `1px solid ${color}44`, color,
    fontSize: 12, fontWeight: 700,
  };
}
