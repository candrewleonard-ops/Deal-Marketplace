import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import {
  Building2, ShoppingBag, Users, Wrench, Calendar, Bell, MessageSquare,
  Plus, Search, ChevronDown, Menu, X, LogOut, User, Settings, TrendingUp,
  Crown, Shield, UsersRound, Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PostDealModal from './PostDealModal';
import { useIsMobile } from '../hooks/useIsMobile';

const primaryNav = [
  { to: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
  { to: '/my-deals',    label: 'My Deals',    icon: TrendingUp },
  { to: '/social',      label: 'Social',      icon: Users },
  { to: '/groups',      label: 'Groups',      icon: UsersRound },
  { to: '/contractors', label: 'Contractors', icon: Wrench },
  { to: '/meetups',     label: 'Meetups',     icon: Calendar },
];

const drawerSecondary = [
  { to: '/saved',         label: 'Saved Deals',  icon: Heart },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/messages',      label: 'Messages',     icon: MessageSquare },
  { to: '/premium',       label: 'Premium',      icon: Crown },
];

export default function Navbar() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { currentUser } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [showPostDeal, setShowPostDeal] = useState(false);

  const notifications = [
    { id: 1, text: 'Marcus Johnson liked your post', time: '2m ago', unread: true },
    { id: 2, text: 'New deal in Atlanta matches your saved search', time: '15m ago', unread: true },
    { id: 3, text: 'Diana Cruz sent you a message', time: '1h ago', unread: true },
    { id: 4, text: 'Your deal "Phoenix Fixer" got 12 views today', time: '2h ago', unread: false },
    { id: 5, text: 'Kevin Washington started following you', time: '3h ago', unread: false },
  ];
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <nav
      style={{
        background: 'rgba(13,13,26,0.92)',
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
        <div style={{ display: 'flex', alignItems: 'center', height: isMobile ? 56 : 64, gap: isMobile ? 8 : 24 }}>
          {/* Logo */}
          <Link to="/marketplace" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Building2 size={18} color="#fff" />
            </div>
            <span style={{
              background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              fontWeight: 900, fontSize: isMobile ? 16 : 18, letterSpacing: '-0.5px',
            }}>
              TREIM
            </span>
          </Link>

          {/* DESKTOP: inline nav links */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
              {primaryNav.map(({ to, label, icon: Icon }) => {
                const active = location.pathname === to || (to === '/marketplace' && location.pathname === '/');
                return (
                  <Link
                    key={to}
                    to={to}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '6px 12px', borderRadius: 8, textDecoration: 'none',
                      fontSize: 14, fontWeight: 600,
                      color: active ? '#8b5cf6' : '#94a3b8',
                      background: active ? 'rgba(139,92,246,0.1)' : 'transparent',
                      borderBottom: active ? '2px solid #8b5cf6' : '2px solid transparent',
                      transition: 'all 0.2s',
                      paddingBottom: 4,
                    }}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Search (desktop only) */}
          {!isMobile && (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, color: '#475569', pointerEvents: 'none' }} />
              <input
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search deals, investors..."
                className="input-dark"
                style={{ paddingLeft: 36, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 8, fontSize: 14, width: 220 }}
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
            {!isMobile && (
              <button
                onClick={() => setShowPostDeal(true)}
                className="gradient-btn"
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: 8,
                  color: '#fff', border: 'none', cursor: 'pointer',
                  fontSize: 14, fontWeight: 600,
                }}
              >
                <Plus size={16} />
                Post a Deal
              </button>
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
                  color: '#94a3b8',
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
                      background: '#12121e',
                      border: '1px solid #1e1e2e',
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
                  background: '#12121e',
                  border: '1px solid #1e1e2e',
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
                  color: '#94a3b8',
                  display: 'flex', alignItems: 'center',
                  textDecoration: 'none',
                  minWidth: 40, minHeight: 40, justifyContent: 'center',
                }}
              >
                <MessageSquare size={18} />
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
                  cursor: 'pointer', color: '#94a3b8',
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
                  <ChevronDown size={14} color="#94a3b8" />
                </button>
                {userMenuOpen && <UserMenu currentUser={currentUser} onClose={() => setUserMenuOpen(false)} />}
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
              background: '#0d0d1a',
              borderLeft: '1px solid #1e1e2e',
              zIndex: 210,
              transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
              transition: 'transform 0.3s cubic-bezier(.2,.9,.3,1)',
              display: 'flex', flexDirection: 'column',
              paddingTop: 'env(safe-area-inset-top)',
              paddingBottom: 'env(safe-area-inset-bottom)',
              boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottom: '1px solid #1e1e2e' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img
                  src={currentUser?.avatar}
                  alt="avatar"
                  style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <p style={{ color: '#f8fafc', fontWeight: 700, margin: 0, fontSize: 14 }}>{currentUser?.name || 'Guest'}</p>
                  <p style={{ color: '#475569', margin: '2px 0 0', fontSize: 12 }}>{currentUser?.username ? `@${currentUser.username}` : 'Sign in for full access'}</p>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: 'none', borderRadius: 10, padding: 8,
                  color: '#94a3b8', cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '12px 8px' }}>
              <div style={{ padding: '0 8px', marginBottom: 8 }}>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
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
                  />
                ))}
                <DrawerItem to={currentUser ? `/profile/${currentUser.id}` : '/auth'} icon={User} label="View Profile" onClick={() => setDrawerOpen(false)} />
                {currentUser?.isAdmin && <DrawerItem to="/admin" icon={Shield} label="Admin" onClick={() => setDrawerOpen(false)} danger />}
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
      {!isMobile && (userMenuOpen || notifOpen) && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 40 }}
          onClick={() => { setUserMenuOpen(false); setNotifOpen(false); }}
        />
      )}

      {showPostDeal && <PostDealModal onClose={() => setShowPostDeal(false)} />}
    </nav>
  );
}

function UserMenu({ currentUser, onClose }) {
  return (
    <div style={{
      position: 'absolute', right: 0, top: 48,
      background: '#12121e', border: '1px solid #1e1e2e',
      borderRadius: 12, width: 220, zIndex: 100,
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      overflow: 'hidden',
    }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e1e2e' }}>
        <p style={{ color: '#f8fafc', fontWeight: 600, margin: 0, fontSize: 14 }}>{currentUser?.name}</p>
        <p style={{ color: '#475569', margin: '2px 0 0', fontSize: 12 }}>@{currentUser?.username}</p>
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
            padding: '10px 16px', color: '#94a3b8', textDecoration: 'none', fontSize: 14,
          }}
        >
          <Icon size={16} /> {label}
        </Link>
      ))}
      <div style={{ borderTop: '1px solid #1e1e2e' }}>
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
      <p style={{ color: '#475569', fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', padding: '6px 16px', margin: 0 }}>
        {title}
      </p>
      <div>{children}</div>
    </div>
  );
}

function DrawerItem({ to, icon: Icon, label, active, danger, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '11px 16px', textDecoration: 'none', fontSize: 15, fontWeight: 500,
        color: danger ? '#ef4444' : (active ? '#a78bfa' : '#e2e8f0'),
        background: active ? 'rgba(139,92,246,0.1)' : 'transparent',
        borderRadius: 10,
        margin: '1px 8px',
        transition: 'background 0.15s',
      }}
    >
      <Icon size={18} />
      {label}
    </Link>
  );
}

function NotifList({ notifications, onCloseAfterNav }) {
  return (
    <>
      <div style={{ padding: 14, borderBottom: '1px solid #1e1e2e', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 700, color: '#f8fafc' }}>Notifications</span>
        <button style={{ background: 'none', border: 'none', color: '#8b5cf6', cursor: 'pointer', fontSize: 13 }}>Mark all read</button>
      </div>
      {notifications.map(n => (
        <div key={n.id} style={{
          padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'flex-start',
          borderBottom: '1px solid #1e1e2e',
          background: n.unread ? 'rgba(139,92,246,0.05)' : 'transparent',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.unread ? '#8b5cf6' : 'transparent', marginTop: 6, flexShrink: 0 }} />
          <div>
            <p style={{ color: '#f8fafc', fontSize: 13, margin: 0, lineHeight: 1.4 }}>{n.text}</p>
            <p style={{ color: '#475569', fontSize: 12, margin: '4px 0 0' }}>{n.time}</p>
          </div>
        </div>
      ))}
      <Link
        to="/notifications"
        onClick={onCloseAfterNav}
        style={{ display: 'block', padding: '14px', textAlign: 'center', color: '#8b5cf6', textDecoration: 'none', fontWeight: 700, fontSize: 13 }}
      >
        View all →
      </Link>
    </>
  );
}
