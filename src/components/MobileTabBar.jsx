import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { ShoppingBag, UsersRound, Plus, Heart, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PostDealModal from './PostDealModal';

/**
 * Native-app-style bottom tab bar — visible only on mobile.
 * 5 slots: Browse / Social / Post (FAB) / Saved / Profile
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
    { to: '/marketplace', label: 'Browse', icon: ShoppingBag },
    { to: '/groups',      label: 'Groups', icon: UsersRound },
    { type: 'fab' },
    { to: '/saved',       label: 'Saved',  icon: Heart },
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
          background: 'rgba(13,13,26,0.92)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
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
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  minWidth: 56,
                  padding: '6px 0',
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(139,92,246,0.5)',
                    transform: 'translateY(-12px)',
                  }}
                >
                  <Plus size={26} strokeWidth={2.5} color="#fff" />
                </div>
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
                padding: '8px 4px 4px',
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
