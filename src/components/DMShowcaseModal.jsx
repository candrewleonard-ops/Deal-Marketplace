import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  X, MessageSquare, ArrowRight, Check, Zap, Shield, Clock, Send,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Conversion-focused modal shown to guests who tap a DM-related entry point.
 * Different from the generic AuthPromptModal — leads with a mocked DM
 * thread screenshot to demonstrate the feature's value before asking for signup.
 *
 * The `placement` field in dmPrompt tells us where the modal was triggered
 * (messages-tab, deal-detail-seller, profile-message-btn, etc.) so we can A/B
 * compare conversion later via analytics.
 */
export default function DMShowcaseModal() {
  const { dmPrompt, closeDmPrompt } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!dmPrompt.open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [dmPrompt.open]);

  useEffect(() => {
    if (!dmPrompt.open) return;
    const onKey = (e) => { if (e.key === 'Escape') closeDmPrompt(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dmPrompt.open, closeDmPrompt]);

  if (!dmPrompt.open || typeof document === 'undefined') return null;

  const goSignup = () => {
    closeDmPrompt();
    navigate(`/auth?tab=register&intent=dm&placement=${dmPrompt.placement}&from=${encodeURIComponent(location.pathname)}`);
  };

  const goLogin = () => {
    closeDmPrompt();
    navigate(`/auth?tab=login&from=${encodeURIComponent(location.pathname)}`);
  };

  return createPortal(
    <div
      onClick={closeDmPrompt}
      style={{
        position: 'fixed', inset: 0, zIndex: 650,
        background: 'rgba(5,5,12,0.85)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
        animation: 'dm-overlay-in 0.2s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 540,
          maxHeight: '94vh', overflowY: 'auto',
          background: 'linear-gradient(180deg, #1a1f1b 0%, #131614 100%)',
          border: '1px solid rgba(0, 200, 5,0.3)',
          borderRadius: 22,
          boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04) inset',
          position: 'relative',
          animation: 'dm-card-in 0.3s cubic-bezier(.2,.9,.3,1)',
        }}
      >
        <button
          onClick={closeDmPrompt}
          aria-label="Close"
          style={{
            position: 'absolute', top: 12, right: 12, zIndex: 3,
            background: 'rgba(255,255,255,0.08)', border: 'none',
            borderRadius: '50%', width: 36, height: 36,
            color: '#95a29b', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <X size={18} />
        </button>

        {/* Hero header — "Message deal contacts" */}
        <div style={{
          padding: '30px 28px 0',
          textAlign: 'center',
          position: 'relative',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 11px', borderRadius: 999,
            background: 'rgba(0, 200, 5,0.15)',
            border: '1px solid rgba(0, 200, 5,0.35)',
            color: '#4ade80', fontSize: 11, fontWeight: 800, letterSpacing: 0.6,
            marginBottom: 12,
          }}>
            <Zap size={12} /> SIGN UP — FREE
          </div>
          <h2 style={{
            color: '#f8fafc', fontWeight: 900, fontSize: 26, margin: 0,
            lineHeight: 1.15, letterSpacing: '-0.5px',
          }}>
            Message deal contacts
          </h2>
          <p style={{
            color: '#95a29b', fontSize: 14, margin: '8px 0 0',
            lineHeight: 1.55, maxWidth: 380, marginLeft: 'auto', marginRight: 'auto',
          }}>
            Talk directly to wholesalers, lenders, and contractors on every deal — no email middleman, no waiting.
          </p>
        </div>

        {/* DM screenshot mock */}
        <div style={{ padding: '22px 22px 0' }}>
          <DMScreenshot />
        </div>

        {/* Benefits */}
        <div style={{ padding: '18px 28px 4px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {[
              { icon: Send, color: '#00c805', text: 'DM any wholesaler or seller in one tap' },
              { icon: Clock, color: '#00e5a0', text: 'Get replies in minutes, not days' },
              { icon: Shield, color: '#10b981', text: 'Verified profiles — no spam, no scams' },
            ].map(({ icon: Icon, color, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  flexShrink: 0,
                  width: 26, height: 26, borderRadius: 8,
                  background: `${color}18`, border: `1px solid ${color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={13} style={{ color }} />
                </div>
                <span style={{ color: '#e4eae6', fontSize: 13.5, lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div style={{ padding: '18px 24px 22px', display: 'flex', flexDirection: 'column', gap: 9 }}>
          <button
            onClick={goSignup}
            style={{
              padding: '15px 18px', borderRadius: 12,
              background: 'linear-gradient(135deg, #00c805, #00e5a0)',
              color: '#fff', fontWeight: 800, fontSize: 15,
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 12px 32px rgba(0, 200, 5,0.45)',
              transition: 'transform 0.15s',
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            Sign up free to message
            <ArrowRight size={17} />
          </button>
          <button
            onClick={goLogin}
            style={{
              padding: '12px 18px', borderRadius: 12,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              color: '#e4eae6', fontWeight: 700, fontSize: 13.5, cursor: 'pointer',
            }}
          >
            I already have an account — Sign in
          </button>
        </div>

        <div style={{
          padding: '10px 24px 14px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          textAlign: 'center', color: '#5a675f', fontSize: 11,
          background: 'rgba(255,255,255,0.015)',
        }}>
          Free forever — no credit card. Verified by email + phone.
        </div>
      </div>

      <style>{`
        @keyframes dm-overlay-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes dm-card-in {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>,
    document.body
  );
}

/** Stylized DM thread mock — uses native DOM, no real image asset needed. */
function DMScreenshot() {
  return (
    <div style={{
      background: '#0e100e', borderRadius: 14, overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 18px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.03) inset',
    }}>
      {/* Header */}
      <div style={{
        padding: '11px 14px',
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'rgba(255,255,255,0.03)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg,#00c805,#00e5a0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 900, fontSize: 14,
        }}>
          MJ
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
            Marcus Johnson
            <span style={{
              width: 13, height: 13, borderRadius: '50%',
              background: '#10b981', border: '2px solid #0e100e',
              flexShrink: 0,
            }} />
          </div>
          <div style={{ color: '#707d75', fontSize: 11 }}>
            Wholesaler · Atlanta, GA · <span style={{ color: '#34d399', fontWeight: 700 }}>Online now</span>
          </div>
        </div>
        <MessageSquare size={16} style={{ color: '#4ade80' }} />
      </div>

      {/* Messages */}
      <div style={{ padding: '14px 14px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <DMBubble
          from="them"
          text="Hey — saw you saved my Peachtree Rd deal. Got the inspection report if you want it."
        />
        <DMBubble
          from="me"
          text="Yeah send it over. What's your assignment fee on this one?"
        />
        <DMBubble
          from="them"
          text="$12k. Already have 3 cash buyers eyeballing it though, you want to lock?"
        />
        <DMBubble
          from="me"
          text="Send me the contract — I'll wire EMD today."
          status="delivered"
        />
        <div style={{
          alignSelf: 'flex-start',
          padding: '6px 12px', borderRadius: 16,
          background: 'rgba(0, 200, 5,0.12)',
          color: '#4ade80', fontSize: 11, fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <span style={{ display: 'flex', gap: 2 }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#4ade80', animation: 'dm-typing 1s infinite' }} />
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#4ade80', animation: 'dm-typing 1s infinite 0.15s' }} />
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#4ade80', animation: 'dm-typing 1s infinite 0.3s' }} />
          </span>
          Marcus is typing…
        </div>
      </div>

      {/* Fake input */}
      <div style={{
        padding: '10px 12px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(255,255,255,0.02)',
      }}>
        <div style={{
          flex: 1, padding: '8px 14px', borderRadius: 999,
          background: 'rgba(255,255,255,0.05)', color: '#707d75', fontSize: 12,
        }}>
          Sign up to reply…
        </div>
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'linear-gradient(135deg,#00c805,#00e5a0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Send size={14} color="#fff" />
        </div>
      </div>

      <style>{`
        @keyframes dm-typing {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-2px); }
        }
      `}</style>
    </div>
  );
}

function DMBubble({ from, text, status }) {
  const isMe = from === 'me';
  return (
    <div style={{
      alignSelf: isMe ? 'flex-end' : 'flex-start',
      maxWidth: '78%',
    }}>
      <div style={{
        padding: '8px 13px', borderRadius: 16,
        background: isMe
          ? 'linear-gradient(135deg, #00c805, #6d3df5)'
          : 'rgba(255,255,255,0.05)',
        color: isMe ? '#fff' : '#e4eae6',
        fontSize: 13, lineHeight: 1.5,
        boxShadow: isMe ? '0 4px 12px rgba(0, 200, 5,0.3)' : 'none',
        borderBottomRightRadius: isMe ? 4 : 16,
        borderBottomLeftRadius: isMe ? 16 : 4,
      }}>
        {text}
      </div>
      {status && (
        <div style={{
          color: '#34d399', fontSize: 10, fontWeight: 700,
          textAlign: 'right', marginTop: 2,
          display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end',
        }}>
          <Check size={10} /> {status}
        </div>
      )}
    </div>
  );
}
