import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  X, MapPin, Lock, ArrowRight, Zap, Users, ShieldCheck, TrendingUp,
} from 'lucide-react';

/**
 * Shown when a GUEST tries to request a deal's address. Auto-advancing
 * slides with moving gradient graphics that sell the signup, then close
 * with a strong CTA. Free account, takes seconds.
 */
const SLIDES = [
  {
    icon: MapPin, color: '#00c805',
    title: 'Unlock exact addresses',
    body: 'Free members request and view the real property address — guests only see the masked street.',
  },
  {
    icon: Users, color: '#00e5a0',
    title: 'Message deal contacts directly',
    body: 'DM the wholesaler in one tap, negotiate, and lock the deal before someone else does.',
  },
  {
    icon: TrendingUp, color: '#10b981',
    title: 'Run the numbers instantly',
    body: 'Every deal has a live profit + cash-on-cash calculator. Know your spread before you call.',
  },
  {
    icon: ShieldCheck, color: '#f59e0b',
    title: 'Verified, safer deals',
    body: 'Vetted sellers, activity tracking, and buyer protection — the network is built to keep you safe.',
  },
];

export default function AddressSignupSlider({ open, onClose, redirectTo = '/marketplace' }) {
  const navigate = useNavigate();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const id = setInterval(() => setI(n => (n + 1) % SLIDES.length), 3000);
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      clearInterval(id);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;
  const s = SLIDES[i];
  const Icon = s.icon;

  const go = (tab) => {
    onClose();
    navigate(`/auth?tab=${tab}&from=${encodeURIComponent(redirectTo)}`);
  };

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 720,
        background: 'rgba(5,5,12,0.86)', backdropFilter: 'blur(14px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        animation: 'asl-fade 0.2s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 460, position: 'relative',
          background: 'linear-gradient(180deg,#1a1f1b,#131614)',
          border: '1px solid rgba(0, 200, 5,0.3)', borderRadius: 22,
          overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
          animation: 'asl-pop 0.28s cubic-bezier(.2,.9,.3,1)',
        }}
      >
        <button
          onClick={onClose} aria-label="Close"
          style={{
            position: 'absolute', top: 12, right: 12, zIndex: 3,
            width: 34, height: 34, borderRadius: '50%', border: 'none',
            background: 'rgba(255,255,255,0.08)', color: '#95a29b', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <X size={17} />
        </button>

        {/* Animated graphic stage */}
        <div style={{
          height: 200, position: 'relative', overflow: 'hidden',
          background: `radial-gradient(circle at 30% 30%, ${s.color}44, transparent 60%), radial-gradient(circle at 75% 80%, rgba(0, 229, 160,0.3), transparent 55%), #0e100e`,
          transition: 'background 0.6s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {/* drifting blobs */}
          <div style={{
            position: 'absolute', width: 160, height: 160, borderRadius: '50%',
            background: `${s.color}33`, filter: 'blur(30px)',
            animation: 'asl-orb1 6s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', width: 130, height: 130, borderRadius: '50%',
            background: 'rgba(0, 229, 160,0.28)', filter: 'blur(28px)',
            animation: 'asl-orb2 7s ease-in-out infinite',
          }} />
          <div key={i} style={{
            position: 'relative',
            width: 76, height: 76, borderRadius: 20,
            background: `linear-gradient(135deg, ${s.color}, #00e5a0)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 16px 44px ${s.color}66`,
            animation: 'asl-icon 0.5s cubic-bezier(.2,.9,.3,1)',
          }}>
            <Icon size={34} color="#fff" />
            <div style={{
              position: 'absolute', bottom: -6, right: -6,
              width: 26, height: 26, borderRadius: '50%',
              background: '#0a0b0a', border: '2px solid #f59e0b',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Lock size={11} color="#f59e0b" />
            </div>
          </div>
        </div>

        <div style={{ padding: '22px 26px 24px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 11px', borderRadius: 999, marginBottom: 12,
            background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
            color: '#34d399', fontSize: 11, fontWeight: 800, letterSpacing: 0.5,
          }}>
            <Zap size={11} /> FREE — 20 SECONDS
          </div>

          <div key={i} style={{ animation: 'asl-text 0.45s ease-out' }}>
            <h2 style={{ color: '#f8fafc', fontWeight: 900, fontSize: 22, margin: '0 0 8px', lineHeight: 1.2 }}>
              {s.title}
            </h2>
            <p style={{ color: '#95a29b', fontSize: 14, lineHeight: 1.55, margin: 0, minHeight: 44 }}>
              {s.body}
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, margin: '18px 0' }}>
            {SLIDES.map((_, k) => (
              <button
                key={k} onClick={() => setI(k)} aria-label={`Slide ${k + 1}`}
                style={{
                  width: k === i ? 22 : 7, height: 7, borderRadius: 4, border: 'none',
                  background: k === i ? s.color : 'rgba(255,255,255,0.15)',
                  cursor: 'pointer', transition: 'all 0.25s', padding: 0,
                }}
              />
            ))}
          </div>

          <button
            onClick={() => go('register')}
            style={{
              width: '100%', padding: '15px 18px', borderRadius: 12,
              background: 'linear-gradient(135deg,#00c805,#00e5a0)', border: 'none',
              color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 12px 32px rgba(0, 200, 5,0.45)',
            }}
          >
            Create my free account <ArrowRight size={17} />
          </button>
          <button
            onClick={() => go('login')}
            style={{
              width: '100%', marginTop: 9, padding: '12px', borderRadius: 12,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              color: '#e4eae6', fontWeight: 700, fontSize: 13.5, cursor: 'pointer',
            }}
          >
            I already have an account
          </button>
        </div>
      </div>

      <style>{`
        @keyframes asl-fade { from {opacity:0} to {opacity:1} }
        @keyframes asl-pop { from {opacity:0; transform:translateY(20px) scale(.96)} to {opacity:1; transform:none} }
        @keyframes asl-icon { from {opacity:0; transform:scale(.6) rotate(-12deg)} to {opacity:1; transform:none} }
        @keyframes asl-text { from {opacity:0; transform:translateY(8px)} to {opacity:1; transform:none} }
        @keyframes asl-orb1 { 0%,100%{transform:translate(-60px,-30px)} 50%{transform:translate(50px,30px)} }
        @keyframes asl-orb2 { 0%,100%{transform:translate(60px,40px)} 50%{transform:translate(-40px,-30px)} }
      `}</style>
    </div>,
    document.body
  );
}
