import { useState } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Check, Clock, MapPin, Home, Phone, Mail, User,
  Hammer, Trash2, Wind, Droplet, Zap as Bolt, AlertTriangle, PaintBucket,
  Layers, ChefHat, Bath as BathIcon, RectangleHorizontal, TreePine, Sparkles,
  Shield, CreditCard, Wrench,
} from 'lucide-react';
import { getDealById } from '../data/deals';
import { useAuth } from '../context/AuthContext';
import { useIsMobile } from '../hooks/useIsMobile';

const SCOPE_ITEMS = [
  { id: 'full-rehab',  label: 'Full rehab',     icon: Hammer },
  { id: 'cleanout',    label: 'Cleanout',       icon: Trash2 },
  { id: 'roofing',     label: 'Roofing',        icon: Home },
  { id: 'hvac',        label: 'HVAC',           icon: Wind },
  { id: 'plumbing',    label: 'Plumbing',       icon: Droplet },
  { id: 'electrical',  label: 'Electrical',     icon: Bolt },
  { id: 'foundation',  label: 'Foundation',     icon: AlertTriangle },
  { id: 'drywall',     label: 'Drywall',        icon: Layers },
  { id: 'paint',       label: 'Paint',          icon: PaintBucket },
  { id: 'flooring',    label: 'Flooring',       icon: Layers },
  { id: 'kitchen',     label: 'Kitchen',        icon: ChefHat },
  { id: 'bathrooms',   label: 'Bathrooms',      icon: BathIcon },
  { id: 'windows',     label: 'Windows',        icon: RectangleHorizontal },
  { id: 'landscaping', label: 'Landscaping',    icon: TreePine },
  { id: 'other',       label: 'Other',          icon: Sparkles },
];

const TIMELINES = [
  { id: 'asap',      label: 'ASAP',                       desc: 'Within a few days' },
  { id: 'week',      label: 'This week',                  desc: '< 7 days' },
  { id: 'two-weeks', label: 'In 2 weeks',                 desc: '~14 days' },
  { id: '30-days',   label: 'In 30 days',                 desc: '~30 days' },
  { id: 'estimate',  label: 'Just estimating',            desc: 'Pricing before I buy' },
];

export default function BidRequest() {
  const { dealId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { currentUser, requireAuth } = useAuth();

  // Bid requests need an account — if not signed in, prompt and bounce back
  if (!requireAuth('request bids from local contractors', 'bid-request', `/bid-request${dealId ? `/${dealId}` : ''}`)) {
    // requireAuth() opens the auth modal; render a placeholder
    return <div style={{ minHeight: '100vh', background: '#0a0b0a' }} />;
  }

  const deal = dealId ? getDealById(dealId) : null;
  const addressFromQuery = {
    address: searchParams.get('address') || deal?.address || '',
    city:    searchParams.get('city')    || deal?.city || '',
    state:   searchParams.get('state')   || deal?.state || '',
    zip:     searchParams.get('zip')     || deal?.zip || '',
  };

  const [step, setStep] = useState(1);
  const [property, setProperty] = useState(addressFromQuery);
  const [scopes, setScopes] = useState(new Set());
  const [timeline, setTimeline] = useState('');
  const [contact, setContact] = useState({
    name:  currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
  });
  const [agreed, setAgreed] = useState(false);
  const [confirmationId] = useState(() => 'BR-' + Math.random().toString(36).slice(2, 8).toUpperCase());

  const totalSteps = 6;
  const canContinue = (() => {
    if (step === 1) return property.address && property.city && property.state;
    if (step === 2) return scopes.size > 0;
    if (step === 3) return !!timeline;
    if (step === 4) return contact.name && contact.phone && contact.email;
    if (step === 5) return agreed;
    return true;
  })();

  function toggleScope(id) {
    setScopes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function next() {
    if (!canContinue) return;
    if (step < totalSteps) setStep(s => s + 1);
  }
  function back() {
    if (step === 1) navigate(-1);
    else setStep(s => s - 1);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0b0a', paddingBottom: 120 }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'rgba(10, 11, 10,0.92)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom: '1px solid #232925',
        padding: isMobile ? '12px 14px' : '16px 24px',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={back}
            aria-label="Back"
            style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid #232925',
              borderRadius: 10, padding: 8, cursor: 'pointer', color: '#95a29b',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ArrowLeft size={18} />
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ color: '#f8fafc', fontWeight: 800, fontSize: isMobile ? 17 : 19, margin: 0, letterSpacing: '-0.3px' }}>
              Request Contractor Bids
            </h1>
            <div style={{ color: '#707d75', fontSize: 12, marginTop: 2 }}>
              Step {step} of {totalSteps} · <span style={{ color: '#10b981', fontWeight: 700 }}>$300 flat fee</span> · No markup on bids
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ maxWidth: 720, margin: '12px auto 0', height: 3, background: '#232925', borderRadius: 4 }}>
          <div style={{
            width: `${(step / totalSteps) * 100}%`, height: '100%',
            background: 'linear-gradient(90deg, #00c805, #00e5a0)',
            borderRadius: 4, transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: isMobile ? '20px 14px' : '32px 24px' }}>
        {step === 1 && <StepProperty property={property} setProperty={setProperty} isMobile={isMobile} />}
        {step === 2 && <StepScope scopes={scopes} toggleScope={toggleScope} isMobile={isMobile} />}
        {step === 3 && <StepTimeline timeline={timeline} setTimeline={setTimeline} />}
        {step === 4 && <StepContact contact={contact} setContact={setContact} />}
        {step === 5 && <StepReview property={property} scopes={scopes} timeline={timeline} contact={contact} agreed={agreed} setAgreed={setAgreed} />}
        {step === 6 && <StepConfirmation confirmationId={confirmationId} property={property} />}
      </div>

      {/* Sticky bottom CTA */}
      {step < 6 && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: 'rgba(10, 11, 10,0.94)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          borderTop: '1px solid #232925',
          padding: '14px 16px calc(14px + env(safe-area-inset-bottom))',
          zIndex: 30,
        }}>
          <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', gap: 10 }}>
            {step > 1 && (
              <button
                onClick={back}
                style={{
                  padding: '14px 18px', borderRadius: 12, flex: '0 0 auto',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid #232925',
                  color: '#95a29b', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                }}
              >
                Back
              </button>
            )}
            <button
              onClick={next}
              disabled={!canContinue}
              className={canContinue ? 'gradient-btn' : ''}
              style={{
                flex: 1, padding: '14px', borderRadius: 12,
                background: canContinue ? undefined : 'rgba(255,255,255,0.05)',
                border: canContinue ? 'none' : '1px solid #232925',
                color: canContinue ? '#fff' : '#5a675f',
                fontWeight: 800, fontSize: 15, letterSpacing: 0.2,
                cursor: canContinue ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {step === 5 ? 'Pay $300 & Submit' : 'Continue'}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {step === 6 && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: 'rgba(10, 11, 10,0.94)',
          backdropFilter: 'blur(18px)',
          borderTop: '1px solid #232925',
          padding: '14px 16px calc(14px + env(safe-area-inset-bottom))',
          zIndex: 30,
        }}>
          <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', gap: 10 }}>
            <Link
              to="/marketplace"
              style={{
                flex: 1, padding: '14px', borderRadius: 12,
                background: 'rgba(255,255,255,0.05)', border: '1px solid #232925',
                color: '#e4eae6', fontWeight: 700, fontSize: 14, textDecoration: 'none',
                textAlign: 'center',
              }}
            >
              Back to Deals
            </Link>
            <Link
              to={`/contractors?city=${encodeURIComponent(property.city)}&state=${property.state}`}
              className="gradient-btn"
              style={{
                flex: 1, padding: '14px', borderRadius: 12,
                color: '#fff', fontWeight: 800, fontSize: 14, textDecoration: 'none',
                textAlign: 'center',
              }}
            >
              Browse Contractors →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step components ───

function StepProperty({ property, setProperty, isMobile }) {
  return (
    <div>
      <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: 22, marginTop: 0, marginBottom: 6, letterSpacing: '-0.3px' }}>
        Confirm the property
      </h2>
      <p style={{ color: '#95a29b', fontSize: 14, marginBottom: 22, lineHeight: 1.5 }}>
        Where do contractors need to bid on work?
      </p>

      <div style={{ display: 'grid', gap: 12 }}>
        <Field label="STREET ADDRESS">
          <input value={property.address} onChange={e => setProperty({ ...property, address: e.target.value })}
            placeholder="2847 Peachtree Rd NE" className="input-dark"
            style={{ width: '100%', padding: '12px 14px', borderRadius: 10, fontSize: 14 }} />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 80px 100px' : '2fr 1fr 1fr', gap: 10 }}>
          <Field label="CITY">
            <input value={property.city} onChange={e => setProperty({ ...property, city: e.target.value })}
              placeholder="Atlanta" className="input-dark"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, fontSize: 14 }} />
          </Field>
          <Field label="STATE">
            <input value={property.state} onChange={e => setProperty({ ...property, state: e.target.value.toUpperCase() })}
              maxLength={2} placeholder="GA" className="input-dark"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, fontSize: 14 }} />
          </Field>
          <Field label="ZIP">
            <input value={property.zip} onChange={e => setProperty({ ...property, zip: e.target.value })}
              placeholder="30305" className="input-dark"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, fontSize: 14 }} />
          </Field>
        </div>
      </div>

      <Reassure />
    </div>
  );
}

function StepScope({ scopes, toggleScope, isMobile }) {
  return (
    <div>
      <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: 22, marginTop: 0, marginBottom: 6, letterSpacing: '-0.3px' }}>
        What do you need bids for?
      </h2>
      <p style={{ color: '#95a29b', fontSize: 14, marginBottom: 22, lineHeight: 1.5 }}>
        Pick everything that applies — we'll match contractors for each trade.
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
        gap: 10,
      }}>
        {SCOPE_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = scopes.has(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggleScope(id)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                padding: '14px 14px', gap: 8,
                borderRadius: 14,
                background: active ? 'rgba(0, 200, 5,0.12)' : '#131614',
                border: `1.5px solid ${active ? '#00c805' : '#232925'}`,
                cursor: 'pointer',
                transition: 'all 0.15s',
                textAlign: 'left', minHeight: 86,
              }}
            >
              <Icon size={20} style={{ color: active ? '#4ade80' : '#95a29b' }} />
              <span style={{ color: active ? '#f8fafc' : '#cdd6d0', fontSize: 13, fontWeight: 700 }}>
                {label}
              </span>
              {active && (
                <div style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 20, height: 20, borderRadius: '50%',
                  background: '#00c805',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Check size={12} color="#fff" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepTimeline({ timeline, setTimeline }) {
  return (
    <div>
      <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: 22, marginTop: 0, marginBottom: 6, letterSpacing: '-0.3px' }}>
        When do you need the work done?
      </h2>
      <p style={{ color: '#95a29b', fontSize: 14, marginBottom: 22, lineHeight: 1.5 }}>
        Sets contractor expectations on response speed.
      </p>
      <div style={{ display: 'grid', gap: 10 }}>
        {TIMELINES.map(({ id, label, desc }) => {
          const active = timeline === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setTimeline(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '16px 16px', borderRadius: 14,
                background: active ? 'rgba(0, 200, 5,0.12)' : '#131614',
                border: `1.5px solid ${active ? '#00c805' : '#232925'}`,
                cursor: 'pointer',
                transition: 'all 0.15s',
                textAlign: 'left',
              }}
            >
              <Clock size={20} style={{ color: active ? '#4ade80' : '#707d75' }} />
              <div style={{ flex: 1 }}>
                <div style={{ color: active ? '#f8fafc' : '#cdd6d0', fontSize: 15, fontWeight: 700 }}>{label}</div>
                <div style={{ color: '#707d75', fontSize: 12, marginTop: 2 }}>{desc}</div>
              </div>
              {active && (
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: '#00c805',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Check size={13} color="#fff" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepContact({ contact, setContact }) {
  return (
    <div>
      <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: 22, marginTop: 0, marginBottom: 6, letterSpacing: '-0.3px' }}>
        Where should contractors reach you?
      </h2>
      <p style={{ color: '#95a29b', fontSize: 14, marginBottom: 22, lineHeight: 1.5 }}>
        We'll send you the contractors' direct contact info — but they may also reach out to you first.
      </p>
      <div style={{ display: 'grid', gap: 12 }}>
        <Field label="YOUR NAME">
          <div style={{ position: 'relative' }}>
            <User size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#707d75' }} />
            <input value={contact.name} onChange={e => setContact({ ...contact, name: e.target.value })}
              placeholder="Marcus Johnson" className="input-dark"
              style={{ width: '100%', padding: '12px 14px 12px 34px', borderRadius: 10, fontSize: 14 }} />
          </div>
        </Field>
        <Field label="PHONE">
          <div style={{ position: 'relative' }}>
            <Phone size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#707d75' }} />
            <input value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })}
              type="tel" placeholder="(404) 555-0100" className="input-dark"
              style={{ width: '100%', padding: '12px 14px 12px 34px', borderRadius: 10, fontSize: 14 }} />
          </div>
        </Field>
        <Field label="EMAIL">
          <div style={{ position: 'relative' }}>
            <Mail size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#707d75' }} />
            <input value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })}
              type="email" placeholder="you@example.com" className="input-dark"
              style={{ width: '100%', padding: '12px 14px 12px 34px', borderRadius: 10, fontSize: 14 }} />
          </div>
        </Field>
      </div>
    </div>
  );
}

function StepReview({ property, scopes, timeline, contact, agreed, setAgreed }) {
  const scopeLabels = SCOPE_ITEMS.filter(s => scopes.has(s.id)).map(s => s.label);
  const timelineLabel = TIMELINES.find(t => t.id === timeline)?.label || '';

  return (
    <div>
      <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: 22, marginTop: 0, marginBottom: 6, letterSpacing: '-0.3px' }}>
        Review & pay
      </h2>
      <p style={{ color: '#95a29b', fontSize: 14, marginBottom: 22, lineHeight: 1.5 }}>
        Look good? We'll match contractors and send you their info within 1–2 business days.
      </p>

      {/* Summary cards */}
      <div style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
        <SummaryCard icon={MapPin} title="Property">
          <div>{property.address || 'Address not provided'}</div>
          <div style={{ color: '#95a29b', fontSize: 13, marginTop: 2 }}>{[property.city, property.state, property.zip].filter(Boolean).join(', ')}</div>
        </SummaryCard>
        <SummaryCard icon={Hammer} title={`Scope · ${scopeLabels.length} trade${scopeLabels.length === 1 ? '' : 's'}`}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {scopeLabels.map(s => (
              <span key={s} style={{ background: 'rgba(0, 200, 5,0.12)', color: '#4ade80', borderRadius: 8, padding: '3px 9px', fontSize: 12, fontWeight: 700 }}>{s}</span>
            ))}
          </div>
        </SummaryCard>
        <SummaryCard icon={Clock} title="Timeline">
          <div>{timelineLabel}</div>
        </SummaryCard>
        <SummaryCard icon={User} title="Contact">
          <div>{contact.name}</div>
          <div style={{ color: '#95a29b', fontSize: 13, marginTop: 2 }}>{contact.phone} · {contact.email}</div>
        </SummaryCard>
      </div>

      {/* Price breakdown */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16,185,129,0.06), rgba(0, 200, 5,0.04))',
        border: '1px solid rgba(16,185,129,0.25)',
        borderRadius: 14, padding: 16, marginBottom: 18,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <CreditCard size={18} style={{ color: '#10b981' }} />
          <span style={{ color: '#f8fafc', fontWeight: 800, fontSize: 15 }}>What you're paying</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ color: '#95a29b', fontSize: 14 }}>Contractor bid service</span>
          <span style={{ color: '#f8fafc', fontWeight: 700, fontSize: 14 }}>$300.00</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ color: '#95a29b', fontSize: 14 }}>Markup on contractor bids</span>
          <span style={{ color: '#10b981', fontWeight: 700, fontSize: 14 }}>$0.00</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0' }}>
          <span style={{ color: '#f8fafc', fontWeight: 800, fontSize: 15 }}>Total today</span>
          <span style={{ color: '#10b981', fontWeight: 900, fontSize: 22 }}>$300.00</span>
        </div>
        <div style={{ marginTop: 8, color: '#707d75', fontSize: 12, lineHeight: 1.6 }}>
          You get contractor contact info directly. We don't mark up their pricing or take a cut of the job — they're yours to keep for future projects.
        </div>
      </div>

      {/* Agreement */}
      <label style={{
        display: 'flex', gap: 12, alignItems: 'flex-start',
        padding: 14, borderRadius: 12,
        background: agreed ? 'rgba(0, 200, 5,0.08)' : '#131614',
        border: `1.5px solid ${agreed ? '#00c805' : '#232925'}`,
        cursor: 'pointer',
      }}>
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
          style={{ marginTop: 3, accentColor: '#00c805', flexShrink: 0 }} />
        <span style={{ color: '#e4eae6', fontSize: 13, lineHeight: 1.6 }}>
          I authorize a one-time <strong style={{ color: '#f8fafc' }}>$300 charge</strong> for this contractor bid request. I understand AllStreet Live forwards my contact info to local contractors and does not mark up their bids.
        </span>
      </label>
    </div>
  );
}

function StepConfirmation({ confirmationId, property }) {
  return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'linear-gradient(135deg, #10b981, #00e5a0)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 16px 40px rgba(16,185,129,0.4)',
        marginBottom: 18,
      }}>
        <Check size={42} color="#fff" strokeWidth={3} />
      </div>
      <h2 style={{ color: '#f8fafc', fontWeight: 900, fontSize: 26, margin: 0, letterSpacing: '-0.5px' }}>
        You're all set!
      </h2>
      <p style={{ color: '#95a29b', fontSize: 15, lineHeight: 1.6, maxWidth: 480, margin: '12px auto 24px' }}>
        Your bid request has been submitted. We'll connect you with local contractors and send their contact info directly within 1–2 business days.
      </p>

      <div style={{
        background: '#131614', border: '1px solid #232925',
        borderRadius: 14, padding: 18, textAlign: 'left',
        maxWidth: 480, margin: '0 auto 18px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ color: '#707d75', fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase' }}>Confirmation</span>
          <span style={{ color: '#4ade80', fontWeight: 800, fontFamily: 'monospace', fontSize: 13 }}>{confirmationId}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#e4eae6', fontSize: 14 }}>
          <MapPin size={14} style={{ color: '#00c805' }} />
          {[property.address, property.city, property.state].filter(Boolean).join(', ')}
        </div>
      </div>

      <div style={{
        background: 'rgba(0, 229, 160,0.06)', border: '1px solid rgba(0, 229, 160,0.18)',
        borderRadius: 12, padding: 14, fontSize: 13, lineHeight: 1.6, color: '#cdd6d0',
        maxWidth: 480, margin: '0 auto',
      }}>
        <strong style={{ color: '#67e8f9' }}>What happens next:</strong> A confirmation email is on its way. While you wait, browse contractors in {property.city || 'your market'} to get a head start.
      </div>
    </div>
  );
}

// ─── helpers ───

function Field({ label, children }) {
  return (
    <div>
      <label style={{
        display: 'block', color: '#95a29b', fontSize: 11, fontWeight: 700,
        letterSpacing: 0.5, marginBottom: 6, textTransform: 'uppercase',
      }}>{label}</label>
      {children}
    </div>
  );
}

function SummaryCard({ icon: Icon, title, children }) {
  return (
    <div style={{
      background: '#131614', border: '1px solid #232925',
      borderRadius: 12, padding: 14,
      display: 'flex', gap: 12, alignItems: 'flex-start',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 10,
        background: 'rgba(0, 200, 5,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={16} style={{ color: '#4ade80' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: '#95a29b', fontSize: 11, fontWeight: 700, letterSpacing: 0.5, marginBottom: 4, textTransform: 'uppercase' }}>{title}</div>
        <div style={{ color: '#f8fafc', fontSize: 14, fontWeight: 600 }}>{children}</div>
      </div>
    </div>
  );
}

function Reassure() {
  return (
    <div style={{
      marginTop: 20,
      background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)',
      borderRadius: 12, padding: 14,
      display: 'flex', gap: 12, alignItems: 'flex-start',
    }}>
      <Shield size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: 2 }} />
      <div style={{ color: '#cdd6d0', fontSize: 13, lineHeight: 1.6 }}>
        <strong style={{ color: '#f8fafc' }}>Flat $300 — no contractor markup.</strong> We forward your info to local contractors and send you theirs directly. They're yours to keep for any future projects.
      </div>
    </div>
  );
}
