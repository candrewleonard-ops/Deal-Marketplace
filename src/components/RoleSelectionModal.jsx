import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  Hammer, DollarSign, Home, Megaphone, Building2, MoreHorizontal,
  Check, ArrowRight, Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  { key: 'Hard Money Lender', icon: DollarSign, color: '#f59e0b', desc: 'Fund deals for investors' },
  { key: 'Fix N Flipper',     icon: Hammer,     color: '#ef4444', desc: 'Buy, renovate, sell' },
  { key: 'Landlord',          icon: Home,       color: '#10b981', desc: 'Buy & hold rentals' },
  { key: 'Wholesaler',        icon: Megaphone,  color: '#8b5cf6', desc: 'Find deals & assign' },
  { key: 'Developer',         icon: Building2,  color: '#06b6d4', desc: 'Build new construction' },
  { key: 'Other',             icon: MoreHorizontal, color: '#94a3b8', desc: 'Describe your role' },
];

/**
 * Fired after the signup form completes. Collects roles + writes them to the
 * AuthContext profile. If the user picks ONLY "Wholesaler", login redirects
 * them to /my-deals on close (otherwise /marketplace).
 */
export default function RoleSelectionModal({ open, onClose, contactInfo }) {
  const { updateProfile, defaultLandingPath } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [otherText, setOtherText] = useState('');

  if (!open || typeof document === 'undefined') return null;

  function toggle(key) {
    setSelected(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  }

  function submit() {
    if (selected.length === 0) return;
    updateProfile({
      ...(contactInfo || {}),
      roles: selected,
      otherRoleDescription: selected.includes('Other') ? otherText : null,
      onboardedAt: new Date().toISOString(),
    });
    onClose?.();
    // Wholesaler-only users land in My Deals; everyone else hits the marketplace.
    const wholesalerOnly = selected.length === 1 && selected[0] === 'Wholesaler';
    navigate(wholesalerOnly ? '/my-deals' : '/marketplace');
  }

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 700,
        background: 'rgba(5,5,12,0.9)',
        backdropFilter: 'blur(14px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
        animation: 'role-overlay-in 0.2s ease-out',
      }}
    >
      <div
        style={{
          width: '100%', maxWidth: 520,
          maxHeight: '94vh', overflowY: 'auto',
          background: 'linear-gradient(180deg, #1a1a2e 0%, #12121e 100%)',
          border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: 22,
          boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
          animation: 'role-card-in 0.28s cubic-bezier(.2,.9,.3,1)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '28px 28px 18px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 11px', borderRadius: 999,
            background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
            color: '#34d399', fontSize: 11, fontWeight: 800, letterSpacing: 0.6,
            marginBottom: 12,
          }}>
            <Sparkles size={11} /> ACCOUNT CREATED
          </div>
          <h2 style={{
            color: '#f8fafc', fontWeight: 900, fontSize: 24, margin: 0, lineHeight: 1.2,
          }}>
            Which one are you?
          </h2>
          <p style={{ color: '#94a3b8', margin: '8px 0 0', fontSize: 14 }}>
            Pick all that fit — we'll personalize your feed.
          </p>
        </div>

        {/* Role grid */}
        <div style={{ padding: '0 22px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
            {ROLES.map(r => {
              const Icon = r.icon;
              const on = selected.includes(r.key);
              return (
                <button
                  key={r.key}
                  onClick={() => toggle(r.key)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6,
                    padding: 14, borderRadius: 12,
                    background: on ? `${r.color}14` : '#0d0d1a',
                    border: `1.5px solid ${on ? r.color : '#1e1e2e'}`,
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.15s',
                    position: 'relative',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: on ? r.color : `${r.color}18`,
                      border: `1px solid ${on ? r.color : `${r.color}30`}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon size={15} style={{ color: on ? '#fff' : r.color }} />
                    </div>
                    <span style={{
                      color: on ? r.color : '#f8fafc',
                      fontWeight: 800, fontSize: 13.5, flex: 1,
                    }}>
                      {r.key}
                    </span>
                    {on && (
                      <div style={{
                        width: 18, height: 18, borderRadius: '50%',
                        background: r.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Check size={11} color="#fff" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <span style={{ color: '#94a3b8', fontSize: 11, lineHeight: 1.4 }}>
                    {r.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {selected.includes('Other') && (
            <input
              type="text"
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
              placeholder="Describe your role (e.g. real estate attorney, syndicator)"
              autoFocus
              style={{
                width: '100%', marginTop: 12,
                padding: '12px 14px', borderRadius: 10,
                background: '#0d0d1a', border: '1px solid #1e1e2e',
                color: '#f8fafc', fontSize: 14, outline: 'none',
              }}
            />
          )}
        </div>

        {/* Footer + CTA */}
        <div style={{ padding: '20px 24px 22px' }}>
          <button
            onClick={submit}
            disabled={selected.length === 0}
            style={{
              width: '100%', padding: '14px 18px', borderRadius: 12,
              background: selected.length === 0
                ? 'rgba(255,255,255,0.05)'
                : 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              color: selected.length === 0 ? '#475569' : '#fff',
              fontWeight: 800, fontSize: 15,
              border: 'none',
              cursor: selected.length === 0 ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: selected.length > 0 ? '0 10px 28px rgba(139,92,246,0.4)' : 'none',
            }}
          >
            Continue
            <ArrowRight size={17} />
          </button>
          <p style={{
            color: '#475569', fontSize: 11, textAlign: 'center',
            margin: '10px 0 0', lineHeight: 1.5,
          }}>
            You can change this later in your profile.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes role-overlay-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes role-card-in {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>,
    document.body
  );
}
