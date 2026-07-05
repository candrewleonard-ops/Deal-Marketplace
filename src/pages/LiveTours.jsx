import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Radio, Eye, Video, Calendar, Bell, BellOff, X, ChevronRight,
} from 'lucide-react';
import { liveNow, upcomingTours, getLiveNotifPrefs, setLiveNotifsEnabled, toggleMuteHost, isHostMuted } from '../data/liveTours';
import { getFollowing } from '../lib/inbox';
import { users } from '../data/users';
import { deals, getDealById } from '../data/deals';
import { useAuth } from '../context/AuthContext';
import { useSEO } from '../hooks/useSEO';
import { useIsMobile } from '../hooks/useIsMobile';

const findUser = (id) => users.find(u => String(u.id) === String(id));

export default function LiveTours() {
  useSEO({
    title: 'Live Real Estate Tours',
    description: 'Watch wholesalers walk properties live — ask questions, see the rehab up close, and jump on deals before anyone else.',
  });
  const { isAuthenticated, requireAuth, currentUser } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [showGoLive, setShowGoLive] = useState(false);
  const [goLiveTitle, setGoLiveTitle] = useState('');
  const [goLiveDeal, setGoLiveDeal] = useState('');
  const [prefsTick, setPrefsTick] = useState(0); // re-render after prefs change

  const prefs = getLiveNotifPrefs();
  const following = getFollowing();
  const followedHosts = following.map(findUser).filter(Boolean);

  const myDeals = deals.filter(d => String(d.sellerId) === String(currentUser?.id));

  function openGoLive() {
    if (!isAuthenticated) {
      requireAuth('go live', 'go-live', '/live');
      return;
    }
    setShowGoLive(true);
  }

  function startBroadcast() {
    const title = goLiveTitle.trim() || 'Live property tour';
    setShowGoLive(false);
    navigate('/live/broadcast', { state: { title, dealId: goLiveDeal || null } });
  }

  // scroll lock while the modal is open
  useEffect(() => {
    document.body.style.overflow = showGoLive ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showGoLive]);

  return (
    <div className="page-enter" style={{ background: '#0a0b0a', minHeight: '100vh' }}>
      <style>{`
        @keyframes live-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
      `}</style>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(180deg, #0e100e 0%, #0a0b0a 100%)',
        borderBottom: '1px solid #232925',
        padding: isMobile ? '18px 14px' : '26px 20px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ color: '#f8fafc', fontWeight: 900, fontSize: isMobile ? 22 : 28, margin: 0, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                background: 'rgba(239,68,68,0.14)', border: '1px solid rgba(239,68,68,0.45)',
                color: '#f87171', borderRadius: 999, padding: '4px 12px',
                fontSize: 12, fontWeight: 900, letterSpacing: 1,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'live-pulse 1.4s ease-in-out infinite' }} />
                LIVE
              </span>
              Real Estate Tours
            </h1>
            <p style={{ color: '#95a29b', margin: '6px 0 0', fontSize: 13.5 }}>
              Walk properties with wholesalers in real time — ask questions, see the rehab up close, move first.
            </p>
          </div>
          <button
            onClick={openGoLive}
            className="gradient-btn"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 22px', borderRadius: 12,
              fontWeight: 900, fontSize: 15,
            }}
          >
            <Video size={17} /> Go Live
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '16px 14px 40px' : '24px 20px 60px' }}>
        {/* ── Live now ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0 14px' }}>
          <Radio size={16} style={{ color: '#ef4444' }} />
          <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: 17, margin: 0 }}>Live now</h2>
          <span style={{ color: '#707d75', fontSize: 13 }}>· {liveNow.length} streaming</span>
        </div>
        <div style={{
          display: 'grid', gap: 16,
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))',
        }}>
          {liveNow.map(s => {
            const deal = s.dealId ? getDealById(s.dealId) : null;
            return (
              <Link key={s.id} to={`/live/${s.id}`} className="card-hover" style={{
                textDecoration: 'none', borderRadius: 16, overflow: 'hidden',
                background: '#131614', border: '1px solid #232925', display: 'block',
              }}>
                <div style={{ position: 'relative', aspectRatio: '16 / 9', background: '#1a1f1b' }}>
                  <img src={s.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <span style={{
                    position: 'absolute', top: 10, left: 10,
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: '#ef4444', color: '#fff', borderRadius: 7,
                    padding: '3px 9px', fontSize: 11, fontWeight: 900, letterSpacing: 0.8,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', animation: 'live-pulse 1.4s ease-in-out infinite' }} />
                    LIVE
                  </span>
                  <span style={{
                    position: 'absolute', top: 10, right: 10,
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    background: 'rgba(6,8,6,0.75)', backdropFilter: 'blur(6px)',
                    color: '#f8fafc', borderRadius: 7, padding: '3px 9px',
                    fontSize: 11, fontWeight: 800,
                  }}>
                    <Eye size={12} /> {s.viewers.toLocaleString()}
                  </span>
                </div>
                <div style={{ padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <img src={s.hostAvatar} alt="" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ef4444', flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: 14, lineHeight: 1.35 }} className="line-clamp-2">
                      {s.title}
                    </div>
                    <div style={{ color: '#95a29b', fontSize: 12, marginTop: 3 }}>
                      {s.hostName} · started {s.startedMinutesAgo}m ago
                    </div>
                    {deal && (
                      <div style={{ color: '#4ade80', fontSize: 11.5, fontWeight: 700, marginTop: 3 }}>
                        Touring: {deal.title}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── Upcoming ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '30px 0 14px' }}>
          <Calendar size={16} style={{ color: '#4ade80' }} />
          <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: 17, margin: 0 }}>Coming up</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {upcomingTours.map(t => (
            <div key={t.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: '#131614', border: '1px solid #232925', borderRadius: 14,
              padding: '12px 16px',
            }}>
              <img src={t.hostAvatar} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: 14 }} className="line-clamp-1">{t.title}</div>
                <div style={{ color: '#95a29b', fontSize: 12, marginTop: 2 }}>{t.hostName} · <span style={{ color: '#fbbf24', fontWeight: 700 }}>{t.when}</span></div>
              </div>
              <Link
                to={`/profile/${t.hostId}`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  color: '#4ade80', textDecoration: 'none', fontSize: 12.5, fontWeight: 800, flexShrink: 0,
                }}
              >
                Follow <ChevronRight size={14} />
              </Link>
            </div>
          ))}
        </div>

        {/* ── Notification preferences ── */}
        <div style={{
          marginTop: 30, background: '#131614', border: '1px solid #232925',
          borderRadius: 16, padding: isMobile ? 16 : 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {prefs.enabled ? <Bell size={18} style={{ color: '#00c805' }} /> : <BellOff size={18} style={{ color: '#707d75' }} />}
              <div>
                <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: 15 }}>Live notifications</div>
                <div style={{ color: '#95a29b', fontSize: 12.5, marginTop: 2 }}>
                  When a wholesaler you follow goes live, you get notified. On by default — mute anyone below.
                </div>
              </div>
            </div>
            <button
              onClick={() => { setLiveNotifsEnabled(!prefs.enabled); setPrefsTick(prefsTick + 1); }}
              role="switch"
              aria-checked={prefs.enabled}
              style={{
                width: 52, height: 30, borderRadius: 999, border: 'none', cursor: 'pointer',
                background: prefs.enabled ? '#00c805' : '#38403a',
                position: 'relative', transition: 'background 0.2s', flexShrink: 0,
              }}
            >
              <span style={{
                position: 'absolute', top: 3, left: prefs.enabled ? 25 : 3,
                width: 24, height: 24, borderRadius: '50%', background: '#f8fafc',
                transition: 'left 0.2s',
              }} />
            </button>
          </div>

          {prefs.enabled && followedHosts.length > 0 && (
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #232925' }}>
              <div style={{ color: '#707d75', fontSize: 11, fontWeight: 800, letterSpacing: 0.6, marginBottom: 8 }}>
                PER-WHOLESALER
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {followedHosts.map(u => {
                  const muted = isHostMuted(u.id);
                  return (
                    <button
                      key={u.id}
                      onClick={() => { toggleMuteHost(u.id); setPrefsTick(prefsTick + 1); }}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 7,
                        padding: '6px 12px 6px 6px', borderRadius: 999, cursor: 'pointer',
                        background: muted ? 'rgba(255,255,255,0.04)' : 'rgba(0, 200, 5, 0.10)',
                        border: `1px solid ${muted ? '#38403a' : 'rgba(0, 200, 5, 0.35)'}`,
                        color: muted ? '#707d75' : '#4ade80',
                        fontSize: 12, fontWeight: 700,
                      }}
                    >
                      <img src={u.avatar} alt="" style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', opacity: muted ? 0.5 : 1 }} />
                      {u.name.split(' ')[0]}
                      {muted ? <BellOff size={12} /> : <Bell size={12} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Go Live modal ── */}
      {showGoLive && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
          <div style={{ background: '#131614', border: '1px solid #232925', borderRadius: 20, width: '100%', maxWidth: 460, padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ color: '#f8fafc', fontWeight: 900, fontSize: 19, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Radio size={18} style={{ color: '#ef4444' }} /> Go Live
              </h2>
              <button onClick={() => setShowGoLive(false)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 9, padding: 7, color: '#95a29b', cursor: 'pointer', display: 'flex' }}>
                <X size={17} />
              </button>
            </div>
            <p style={{ color: '#95a29b', fontSize: 13, lineHeight: 1.6, margin: '0 0 14px' }}>
              Your camera starts streaming and <strong style={{ color: '#f8fafc' }}>everyone following you gets a notification</strong> (unless they've muted you). Viewers can comment, like, and request to join your screen.
            </p>
            <label style={{ color: '#95a29b', fontSize: 11, fontWeight: 800, letterSpacing: 0.4, display: 'block', marginBottom: 6 }}>TOUR TITLE</label>
            <input
              value={goLiveTitle}
              onChange={e => setGoLiveTitle(e.target.value)}
              placeholder="e.g. Walking the Dallas duplex — roof & foundation"
              className="input-dark"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, fontSize: 14, marginBottom: 12 }}
            />
            {myDeals.length > 0 && (
              <>
                <label style={{ color: '#95a29b', fontSize: 11, fontWeight: 800, letterSpacing: 0.4, display: 'block', marginBottom: 6 }}>ATTACH A LISTING (OPTIONAL)</label>
                <select
                  value={goLiveDeal}
                  onChange={e => setGoLiveDeal(e.target.value)}
                  className="input-dark"
                  style={{ width: '100%', padding: '12px', borderRadius: 10, fontSize: 14, marginBottom: 12, cursor: 'pointer' }}
                >
                  <option value="">No listing</option>
                  {myDeals.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
                </select>
              </>
            )}
            <button
              onClick={startBroadcast}
              className="gradient-btn"
              style={{ width: '100%', padding: 14, borderRadius: 12, fontWeight: 900, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <Video size={17} /> Start streaming
            </button>
            <div style={{ color: '#707d75', fontSize: 11.5, marginTop: 10, textAlign: 'center' }}>
              Works from your phone or computer — the browser will ask for camera access.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
