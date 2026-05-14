import { useState } from 'react';
import { Bell, Plus, Menu, X, Building2 } from 'lucide-react';
import { T } from '../theme';

const NAV_ITEMS = [
  { key: 'marketplace', label: 'Marketplace' },
  { key: 'my-deals',    label: 'My Deals' },
  { key: 'groups',      label: 'Groups' },
  { key: 'contractors', label: 'Contractors' },
  { key: 'meetups',     label: 'Meetups' },
  { key: 'how-tos',     label: 'How Tos' },
  { key: 'wholesale',   label: 'Wholesale' },
];

export default function TopNav({ active = 'marketplace', isMobile, onPost }) {
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 60,
        background: 'rgba(7,8,11,0.85)',
        backdropFilter: 'blur(16px) saturate(160%)',
        WebkitBackdropFilter: 'blur(16px) saturate(160%)',
        borderBottom: `1px solid ${T.border}`,
      }}
    >
      <div
        style={{
          maxWidth: 1480,
          margin: '0 auto',
          padding: isMobile ? '10px 14px' : '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? 8 : 18,
        }}
      >
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${T.lime} 0%, ${T.limeDim} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 14px ${T.limeGlow}`,
            }}
          >
            <Building2 size={18} color="#07080b" strokeWidth={2.6} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span
              style={{
                fontWeight: 900,
                fontSize: isMobile ? 16 : 18,
                color: T.text,
                letterSpacing: '0.5px',
              }}
            >
              TREIM
            </span>
            <span style={{ fontSize: 9, color: T.textFaint, letterSpacing: '1.2px', marginTop: 1 }}>
              BY ALLSTREETLIVE
            </span>
          </div>
        </a>

        {/* Desktop nav */}
        {!isMobile && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' }}>
            {NAV_ITEMS.map((it) => {
              const isActive = it.key === active;
              return (
                <a
                  key={it.key}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  style={{
                    position: 'relative',
                    padding: '8px 14px',
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 600,
                    color: isActive ? T.lime : T.textDim,
                    textDecoration: 'none',
                    background: isActive ? T.limeSoft : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(217,255,79,0.35)' : 'transparent'}`,
                    boxShadow: isActive ? `0 0 18px rgba(217,255,79,0.18)` : 'none',
                    transition: 'all 0.18s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = T.text; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = T.textDim; }}
                >
                  {it.label}
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        left: '18%',
                        right: '18%',
                        bottom: -10,
                        height: 2,
                        borderRadius: 2,
                        background: T.lime,
                        boxShadow: `0 0 10px ${T.limeGlow}`,
                      }}
                    />
                  )}
                </a>
              );
            })}
          </nav>
        )}

        {/* Right side actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 10, marginLeft: 'auto' }}>
          {!isMobile && (
            <>
              <button
                onClick={onPost}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '9px 16px',
                  borderRadius: 999,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 800,
                  fontSize: 13,
                  color: '#0a0c10',
                  background: T.lime,
                  boxShadow: `0 0 0 1px rgba(217,255,79,0.4), 0 6px 22px rgba(217,255,79,0.28)`,
                }}
              >
                <Plus size={14} strokeWidth={3} />
                Post a Deal
              </button>
              <button
                style={{
                  padding: '9px 14px',
                  borderRadius: 999,
                  border: `1px solid ${T.border}`,
                  background: 'transparent',
                  color: T.text,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Sign Up Free
              </button>
              <button
                style={{
                  padding: '9px 14px',
                  borderRadius: 999,
                  border: 'none',
                  background: T.elevated,
                  color: T.textDim,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Sign In
              </button>
            </>
          )}

          {/* Notification bell */}
          <button
            aria-label="Notifications"
            style={{
              position: 'relative',
              width: 38,
              height: 38,
              borderRadius: 10,
              border: `1px solid ${T.border}`,
              background: T.bgRaised,
              color: T.text,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bell size={16} />
            <span
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: T.lime,
                boxShadow: `0 0 8px ${T.limeGlow}`,
              }}
            />
          </button>

          {/* Mobile post button + menu */}
          {isMobile && (
            <>
              <button
                onClick={onPost}
                aria-label="Post a deal"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  border: 'none',
                  background: T.lime,
                  color: '#0a0c10',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 0 1px rgba(217,255,79,0.4), 0 4px 14px rgba(217,255,79,0.3)`,
                }}
              >
                <Plus size={18} strokeWidth={2.6} />
              </button>
              <button
                onClick={() => setOpen(true)}
                aria-label="Menu"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  border: `1px solid ${T.border}`,
                  background: T.bgRaised,
                  color: T.text,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Menu size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {isMobile && open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(6px)',
            zIndex: 80,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'min(82vw, 320px)',
              background: T.bgRaised,
              borderLeft: `1px solid ${T.border}`,
              padding: '16px 14px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: T.text, fontWeight: 800, fontSize: 14, letterSpacing: 0.5 }}>MENU</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  border: `1px solid ${T.border}`,
                  background: T.card,
                  color: T.text,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>
            {NAV_ITEMS.map((it) => (
              <a
                key={it.key}
                href="#"
                onClick={(e) => { e.preventDefault(); setOpen(false); }}
                style={{
                  padding: '12px 14px',
                  borderRadius: 10,
                  background: it.key === active ? T.limeSoft : T.card,
                  border: `1px solid ${it.key === active ? 'rgba(217,255,79,0.35)' : T.border}`,
                  color: it.key === active ? T.lime : T.text,
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: 'none',
                  display: 'block',
                }}
              >
                {it.label}
              </a>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: 10,
                  border: `1px solid ${T.border}`,
                  background: T.card,
                  color: T.text,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                Sign In
              </button>
              <button
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: 10,
                  border: 'none',
                  background: T.lime,
                  color: '#07080b',
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: 'pointer',
                  boxShadow: `0 0 0 1px rgba(217,255,79,0.4), 0 6px 18px rgba(217,255,79,0.3)`,
                }}
              >
                Sign Up Free
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
