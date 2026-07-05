import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell, Heart, MessageSquare, UserPlus, Home, Zap, CheckCircle,
  Calendar, Users, Settings, Trash2, Check
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

function bucketForTime(time = '') {
  const t = time.toLowerCase();
  if (t.includes('min') || t.includes('hour') || t.includes('just now')) return 'Today';
  if (t.includes('1 day')) return 'Yesterday';
  return 'Earlier';
}
const BUCKET_ORDER = ['Today', 'Yesterday', 'Earlier'];

const initialNotifications = [
  {
    id: 1, type: 'address_request', read: false, time: '5 min ago',
    icon: Home, color: '#00c805',
    title: 'New address request',
    body: 'Diana Cruz requested the address for your Atlanta Brick Ranch deal',
    actionLabel: 'Review', actionTo: '/my-deals',
  },
  {
    id: 2, type: 'message', read: false, time: '32 min ago',
    icon: MessageSquare, color: '#00e5a0',
    title: 'New message',
    body: 'Trevor Banks: "Numbers look good, can we schedule a call this week?"',
    actionLabel: 'Reply', actionTo: '/messages',
  },
  {
    id: 3, type: 'follow', read: false, time: '1 hour ago',
    icon: UserPlus, color: '#10b981',
    title: 'New follower',
    body: 'Sarah Mitchell started following you',
    actionLabel: 'View Profile', actionTo: '/profile/4',
  },
  {
    id: 4, type: 'deal', read: true, time: '2 hours ago',
    icon: Home, color: '#00c805',
    title: 'New deal in your market',
    body: 'Marcus Johnson just posted a new fix & flip deal in Atlanta, GA',
    actionLabel: 'View Deal', actionTo: '/marketplace',
  },
  {
    id: 5, type: 'like', read: true, time: '3 hours ago',
    icon: Heart, color: '#ef4444',
    title: 'Post liked',
    body: '12 people liked your post about subject-to deals',
    actionLabel: 'View Post', actionTo: '/social',
  },
  {
    id: 7, type: 'meetup', read: true, time: '1 day ago',
    icon: Calendar, color: '#00e5a0',
    title: 'Upcoming meetup reminder',
    body: 'Dallas REI Meetup is tomorrow at 6pm — 47 investors attending',
    actionLabel: 'View Event', actionTo: '/meetups',
  },
  {
    id: 8, type: 'group_invite', read: true, time: '1 day ago',
    icon: Users, color: '#10b981',
    title: 'Group invite',
    body: 'You\'ve been invited to join "Fix & Flip Mastermind" (Private)',
    actionLabel: 'Respond', actionTo: '/groups',
  },
  {
    id: 9, type: 'address_approved', read: true, time: '2 days ago',
    icon: CheckCircle, color: '#10b981',
    title: 'Address request approved',
    body: 'Robert Hill approved your address request for Kansas City Flip — address unlocked',
    actionLabel: 'View Deal', actionTo: '/marketplace',
  },
];

const FILTERS = [
  { id: 'all',        label: 'All' },
  { id: 'unread',     label: 'Unread' },
  { id: 'deals',      label: 'Deals' },
  { id: 'messages',   label: 'Messages' },
  { id: 'social',     label: 'Social' },
];

export default function Notifications() {
  useSEO({ title: 'Notifications', description: 'Address requests, messages, follows, and deal updates.' });
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState('all');

  const filtered = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    if (filter === 'deals') return ['address_request','deal','address_approved'].includes(n.type);
    if (filter === 'messages') return n.type === 'message';
    if (filter === 'social') return ['follow','like','group_invite','meetup'].includes(n.type);
    return true;
  });

  const grouped = useMemo(() => {
    const buckets = { Today: [], Yesterday: [], Earlier: [] };
    for (const n of filtered) {
      buckets[bucketForTime(n.time)].push(n);
    }
    return buckets;
  }, [filtered]);

  const unreadCount = notifications.filter(n => !n.read).length;

  function markAllRead() {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  }
  function markRead(id) {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  }
  function dismiss(id) {
    setNotifications(notifications.filter(n => n.id !== id));
  }

  return (
    <div style={{ background: '#0a0b0a', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: '#0e100e', borderBottom: '1px solid #232925', padding: '24px 20px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Bell size={22} style={{ color: '#00c805' }} />
              <h1 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '24px', margin: 0 }}>Notifications</h1>
              {unreadCount > 0 && (
                <span style={{
                  background: '#ef4444', color: '#fff',
                  borderRadius: '20px', padding: '2px 10px',
                  fontSize: '12px', fontWeight: 700,
                }}>
                  {unreadCount} new
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '8px 14px', borderRadius: '8px',
                    background: 'rgba(0, 200, 5,0.1)', border: '1px solid rgba(0, 200, 5,0.3)',
                    color: '#4ade80', cursor: 'pointer', fontSize: '12px', fontWeight: 700,
                  }}
                >
                  <Check size={13} /> Mark all read
                </button>
              )}
              <Link
                to="/premium"
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '8px 14px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid #232925',
                  color: '#95a29b', textDecoration: 'none', fontSize: '12px', fontWeight: 700,
                }}
              >
                <Settings size={13} /> Preferences
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                style={{
                  padding: '6px 14px', borderRadius: '20px',
                  background: filter === f.id ? 'linear-gradient(135deg,#00c805,#00e5a0)' : 'rgba(255,255,255,0.04)',
                  border: filter === f.id ? 'none' : '1px solid #232925',
                  color: filter === f.id ? '#fff' : '#95a29b',
                  fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '20px' }}>
        {filtered.length === 0 ? (
          <div style={{ background: '#131614', border: '1px solid #232925', borderRadius: '16px', padding: '60px 20px', textAlign: 'center' }}>
            <Bell size={36} style={{ color: '#5a675f', marginBottom: '12px' }} />
            <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '16px', margin: '0 0 6px' }}>You're all caught up!</h3>
            <p style={{ color: '#95a29b', fontSize: '13px', margin: 0 }}>No notifications matching this filter.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {BUCKET_ORDER.filter(b => grouped[b].length > 0).map(bucket => (
              <div key={bucket}>
                <div style={{
                  color: '#707d75', fontSize: 11, fontWeight: 800,
                  letterSpacing: 1.2, textTransform: 'uppercase',
                  marginBottom: 8, paddingLeft: 4,
                }}>
                  {bucket}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {grouped[bucket].map(n => {
                    const Icon = n.icon;
                    return (
                      <div
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        style={{
                          background: n.read ? '#131614' : 'rgba(0, 200, 5,0.04)',
                          border: `1px solid ${n.read ? '#232925' : 'rgba(0, 200, 5,0.2)'}`,
                          borderRadius: '12px', padding: '14px 16px',
                          display: 'flex', alignItems: 'flex-start', gap: '12px',
                          cursor: 'pointer', transition: 'background 0.15s',
                        }}
                      >
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          background: `${n.color}15`, border: `1px solid ${n.color}30`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <Icon size={16} style={{ color: n.color }} />
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                            <span style={{ color: '#f8fafc', fontWeight: 700, fontSize: '13px' }}>{n.title}</span>
                            {!n.read && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00c805', flexShrink: 0 }} />}
                          </div>
                          <p style={{ color: '#95a29b', fontSize: '13px', margin: '0 0 6px', lineHeight: 1.5 }}>{n.body}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ color: '#5a675f', fontSize: '11px' }}>{n.time}</span>
                            <Link
                              to={n.actionTo}
                              onClick={e => e.stopPropagation()}
                              style={{ color: n.color, fontSize: '11px', fontWeight: 700, textDecoration: 'none' }}
                            >
                              {n.actionLabel} →
                            </Link>
                          </div>
                        </div>

                        <button
                          onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                          style={{
                            background: 'none', border: 'none', color: '#5a675f',
                            cursor: 'pointer', padding: '4px',
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
