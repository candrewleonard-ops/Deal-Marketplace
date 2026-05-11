import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { Home, Lock, ArrowRight, X, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Global modal shown whenever a guest tries to do something that needs an account.
 * Triggered via `requireAuth()` from AuthContext.
 */
export default function AuthPromptModal() {
  const { authPrompt, closeAuthPrompt, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Lock body scroll while the modal is open
  useEffect(() => {
    if (!authPrompt.open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [authPrompt.open]);

  // Close on Escape
  useEffect(() => {
    if (!authPrompt.open) return;
    const onKey = (e) => { if (e.key === 'Escape') closeAuthPrompt(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [authPrompt.open, closeAuthPrompt]);

  if (!authPrompt.open || typeof document === 'undefined') return null;

  const goAuth = (tab) => {
    closeAuthPrompt();
    navigate(`/auth?tab=${tab}&from=${encodeURIComponent(authPrompt.redirectTo || location.pathname)}`);
  };

  const continueAsDemo = () => {
    // Lets curious visitors poke around without a real account — they get a demo identity.
    login('me');
    if (authPrompt.redirectTo) navigate(authPrompt.redirectTo);
  };

  const reason = authPrompt.reason || 'view this property';

  return createPortal(
    <div
      onClick={closeAuthPrompt}
      style={{
        position: 'fixed', inset: 0, zIndex: 600,
        background: 'rgba(0,0,0,0.78)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        animation: 'auth-overlay-in 0.2s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(180deg, #161629 0%, #12121e 60%)',
          border: '1px solid rgba(139,92,246,0.25)',
          borderRadius: '22px',
          width: '100%',
          maxWidth: '460px',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04) inset',
          position: 'relative',
          animation: 'auth-card-in 0.25s cubic-bezier(.2,.9,.3,1)',
        }}
      >
        {/* Close */}
        <button
          onClick={closeAuthPrompt}
          aria-label="Close"
          style={{
            position: 'absolute', top: 12, right: 12,
            background: 'rgba(255,255,255,0.06)', border: 'none',
            borderRadius: '50%', width: 36, height: 36,
            color: '#94a3b8', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2,
          }}
        >
          <X size={18} />
        </button>

        {/* Hero header */}
        <div style={{
          padding: '32px 28px 22px',
          background: 'radial-gradient(ellipse at top, rgba(139,92,246,0.18) 0%, transparent 70%)',
          textAlign: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 12px 40px rgba(139,92,246,0.45)',
            marginBottom: 14,
            position: 'relative',
          }}>
            <Home size={28} color="#fff" />
            <div style={{
              position: 'absolute', bottom: -4, right: -4,
              width: 28, height: 28, borderRadius: '50%',
              background: '#0a0a0f', border: '2px solid #f59e0b',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Lock size={12} color="#f59e0b" />
            </div>
          </div>
          <h2 style={{
            color: '#f8fafc', fontWeight: 900, fontSize: 22, margin: 0, lineHeight: 1.25,
          }}>
            Sign up to {reason}
          </h2>
          <p style={{ color: '#94a3b8', margin: '8px 0 0', fontSize: 14, lineHeight: 1.5 }}>
            Join 10,000+ real estate investors browsing exclusive off-market deals on AllStreet Live.
          </p>
        </div>

        {/* Benefits */}
        <div style={{ padding: '20px 24px 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              'Unlock full property details & addresses',
              'Save deals, message sellers, and follow investors',
              'Get notified the moment new deals hit your market',
            ].map((line) => (
              <div key={line} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{
                  flexShrink: 0, marginTop: 2,
                  width: 18, height: 18, borderRadius: '50%',
                  background: 'rgba(16,185,129,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Check size={11} color="#10b981" strokeWidth={3} />
                </div>
                <span style={{ color: '#e2e8f0', fontSize: 13.5, lineHeight: 1.5 }}>{line}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div style={{ padding: '20px 24px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={() => goAuth('register')}
            className="gradient-btn"
            style={{
              padding: '14px 18px', borderRadius: 12,
              color: '#fff', fontWeight: 800, fontSize: 15,
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            Create Free Account
            <ArrowRight size={18} />
          </button>
          <button
            onClick={() => goAuth('login')}
            style={{
              padding: '13px 18px', borderRadius: 12,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              color: '#e2e8f0', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            }}
          >
            I already have an account — Sign In
          </button>

          <div style={{ textAlign: 'center', marginTop: 4 }}>
            <button
              onClick={continueAsDemo}
              style={{
                background: 'none', border: 'none',
                color: '#64748b', fontSize: 12, fontWeight: 600,
                cursor: 'pointer', textDecoration: 'underline',
                textUnderlineOffset: 3,
              }}
            >
              Just looking? Continue as demo user
            </button>
          </div>
        </div>

        <div style={{
          padding: '12px 24px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(255,255,255,0.02)',
          textAlign: 'center',
          fontSize: 11,
          color: '#475569',
        }}>
          By continuing, you agree to AllStreet Live's{' '}
          <Link to="#" style={{ color: '#8b5cf6', textDecoration: 'none' }}>Terms</Link>
          {' '}&{' '}
          <Link to="#" style={{ color: '#8b5cf6', textDecoration: 'none' }}>Privacy Policy</Link>
        </div>
      </div>

      <style>{`
        @keyframes auth-overlay-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes auth-card-in {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>,
    document.body
  );
}
