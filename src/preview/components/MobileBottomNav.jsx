import { ShoppingBag, TrendingUp, Heart, UsersRound, User } from 'lucide-react';
import { T } from '../theme';

const TABS = [
  { key: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
  { key: 'my-deals',    label: 'My Deals',    icon: TrendingUp },
  { key: 'watchlist',   label: 'Watchlist',   icon: Heart },
  { key: 'groups',      label: 'Groups',      icon: UsersRound },
  { key: 'profile',     label: 'Profile',     icon: User },
];

export default function MobileBottomNav({ active = 'marketplace' }) {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(7,8,11,0.92)',
        backdropFilter: 'blur(16px) saturate(160%)',
        WebkitBackdropFilter: 'blur(16px) saturate(160%)',
        borderTop: `1px solid ${T.border}`,
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 70,
        display: 'flex',
        justifyContent: 'space-around',
      }}
    >
      {TABS.map((t) => {
        const Icon = t.icon;
        const isActive = active === t.key;
        return (
          <button
            key={t.key}
            aria-label={t.label}
            style={{
              flex: 1,
              padding: '10px 4px 6px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              border: 'none',
              background: 'transparent',
              color: isActive ? T.lime : T.textMuted,
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <Icon size={20} strokeWidth={isActive ? 2.6 : 2} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.2 }}>{t.label}</span>
            {isActive && (
              <span
                style={{
                  position: 'absolute',
                  top: 4,
                  width: 22,
                  height: 3,
                  borderRadius: 2,
                  background: T.lime,
                  boxShadow: `0 0 10px ${T.limeGlow}`,
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
