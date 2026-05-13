import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { ShoppingBag, Wrench, Plus, MessageSquare, User, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PostDealModal from './PostDealModal';

/**
 * Mobile bottom nav — Deals · Contractors · POST · Messages · Profile.
 * The POST tab is a raised gradient FAB that sits above the bar — the
 * "do something" action of the whole app.
 */
export default function MobileTabBar() {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [showPostDeal, setShowPostDeal] = useState(false);

  const isActive = (path) => {
    if (path === '/marketplace') return location.pathname === '/' || location.pathname.startsWith('/marketplace');
    return location.pathname.startsWith(path);
  };

  const tabs = [
    { to: '/marketplace', label: 'Deals',       icon: ShoppingBag },
    { to: '/how-to',      label: 'How Tos',     icon: GraduationCap },
    { to: '/contractors', label: 'Pros',        icon: Wrench },
    { type: 'fab',        label: 'Post' },
    { to: '/messages',    label: 'DMs',         icon: MessageSquare },
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
          background: 'rgba(13,13,26,0.94)',
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
                onClick={() => setShowPostDeal(true)}
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
                    background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 28px rgba(139,92,246,0.55), 0 0 0 4px rgba(10,10,15,0.95)',
                    transform: 'translateY(-18px)',
                  }}
                >
                  <Plus size={28} strokeWidth={2.6} color="#fff" />
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: 0.2,
                  color: '#a78bfa', marginTop: -8,
                }}>
                  {t.label}
                </span>
              </button>
            );
          }
          const active = isActive(t.to);
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              aria-label={t.label}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 4px 6px',
                color: active ? '#a78bfa' : '#64748b',
                textDecoration: 'none',
                gap: 3,
                transition: 'color 0.15s, transform 0.1s',
              }}
              onTouchStart={(e) => { e.currentTarget.style.transform = 'scale(0.94)'; }}
              onTouchEnd={(e)   => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.2 }}>{t.label}</span>
            </Link>
          );
        })}
      </nav>

      {showPostDeal && <PostDealModal onClose={() => setShowPostDeal(false)} />}
    </>
  );
}
