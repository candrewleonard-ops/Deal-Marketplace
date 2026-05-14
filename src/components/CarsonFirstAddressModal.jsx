import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldAlert, ArrowRight } from 'lucide-react';

/**
 * Modal that fires the FIRST time a user submits an address request. After
 * dismissal it's never shown again (localStorage flag).
 *
 * Use:
 *   import { hasSeenCarsonNote, markCarsonNoteSeen } from './CarsonFirstAddressModal';
 *   // In the place where you submit the request:
 *   if (!hasSeenCarsonNote()) setShowCarson(true);
 *   <CarsonFirstAddressModal open={showCarson} onContinue={() => {
 *     markCarsonNoteSeen();
 *     setShowCarson(false);
 *     submitTheRequest();
 *   }} />
 */
const STORAGE_KEY = 'asl-carson-note-seen-v1';

export function hasSeenCarsonNote() {
  if (typeof window === 'undefined') return true;
  try { return !!localStorage.getItem(STORAGE_KEY); }
  catch { return true; }
}

export function markCarsonNoteSeen() {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* ignore */ }
}

export default function CarsonFirstAddressModal({ open, onContinue, onClose }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 720,
        background: 'rgba(5,5,12,0.88)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
        animation: 'carson-overlay-in 0.2s ease-out',
      }}
    >
      <div
        style={{
          width: '100%', maxWidth: 480,
          background: 'linear-gradient(180deg, #1a1a2e 0%, #12121e 100%)',
          border: '1px solid rgba(245,158,11,0.35)',
          borderRadius: 22,
          boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04) inset',
          position: 'relative',
          animation: 'carson-card-in 0.28s cubic-bezier(.2,.9,.3,1)',
        }}
      >
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute', top: 12, right: 12, zIndex: 3,
              background: 'rgba(255,255,255,0.06)', border: 'none',
              borderRadius: '50%', width: 36, height: 36,
              color: '#94a3b8', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        )}

        {/* Header */}
        <div style={{ padding: '30px 28px 16px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 60, height: 60, borderRadius: 18,
            background: 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(251,146,60,0.18))',
            border: '1px solid rgba(245,158,11,0.4)',
            marginBottom: 14,
            boxShadow: '0 14px 40px rgba(245,158,11,0.25)',
          }}>
            <ShieldAlert size={28} style={{ color: '#fbbf24' }} />
          </div>
          <h2 style={{
            color: '#f8fafc', fontWeight: 900, fontSize: 22,
            margin: 0, lineHeight: 1.25, letterSpacing: '-0.3px',
          }}>
            Before you request this address…
          </h2>
        </div>

        {/* The Carson quote — set apart and styled like a real pull quote */}
        <div style={{
          margin: '0 24px 4px',
          padding: '22px 24px',
          background: 'rgba(245,158,11,0.06)',
          border: '1px solid rgba(245,158,11,0.22)',
          borderRadius: 16,
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: 8, left: 14,
            color: 'rgba(245,158,11,0.4)', fontSize: 38, fontWeight: 900,
            lineHeight: 1, fontFamily: 'Georgia, serif',
          }}>
            “
          </div>
          <p style={{
            color: '#e2e8f0', fontSize: 14.5, lineHeight: 1.65,
            margin: 0, paddingTop: 14, fontStyle: 'italic',
          }}>
            Remember, nobody likes a lying daisy chainer. Be authentic to grow your network &amp; business and earn your business. When deals don't close, everybody involved can be hurt. Play safe.
          </p>
          <div style={{
            marginTop: 14, paddingTop: 12,
            borderTop: '1px solid rgba(245,158,11,0.18)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'linear-gradient(135deg, #f59e0b, #fb923c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 900, fontSize: 13,
              flexShrink: 0,
            }}>
              C
            </div>
            <div>
              <div style={{ color: '#fbbf24', fontWeight: 800, fontSize: 13 }}>— Carson</div>
              <div style={{ color: '#94a3b8', fontSize: 11 }}>Founder, AllStreetLive</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: '22px 24px 22px' }}>
          <button
            onClick={onContinue}
            style={{
              width: '100%',
              padding: '13px 18px', borderRadius: 12,
              background: 'linear-gradient(135deg, #f59e0b, #fb923c)',
              border: 'none', color: '#1a1a2e',
              fontWeight: 800, fontSize: 14.5,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 10px 28px rgba(245,158,11,0.35)',
            }}
          >
            I understand — continue
            <ArrowRight size={16} />
          </button>
          <p style={{
            color: '#475569', fontSize: 11,
            margin: '10px 0 0', textAlign: 'center', lineHeight: 1.5,
          }}>
            You'll only see this message once.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes carson-overlay-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes carson-card-in {
          from { opacity: 0; transform: translateY(22px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>,
    document.body
  );
}
