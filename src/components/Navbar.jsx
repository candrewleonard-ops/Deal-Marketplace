import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Building2, ShoppingBag, Users, Wrench, Calendar, Bell, MessageSquare,
  Plus, Search, ChevronDown, Menu, X, LogOut, User, Settings, TrendingUp,
  Crown, Shield, UsersRound, Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PostDealModal from './PostDealModal';

const navLinks = [
  { to: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
  { to: '/my-deals', label: 'My Deals', icon: TrendingUp },
  { to: '/social', label: 'Social', icon: Users },
  { to: '/groups', label: 'Groups', icon: UsersRound },
  { to: '/contractors', label: 'Contractors', icon: Wrench },
  { to: '/meetups', label: 'Meetups', icon: Calendar },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
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
    <nav style={{ background: '#0d0d1a', borderBottom: '1px solid #1e1e2e', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: '64px', gap: '24px' }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Building2 size={18} style={{ color: '#fff' }} />
            </div>
            <span style={{
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', fontWeight: 900, fontSize: '18px', letterSpacing: '-0.5px'
            }}>
              TREIM
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }} className="hidden md:flex">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 12px', borderRadius: '8px', textDecoration: 'none',
                  fontSize: '14px', fontWeight: 600,
                  color: location.pathname === to ? '#8b5cf6' : '#94a3b8',
                  background: location.pathname === to ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                  borderBottom: location.pathname === to ? '2px solid #8b5cf6' : '2px solid transparent',
                  transition: 'all 0.2s',
                  paddingBottom: '4px',
                }}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }} className="hidden lg:flex">
            <Search size={16} style={{ position: 'absolute', left: '12px', color: '#475569' }} />
            <input
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Search deals, investors..."
              className="input-dark"
              style={{ paddingLeft: '36px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', borderRadius: '8px', fontSize: '14px', width: '240px' }}
            />
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
            {currentUser?.isAdmin && (
              <Link
                to="/admin"
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '7px 12px', borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#ef4444', textDecoration: 'none', fontSize: '13px', fontWeight: 700,
                }}
              >
                <Shield size={14} /> Admin
              </Link>
            )}
            {/* Post Deal Button */}
            <button
              onClick={() => setShowPostDeal(true)}
              className="gradient-btn"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '8px',
                color: '#fff', border: 'none', cursor: 'pointer',
                fontSize: '14px', fontWeight: 600,
                animation: 'pulse-glow 3s ease-in-out infinite',
              }}
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Post a Deal</span>
            </button>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false); }}
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid #1e1e2e',
                  borderRadius: '8px', padding: '8px', cursor: 'pointer',
                  color: '#94a3b8', display: 'flex', alignItems: 'center', position: 'relative',
                  transition: 'all 0.2s',
                }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-4px', right: '-4px',
                    background: '#ef4444', color: '#fff', borderRadius: '50%',
                    width: '18px', height: '18px', fontSize: '11px', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '48px',
                  background: '#12121e', border: '1px solid #1e1e2e',
                  borderRadius: '12px', width: '320px', zIndex: 100,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                }}>
                  <div style={{ padding: '16px', borderBottom: '1px solid #1e1e2e', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, color: '#f8fafc' }}>Notifications</span>
                    <button style={{ background: 'none', border: 'none', color: '#8b5cf6', cursor: 'pointer', fontSize: '13px' }}>Mark all read</button>
                  </div>
                  {notifications.map(n => (
                    <div key={n.id} style={{
                      padding: '12px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start',
                      borderBottom: '1px solid #1e1e2e',
                      background: n.unread ? 'rgba(139, 92, 246, 0.05)' : 'transparent',
                      cursor: 'pointer', transition: 'background 0.2s',
                    }}>
                      {n.unread && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6', marginTop: '6px', flexShrink: 0 }} />}
                      {!n.unread && <div style={{ width: '8px', height: '8px', flexShrink: 0 }} />}
                      <div>
                        <p style={{ color: '#f8fafc', fontSize: '13px', margin: 0, lineHeight: '1.4' }}>{n.text}</p>
                        <p style={{ color: '#475569', fontSize: '12px', margin: '4px 0 0' }}>{n.time}</p>
                      </div>
                    </div>
                  ))}
                  <Link
                    to="/notifications"
                    onClick={() => setNotifOpen(false)}
                    style={{
                      display: 'block', padding: '12px 16px', textAlign: 'center',
                      color: '#8b5cf6', textDecoration: 'none', fontWeight: 700, fontSize: '13px',
                    }}
                  >
                    View all notifications →
                  </Link>
                </div>
              )}
            </div>

            {/* Messages */}
            <Link
              to="/messages"
              style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid #1e1e2e',
                borderRadius: '8px', padding: '8px', cursor: 'pointer',
                color: '#94a3b8', display: 'flex', alignItems: 'center',
                textDecoration: 'none', transition: 'all 0.2s',
              }}
            >
              <MessageSquare size={18} />
            </Link>

            {/* User Avatar */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid #1e1e2e',
                  borderRadius: '8px', padding: '6px 10px', cursor: 'pointer',
                }}
              >
                <img
                  src={currentUser?.avatar}
                  alt="avatar"
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <ChevronDown size={14} style={{ color: '#94a3b8' }} />
              </button>

              {userMenuOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '48px',
                  background: '#12121e', border: '1px solid #1e1e2e',
                  borderRadius: '12px', width: '200px', zIndex: 100,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  overflow: 'hidden',
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e1e2e' }}>
                    <p style={{ color: '#f8fafc', fontWeight: 600, margin: 0, fontSize: '14px' }}>{currentUser?.name}</p>
                    <p style={{ color: '#475569', margin: '2px 0 0', fontSize: '12px' }}>@{currentUser?.username}</p>
                  </div>
                  {[
                    { icon: User, label: 'View Profile', to: `/profile/${currentUser?.id}` },
                    { icon: TrendingUp, label: 'My Deals', to: '/my-deals' },
                    { icon: Heart, label: 'Saved Deals', to: '/saved' },
                    { icon: Bell, label: 'Notifications', to: '/notifications' },
                    { icon: Crown, label: 'Upgrade to Premium', to: '/premium' },
                    { icon: Settings, label: 'Settings', to: '/auth' },
                  ].map(({ icon: Icon, label, to }) => (
                    <Link
                      key={label}
                      to={to}
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 16px', color: '#94a3b8', textDecoration: 'none',
                        fontSize: '14px', transition: 'all 0.2s',
                      }}
                    >
                      <Icon size={16} />
                      {label}
                    </Link>
                  ))}
                  <div style={{ borderTop: '1px solid #1e1e2e' }}>
                    <Link
                      to="/auth"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 16px', color: '#ef4444', textDecoration: 'none',
                        fontSize: '14px', transition: 'all 0.2s',
                      }}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid #1e1e2e',
                borderRadius: '8px', padding: '8px', cursor: 'pointer',
                color: '#94a3b8', display: 'flex', alignItems: 'center',
              }}
              className="md:hidden"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div style={{ borderTop: '1px solid #1e1e2e', padding: '12px 0', display: 'flex', flexDirection: 'column', gap: '4px' }} className="md:hidden">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', borderRadius: '8px', textDecoration: 'none',
                  fontSize: '14px', fontWeight: 500,
                  color: location.pathname === to ? '#8b5cf6' : '#94a3b8',
                  background: location.pathname === to ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                }}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
            <div style={{ padding: '8px 0' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input
                  placeholder="Search deals, investors..."
                  className="input-dark"
                  style={{ paddingLeft: '36px', paddingRight: '12px', paddingTop: '10px', paddingBottom: '10px', borderRadius: '8px', fontSize: '14px', width: '100%' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop for menus */}
      {(userMenuOpen || notifOpen) && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 40 }}
          onClick={() => { setUserMenuOpen(false); setNotifOpen(false); }}
        />
      )}

      {/* Post Deal Modal */}
      {showPostDeal && <PostDealModal onClose={() => setShowPostDeal(false)} />}
    </nav>
  );
}
