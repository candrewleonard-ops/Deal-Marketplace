import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingBag, Users, Wrench, Calendar, Bell, MessageSquare,
  Plus, Search, ChevronDown, Menu, X, LogOut, User, Settings, TrendingUp,
  Crown, Shield, UsersRound, Heart, GraduationCap, Radio
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { users as testUsers } from '../data/users';
import { useIsMobile } from '../hooks/useIsMobile';
import CyclingText from './CyclingText';
import { useUnreadDMs } from '../hooks/useUnreadDMs';
import { liveNow, notifiableLiveSessions } from '../data/liveTours';
import { getFollowing } from '../lib/inbox';
import Logo from './Logo';

const HOWTO_PHRASES = [
  'Buy Fix n Flips',
  'Buy Rentals',
  'With No Credit',
  'Get More Deals',
  'Wholesale',
  'Find Wholesale Deals',
];

// Primary nav (Social is intentionally tucked into the More section — it's still
// accessible from the drawer / More menu, just no longer a top-level tab).
const primaryNav = [
  { to: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
  { to: '/live',        label: 'Live',        icon: Radio, isLive: true },
  { to: '/my-deals',    label: 'My Deals',    icon: TrendingUp },
  { to: '/groups',      label: 'Groups',      icon: UsersRound },
  { to: '/contractors', label: 'Contractors', icon: Wrench },
  { to: '/how-to',      label: 'How Tos - All Industries', icon: GraduationCap },
];

const drawerSecondary = [
  { to: '/saved',         label: 'Saved Deals',  icon: Heart },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/messages',      label: 'Messages',     icon: MessageSquare },
  { to: '/premium',       label: 'Premium',      icon: Crown },
];

const drawerMore = [
  { to: '/social', label: 'Social Feed', icon: Users },
];

export default function Navbar() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { currentUser, isAuthenticated, setCurrentUserId } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const unreadDMs = useUnreadDMs();

  // The nav must fit ANY viewport without pushing the right-side buttons
  // off-screen (Windows display scaling makes 1920 screens ~1280 CSS px).
  // Three desktop tiers: full ≥1500, condensed ≥1200, compact below that.
  const [navW, setNavW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1600);
  useEffect(() => {
    const onResize = () => setNavW(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const tier = navW >= 1500 ? 'full' : navW >= 1200 ? 'condensed' : 'compact';
  // Compact screens tuck the low-traffic links into a More menu.
  const inlineNav = tier === 'compact'
    ? primaryNav.filter(n => ['/marketplace', '/live', '/my-deals'].includes(n.to))
    : primaryNav.filter(n => n.to !== '/how-to');
  const moreNav = tier === 'compact'
    ? primaryNav
        .filter(n => !['/marketplace', '/live', '/my-deals'].includes(n.to))
        .map(n => (n.to === '/how-to' ? { ...n, label: 'How Tos' } : n))
    : [];

  // Live-tour alerts for wholesalers you follow (default on; managed on /live).
  // Demo notifications are gone — this list is real signals only now.
  const liveAlerts = notifiableLiveSessions(getFollowing()).map(s => ({
    id: `live-${s.id}`,
    text: `🔴 ${s.hostName} is LIVE — ${s.title}`,
    time: `${s.startedMinutesAgo}m ago`,
    unread: true,
    to: `/live/${s.id}`,
  }));
  const notifications = [...liveAlerts];
  const unreadCount = notifications.filter(n => n.unread).length + unreadDMs;

  return (
    <nav
      style={{
        background: 'rgba(13, 16, 13,0.92)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: isMobile ? '0 12px' : '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: isMobile ? 56 : 64, gap: isMobile ? 8 : (tier === 'full' ? 20 : 10) }}>
          {/* Logo */}
          <Link to="/marketplace" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <Logo size={isMobile ? 'sm' : 'sm'} />
          </Link>

          {/* DESKTOP: inline nav links */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0, overflow: 'hidden' }}>
              {inlineNav.map(({ to, label, icon: Icon, isLive }) => {
                const active = location.pathname === to || (to === '/marketplace' && location.pathname === '/');
                const liveCount = isLive ? liveNow.length : 0;
                return (
                  <Link
                    key={to}
                    to={to}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '6px 12px', borderRadius: 8, textDecoration: 'none',
                      fontSize: 14, fontWeight: 600,
                      color: active ? '#00c805' : (isLive ? '#f87171' : '#95a29b'),
                      background: active ? 'rgba(0, 200, 5,0.1)' : 'transparent',
                      borderBottom: active ? '2px solid #00c805' : '2px solid transparent',
                      transition: 'all 0.2s',
                      paddingBottom: 4,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Icon size={16} />
                    {label}
                    {liveCount > 0 && (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        background: 'rgba(239,68,68,0.14)', border: '1px solid rgba(239,68,68,0.4)',
                        color: '#f87171', borderRadius: 999, padding: '1px 7px',
                        fontSize: 10, fontWeight: 900, letterSpacing: 0.4,
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', animation: 'sponsored-shimmer 1.6s ease-in-out infinite' }} />
                        {liveCount}
                      </span>
                    )}
                  </Link>
                );
              })}
              {/* How Tos (with cycling text) — shortens as the viewport tightens */}
              {tier !== 'compact' && (() => {
                const active = location.pathname === '/how-to';
                return (
                  <Link
                    to="/how-to"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '6px 12px', borderRadius: 8, textDecoration: 'none',
                      fontSize: 14, fontWeight: 600,
                      color: active ? '#4ade80' : '#95a29b',
                      background: active ? 'rgba(0, 200, 5,0.1)' : 'transparent',
                      borderBottom: active ? '2px solid #00c805' : '2px solid transparent',
                      transition: 'all 0.2s',
                      paddingBottom: 4,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <GraduationCap size={16} />
                    <span>{tier === 'full' ? 'How Tos \u2014 All Industries' : 'How Tos'}</span>{' '}
                    {tier === 'full' && <CyclingText
                      phrases={HOWTO_PHRASES}
                      interval={3000}
                      textStyle={{
                        background: 'linear-gradient(135deg,#00c805,#00e5a0)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        color: 'transparent',
                        fontWeight: 800,
                      }}
                    />}
                  </Link>
                );
              })()}

              {/* Compact screens: overflow links live in a More menu */}
              {moreNav.length > 0 && (
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <button
                    onClick={() => { setMoreOpen(!moreOpen); setUserMenuOpen(false); setNotifOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      padding: '6px 10px 4px', borderRadius: 8,
                      background: moreOpen ? 'rgba(0, 200, 5,0.1)' : 'transparent',
                      border: 'none', cursor: 'pointer',
                      fontSize: 14, fontWeight: 600, color: '#95a29b',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    More <ChevronDown size={14} style={{ transform: moreOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                  </button>
                  {moreOpen && (
                    <div style={{
                      position: 'absolute', left: 0, top: 42,
                      background: '#131614', border: '1px solid #232925',
                      borderRadius: 12, width: 200, zIndex: 100,
                      boxShadow: '0 20px 60px rgba(0,0,0,0.5)', overflow: 'hidden',
                    }}>
                      {moreNav.map(({ to, label, icon: Icon }) => (
                        <Link
                          key={to}
                          to={to}
                          onClick={() => setMoreOpen(false)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '10px 14px', color: location.pathname === to ? '#4ade80' : '#e4eae6',
                            textDecoration: 'none', fontSize: 14, fontWeight: 600,
                            background: location.pathname === to ? 'rgba(0, 200, 5,0.08)' : 'transparent',
                          }}
                        >
                          <Icon size={16} /> {label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Search (desktop only) */}
          {!isMobile && (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flexShrink: 1, minWidth: 120 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, color: '#5a675f', pointerEvents: 'none' }} />
              <input
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder={tier === 'full' ? 'Search deals, investors...' : 'Search…'}
                className="input-dark"
                style={{
                  paddingLeft: 36, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
                  borderRadius: 8, fontSize: 14,
                  width: tier === 'full' ? 220 : tier === 'condensed' ? 170 : 140,
                  maxWidth: '100%',
                }}
              />
            </div>
          )}

          {/* Right cluster */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto', flexShrink: 0 }}>
            {currentUser?.isAdmin && !isMobile && (
              <Link
                to="/admin"
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 12px', borderRadius: 8,
                  background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)',
                  color: '#ef4444', textDecoration: 'none', fontSize: 13, fontWeight: 700,
                }}
              >
                <Shield size={14} /> Admin
              </Link>
            )}

            {/* Post Deal button — desktop only (mobile has FAB in tab bar) */}
            {!isMobile && isAuthenticated && (
              <Link
                to="/post-deal"
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: 8,
                  background: 'transparent',
                  border: '1px solid rgba(0, 200, 5, 0.55)',
                  color: '#4ade80', cursor: 'pointer',
                  fontSize: 14, fontWeight: 700, textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <Plus size={16} />
                Post a Deal
              </Link>
            )}

            {/* Guest CTA — desktop */}
            {!isMobile && !isAuthenticated && (
              <Link
                to="/auth?tab=register"
                className="gradient-btn"
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 18px', borderRadius: 8,
                  color: '#fff', textDecoration: 'none',
                  fontSize: 14, fontWeight: 700,
                }}
              >
                Sign Up Free
              </Link>
            )}
            {!isMobile && !isAuthenticated && (
              <Link
                to="/auth?tab=login"
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#e4eae6', textDecoration: 'none',
                  fontSize: 14, fontWeight: 600,
                }}
              >
                Sign In
              </Link>
            )}

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false); }}
                aria-label="Notifications"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 10,
                  padding: isMobile ? 9 : 8,
                  cursor: 'pointer',
                  color: '#95a29b',
                  display: 'flex', alignItems: 'center', position: 'relative',
                  minWidth: 40, minHeight: 40,
                  justifyContent: 'center',
                }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: -4, right: -4,
                    background: '#ef4444', color: '#fff', borderRadius: '50%',
                    width: 18, height: 18, fontSize: 11, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (isMobile ? (
                typeof document !== 'undefined' && createPortal((
                  <>
                    <div
                      onClick={() => setNotifOpen(false)}
                      style={{ position: 'fixed', inset: 0, zIndex: 190, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}
                    />
                    <div style={{
                      position: 'fixed',
                      right: 12, left: 12,
                      top: 'calc(56px + env(safe-area-inset-top))',
                      background: '#131614',
                      border: '1px solid #232925',
                      borderRadius: 14,
                      maxHeight: '70vh',
                      overflowY: 'auto',
                      WebkitOverflowScrolling: 'touch',
                      zIndex: 195,
                      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    }}>
                      <NotifList notifications={notifications} onCloseAfterNav={() => setNotifOpen(false)} />
                    </div>
                  </>
                ), document.body)
              ) : (
                <div style={{
                  position: 'absolute', right: 0, top: 48,
                  background: '#131614',
                  border: '1px solid #232925',
                  borderRadius: 14,
                  width: 320,
                  maxHeight: '70vh',
                  overflowY: 'auto',
                  zIndex: 100,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                }}>
                  <NotifList notifications={notifications} onCloseAfterNav={() => setNotifOpen(false)} />
                </div>
              ))}
            </div>

            {/* Messages — desktop only (mobile has it in drawer) */}
            {!isMobile && (
              <Link
                to="/messages"
                aria-label="Messages"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 10, padding: 8,
                  color: '#95a29b',
                  display: 'flex', alignItems: 'center',
                  textDecoration: 'none',
                  minWidth: 40, minHeight: 40, justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <MessageSquare size={18} />
                {unreadDMs > 0 && (
                  <span style={{
                    position: 'absolute', top: -4, right: -4,
                    background: '#ef4444', color: '#fff', borderRadius: 999,
                    minWidth: 18, height: 18, padding: '0 4px',
                    fontSize: 10, fontWeight: 900,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    !{unreadDMs}
                  </span>
                )}
              </Link>
            )}

            {/* Avatar / drawer toggle */}
            {isMobile ? (
              <button
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 10, padding: 9,
                  cursor: 'pointer', color: '#95a29b',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  minWidth: 40, minHeight: 40,
                }}
              >
                <Menu size={20} />
              </button>
            ) : (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 10, padding: '6px 10px', cursor: 'pointer',
                  }}
                >
                  <img
                    src={currentUser?.avatar}
                    alt="avatar"
                    style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <ChevronDown size={14} color="#95a29b" />
                </button>
                {userMenuOpen && <UserMenu currentUser={currentUser} onClose={() => setUserMenuOpen(false)} onSwitchAccount={setCurrentUserId} />}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile drawer — rendered via Portal to escape nav's backdrop-filter containing block */}
      {isMobile && typeof document !== 'undefined' && createPortal((
        <>
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              opacity: drawerOpen ? 1 : 0,
              pointerEvents: drawerOpen ? 'auto' : 'none',
              transition: 'opacity 0.25s',
            }}
          />
          <div
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: 'min(86vw, 320px)',
              background: '#0e100e',
              borderLeft: '1px solid #232925',
              zIndex: 210,
              transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
              transition: 'transform 0.3s cubic-bezier(.2,.9,.3,1)',
              display: 'flex', flexDirection: 'column',
              paddingTop: 'env(safe-area-inset-top)',
              paddingBottom: 'env(safe-area-inset-bottom)',
              boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottom: '1px solid #232925' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {isAuthenticated ? (
                  <img
                    src={currentUser?.avatar}
                    alt="avatar"
                    style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: 'linear-gradient(135deg,#00c805,#00e5a0)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <User size={18} color="#fff" />
                  </div>
                )}
                <div>
                  <p style={{ color: '#f8fafc', fontWeight: 700, margin: 0, fontSize: 14 }}>
                    {isAuthenticated ? currentUser?.name : 'Welcome'}
                  </p>
                  <p style={{ color: '#5a675f', margin: '2px 0 0', fontSize: 12 }}>
                    {isAuthenticated ? `@${currentUser?.username}` : 'Sign in for full access'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: 'none', borderRadius: 10, padding: 8,
                  color: '#95a29b', cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Guest CTA banner in the drawer */}
            {!isAuthenticated && (
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #232925', display: 'flex', gap: 8 }}>
                <Link
                  to="/auth?tab=register"
                  onClick={() => setDrawerOpen(false)}
                  className="gradient-btn"
                  style={{
                    flex: 1, textAlign: 'center', padding: '11px',
                    borderRadius: 10, color: '#fff', textDecoration: 'none',
                    fontWeight: 700, fontSize: 14,
                  }}
                >
                  Sign Up Free
                </Link>
                <Link
                  to="/auth?tab=login"
                  onClick={() => setDrawerOpen(false)}
                  style={{
                    flex: 1, textAlign: 'center', padding: '11px',
                    borderRadius: 10, color: '#e4eae6', textDecoration: 'none',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    fontWeight: 600, fontSize: 14,
                  }}
                >
                  Sign In
                </Link>
              </div>
            )}

            <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '12px 8px' }}>
              <div style={{ padding: '0 8px', marginBottom: 8 }}>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#5a675f' }} />
                  <input
                    placeholder="Search deals, investors..."
                    className="input-dark"
                    style={{ paddingLeft: 38, paddingRight: 12, paddingTop: 11, paddingBottom: 11, borderRadius: 10, fontSize: 14, width: '100%' }}
                  />
                </div>
              </div>

              <DrawerSection title="Browse">
                {primaryNav.map(({ to, label, icon }) => (
                  <DrawerItem
                    key={to}
                    to={to}
                    icon={icon}
                    label={label}
                    active={location.pathname === to || (to === '/marketplace' && location.pathname === '/')}
                    onClick={() => setDrawerOpen(false)}
                  />
                ))}
              </DrawerSection>

              <DrawerSection title="You">
                {drawerSecondary.map(({ to, label, icon }) => (
                  <DrawerItem
                    key={to}
                    to={to}
                    icon={icon}
                    label={label}
                    active={location.pathname.startsWith(to)}
                    onClick={() => setDrawerOpen(false)}
                    badgeCount={to === '/messages' ? unreadDMs : 0}
                  />
                ))}
                <DrawerItem to={currentUser ? `/profile/${currentUser.id}` : '/auth'} icon={User} label="View Profile" onClick={() => setDrawerOpen(false)} />
                {currentUser?.isAdmin && <DrawerItem to="/admin" icon={Shield} label="Admin" onClick={() => setDrawerOpen(false)} danger />}
              </DrawerSection>

              <DrawerSection title="More">
                {drawerMore.map(({ to, label, icon }) => (
                  <DrawerItem
                    key={to}
                    to={to}
                    icon={icon}
                    label={label}
                    active={location.pathname.startsWith(to)}
                    onClick={() => setDrawerOpen(false)}
                  />
                ))}
              </DrawerSection>

              <DrawerSection title="Account">
                <DrawerItem to="/auth" icon={Settings} label="Settings" onClick={() => setDrawerOpen(false)} />
                <DrawerItem to="/auth" icon={LogOut} label="Sign Out" onClick={() => setDrawerOpen(false)} danger />
              </DrawerSection>
            </div>
          </div>
        </>
      ), document.body)}

      {/* Backdrop for desktop dropdowns */}
      {!isMobile && (userMenuOpen || notifOpen || moreOpen) && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 40 }}
          onClick={() => { setUserMenuOpen(false); setNotifOpen(false); setMoreOpen(false); }}
        />
      )}

    </nav>
  );
}

function UserMenu({ currentUser, onClose, onSwitchAccount }) {
  return (
    <div style={{
      position: 'absolute', right: 0, top: 48,
      background: '#131614', border: '1px solid #232925',
      borderRadius: 12, width: 220, zIndex: 100,
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      overflow: 'hidden',
    }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #232925' }}>
        <p style={{ color: '#f8fafc', fontWeight: 600, margin: 0, fontSize: 14 }}>{currentUser?.name}</p>
        <p style={{ color: '#5a675f', margin: '2px 0 0', fontSize: 12 }}>@{currentUser?.username}</p>
      </div>
      {[
        { icon: User,       label: 'View Profile',       to: `/profile/${currentUser?.id}` },
        { icon: TrendingUp, label: 'My Deals',           to: '/my-deals' },
        { icon: Heart,      label: 'Saved Deals',        to: '/saved' },
        { icon: Bell,       label: 'Notifications',      to: '/notifications' },
        { icon: Crown,      label: 'Upgrade to Premium', to: '/premium' },
        { icon: Settings,   label: 'Settings',           to: '/auth' },
      ].map(({ icon: Icon, label, to }) => (
        <Link
          key={label}
          to={to}
          onClick={onClose}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 16px', color: '#95a29b', textDecoration: 'none', fontSize: 14,
          }}
        >
          <Icon size={16} /> {label}
        </Link>
      ))}
      <div style={{ borderTop: '1px solid #232925', padding: '8px 16px 4px' }}>
        <p style={{ color: '#5a675f', fontSize: 10, fontWeight: 800, letterSpacing: 0.8, margin: '0 0 6px' }}>SWITCH TEST ACCOUNT</p>
        <div style={{ display: 'flex', gap: 6, paddingBottom: 8 }}>
          {testUsers.map(u => (
            <button
              key={u.id}
              onClick={() => { onSwitchAccount?.(u.id); onClose(); }}
              title={u.name}
              style={{
                flex: 1, padding: '6px 0', borderRadius: 8, cursor: 'pointer',
                background: String(currentUser?.id) === String(u.id) ? 'rgba(0, 200, 5, 0.16)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${String(currentUser?.id) === String(u.id) ? '#00c805' : '#232925'}`,
                color: String(currentUser?.id) === String(u.id) ? '#4ade80' : '#95a29b',
                fontSize: 11, fontWeight: 800,
              }}
            >
              {u.name.replace('Test ', 'T')}
            </button>
          ))}
        </div>
      </div>
      <div style={{ borderTop: '1px solid #232925' }}>
        <Link
          to="/auth"
          onClick={onClose}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', color: '#ef4444', textDecoration: 'none', fontSize: 14 }}
        >
          <LogOut size={16} /> Sign Out
        </Link>
      </div>
    </div>
  );
}

function DrawerSection({ title, children }) {
  return (
    <div style={{ padding: '8px 0' }}>
      <p style={{ color: '#5a675f', fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', padding: '6px 16px', margin: 0 }}>
        {title}
      </p>
      <div>{children}</div>
    </div>
  );
}

function DrawerItem({ to, icon: Icon, label, active, danger, onClick, badgeCount = 0 }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '11px 16px', textDecoration: 'none', fontSize: 15, fontWeight: 500,
        color: danger ? '#ef4444' : (active ? '#4ade80' : '#e4eae6'),
        background: active ? 'rgba(0, 200, 5,0.1)' : 'transparent',
        borderRadius: 10,
        margin: '1px 8px',
        transition: 'background 0.15s',
      }}
    >
      <Icon size={18} />
      <span style={{ flex: 1 }}>{label}</span>
      {badgeCount > 0 && (
        <span style={{
          background: '#ef4444', color: '#fff', borderRadius: 999,
          minWidth: 19, height: 19, padding: '0 5px',
          fontSize: 11, fontWeight: 900,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          !{badgeCount}
        </span>
      )}
    </Link>
  );
}

function NotifList({ notifications, onCloseAfterNav }) {
  return (
    <>
      <div style={{ padding: 14, borderBottom: '1px solid #232925', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 700, color: '#f8fafc' }}>Notifications</span>
      </div>
      {notifications.length === 0 && (
        <div style={{ padding: '28px 18px', textAlign: 'center' }}>
          <div style={{ fontSize: 26, marginBottom: 8 }}>✅</div>
          <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: 14 }}>You're all caught up</div>
          <div style={{ color: '#707d75', fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>
            Deal views, hearts, messages, and live tours from people you follow land here.
          </div>
        </div>
      )}
      {notifications.map(n => {
        const inner = (
          <>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.unread ? '#00c805' : 'transparent', marginTop: 6, flexShrink: 0 }} />
            <div>
              <p style={{ color: '#f8fafc', fontSize: 13, margin: 0, lineHeight: 1.4 }}>{n.text}</p>
              <p style={{ color: '#5a675f', fontSize: 12, margin: '4px 0 0' }}>{n.time}</p>
            </div>
          </>
        );
        const rowStyle = {
          padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'flex-start',
          borderBottom: '1px solid #232925',
          background: n.unread ? 'rgba(0, 200, 5,0.05)' : 'transparent',
          textDecoration: 'none',
        };
        return n.to ? (
          <Link key={n.id} to={n.to} onClick={onCloseAfterNav} style={rowStyle}>{inner}</Link>
        ) : (
          <div key={n.id} style={rowStyle}>{inner}</div>
        );
      })}
      <Link
        to="/notifications"
        onClick={onCloseAfterNav}
        style={{ display: 'block', padding: '14px', textAlign: 'center', color: '#00c805', textDecoration: 'none', fontWeight: 700, fontSize: 13 }}
      >
        View all →
      </Link>
    </>
  );
}
