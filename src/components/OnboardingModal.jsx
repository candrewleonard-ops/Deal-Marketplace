import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Home, Heart, Users, Zap, ArrowRight, X, CheckCircle } from 'lucide-react';

const STORAGE_KEY = 'asl-onboarding-seen-v1';

const SLIDES = [
  {
    icon: Home,
    color: '#00c805',
    title: 'Off-market deals, nationwide',
    body: 'Browse a feed of wholesale, fix & flip, and creative-finance deals from investors across the country. Filter by city, price, and deal type.',
  },
  {
    icon: Heart,
    color: '#ef4444',
    title: 'Save deals, get alerts',
    body: 'Tap the heart on any deal to add it to your shortlist. Upgrade to VIP for deal alerts in your favorite markets.',
  },
  {
    icon: Users,
    color: '#00e5a0',
    title: 'Connect with operators',
    body: 'DM wholesalers, follow investors, join city groups, and find vetted contractors when you need work done on a flip.',
  },
  {
    icon: Zap,
    color: '#f59e0b',
    title: 'Post your own deals',
    body: 'Tap the POST button at the center of the tab bar to list a deal in under 60 seconds. Address autocomplete makes it fast.',
  },
];

export default function OnboardingModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        // Small delay so it doesn't fight the page mount
        const t = setTimeout(() => setOpen(true), 600);
        return () => clearTimeout(t);
      }
    } catch {
      // Private mode or localStorage disabled — just don't show
    }
  }, []);

  function close() {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* ignore */ }
    setOpen(false);
  }

  if (!open || typeof document === 'undefined') return null;

  const slide = SLIDES[step];
  const Icon = slide.icon;
  const isLast = step === SLIDES.length - 1;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 700,
        background: 'rgba(5,5,12,0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
        animation: 'ob-fade 0.2s ease-out',
      }}
    >
      <div style={{
        width: '100%', maxWidth: 440,
        background: '#131614',
        border: '1px solid #232925',
        borderRadius: 20,
        padding: '28px 24px',
        position: 'relative',
        boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
        animation: 'ob-pop 0.25s ease-out',
      }}>
        <button
          onClick={close}
          aria-label="Close"
          style={{
            position: 'absolute', top: 12, right: 12,
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)', border: 'none',
            color: '#95a29b', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <X size={16} />
        </button>

        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: `${slide.color}15`,
          border: `1px solid ${slide.color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 18px',
        }}>
          <Icon size={28} style={{ color: slide.color }} />
        </div>

        <h2 style={{
          color: '#f8fafc', fontWeight: 800, fontSize: 22, margin: '0 0 10px',
          textAlign: 'center',
        }}>
          {slide.title}
        </h2>
        <p style={{
          color: '#95a29b', fontSize: 14, lineHeight: 1.6, margin: 0,
          textAlign: 'center',
        }}>
          {slide.body}
        </p>

        {/* Step dots */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', margin: '24px 0 18px' }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              aria-label={`Go to step ${i + 1}`}
              style={{
                width: i === step ? 22 : 7, height: 7, borderRadius: 4,
                background: i === step ? slide.color : 'rgba(255,255,255,0.12)',
                border: 'none', padding: 0, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            />
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              style={{
                flex: 1, padding: '12px 16px', borderRadius: 10,
                background: 'rgba(255,255,255,0.04)', border: '1px solid #232925',
                color: '#95a29b', fontWeight: 700, fontSize: 14, cursor: 'pointer',
              }}
            >
              Back
            </button>
          ) : (
            <button
              onClick={close}
              style={{
                flex: 1, padding: '12px 16px', borderRadius: 10,
                background: 'transparent', border: '1px solid transparent',
                color: '#707d75', fontWeight: 600, fontSize: 13, cursor: 'pointer',
              }}
            >
              Skip
            </button>
          )}

          <button
            onClick={() => isLast ? close() : setStep(step + 1)}
            style={{
              flex: 1.6, padding: '12px 16px', borderRadius: 10,
              background: 'linear-gradient(135deg,#00c805,#00e5a0)',
              border: 'none', color: '#fff', fontWeight: 700, fontSize: 14,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              boxShadow: '0 6px 20px rgba(0, 200, 5,0.35)',
            }}
          >
            {isLast ? (<>Get started <CheckCircle size={15} /></>) : (<>Next <ArrowRight size={15} /></>)}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes ob-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes ob-pop {
          from { opacity: 0; transform: translateY(12px) scale(0.97) }
          to   { opacity: 1; transform: translateY(0) scale(1) }
        }
      `}</style>
    </div>,
    document.body
  );
}
