import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X, ArrowRight, ArrowLeft, Sparkles, Eye, Users, MessageSquare,
  TrendingUp, Zap, Camera, MapPin, Hammer, CheckCircle2, Plus, Heart,
} from 'lucide-react';

/**
 * First-time My Deals tutorial — an interactive 5-step walkthrough that
 * trains the user (especially wholesalers) on how to post their first deal.
 *
 * Each step has its own mocked "screenshot" rendered with DOM nodes so it
 * stays crisp at any size, plus a colored Next button showing "1/5", "2/5", etc.
 * Press Esc / X to skip.
 */
export default function MyDealsTutorial({ onClose, onPostDeal }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const slide = SLIDES[step];
  const isLast = step === SLIDES.length - 1;

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 750,
        background: 'radial-gradient(circle at 30% 0%, rgba(0, 200, 5,0.18), transparent 50%), radial-gradient(circle at 70% 100%, rgba(0, 229, 160,0.16), transparent 50%), rgba(5,5,12,0.92)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
        animation: 'tut-overlay-in 0.25s ease-out',
      }}
    >
      <div
        style={{
          width: '100%', maxWidth: 720,
          maxHeight: '94vh', overflowY: 'auto',
          background: 'linear-gradient(180deg, #1a1f1b 0%, #131614 100%)',
          border: '1px solid rgba(0, 200, 5,0.35)',
          borderRadius: 24,
          boxShadow: '0 40px 100px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.04) inset',
          position: 'relative',
          animation: 'tut-card-in 0.35s cubic-bezier(.2,.9,.3,1)',
        }}
      >
        {/* Skip button */}
        <button
          onClick={onClose}
          aria-label="Skip tutorial"
          style={{
            position: 'absolute', top: 14, right: 14, zIndex: 3,
            background: 'rgba(255,255,255,0.06)', border: 'none',
            borderRadius: '50%', width: 36, height: 36,
            color: '#95a29b', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <X size={18} />
        </button>

        {/* Header chip */}
        <div style={{ padding: '22px 26px 0', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 11px', borderRadius: 999,
            background: 'rgba(0, 200, 5,0.16)',
            border: '1px solid rgba(0, 200, 5,0.35)',
            color: '#4ade80', fontSize: 11, fontWeight: 800, letterSpacing: 0.6,
          }}>
            <Sparkles size={11} /> QUICK TOUR · {step + 1} / {SLIDES.length}
          </div>
        </div>

        {/* Step body */}
        <div style={{ padding: '18px 26px 0' }}>
          <h2 style={{
            color: '#f8fafc', fontWeight: 900, fontSize: 26,
            margin: '8px 0 8px', lineHeight: 1.15, letterSpacing: '-0.4px',
            textAlign: 'center',
          }}>
            {slide.title}
          </h2>
          <p style={{
            color: '#95a29b', fontSize: 14, lineHeight: 1.6,
            margin: '0 auto', textAlign: 'center', maxWidth: 480,
          }}>
            {slide.body}
          </p>
        </div>

        {/* Mock screenshot */}
        <div style={{ padding: '20px 26px 0' }}>
          {slide.render({ onPostDeal })}
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '20px 26px 4px' }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              aria-label={`Step ${i + 1}`}
              style={{
                width: i === step ? 24 : 7, height: 7, borderRadius: 4,
                background: i === step ? slide.color : 'rgba(255,255,255,0.13)',
                border: 'none', padding: 0, cursor: 'pointer',
                transition: 'all 0.22s',
              }}
            />
          ))}
        </div>

        {/* Actions */}
        <div style={{
          padding: '16px 22px 22px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '12px 16px', borderRadius: 12,
                background: 'rgba(255,255,255,0.04)', border: '1px solid #232925',
                color: '#95a29b', fontWeight: 700, fontSize: 13.5, cursor: 'pointer',
              }}
            >
              <ArrowLeft size={15} /> Back
            </button>
          ) : (
            <button
              onClick={onClose}
              style={{
                padding: '12px 16px', borderRadius: 12,
                background: 'transparent', border: '1px solid transparent',
                color: '#707d75', fontWeight: 600, fontSize: 12.5, cursor: 'pointer',
              }}
            >
              Skip tour
            </button>
          )}

          <div style={{ flex: 1 }} />

          <button
            onClick={() => {
              if (isLast) { onPostDeal?.(); return; }
              setStep(step + 1);
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '13px 22px', borderRadius: 12,
              background: `linear-gradient(135deg, ${slide.color}, ${slide.colorAlt})`,
              border: 'none', color: '#fff',
              fontWeight: 800, fontSize: 14.5, letterSpacing: 0.2,
              cursor: 'pointer',
              boxShadow: `0 10px 28px ${slide.color}66`,
              transition: 'transform 0.12s',
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            {isLast ? (
              <>Post my first deal <Plus size={16} /></>
            ) : (
              <>Next · {step + 2}/{SLIDES.length} <ArrowRight size={16} /></>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes tut-overlay-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes tut-card-in {
          from { opacity: 0; transform: translateY(28px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes tut-shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(220%); }
        }
        @keyframes tut-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0, 200, 5,0.6); }
          50%      { box-shadow: 0 0 0 14px rgba(0, 200, 5,0); }
        }
      `}</style>
    </div>,
    document.body
  );
}

// ───────────────────────────────────────────────────────────────────────
// Slides
// ───────────────────────────────────────────────────────────────────────
const SLIDES = [
  {
    color: '#00c805', colorAlt: '#00e5a0',
    title: 'Welcome to My Deals',
    body: "This is your command center — every deal you post lives here. Track views, address requests, and messages in one place.",
    render: () => <DashboardMock />,
  },
  {
    color: '#00e5a0', colorAlt: '#00c805',
    title: 'Tap "Post a Deal" to start',
    body: "We made it stupid-simple. Address autocomplete pulls the property info, photos upload in seconds, and you're live in under a minute.",
    render: () => <PostButtonMock />,
  },
  {
    color: '#f59e0b', colorAlt: '#fb923c',
    title: 'Fill in the deal details',
    body: 'Price, ARV, rehab estimate, beds/baths, photos. The cleaner the numbers, the faster buyers come knocking.',
    render: () => <FormMock />,
  },
  {
    color: '#10b981', colorAlt: '#00e5a0',
    title: 'Approve address requests fast',
    body: "Buyers tap to request the full address. You approve who you want. Auto-approve verified investors with one toggle.",
    render: () => <RequestsMock />,
  },
  {
    color: '#00c805', colorAlt: '#ef4444',
    title: 'Ready? Let’s post your first deal',
    body: 'Click below and we’ll open the form for you. Pro tip: have your address, price, and best photo ready — takes less than 60 seconds.',
    render: () => <FinalMock />,
  },
];

// ───────────────────────────────────────────────────────────────────────
// Mock "screenshots" — all DOM, no images needed
// ───────────────────────────────────────────────────────────────────────
function MockCard({ children, accent }) {
  return (
    <div style={{
      background: '#0e100e',
      border: `1px solid ${accent ? `${accent}30` : '#232925'}`,
      borderRadius: 14,
      overflow: 'hidden',
      boxShadow: '0 18px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03) inset',
    }}>
      {children}
    </div>
  );
}

function DashboardMock() {
  return (
    <MockCard accent="#00c805">
      <div style={{
        padding: '11px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ color: '#f8fafc', fontWeight: 800, fontSize: 13 }}>My Deals</span>
        <span style={{
          padding: '4px 10px', borderRadius: 999,
          background: 'linear-gradient(135deg,#00c805,#00e5a0)',
          color: '#fff', fontSize: 10, fontWeight: 800,
        }}>+ Post Deal</span>
      </div>
      <div style={{ padding: 12, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {[
          { label: 'Active', value: '3', color: '#10b981' },
          { label: 'Views', value: '1,284', color: '#00e5a0' },
          { label: 'Requests', value: '12', color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} style={{
            padding: '10px 12px', borderRadius: 10,
            background: 'rgba(255,255,255,0.03)', border: '1px solid #232925',
          }}>
            <div style={{ color: '#707d75', fontSize: 10, fontWeight: 700, letterSpacing: 0.5 }}>{s.label.toUpperCase()}</div>
            <div style={{ color: s.color, fontWeight: 900, fontSize: 19, marginTop: 2 }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '0 12px 12px' }}>
        <DealRow city="Atlanta, GA" price="$25k" status="ACTIVE" color="#10b981" />
        <DealRow city="Phoenix, AZ" price="$18k" status="ACTIVE" color="#10b981" />
        <DealRow city="Memphis, TN" price="$42k" status="ACTIVE" color="#10b981" />
      </div>
    </MockCard>
  );
}

function DealRow({ city, price, status, color }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '9px 0', borderTop: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: 'linear-gradient(135deg, #00c805, #00e5a0)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <MapPin size={13} color="#fff" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: 12.5 }}>{city}</div>
        <div style={{ color: '#707d75', fontSize: 11 }}>3/2 · 1,840 sqft</div>
      </div>
      <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: 13 }}>{price}</div>
      <span style={{
        padding: '3px 8px', borderRadius: 6,
        background: `${color}18`, color, fontSize: 9, fontWeight: 800, letterSpacing: 0.5,
      }}>{status}</span>
    </div>
  );
}

function PostButtonMock() {
  return (
    <MockCard accent="#00e5a0">
      <div style={{ padding: '38px 20px', textAlign: 'center', position: 'relative' }}>
        <div style={{
          color: '#95a29b', fontSize: 12, marginBottom: 16,
        }}>
          Top right of your dashboard:
        </div>

        {/* Mock CTA with pulse halo */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button style={{
            padding: '13px 26px', borderRadius: 12,
            background: 'linear-gradient(135deg,#00c805,#00e5a0)',
            color: '#fff', border: 'none',
            fontWeight: 800, fontSize: 14,
            display: 'inline-flex', alignItems: 'center', gap: 7,
            boxShadow: '0 14px 36px rgba(0, 200, 5,0.45)',
            animation: 'tut-pulse 1.6s infinite',
            cursor: 'default',
          }}>
            <Plus size={15} /> Post a Deal
          </button>
        </div>

        <div style={{
          marginTop: 22, display: 'flex', flexDirection: 'column', gap: 6,
          maxWidth: 280, marginLeft: 'auto', marginRight: 'auto',
        }}>
          {[
            { icon: Camera,  text: 'Upload photos in one tap' },
            { icon: MapPin,  text: 'Address autocomplete' },
            { icon: Zap,     text: 'Live in under 60 seconds' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 11px', borderRadius: 8,
              background: 'rgba(0, 200, 5,0.07)', border: '1px solid rgba(0, 200, 5,0.18)',
              color: '#cdd6d0', fontSize: 12, fontWeight: 600,
            }}>
              <Icon size={13} style={{ color: '#4ade80' }} />
              {text}
            </div>
          ))}
        </div>
      </div>
    </MockCard>
  );
}

function FormMock() {
  return (
    <MockCard accent="#f59e0b">
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <FieldMock label="Address" value="2847 Peachtree Rd NE, Atlanta, GA" icon={MapPin} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <FieldMock label="Listing Price" value="$25,000" />
          <FieldMock label="ARV" value="$320,000" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <FieldMock label="Beds" value="3" />
          <FieldMock label="Baths" value="2" />
          <FieldMock label="Sqft" value="1,850" />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{
              width: 44, height: 44, borderRadius: 8,
              background: `linear-gradient(135deg, hsl(${i * 60} 70% 60%), hsl(${i * 60 + 40} 70% 50%))`,
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 9, fontWeight: 800,
            }}>
              <Camera size={14} />
            </div>
          ))}
          <div style={{
            width: 44, height: 44, borderRadius: 8,
            border: '1.5px dashed #232925',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#5a675f',
          }}>
            <Plus size={16} />
          </div>
        </div>
        <button style={{
          padding: '11px 16px', borderRadius: 10,
          background: 'linear-gradient(135deg,#10b981,#00e5a0)',
          color: '#fff', border: 'none',
          fontWeight: 800, fontSize: 13,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          marginTop: 4,
        }}>
          <CheckCircle2 size={14} /> Publish Deal
        </button>
      </div>
    </MockCard>
  );
}

function FieldMock({ label, value, icon: Icon }) {
  return (
    <div style={{
      padding: '8px 12px', borderRadius: 8,
      background: '#1a1f1b', border: '1px solid #232925',
    }}>
      <div style={{
        color: '#707d75', fontSize: 9, fontWeight: 800, letterSpacing: 0.6,
        marginBottom: 1,
      }}>
        {label.toUpperCase()}
      </div>
      <div style={{
        color: '#f8fafc', fontWeight: 700, fontSize: 12,
        display: 'flex', alignItems: 'center', gap: 5,
      }}>
        {Icon && <Icon size={11} style={{ color: '#4ade80', flexShrink: 0 }} />}
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
      </div>
    </div>
  );
}

function RequestsMock() {
  return (
    <MockCard accent="#10b981">
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { name: 'Diana Cruz',     time: '5 min ago',  color: '#00c805', verified: true },
          { name: 'Trevor Banks',   time: '32 min ago', color: '#00e5a0', verified: true },
          { name: 'Sarah Mitchell', time: '2 hours ago', color: '#f59e0b', verified: false },
        ].map(r => (
          <div key={r.name} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: 10, borderRadius: 10,
            background: 'rgba(255,255,255,0.03)', border: '1px solid #232925',
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: `linear-gradient(135deg, ${r.color}, ${r.color}aa)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 900, fontSize: 12,
            }}>
              {r.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                color: '#f8fafc', fontWeight: 700, fontSize: 12.5,
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                {r.name}
                {r.verified && (
                  <span style={{
                    width: 13, height: 13, borderRadius: '50%',
                    background: '#00e5a0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <CheckCircle2 size={9} color="#fff" />
                  </span>
                )}
              </div>
              <div style={{ color: '#707d75', fontSize: 10.5 }}>
                Requested address · {r.time}
              </div>
            </div>
            <button style={{
              padding: '5px 12px', borderRadius: 6,
              background: '#10b981', color: '#fff', border: 'none',
              fontSize: 11, fontWeight: 800,
            }}>
              Approve
            </button>
          </div>
        ))}
      </div>
    </MockCard>
  );
}

function FinalMock() {
  return (
    <div style={{
      padding: '32px 16px', borderRadius: 16,
      background: 'radial-gradient(circle at 50% 0%, rgba(0, 200, 5,0.18), transparent 60%), #0e100e',
      border: '1px solid rgba(0, 200, 5,0.3)',
      textAlign: 'center', position: 'relative', overflow: 'hidden',
    }}>
      {/* shimmer */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(90deg, transparent, rgba(0, 200, 5,0.18), transparent)',
        animation: 'tut-shimmer 2.5s infinite linear',
        width: '45%',
      }} />
      <div style={{
        position: 'relative',
        width: 64, height: 64, borderRadius: 18,
        background: 'linear-gradient(135deg,#00c805,#00e5a0)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 14px 40px rgba(0, 200, 5,0.45)',
        marginBottom: 12,
      }}>
        <Hammer size={28} color="#fff" />
      </div>
      <div style={{
        position: 'relative',
        color: '#f8fafc', fontWeight: 900, fontSize: 17, lineHeight: 1.3,
      }}>
        You’re in. Let’s post that first deal.
      </div>
      <div style={{
        position: 'relative',
        color: '#95a29b', fontSize: 12.5, marginTop: 6,
      }}>
        Pro tip: have the address, list price, and best photo ready.
      </div>
    </div>
  );
}
