import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Wrench, Plus, MessageSquare, User, Radio } from 'lucide-react';
import { useUnreadDMs } from '../hooks/useUnreadDMs';
import { liveNow } from '../data/liveTours';
import { useAuth } from '../context/AuthContext';

/**
 * Mobile bottom nav — Deals · Contractors · POST · Messages · Profile.
 * The POST tab is a raised gradient FAB that sits above the bar — the
 * "do something" action of the whole app.
 */
export default function MobileTabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, requireAuth, requireAuthForDM } = useAuth();
  const unreadDMs = useUnreadDMs();

  function goPostDeal() {
    // Guests get the sign-up prompt; signed-in users land on /my-deals
    // where they can hit "Post a Deal" — no instant modal pop.
    if (!isAuthenticated) {
      requireAuth('post a deal', 'post-deal', '/post-deal');
      return;
    }
    navigate('/post-deal');
  }

  const isActive = (path) => {
    if (path === '/marketplace') return location.pathname === '/' || location.pathname.startsWith('/marketplace');
    return location.pathname.startsWith(path);
  };

  const tabs = [
    { to: '/marketplace', label: 'Deals',       icon: ShoppingBag },
    { to: '/live',        label: 'Live',        icon: Radio, isLive: liveNow.length > 0 },
    { to: '/contractors', label: 'Pros',        icon: Wrench },
    { type: 'fab',        label: 'Post' },
    { to: '/messages',    label: 'DMs',         icon: MessageSquare, badge: unreadDMs },
    { to: currentUser ? `/profile/${currentUser.id}` : '/auth', label: 'Profile', icon: User },
  ];

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(13, 16, 13,0.94)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'space-around',
          zIndex: 100,
        }}
        className="mobile-tab-bar"
      >
        {tabs.map((t, idx) => {
          if (t.type === 'fab') {
            return (
              <button
                key={idx}
                onClick={goPostDeal}
                aria-label="Post a Deal"
                style={{
                  border: 'none',
                  background: 'transparent',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  cursor: 'pointer',
                  position: 'relative',
                  minWidth: 64,
                  padding: '4px 0 6px',
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg,#00c805,#00e5a0)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 28px rgba(0, 200, 5,0.55), 0 0 0 4px rgba(10, 11, 10,0.95)',
                    transform: 'translateY(-18px)',
                  }}
                >
                  <Plus size={28} strokeWidth={2.6} color="#052012" />
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: 0.2,
                  color: '#4ade80', marginTop: -8,
                }}>
                  {t.label}
                </span>
              </button>
            );
          }
          const active = isActive(t.to);
          const Icon = t.icon;
          const gateDM = !isAuthenticated && t.to === '/messages';
          return (
            <Link
              key={t.to}
              to={t.to}
              aria-label={t.label}
              onClick={(e) => {
                if (gateDM) {
                  e.preventDefault();
                  requireAuthForDM('mobile-tab-bar');
                }
              }}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 4px 6px',
                color: active ? '#4ade80' : '#707d75',
                textDecoration: 'none',
                gap: 3,
                transition: 'color 0.15s, transform 0.1s',
              }}
              onTouchStart={(e) => { e.currentTarget.style.transform = 'scale(0.94)'; }}
              onTouchEnd={(e)   => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <span style={{ position: 'relative', display: 'inline-flex' }}>
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                {t.badge > 0 && (
                  <span style={{
                    position: 'absolute', top: -6, right: -10,
                    background: '#ef4444', color: '#fff', borderRadius: 999,
                    minWidth: 16, height: 16, padding: '0 4px',
                    fontSize: 9, fontWeight: 900,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    !{t.badge}
                  </span>
                )}
                {t.isLive && (
                  <span style={{
                    position: 'absolute', top: -3, right: -5,
                    width: 8, height: 8, borderRadius: '50%',
                    background: '#ef4444',
                    animation: 'sponsored-shimmer 1.6s ease-in-out infinite',
                  }} />
                )}
              </span>
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.2 }}>{t.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
