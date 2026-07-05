import { useState, useEffect } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Ban, Clock, RotateCcw, Pencil, FileEdit, MessageSquare,
  MessageCircle, Home, Activity, ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSEO } from '../hooks/useSEO';
import { getUserById } from '../data/users';
import { getActivityForUser } from '../lib/activityLog';
import { getStatus, banUser, timeoutUser, clearUser } from '../lib/moderation';

const TYPE_META = {
  deal_create:      { icon: Home,        color: '#10b981', label: 'Posted a deal' },
  deal_edit:        { icon: FileEdit,    color: '#f59e0b', label: 'Edited a deal' },
  dm_sent:          { icon: MessageSquare,color: '#00c805', label: 'Sent a DM' },
  dm_received:      { icon: MessageCircle,color: '#00e5a0', label: 'Received a DM' },
  address_request:  { icon: Home,        color: '#4ade80', label: 'Requested an address' },
  address_approved: { icon: Home,        color: '#10b981', label: 'Address approved' },
  address_denied:   { icon: Home,        color: '#ef4444', label: 'Address denied' },
  ban:              { icon: Ban,         color: '#ef4444', label: 'Banned' },
  timeout:          { icon: Clock,       color: '#f59e0b', label: 'Timed out' },
  moderation_clear: { icon: RotateCcw,   color: '#10b981', label: 'Restrictions lifted' },
};

export default function SuperAdminUser() {
  const { id } = useParams();
  const { isSuperAdmin, currentUser } = useAuth();
  const user = getUserById(id);
  useSEO({ title: user ? `Activity — ${user.name}` : 'User activity' });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const bump = () => setTick(t => t + 1);
    window.addEventListener('asl-activity-change', bump);
    window.addEventListener('asl-moderation-change', bump);
    window.addEventListener('asl-dm-change', bump);
    return () => {
      window.removeEventListener('asl-activity-change', bump);
      window.removeEventListener('asl-moderation-change', bump);
      window.removeEventListener('asl-dm-change', bump);
    };
  }, []);

  if (!isSuperAdmin) return <Navigate to="/" replace />;
  if (!user) return <Navigate to="/super-admin" replace />;

  const events = getActivityForUser(id); // eslint-disable-line no-unused-vars
  void tick;
  const s = getStatus(id);

  return (
    <div style={{ background: '#0a0b0a', minHeight: '100vh' }}>
      <div style={{ background: '#0e100e', borderBottom: '1px solid #232925', padding: '18px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Link to="/super-admin" style={{ color: '#95a29b', textDecoration: 'none', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
            <ArrowLeft size={14} /> Back to Super Admin
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <img src={user.avatar} alt="" style={{ width: 54, height: 54, borderRadius: '50%', objectFit: 'cover' }} />
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: 19, display: 'flex', alignItems: 'center', gap: 8 }}>
                {user.name}
                {s.banned && <Badge c="#ef4444">BANNED</Badge>}
                {s.timedOut && <Badge c="#f59e0b">TIMED OUT until {new Date(s.timedOutUntil).toLocaleDateString()}</Badge>}
              </div>
              <div style={{ color: '#95a29b', fontSize: 13 }}>{user.email} · @{user.username} · {user.location}</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {s.restricted ? (
                <button onClick={() => clearUser(id, currentUser)} style={btn('#10b981')}><RotateCcw size={13} /> Lift restrictions</button>
              ) : (
                <>
                  <button onClick={() => banUser(id, currentUser, 'Banned by super admin')} style={btn('#ef4444')}><Ban size={13} /> Ban</button>
                  <button onClick={() => timeoutUser(id, 7, currentUser, '')} style={btn('#f59e0b')}><Clock size={13} /> 7-day timeout</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Activity size={16} style={{ color: '#4ade80' }} />
          <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: 17, margin: 0 }}>Activity log</h2>
          <span style={{ color: '#707d75', fontSize: 12 }}>{events.length} events</span>
        </div>

        {events.length === 0 ? (
          <div style={{
            background: '#131614', border: '1px dashed #232925', borderRadius: 14,
            padding: '40px 20px', textAlign: 'center', color: '#95a29b',
          }}>
            <ShieldAlert size={26} style={{ color: '#5a675f', marginBottom: 10 }} />
            <div style={{ fontSize: 14 }}>No recorded activity yet.</div>
            <div style={{ fontSize: 12, color: '#707d75', marginTop: 4 }}>
              Edits, DMs, and address requests are logged here as they happen.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {events.map(e => {
              const m = TYPE_META[e.type] || { icon: Pencil, color: '#95a29b', label: e.type };
              const Icon = m.icon;
              return (
                <div key={e.id} style={{
                  background: '#131614', border: '1px solid #232925', borderRadius: 12,
                  padding: 12, display: 'flex', alignItems: 'flex-start', gap: 12,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: `${m.color}18`, border: `1px solid ${m.color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={15} style={{ color: m.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: 13 }}>
                      {m.label}
                      {e.actorId !== String(id) && <span style={{ color: '#707d75', fontWeight: 500 }}> · by {e.actorName}</span>}
                    </div>
                    {e.detail && <div style={{ color: '#95a29b', fontSize: 12, marginTop: 2, wordBreak: 'break-word' }}>{e.detail}</div>}
                    <div style={{ color: '#5a675f', fontSize: 11, marginTop: 3 }}>
                      {new Date(e.ts).toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Badge({ children, c }) {
  return (
    <span style={{
      padding: '2px 8px', borderRadius: 999, fontSize: 9, fontWeight: 800,
      background: `${c}22`, color: c, border: `1px solid ${c}44`,
    }}>
      {children}
    </span>
  );
}
function btn(c) {
  return {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
    background: `${c}18`, border: `1px solid ${c}44`, color: c,
    fontSize: 12, fontWeight: 700,
  };
}
